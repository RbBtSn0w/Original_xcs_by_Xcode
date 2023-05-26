'use strict';

var cluster = require('cluster'),
    fs = require('fs'),
    expressSession = require('express-session'),
    RedisStore = require('connect-redis')(expressSession),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    compression = require('compression'),
    serveStatic = require('serve-static'),
    errorhandler = require('errorhandler'),
    config = require('config');

var logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js'),
    Errors = require('../util/error.js'),
    redisClass = require('../classes/redisClass.js'),
    healthClass = require('../classes/healthClass.js'),
    k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    agentClass = require('../classes/agentClass.js'),
    integrationClass = require('../classes/integrationClass.js'),
    scheduler = require('../util/scheduler.js'),
    portalClass = require('../classes/portalClass.js'),
    delegation = require('../util/delegation.js'),
    te = require('../util/turboevents.js');

var sockets = null;

// Constants

var appConfig = config.get('app');

var XCSCookieSessionTimeout = require('../constants.js').XCSCookieSessionTimeout;

module.exports = function app_startXCS_init(app, cb) {

    logger.debug('Initializing Express application.');

    app.use(function (req, res, next) {
        // Set the request UUID
        req.requestUUID = req && req.headers[k.XCSRequestUUID];
        next();
    });

    // Use defaults in every response
    app.use(function ASXCSSetDefaultResponseHeader(req, res, next) {
        res.setHeader(k.XCSServerAPIVersionHeader, k.XCSAPIVersion);
        res.contentType('application/json');
        res.set('Keep-Alive', 'timeout=5; max=100');
        next();
    });

    app.set('json spaces', false);

    app.use(healthClass.trackRequest);
    app.use(methodOverride());
    app.use(compression()); // compress all responses
    app.use(bodyParser.json({
        limit: '2gb'
    }));
    app.use(bodyParser.urlencoded({
        limit: '2gb',
        extended: true,
    }));
    app.use(serveStatic(__dirname + '/public'));

    // We cannot rely on Redis to store the secret because it could evicted or lost during restart.
    // The master process will generate a session secret file once (if needed) and all workers will
    // read the file on launch prior to initializaing the Express session object.

    var sessionSecretPath = config.get('path.sessionSecret'),
        sessionSecret = fs.readFileSync(sessionSecretPath, 'utf8');
    if (!sessionSecret) {
        logger.error('Could not read the session secret from', sessionSecretPath);
        return process.exit(1);
    }

    var sessionMiddleware = expressSession({
        name: 'session',
        secret: sessionSecret,
        cookie: {
            path: '/',
            httpOnly: true, // when true, cookie is not accessible from javascript
            secure: config.get('app.secureCookies'),
            maxAge: XCSCookieSessionTimeout
        },
        store: new RedisStore({
            client: redisClass.client()
        }),
        saveUninitialized: true,
        resave: true
    });

    app.use(function ASXCSVerifySessionIsLoaded(req, res, next) {
        sessionMiddleware(req, res, function () {
            var log = logger.withRequest(req);

            if (req.session) {
                log.debug('Session is already loaded. Continuing with request.');
                return next();
            }

            var tryCount = 1,
                maxTries = 3,
                message;

            function lookupSession(error) {
                if (error) {
                    message = 'Error while loading the session: ' + JSON.stringify(error);
                    log.error(message);
                    return xcsutil.standardizedErrorResponse(res, {
                        status: 500,
                        message: 'Internal Server Error (xcsd): ' + message
                    });
                }

                log.debug('Attempting to load the session from Redis, attempt', tryCount, 'of', maxTries);

                tryCount += 1;

                if (req.session) {
                    return next();
                }

                if (tryCount > maxTries) {
                    message = 'Session could not be loaded even though Redis is available. Please try again later.';
                    log.error(message);
                    return xcsutil.standardizedErrorResponse(res, {
                        status: 500,
                        message: 'Internal Server Error (xcsd): ' + message
                    });
                }

                sessionMiddleware(req, res, lookupSession);
            }

            // Once in a while, for reasons unknown, connect-redis seems to disconnect from Redis.
            // Interestingly enough, when we detect this situation we ping Redis and it seems to
            // up and running.
            // Reference: <rdar://problem/19035207> Bot Issue for XCS (build service error)

            log.debug('Session not loaded, pinging Redis.');

            var redisClient = redisClass.client();

            if (redisClient) {
                redisClass.client().ping(function ASXCSRedisPing(err) {
                    if (err) {
                        err.message = '[XCSNode - startXCS] error while pinging Redis. Reason: ' + JSON.stringify(err);
                        xcsutil.standardizedErrorResponse(res, {
                            status: 500,
                            message: 'Internal Server Error (xcsd): ' + err.message
                        });
                    } else {
                        log.debug('Session was not loaded even though Redis is available. Going to attempt reloading it manually');
                        lookupSession();
                    }
                });
            } else {
                message = 'Cannot load session: Redis client is not available!';
                log.error(message);
                xcsutil.standardizedErrorResponse(res, {
                    status: 500,
                    message: 'Internal Server Error (xcsd): ' + message
                });
            }
        });
    });

    app.use(function (req, res, next) {
        // Memorize the method, URL, request ID and unit test ID for the standardized response
        res.xcsMethod = req.method;
        res.xcsURL = req.url;
        res.xcsRequestUUID = req.requestUUID;
        res.xcsRequestStartTime = new Date().getTime();

        var unitTestUUID = req && req.headers[k.XCSUnitTestHeader];
        if (unitTestUUID) {
            res.xcsUnitTestUUID = unitTestUUID;
        }

        xcsutil.displayLogRouteHeader(req);

        next();
    });

    app.disable('x-powered-by');

    // Development only
    if (process.env.NODE_ENV === 'development') {
        // only use in development
        app.use(errorhandler());
    }

    // Routing ========================================================================

    logger.debug('Installing application routes.');
    app.use(k.XCSAPIBasePath, require('../routes/routes.js'));

    app.use(function errorResponseHandler(err, req, res, next) {
        if (res.headersSent) {
            return next(err);
        }

        if (err instanceof Errors.HTTPError || err.status) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            next(err);
        }
    });

    function finishBootstrap() {
        // spool up socket support
        sockets = require('../socket.js')(integrationClass, authClass, agentClass);

        // setup a timer to reload the ACL default
        redisClass.client().get(k.XCSRedisMaintenanceTasksPhase, function ASXCSRedisGetAuthTokenPrefix(err, reply) {
            if ('1' !== reply) {
                logger.debug('Maintenance tasks are completed, setting up delegated schedules.');

                // Schedule portal syncing
                delegation.once('portalSync', function ASXCSPortalSync(err) {
                    if (!err) {
                        var randomMinuteInHour = Math.floor(Math.random() * 60); // 17345362
                        logger.debug('Setting up portal sync schedule for', randomMinuteInHour, 'minutes after the hour.');
                        scheduler.scheduleHourlyAtTime(randomMinuteInHour, function ASXCSPortalSyncCallback() {
                            portalClass.emitSyncMessage();
                        }, true);
                    }
                });
            } else {
                logger.debug('Maintenance tasks are not yet complete, delaying schedule configuration.');
            }
        });

        var settingsDocument = app.get('settingsDocument'),
            enableSockets = !settingsDocument || settingsDocument[k.XCSServiceEnabledKey],
            server = app.get('server'),
            secureServer = app.get('secureServer');

        // start our HTTP server
        // DO NOT REMOVE THIS. I know it looks unused, since we almost always use SSL for everything, but asset pack
        // downloads can't be forced to accept a self-signed cert, so they occur over the HTTP port.
        server.listen(appConfig.httpPort, '::', function () {
            logger.info('HTTP server now listening on', appConfig.host + ':' + appConfig.httpPort);
        });

        // start our HTTPS server (w/ Socket.io) for JS clients
        if (secureServer) {
            secureServer.listen(appConfig.httpsPort, '::', function ASXCSServerListenIPv6HTTPS() {
                logger.info('HTTPS server now listening on', appConfig.host + ':' + appConfig.httpsPort);

                if (enableSockets) {
                    var io = require('socket.io').listen(secureServer);
                    io.set('transports', ['xhr-polling', 'jsonp-polling']);
                    io.set('log level', 2);
                    io.configure('production', function ASXCSSocketIOSecureServerProductionCallback() {
                        io.enable('browser client minification'); // send minified client
                        io.enable('browser client etag'); // apply etag caching logic based on version number
                        io.enable('browser client gzip'); // gzip the file
                    });
                    io.sockets.on('connection', function ASXCSSocketIOSecureServerConnectionCallback(socket) {
                        te.registerSocketIOSocket(socket);
                    });
                }

                if (!cluster.isDisabled) {
                    redisClass.client().incrby(k.XCSRedisWorkerSetupPhase, -1, function ASXCSRedisDecrWorkerSetupPhaseCallback(err) {
                        if (err) {
                            return xcsutil.safeCallback(cb, err);
                        } else {
                            return xcsutil.safeCallback(cb);
                        }
                    });
                } else {
                    return xcsutil.safeCallback(cb);
                }

            });
        } else {
            xcsutil.safeCallback(cb);
        }

        // start our HTTPS + Client Auth server (w/o Socket.io)
        var secureServerWithClientAuth = app.set('secureServerWithClientAuth');
        if (secureServerWithClientAuth) {
            secureServerWithClientAuth.listen(appConfig.secureClientPort, function ASXCSsSecureServerWithClientAuthListenCallback() {
                logger.info('HTTPS + Client SSL server listening on', appConfig.host + ':' + appConfig.secureClientPort);
            });
        }

        // start our TurboSocket server
        var turbosocketServer = app.set('turbosocketServer');
        if (turbosocketServer && enableSockets) {
            turbosocketServer.listen(appConfig.socketPort, function ASXCSTurboSocketServerListenCallback() {
                logger.info('TurboSocket server listening on', appConfig.host + ':' + appConfig.socketPort);
            });
        }

        var turbosocketServerWithClientAuth = app.set('turbosocketServerWithClientAuth');
        if (turbosocketServerWithClientAuth) {
            turbosocketServerWithClientAuth.listen(appConfig.secureClientSocketPort, function ASXCSTurbosocketServerWithClientAuthListenCallback() {
                logger.info('TurboSocket + Client SSL server listening on', appConfig.host + ':' + appConfig.secureClientSocketPort);
            });
        }
    }

    finishBootstrap();

};
