'use strict';

// Node modules

var express = require('express'),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    RedisStore = require('connect-redis')(express),
    uuid = require('node-uuid'),
    cluster = require('cluster'),
    async = require('async'),
    os = require('os'),
    util = require('util');

// XCSNode modules

var ts = require('./util/turbosocket.js'),
    te = require('./util/turboevents.js'),
    scheduler = require('./util/scheduler.js'),
    delegation = require('./util/delegation.js'),
    security = require('./util/xcssecurity.js'),
    xcsbridge = require('./util/xcsbridge.js'),
    auth = require('./routes/auth.js'),
    bot = require('./routes/bot.js'),
    integration = require('./routes/integration.js'),
    portal = require('./routes/portal.js'),
    file = require('./routes/file.js'),
    version = require('./routes/version.js'),
    settings = require('./routes/settings.js'),
    health = require('./routes/health.js'),
    redis = require('./routes/redis.js'),
    konsole = require('./util/konsole.js'),
    acl = require('./routes/acl.js');

// Constants

var XCSCookieSessionTimeout = require('./constants.js').XCSCookieSessionTimeout,
    XCSMaxSockets = require('./constants.js').XCSMaxSockets,
    XCSSSLCyphers = require('./constants.js').XCSSSLCyphers,
    XCSCouchHost = require('./constants.js').XCSCouchHost,
    XCSCouchPort = require('./constants.js').XCSCouchPort,
    XCSHost = require('./constants.js').XCSHost,
    XCSHTTPPort = require('./constants.js').XCSHTTPPort,
    XCSHTTPSPort = require('./constants.js').XCSHTTPSPort,
    XCSSecureClientAuthPort = require('./constants.js').XCSSecureClientAuthPort,
    XCSTurboSocketPort = require('./constants.js').XCSTurboSocketPort,
    XCSTurboSocketClientPort = require('./constants.js').XCSTurboSocketClientPort,
    XCS_SSL_SERVER_KEY_PATH = require('./constants.js').XCS_SSL_SERVER_KEY_PATH,
    XCS_SSL_SERVER_CERT_PATH = require('./constants.js').XCS_SSL_SERVER_CERT_PATH,
    XCS_SSL_CLIENT_CA_CERT_PATH = require('./constants.js').XCS_SSL_CLIENT_CA_CERT_PATH,
    XCS_SSL_SERVER_CA_PATH = require('./constants.js').XCS_SSL_SERVER_CA_PATH,
    k = require('./constants.js'); // for any leftovers

// App

var app = express(),
    server = http.createServer(app),
    secureOptions = null,
    secureOptionsWithClientAuth = null,
    secureServer = null,
    secureServerWithClientAuth = null,
    turbosocketServer = null,
    turbosocketServerWithClientAuth = null,
    sessionUUID = null,
    sockets = null,
    manageWorkersTimeout = null;

// Global configuration =============================================================

http.globalAgent.maxSockets = XCSMaxSockets;
https.globalAgent.maxSockets = XCSMaxSockets;

if (process.env.PROCESS_MODE && process.env.PROCESS_MODE.toLowerCase() === 'single') {
    cluster.isDisabled = true; // stash the value here for our convenience
}

konsole.log(null, '*******************************************');
konsole.log(null, '*************** Xcode Server **************');
konsole.log(null, '*******************************************\n');

// Make sure speedsnitch is installed if the profiler is active  ====================

if (k.XCSProfilerActive) {

    var Snitch;

    try {
        Snitch = require('speedsnitch');
    } catch (e) {
        konsole.error(null, '[XCSNode] Profiling is enabled but the required module \'speedsnitch\' is not installed.');
        konsole.error(null, '[XCSNode] To install speedsnitch via Terminal: npm install speedsnitch');
        process.exit(1);
    }

    konsole.log(null, '[XCSNode] The profiler is active.');

} else {

    konsole.log(null, '[XCSNode] The profiler is inactive.');

}

// Redis init ========================================================================

require('./routes/redis.js')();
delegation.configureStore(redis.client());

// SIGHUP log file handling ==========================================================

function reload() {
    fs.closeSync(1);
    fs.openSync(k.XCSKonsoleXCSDLogFilePath, 'a+');
    fs.closeSync(2);
    fs.openSync(k.XCSKonsoleXCSDLogFilePath, 'a+');
}

// App launch ========================================================================

function startXCS() {

    konsole.log(null, '[XCSNode - startXCS] start XCSNode...');

    // Configuration ==================================================================

    app.configure(function () {
        // TODO: uncommenting this disables connection reuse, which fixes unit tests on Syrah
        // app.use(function(req, res, next){
        //     res.useChunkedEncodingByDefault = false;
        //     next();
        // });

        konsole.log(null, '[XCSNode - startXCS] app.configure...');

        // Inject the API version in every response
        app.use(function (req, res, next) {
            res.setHeader(k.XCSServerAPIVersionHeader, k.XCSAPIVersion);
            next();
        });

        app.set('json spaces', false);

        app.use(health.trackRequest);
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.compress());
        app.use(express.multipart({
            limit: '2gb'
        }));
        app.use(express.json({
            limit: '50mb'
        }));
        app.use(express.urlencoded({
            limit: '50mb'
        }));
        app.use(express.cookieParser());
        app.use(express.session({
            name: 'session',
            secret: sessionUUID,
            cookie: {
                path: '/',
                httpOnly: true, // when true, cookie is not accessible from javascript
                secure: false,
                maxAge: XCSCookieSessionTimeout,
                signed: false
            },
            store: new RedisStore({
                host: k.XCSRedisHost,
                port: k.XCSRedisPort,
                prefix: k.XCSRedisSessionPrefix
            })
        }));
        app.use(express.static(__dirname + '/public'));
        app.use(express.methodOverride());

        app.use(function (req, res, next) {
            res.contentType('application/json');
            res.set('Keep-Alive', 'timeout=5; max=100');
            next();
        });

        app.use(function (req, res, next) {
            if (app.get('server closed')) {
                req.connection.setTimeout(1);
            }
            next();
        });
        app.use(app.router);

        app.disable('etag');

        // Development only
        if ('development' === app.get('env')) {
            app.use(express.errorHandler());
        }

    });

    // Routing ========================================================================

    konsole.log(null, '[XCSNode - startXCS] setting up the routes...');
    require('./routes/routes.js')(app);
    konsole.log(null, '[XCSNode - startXCS] done.');

    // Error and exception handling ===================================================

    konsole.log(null, '[XCSNode - startXCS] setting up the error handler...');
    require('./error_handler.js')(process);
    konsole.log(null, '[XCSNode - startXCS] done.');

    // Cluster delegation =============================================================

    konsole.log(null, '[XCSNode - startXCS] setting up schedule commit polling...');
    delegation.register('scheduleCommitPolling', function (req) {
        bot.scheduleCommitPolling(req);
    });
    konsole.log(null, '[XCSNode - startXCS] done.');

    konsole.log(null, '[XCSNode - startXCS] setting up schedule periodic bot runs...');
    delegation.register('schedulePeriodicBotRuns', function (req) {
        bot.schedulePeriodicBotRuns(req);
    });
    konsole.log(null, '[XCSNode - startXCS] done.');

    // ACLs ===========================================================================

    konsole.debug(null, '*******************************************');
    konsole.debug(null, '*********** Load and cache ACLs ***********');
    konsole.debug(null, '*******************************************\n');

    auth.loadAndCacheACLDocumentWithUUID(null, function (err) {
        if (err) {
            throw new Error('Unable to load and cache the ACL document. Reason: ' + err.message);
        } else {
            // spool up the scheduler for periodic integrations
            delegation.once('prepareBotScheduling', function () {
                bot.scheduleCommitPolling(null);
                bot.schedulePeriodicBotRuns(null);
            });

            finishBootstrap();
        }
    });

    // setup reloading of ACL documents

    setInterval(function () {
        auth.loadAndCacheACLDocumentWithUUID(null, function (err) {
            if (err) {
                konsole.log(null, '[ACL] Unable to load and cache the ACL document. Reason: ' + err.message);
            }
        });
    }, k.XCSACLStandardRefreshTimeout);

    function finishBootstrap() {
        // spool up socket support
        sockets = require('./socket.js')(integration, auth);

        // schedule portal syncing
        delegation.once('portalSync', function () {
            var randomMinuteInHour = Math.floor(Math.random() * 60); // 17345362
            konsole.log(null, '[Portal] Scheduling hourly portal sync ' + randomMinuteInHour + ' minutes after the hour.');
            scheduler.scheduleHourlyAtTime(randomMinuteInHour, function () {
                portal.emitSyncMessage();
            }, true);
        });

        // schedule pruning check
        delegation.once('pruning', function () {
            scheduler.scheduleHourlyAtTime(7, function () {
                file.prune(function (err, result) {
                    if (err) {
                        konsole.log(null, '[Pruning] Error while pruning: ' + err.message);
                    } else if (result) {
                        konsole.log(null, '[Pruning] Successfully freed up disk space.');
                    } else {
                        konsole.log(null, '[Pruning] No pruning was necessary.');
                    }
                });
            }, true);
        });

        settings.findOrCreateSettingsDocument(null, function (err, theSettings) {
            var enableSockets = !theSettings || theSettings.service_enabled;

            // start our HTTP server (w/ Socket.io)
            server.listen(XCSHTTPPort, function () {
                konsole.log(null, '[XCSNode] CouchDB listening on ' + XCSCouchHost + ':' + XCSCouchPort);
                konsole.log(null, '[XCSNode] HTTP server listening on ' + XCSHost + ':' + XCSHTTPPort);

                if (enableSockets) {
                    var io = require('socket.io').listen(server);
                    io.set('log level', 2);
                    io.sockets.on('connection', function (socket) {
                        te.registerSocketIOSocket(socket);
                    });
                }
            });

            // start our HTTPS server (w/ Socket.io)
            if (secureServer) {
                secureServer.listen(XCSHTTPSPort, function () {
                    konsole.log(null, '[XCSNode] HTTPS server listening on ' + XCSHost + ':' + XCSHTTPSPort);

                    if (enableSockets) {
                        var io = require('socket.io').listen(secureServer);
                        io.set('log level', 2);
                        io.sockets.on('connection', function (socket) {
                            te.registerSocketIOSocket(socket);
                        });
                    }
                });
            }

            // setup a single node to handle actual Socket.io traffic (we use the other ones for serving JS only)
            delegation.once('socketioTraffic', function () {
                if (enableSockets) {
                    var sioServer = http.createServer(app);
                    var io = require('socket.io').listen(sioServer);
                    io.set('log level', 2);
                    io.sockets.on('connection', function (socket) {
                        te.registerSocketIOSocket(socket);
                    });

                    sioServer.listen(k.XCSSocketIOPort, function () {
                        var clusterID = (cluster.isDisabled) ? '' : ' (worker ' + cluster.worker.id + ')';
                        konsole.log(null, '[XCSNode] Socket.io server listening on ' + XCSHost + ':' + k.XCSSocketIOPort + clusterID);
                    });
                }
            });

            // start our HTTPS + Client Auth server (w/o Socket.io)
            if (secureServerWithClientAuth) {
                secureServerWithClientAuth.listen(XCSSecureClientAuthPort, function () {
                    konsole.log(null, '[XCSNode] HTTPS + Client SSL server listening on ' + XCSHost + ':' + XCSSecureClientAuthPort);
                });
            }

            // start our TurboSocket server
            if (turbosocketServer && enableSockets) {
                turbosocketServer.listen(XCSTurboSocketPort, function () {
                    konsole.log(null, '[XCSNode] TurboSocket server listening on ' + XCSHost + ':' + XCSTurboSocketPort);
                });
            }

            if (turbosocketServerWithClientAuth) {
                turbosocketServerWithClientAuth.listen(XCSTurboSocketClientPort, function () {
                    konsole.log(null, '[XCSNode] TurboSocket server with client auth listening on ' + XCSHost + ':' + XCSTurboSocketClientPort);
                });
            }
        });
    }
}

var settingsDocument;

// Branch for clustering
async.series([

        function (next) {
            // setup our server-side SSL certificates
            if (cluster.isMaster || cluster.isDisabled) {
                // clean up our old SSL certificates
                if (fs.existsSync(XCS_SSL_SERVER_KEY_PATH)) {
                    fs.unlinkSync(XCS_SSL_SERVER_KEY_PATH);
                }

                if (fs.existsSync(XCS_SSL_SERVER_CERT_PATH)) {
                    fs.unlinkSync(XCS_SSL_SERVER_CERT_PATH);
                }

                // open the server-side certificate authority
                var keychain = security.openKeychain(k.XCSDKeychainPath, k.XCSDKeychainSharedSecretPath);
                var ca = security.openCertificateAuthority(XCS_SSL_SERVER_CA_PATH, keychain);

                // see if we can find a certificate for our current hostname
                var commonName = os.hostname();
                keychain.exportIdentity(commonName, k.XCS_SSL_SERVER_CERT_EMAIL, XCS_SSL_SERVER_CERT_PATH, XCS_SSL_SERVER_KEY_PATH, function (err) {
                    if (err) {
                        // generate a new one
                        keychain.generateCSR(commonName, k.XCS_SSL_SERVER_CERT_EMAIL, function (err, csr) {
                            if (err) {
                                konsole.warn(null, '[XCSNode] SSL: Could not generate a CSR for our SSL certificate: ' + err);
                                next({
                                    message: err
                                });
                            } else {
                                ca.fulfillCSR(csr, keychain, k.XCSSSLCertificateValidityPeriod, function (err) {
                                    if (err) {
                                        konsole.warn(null, '[XCSNode] SSL: Could not fulfill CSR for our SSL certificate: ' + err);
                                        next({
                                            message: err
                                        });
                                    } else {
                                        keychain.exportIdentity(commonName, k.XCS_SSL_SERVER_CERT_EMAIL, XCS_SSL_SERVER_CERT_PATH, XCS_SSL_SERVER_KEY_PATH, function (err) {
                                            if (err) {
                                                konsole.warn(null, '[XCSNode] SSL: Could not export certificate and private key: ' + err);
                                                next({
                                                    message: err
                                                });
                                            } else {
                                                next();
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        next();
                    }
                });
            } else {
                next();
            }
        },
        function (next) {
            if (cluster.isWorker || cluster.isDisabled) {
                // check if we have the required key files
                if (!fs.existsSync(XCS_SSL_SERVER_KEY_PATH)) {
                    konsole.warn(null, '[XCSNode] SSL: Server SSL private key missing, skipping SSL setup');
                } else {
                    if (!fs.existsSync(XCS_SSL_SERVER_CERT_PATH)) {
                        konsole.warn(null, '[XCSNode] SSL: Server SSL certificate missing, skipping SSL setup');
                    } else {
                        if (!fs.existsSync(XCS_SSL_CLIENT_CA_CERT_PATH)) {
                            konsole.warn(null, '[XCSNode] SSL: Client SSL certificate authority missing, skipping SSL setup');
                        } else {

                            /**
                             * Mitigating the BEAST TLS attack in Node.js:
                             * http://www.ericmartindale.com/2012/07/19/mitigating-the-beast-tls-attack-in-nodejs/
                             */

                            secureOptions = {
                                key: fs.readFileSync(XCS_SSL_SERVER_KEY_PATH),
                                cert: fs.readFileSync(XCS_SSL_SERVER_CERT_PATH),
                                ciphers: XCSSSLCyphers,
                                honorCipherOrder: true
                            };

                            secureServer = https.createServer(secureOptions, app);

                            secureOptionsWithClientAuth = {
                                key: fs.readFileSync(XCS_SSL_SERVER_KEY_PATH),
                                cert: fs.readFileSync(XCS_SSL_SERVER_CERT_PATH),
                                ca: fs.readFileSync(XCS_SSL_CLIENT_CA_CERT_PATH),
                                requestCert: true,
                                rejectUnauthorized: false,
                                ciphers: XCSSSLCyphers,
                                honorCipherOrder: true
                            };

                            secureServerWithClientAuth = https.createServer(secureOptionsWithClientAuth, app);

                            turbosocketServer = ts.createServer(secureOptionsWithClientAuth, function (socket) {
                                te.registerTurboSocket(socket);
                            });

                            turbosocketServerWithClientAuth = ts.createServer(secureOptionsWithClientAuth, function (socket) {
                                te.registerTurboSocket(socket);
                            });
                        }
                    }
                }
            }

            next();
        },
        function (next) {
            // prepare OTA app distribution
            if (cluster.isMaster || cluster.isDisabled) {
                konsole.log(null, '[XCSNode] Setting up configuration profile for OTA app distribution');

                if (fs.existsSync(k.XCSOTAConfigurationProfilePath)) {
                    fs.unlinkSync(k.XCSOTAConfigurationProfilePath);
                }

                xcsbridge.profiles.generateCertificateAuthorityProfile(k.XCS_SSL_SERVER_CA_CERT_PATH, function (err, profileData) {
                    if (err) {
                        konsole.warn(null, '[XCSNode] Error generating configuration profile: ' + err);
                        next({
                            message: err
                        });
                    } else {
                        // sign the profile
                        var keychain = security.openKeychain(k.XCSDKeychainPath, k.XCSDKeychainSharedSecretPath);
                        var identity = keychain.openIdentity(k.XCSCASigningIdentityCommonName, null);

                        identity.signMessage(profileData, function (err, signedProfileData) {
                            if (err) {
                                konsole.warn(null, '[XCSNode] Error signing configuration profile: ' + err);
                                next({
                                    message: err
                                });
                            } else {
                                fs.writeFile(k.XCSOTAConfigurationProfilePath, signedProfileData, function (err) {
                                    if (err) {
                                        konsole.warn(null, '[XCSNode] Error writing configuration profile to disk: ' + err.message);
                                        next(err);
                                    } else {
                                        next();
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                next();
            }
        },
        function (next) {
            // flush the Redis database
            if (cluster.isMaster || cluster.isDisabled) {
                konsole.log(null, '[XCSNode] flush Redis...');
                redis.client().flushdb(function (err) {
                    if (!err) {
                        konsole.warn(null, '[XCSNode - connectToRedis] done.');
                    }
                    next(err);
                });
            } else {
                next();
            }
        },
        function (next) {
            // write the pid file
            if (cluster.isMaster || cluster.isDisabled) {
                fs.writeFile(k.XCSMasterProcessPIDFilePath, process.pid, function (err) {
                    if (err) {
                        konsole.error(null, '[XCSNode - writeFile] error writing the pid file: ' + err);
                    } else {
                        konsole.error(null, '[XCSNode - writeFile] pid file saved. The PID is: ' + process.pid);
                    }
                    next();
                });
            } else {
                next();
            }
        },
        function (next) {
            // find and create the default settings document if needed
            konsole.log(null, '[XCSNode] find or create the default Settings document...');
            settings.findOrCreateSettingsDocument(null, function (err, settingsDoc) {
                if (err) {
                    konsole.error(null, '[XCSNode - findOrCreateSettingsDocument] error: ' + err.message);
                } else {
                    settingsDocument = settingsDoc;
                    konsole.warn(null, '[XCSNode - findOrCreateSettingsDocument] done.');
                }
                next(err);
            });
        },
        function (next) {
            // find and create the default ACL document if needed
            konsole.log(null, '[XCSNode] find or create the default ACL document...');
            acl.findOrCreateDefaultACLDocument(null, function (err) {
                if (err) {
                    konsole.error(null, '[XCSNode - findOrCreateDefaultACLDocument] error: ' + err.message);
                } else {
                    konsole.warn(null, '[XCSNode - findOrCreateDefaultACLDocument] done.');
                }
                next(err);
            });
        },
        function (next) {
            // find and create the default version document if needed
            konsole.log(null, '[XCSNode] find or create the default Version document...');
            version.findOrCreateVersionDocument(null, function (err) {
                if (err) {
                    konsole.error(null, '[XCSNode - findOrCreateVersionDocument] error: ' + err.message);
                } else {
                    konsole.log(null, '[XCSNode - findOrCreateVersionDocument] done.');
                }
                next(err);
            });
        },
        function (next) {
            function killAllWorkers(cb) {
                var workerIDs = Object.keys(cluster.workers);
                konsole.debug(null, '[XCSNode] number of workers to purge: ' + workerIDs.length - 1);

                // don't kill the first worker since we still have to respond to xcscontrol requests
                for (var i = 0; i < workerIDs.length; i++) {
                    var workerID = workerIDs[i];
                    konsole.debug(null, '[XCSNode] purging worker: ' + workerID);
                    cluster.workers[workerID].kill();
                }

                manageWorkersTimeout = undefined;
                konsole.log(null, '[XCSNode] done.');

                if (cb) {
                    cb();
                }
            }

            function setKillAllWorkersTimeout(cb) {
                if (!manageWorkersTimeout) {
                    manageWorkersTimeout = setTimeout(function () {
                        killAllWorkers(cb);
                    }, k.XCSManageAllWorkersTimeout);
                    konsole.log(null, '[XCSNode] purging existing workers in: ' + k.XCSManageAllWorkersTimeout / 1000 + ' seconds');
                }
            }

            function startAllWorkers(serviceEnabled) {
                // clear the killWorkersTimeout (in case one is already running)
                if (manageWorkersTimeout) {
                    clearTimeout(manageWorkersTimeout);
                    manageWorkersTimeout = undefined;
                    konsole.log(null, '[XCSNode] previous purging timeout has been canceled');
                }

                var workerIDs = Object.keys(cluster.workers);
                if (workerIDs.length <= 1) {
                    setKillAllWorkersTimeout(function () {
                        // fork a bunch of workers
                        var workerCount = serviceEnabled ? os.cpus().length : 1;
                        konsole.log(null, '[XCSNode] number of workers to start: ' + workerCount);
                        for (var i = 0; i < workerCount; i++) {
                            startWorker();
                        }
                        konsole.log(null, '[XCSNode] done.');
                    });
                }
            }

            function startWorker() {
                var w = cluster.fork();
                r.set('cluster:' + w.id, w.process.pid);
                konsole.debug(null, '[XCSNode] starting worker: ' + w.id);
                w.on('message', function (msg) {
                    if (msg.command === 'ManageWorkers') {
                        if (msg.enabled) {
                            konsole.log(null, '[XCSNode] starting all workers');
                            startAllWorkers(msg.enabled);
                        } else {
                            setKillAllWorkersTimeout(function () {
                                startWorker();
                            });
                        }
                    }
                });
            }

            if (cluster.isMaster && !cluster.isDisabled) {
                konsole.log(null, '[XCSNode] clear out old cluster mappings.');
                // clear out old cluster mappings
                var r = redis.client();
                r.del('cluster:*', function () {

                    // prepare delegation
                    delegation.cleanAll(function () {
                        startAllWorkers(settingsDocument.service_enabled);

                        // handle termination behavior
                        cluster.on('exit', function (oldWorker) {
                            redis.client().del('cluster:' + oldWorker.id, function () {
                                redis.client().del('cluster-mem:' + oldWorker.id, function () {
                                    delegation.cleanup(oldWorker.id, function () {
                                        if (!oldWorker.suicide) {
                                            startWorker();
                                        }
                                    });
                                });
                            });
                        });

                        // move on
                        next();
                    });
                });
            } else {
                next();
            }
        },
        function (next) {
            if (cluster.isMaster && !cluster.isDisabled) {
                console.log('[XCSNode] setting up SIGHUP handling.');
                process.on('SIGHUP', function () {
                    konsole.log(null, '[XCSNode] SIGHUP received on master.');
                    reload();
                    konsole.log(null, '[XCSNode - process.kill] number of workers to be told about the SIGHUP: ' + Object.keys(cluster.workers).length);
                    for (var id in cluster.workers) {
                        if (cluster.workers.hasOwnProperty(id)) {
                            konsole.log(null, '[XCSNode] notifying SIGHUP to worker: ' + id);
                            cluster.workers[id].process.kill('SIGHUP');
                        }
                    }
                });
            } else {
                process.on('SIGHUP', function () {
                    if (cluster.isDisabled) {
                        console.log('[XCSNode] SIGHUP received.');
                    } else {
                        console.log('[XCSNode] SIGHUP received on worker: ' + cluster.worker.id);
                    }
                    reload();
                });
            }
            next();
        },
        function (next) {
            if (cluster.isWorker || cluster.isDisabled) {
                konsole.log(null, '[XCSNode] Generate a new UUID for the session.');
                // Generate a new UUID for the session
                redis.client().set(k.XCSSessionSecretKey, uuid.v4(), 'NX', function () {
                    redis.client().get(k.XCSSessionSecretKey, function (err, reply) {
                        if (err) {
                            konsole.error(null, '[XCSNode] Could not obtain a session UUID: ' + err.message);
                            process.exit(1);
                        }

                        sessionUUID = reply;

                        try {
                            var pe = require('pretty-error');
                            konsole.log(null, '[XCSNode] Module pretty-error activated.');
                            pe.start(startXCS);
                        } catch (e) {
                            startXCS();
                        }

                        next();
                    });
                });
            } else {
                next();
            }
        },
        function (next) {
            var _ = require('underscore');

            function updateMemoryUsage(cb) {
                redis.client().set('cluster-mem:' + cluster.worker.id, process.memoryUsage().rss + '', 'EX', 420, function () {
                    konsole.log(null, 'Cluster ' + cluster.worker.id + ' updated its memory usage');
                    if (cb) {
                        cb();
                    }
                });
            }

            function terminateWorker(workerID, cleanly) {
                konsole.debug(null, '[Cluster] Terminating ' + workerID + ', cleanly? ' + cleanly);

                var worker = cluster.workers[workerID];
                if (!cleanly) {
                    worker.kill('SIGKILL');
                } else {
                    worker.send('graceful');
                }
            }

            function cycleProcessesAsNeeded() {
                var workers = Object.keys(cluster.workers);
                if (workers.length < 2) {
                    return;
                }

                var keys = workers.map(function (id) {
                    return 'cluster-mem:' + id;
                });

                redis.client().mget(keys, function (err, results) {
                    if (err) {
                        konsole.error(null, '[Cluster] Error loading cluster memory usage from Redis: ' + util.inspect(err));
                    } else {
                        var memoryUsage = results.map(function (usage) {
                            return parseInt(usage, 10);
                        });
                        var deadProcesses = workers.filter(function (key, index) {
                            return !memoryUsage[index];
                        });
                        var highestUsage = _.max(workers, function (key, index) {
                            return memoryUsage[index];
                        });

                        deadProcesses.forEach(function (workerID) {
                            terminateWorker(workerID, false);
                        });

                        terminateWorker(highestUsage, true);
                    }
                });
            }

            if (cluster.isWorker) {
                for (var i = 0; i < 60; i += 5) {
                    scheduler.scheduleHourlyAtTime(i, updateMemoryUsage);
                }

                updateMemoryUsage(next);

                process.on('message', function (msg) {
                    if (msg === 'graceful') {
                        app.set('server closed', true);

                        process.on('exit', function () {
                            konsole.log(null, '\n\n\nAll servers on this process finished. Recycling worker...\n\n');
                        });

                        async.parallel([

                            function (cb) {
                                server.close(function () {
                                    konsole.log(null, '[Cluster] Shut down non-secure server.');
                                    cb();
                                });
                            },
                            function (cb) {
                                secureServer.close(function () {
                                    konsole.log(null, '[Cluster] Shut down secure server.');
                                    cb();
                                });
                            },
                            function (cb) {
                                secureServerWithClientAuth.close(function () {
                                    konsole.log(null, '[Cluster] Shut down secure-with-client-auth server.');
                                    cb();
                                });
                            }
                        ], function (err) {
                            if (err) {
                                konsole.log(null, '[Cluster] error: ' + err);
                            }
                            konsole.log(null, '[Cluster] All servers are closed. Waiting ' + k.XCSManageAllWorkersTimeout / 1000 + ' seconds to serve the responses...');
                            setTimeout(function () {
                                konsole.log(null, '[Cluster] Done. Exiting now.');
                                process.exit();
                            }, k.XCSManageAllWorkersTimeout * 1000);
                        });

                        setTimeout(function () {
                            konsole.log(null, '[Cluster] Servers took too long close, exiting anyway.');
                            process.exit();
                        }, 120000);
                    }
                });
            } else if (cluster.isMaster && !cluster.isDisabled) {
                for (var j = 0; j < 60; j += 30) {
                    scheduler.scheduleHourlyAtTime(j, cycleProcessesAsNeeded);
                }

                next();
            } else {
                next();
            }
        }
    ],
    function (err) {
        konsole.error(null, '[XCSNode] Could not start the service due to an underlying error: ' + err.message);
    });