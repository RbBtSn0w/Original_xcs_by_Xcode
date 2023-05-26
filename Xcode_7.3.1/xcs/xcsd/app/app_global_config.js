'use strict';

var cluster = require('cluster'),
    fs = require('fs'),
    os = require('os'),
    async = require('async'),
    uuid = require('node-uuid'),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    config = require('config'),
    memwatch;

var k = require('../constants.js'),
    redisClass = require('../classes/redisClass.js'),
    databaseClass = require('../classes/databaseClass.js'),
    logger = require('../util/logger.js'),
    delegation = require('../util/delegation.js'),
    dbCoreClass = require('../classes/dbCoreClass.js'),
    xcsutil = require('../util/xcsutil.js');

function initDashboard() {
    if (cluster.isMaster || cluster.isDisabled) {

        var dashboardPath = path.join(__dirname, '../public/XCS2-Dashboard/dashboard');
        if (fs.existsSync(dashboardPath)) {
            redisClass.client().hset('XCSDashboard key', 'isDashboardInstalled', dashboardPath);
            logger.info('Xcode Server Dashboard is installed.');
        } else {
            redisClass.client().hdel('XCSDashboard key', 'isDashboardInstalled');
            logger.debug('Xcode Server Dashboard is not installed.');
        }

    }
}

function initReindexationWatcher() {
    if (cluster.isMaster || cluster.isDisabled) {
        logger.debug('Watching for reindexation.');
        setInterval(databaseClass.reindexDatabase_internal, k.ReindexationWatcherInterval);
    }
}

function initExpiredDocumentsWatcher() {
    if (cluster.isMaster || cluster.isDisabled) {
        logger.debug('Watching for expired documents.');
        setInterval(xcsutil.deleteExpiredDocuments, k.ExpiredDocumentsWatcherInterval);
    }
}

function initMemWatch() {

    try {

        memwatch = require('memwatch');

        logger.info('Memwatch is installed. Memory performance will be measured.');

        memwatch.on('leak', function (info) {
            logger.warn('Memwatch: Leak detected:', info);

            var now = new Date();
            info.dateISO8601 = now.toISOString();
            info.date = xcsutil.dateComponentsFromDate(now);
            dbCoreClass.createDocument(null, k.XCSDesignDocumentMemWatchLeak, info);
        });

        memwatch.on('stats', function (stats) {
            logger.debug('Memwatch stats:', stats);

            var now = new Date();
            stats.dateISO8601 = now.toISOString();
            stats.date = xcsutil.dateComponentsFromDate(now);
            dbCoreClass.createDocument(null, k.XCSDesignDocumentMemWatchStats, stats);
        });

        redisClass.client().set(k.XCSMemWatchActive, '1');

    } catch (e) {

        logger.debug('Memwatch is not installed. To measure memory performance, run npm install memwatch.');
        redisClass.client().set(k.XCSMemWatchActive, '0');

    }

}

module.exports = function app_global_config_init(app, cb) {

    var numberOfCPUs = os.cpus().length,
        specifiedNumOfCPUs = numberOfCPUs,
        maxSockets = config.get('app.maxSockets');

    http.globalAgent.maxSockets = maxSockets;
    https.globalAgent.maxSockets = maxSockets;

    if (process.env.PROCESS_MODE && process.env.PROCESS_MODE.toLowerCase() === 'single') {
        cluster.isDisabled = true; // stash the value here for our convenience
    } else if (process.env.PROCESS_MODE && process.env.PROCESS_MODE.toLowerCase() === 'multi-node-no-recycle') {
        app.set('multi-node-no-recycle', true);
    }

    if (process.env.NUM_WORKERS) {
        specifiedNumOfCPUs = parseInt(process.env.NUM_WORKERS, 10);

        // If the user has specified a negative number, make it 1
        if (specifiedNumOfCPUs <= 0) {
            specifiedNumOfCPUs = 1;
        }
    } else {
        var data;

        try {
            data = fs.readFileSync(k.XCSConfigurationFilePath, 'utf8');
        } catch (e) {
            logger.info('Xcode Server configuration file not found, applying defaults.');
        }

        if (!data) {
            specifiedNumOfCPUs = defaultNumberOfWorkers();
        } else {
            var fileContents = JSON.parse(data);
            specifiedNumOfCPUs = fileContents.numberOfWorkers;
            if (!specifiedNumOfCPUs) {
                specifiedNumOfCPUs = defaultNumberOfWorkers();
            }
        }
    }

    if (process.env.BENCH_REQUESTS) {
        var value = parseInt(process.env.BENCH_REQUESTS, 10);
        if (0 === value) {
            app.set('benchRequests', false);
        } else {
            app.set('benchRequests', true);
        }
    }

    logger.debug('We are using', specifiedNumOfCPUs, 'additional worker node processes.');
    redisClass.client().set(k.XCSRedisSpecifiedNumOfCPUs, specifiedNumOfCPUs);

    if (process.env.DEBUG) {
        var flags = process.env.DEBUG.toLowerCase();
        // Override the default value and turn on session debug
        if (flags.indexOf('xcsd:session') !== -1) {
            k.XCSDebugConnectSession = true;
        }
    }

    // Initialize the dashboard if available
    initDashboard();

    // initialize memwatch
    initMemWatch();

    // initialize the reindexation watcher
    initReindexationWatcher();

    // initialize the expiration document watcher
    initExpiredDocumentsWatcher();

    // set the HTTP server
    var server = http.createServer(app);
    app.set('server', server);

    async.series([

        // Session UUID management

        function AGCSessionSecretManagement(next) {
                if (cluster.isMaster) {
                    logger.debug('Generating a new UUID for the session if needed.');
                    var sessionSecretPath = config.get('path.sessionSecret');
                    fs.readFile(sessionSecretPath, 'utf8', function (err) {
                        if (err) {
                            // Generate and save a new session secret file
                            fs.writeFile(sessionSecretPath, uuid.v4(), function (err) {
                                if (err) {
                                    logger.error('Could not save the session secret to:', sessionSecretPath, '. Reason:', JSON.stringify(err));
                                    return process.exit(1);
                                }
                                fs.chmod(sessionSecretPath, '0600', function (err) {
                                    if (err) {
                                        logger.error('Could not chmod the session secret to:', sessionSecretPath, '. Reason:', JSON.stringify(err));
                                        logger.info('Removing unsecured file:', sessionSecretPath);
                                        fs.unlink(sessionSecretPath, function (err) {
                                            if (err) {
                                                logger.error('Unable to remove the session secret file:', sessionSecretPath, '. Reason:', JSON.stringify(err));
                                            }
                                            return process.exit(1);
                                        });
                                    }
                                    logger.info('Session secret securely saved to:', sessionSecretPath);
                                    next();
                                });
                            });
                        } else {
                            logger.debug('Session secret file exists.');
                            next();
                        }
                    });
                } else {
                    next();
                }
            },

            function AGCSetupDelegationStore(next) {
                logger.debug('Configuring worker delegation to use Redis for its backing store.');
                delegation.configureStore(redisClass.client());
                return next();
            }

            ],
        function AGCFinalizer(err) {
            return xcsutil.safeCallback(cb, err);
        }
    );

};

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function defaultNumberOfWorkers() {
    var numberOfCPUs = os.cpus().length,
        numberOfWorkers;

    switch (true) {
    case (numberOfCPUs === 1):
        numberOfWorkers = 1;
        break;
    case (numberOfCPUs <= 8):
        numberOfWorkers = numberOfCPUs / 2;
        break;
    default:
        numberOfWorkers = numberOfCPUs / 2;
    }

    return numberOfWorkers;
}