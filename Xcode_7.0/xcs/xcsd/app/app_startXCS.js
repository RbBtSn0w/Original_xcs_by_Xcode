'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var cluster = require('cluster'),
    multer = require('multer'),
    expressSession = require('express-session'),
    RedisStore = require('connect-redis')(expressSession),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    compression = require('compression'),
    serveStatic = require('serve-static'),
    errorhandler = require('errorhandler');

var konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('../classes/redisClass.js'),
    healthClass = require('../classes/healthClass.js'),
    k = require('../constants.js'),
    botClass = require('../classes/botClass.js'),
    authClass = require('../classes/authClass.js'),
    aclClass = require('../classes/aclClass.js'),
    agentClass = require('../classes/agentClass.js'),
    integrationClass = require('../classes/integrationClass.js'),
    scheduler = require('../util/scheduler.js'),
    portalClass = require('../classes/portalClass.js'),
    fileClass = require('../classes/fileClass.js'),
    delegation = require('../util/delegation.js'),
    te = require('../util/turboevents.js');

var sockets = null;

// Constants

var XCSCookieSessionTimeout = require('../constants.js').XCSCookieSessionTimeout,
    XCSHost = require('../constants.js').XCSHost,
    XCSHTTPSPort = require('../constants.js').XCSHTTPSPort,
    XCSSecureClientAuthPort = require('../constants.js').XCSSecureClientAuthPort,
    XCSTurboSocketPort = require('../constants.js').XCSTurboSocketPort,
    XCSTurboSocketClientPort = require('../constants.js').XCSTurboSocketClientPort;

module.exports = function app_startXCS_init(app, cb) {

    var sessionUUID = app.get('sessionUUID');

    konsole.log(null, '[XCSNode - startXCS] start XCSNode');

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
    app.use(multer({
        dest: k.XCSIntegrationAssets,
        fieldNameSize: 100, // limit property name length (in bytes)
        fileSize: 2 * 1024 * 1024 // limit total file size (in bytes)
    }));
    app.use(cookieParser());
    app.use(bodyParser.json({
        limit: '2gb'
    }));
    app.use(bodyParser.urlencoded({
        limit: '2gb',
        extended: true,
    }));
    app.use(serveStatic(__dirname + '/public'));

    // Once in a while, for reasons unknown, connect-redis seems to disconnect from Redis.
    // Interestingly enough, when we detect this situation we ping Redis and it seems to
    // up and running.
    // Reference: <rdar://problem/19035207> Bot Issue for XCS (build service error)

    var sessionMiddleware = expressSession({
        name: 'session',
        secret: sessionUUID,
        cookie: {
            path: '/',
            httpOnly: true, // when true, cookie is not accessible from javascript
            secure: true,
            maxAge: XCSCookieSessionTimeout,
            signed: false
        },
        store: new RedisStore({
            socket: k.XCSRedisSocket,
            prefix: k.XCSRedisSessionPrefix
        }),
        saveUninitialized: true,
        resave: true
    });

    app.use(function ASXCSVerifySessionIsLoaded(req, res, next) {
        if (req.session) {
            konsole.info(req, '[XCSNode - startXCS] Session loaded successfully');
            return next();
        }

        var tryCount = 1,
            maxTries = 3,
            message;

        function lookupSession(error) {
            if (error) {
                message = '[XCSNode - startXCS] Error while loading the session. Reason: ' + JSON.stringify(error);
                konsole.error(req, message);
                return xcsutil.standardizedErrorResponse(res, {
                    status: 500,
                    message: 'Internal Server Error (xcsd): ' + message
                });
            }

            konsole.debug(req, '[XCSNode - startXCS] Attempting to load the session: ' + tryCount + ' of ' + maxTries);

            tryCount += 1;

            if (req.session) {
                return next();
            }

            if (tryCount > maxTries) {
                message = '[XCSNode - startXCS] Session could not be loaded even though Redis is available. Please try again later';
                konsole.error(req, message);
                return xcsutil.standardizedErrorResponse(res, {
                    status: 500,
                    message: 'Internal Server Error (xcsd): ' + message
                });
            }

            sessionMiddleware(req, res, lookupSession);
        }

        konsole.debug(req, '[XCSNode - startXCS] session not loaded! Pinging Redis');

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
                    konsole.debug(req, '[XCSNode - startXCS] Session was not loaded even though Redis is available. Going to attempt reloading it manually');
                    lookupSession();
                }
            });
        } else {
            message = '[XCSNode - startXCS] Redis client is not available!';
            konsole.error(req, message);
            xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: 'Internal Server Error (xcsd): ' + message
            });
        }
    });

    app.use(function ASXCSBenchRequests(req, res, next) {
        var logRequest = app.get('benchRequests');
        if (logRequest) {
            var ts = xcsutil.timestamp();
            console.log('[Request from: ' + req.ip + '][' + ts + ']: ' + req.url);
        }
        next();
    });


    app.disable('x-powered-by');

    // Development only
    if (process.env.NODE_ENV === 'development') {
        // only use in development 
        app.use(errorhandler());
    }

    // Routing ========================================================================

    konsole.log(null, '[XCSNode - startXCS] setting up the routes');
    require('../routes/routes.js')(app);
    konsole.log(null, '[XCSNode - startXCS] done: setting up the routes');

    function finishBootstrap() {
        // spool up socket support
        sockets = require('../socket.js')(integrationClass, authClass, agentClass);

        // setup a timer to reload the ACL default
        redisClass.client().get(k.XCSRedisMaintenanceTasksPhase, function ASXCSRedisGetAuthTokenPrefix(err, reply) {
            konsole.log(null, '[XCSNode - startXCS] redisClass.client().get(k.XCSRedisMaintenanceTasksPhase: ' + reply);
            if ('1' !== reply) {
                // Schedule commit polling and periodic bot runs
                delegation.once('prepareBotScheduling', function ASXCSPrepareBotScheduling(err) {
                    if (!err) {
                        konsole.log(null, '[XCSNode - startXCS] setting scheduler for "prepareBotScheduling"');
                        botClass.scheduleCommitPolling(null);
                        botClass.schedulePeriodicBotRuns(null);
                        konsole.log(null, '[XCSNode - startXCS] done: setting up schedule periodic bot runs');
                    }
                });

                // Schedule ACL expansion
                delegation.once('aclLoadAndAndCache', function ASXCSACLLoadAndAndCache(err) {
                    if (!err) {
                        konsole.log(null, '[XCSNode - startXCS] setting scheduler for "aclLoadAndAndCache"');
                        setInterval(function ASXCSACLLoadAndAndCacheInterval() {
                            konsole.log(null, '[StartXCS] scheduled default ACL reload');
                            aclClass.askODToExpandACLDocument(null, function ASXCSACLLoadAndAndCacheIntervalCallback(err) {
                                if (err && (531 !== err.status)) {
                                    var message = 'Unable to load and cache the ACL document. Reason: ' + err.message;
                                    konsole.warn(null, '[StartXCS] scheduled default ACL reload warning: ' + message);
                                } else {
                                    konsole.log(null, '[StartXCS] scheduled default ACL reload completed successfully');
                                }
                            });
                        }, k.XCSACLStandardRefreshTimeout);
                    }
                });

                // Schedule portal syncing
                delegation.once('portalSync', function ASXCSPortalSync(err) {
                    if (!err) {
                        konsole.log(null, '[XCSNode - startXCS] setting scheduler for "portalSync"');
                        var randomMinuteInHour = Math.floor(Math.random() * 60); // 17345362
                        konsole.log(null, '[Portal] Scheduling hourly portal sync ' + randomMinuteInHour + ' minutes after the hour.');
                        scheduler.scheduleHourlyAtTime(randomMinuteInHour, function ASXCSPortalSyncCallback() {
                            portalClass.emitSyncMessage();
                        }, true);
                    }
                });

                // Schedule pruning check
                delegation.once('pruning', function ASXCSPruning(err) {
                    if (!err) {

                        // We got the responsibility to prune. Make sure we start fresh because:
                        //      - we could have crashed
                        //      - the worker doing the previous pruning could have been recycled

                        redisClass.client().del(k.XCSPruningIsActive, function () {
                            // Schedule pruning
                            setInterval(function ASXCSACLLoadAndAndCacheInterval() {
                                checkPruningNow();
                            }, k.XCSPruningInterval);

                            // Prune now
                            checkPruningNow();
                        });

                    }
                });
            }
        });

        var settingsDocument = app.get('settingsDocument'),
            enableSockets = !settingsDocument || settingsDocument[k.XCSServiceEnabledKey],
            secureServer = app.get('secureServer');

        // start our HTTPS server (w/ Socket.io) for JS clients
        if (secureServer) {
            secureServer.listen(XCSHTTPSPort, '::', function ASXCSServerListenIPv6HTTPS() {
                konsole.log(null, '[XCSNode - startXCS] HTTPS server listening on ' + XCSHost + ':' + XCSHTTPSPort);

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
        }

        // start our HTTPS + Client Auth server (w/o Socket.io)
        var secureServerWithClientAuth = app.set('secureServerWithClientAuth');
        if (secureServerWithClientAuth) {
            secureServerWithClientAuth.listen(XCSSecureClientAuthPort, function ASXCSsSecureServerWithClientAuthListenCallback() {
                konsole.log(null, '[XCSNode] HTTPS + Client SSL server listening on ' + XCSHost + ':' + XCSSecureClientAuthPort);
            });
        }

        // start our TurboSocket server
        var turbosocketServer = app.set('turbosocketServer');
        if (turbosocketServer && enableSockets) {
            turbosocketServer.listen(XCSTurboSocketPort, function ASXCSTurboSocketServerListenCallback() {
                konsole.log(null, '[XCSNode] TurboSocket server listening on ' + XCSHost + ':' + XCSTurboSocketPort);
            });
        }

        var turbosocketServerWithClientAuth = app.set('turbosocketServerWithClientAuth');
        if (turbosocketServerWithClientAuth) {
            turbosocketServerWithClientAuth.listen(XCSTurboSocketClientPort, function ASXCSTurbosocketServerWithClientAuthListenCallback() {
                konsole.log(null, '[XCSNode] TurboSocket server with client auth listening on ' + XCSHost + ':' + XCSTurboSocketClientPort);
            });
        }
    }

    finishBootstrap();

};

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function checkPruningNow() {

    // Set the ODExpansionACLFlag if it doesn't exist
    redisClass.client().setnx(k.XCSPruningIsActive, '1', function XCSDAppSetXCSPruningIsActiveFlag(err, reply) {
        if (err) {
            konsole.error(null, '[XCSNode] error setting if "XCSPruningIsActive" exists. Reason: ' + JSON.stringify(err));
        } else {
            if (1 === reply) {
                // The PruningIsActiveFlag didn't exist and is now set
                fileClass.prune_internal(function ASXCSPruningFilePruneCallback(err, result) {
                    if (err && (404 !== err.status)) {
                        konsole.error(null, '[Pruning] Error while pruning: ' + JSON.stringify(err));
                    } else if (result) {
                        konsole.log(null, '[Pruning] Successfully freed up disk space.');
                    } else {
                        konsole.log(null, '[Pruning] No pruning was necessary.');
                    }
                    redisClass.client().del(k.XCSPruningIsActive);
                });
            }
        }
    });

}