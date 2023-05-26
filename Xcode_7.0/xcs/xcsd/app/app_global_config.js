'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var cluster = require('cluster'),
    fs = require('fs'),
    os = require('os'),
    async = require('async'),
    uuid = require('node-uuid'),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    memwatch;

var k = require('../constants.js'),
    redisClass = require('../classes/redisClass.js'),
    databaseClass = require('../classes/databaseClass.js'),
    konsole = require('../util/konsole.js'),
    delegation = require('../util/delegation.js'),
    XCSMaxSockets = require('../constants.js').XCSMaxSockets,
    dbCoreClass = require('../classes/dbCoreClass.js'),
    xcsutil = require('../util/xcsutil.js');

function initDashboard() {
    if (cluster.isMaster || cluster.isDisabled) {

        var dashboardPath = path.join(__dirname, '../public/XCS2-Dashboard/dashboard');
        if (fs.existsSync(dashboardPath)) {
            redisClass.client().hset('XCSDashboard key', 'isDashboardInstalled', dashboardPath);
            konsole.info(null, '[XCSNode - Global Config] The Xcode Server Dashboard is installed.');
        } else {
            redisClass.client().hdel('XCSDashboard key', 'isDashboardInstalled');
            konsole.info(null, '[XCSNode - Global Config] The Xcode Server Dashboard is not installed.');
        }

    }
}

function initReindexationWatcher() {
    if (cluster.isMaster || cluster.isDisabled) {
        konsole.info(null, '[XCSNode - Global Config] The reindexation watcher has been activated.');
        setInterval(databaseClass.reindexDatabase_internal, k.ReindexationWatcherInterval);
    }
}

function initExpiredDocumentsWatcher() {
    if (cluster.isMaster || cluster.isDisabled) {
        konsole.info(null, '[XCSNode - Global Config] The expired documents watcher has been activated.');
        setInterval(xcsutil.deleteExpiredDocuments, k.ExpiredDocumentsWatcherInterval);
    }
}

function initMemWatch() {

    try {

        memwatch = require('memwatch');

        konsole.info(null, '[XCSNode - Global Config] The module \'memwatch\' is installed.');

        memwatch.on('leak', function (info) {
            konsole.warn(null, '[XCSNode - MemWatch] leak detected: ' + JSON.stringify(info));
            var now = new Date();
            info.dateISO8601 = now.toISOString();
            info.date = xcsutil.dateComponentsFromDate(now);
            dbCoreClass.createDocument(null, k.XCSDesignDocumentMemWatchLeak, info);
        });

        memwatch.on('stats', function (stats) {
            konsole.debug(null, '[XCSNode - MemWatch] stats: ' + JSON.stringify(stats));
            var now = new Date();
            stats.dateISO8601 = now.toISOString();
            stats.date = xcsutil.dateComponentsFromDate(now);
            dbCoreClass.createDocument(null, k.XCSDesignDocumentMemWatchStats, stats);
        });

        redisClass.client().set(k.XCSMemWatchActive, '1');

    } catch (e) {

        konsole.info(null, '[XCSNode - Global Config] The module \'memwatch\' is not installed.');
        konsole.info(null, '[XCSNode - Global Config] To install \'memwatch\' via Terminal: npm install memwatch');
        redisClass.client().set(k.XCSMemWatchActive, '0');

    }

}

module.exports = function app_global_config_init(app, cb) {

    var numberOfCPUs = os.cpus().length,
        specifiedNumOfCPUs = numberOfCPUs;

    http.globalAgent.maxSockets = XCSMaxSockets;
    https.globalAgent.maxSockets = XCSMaxSockets;

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
            konsole.log(null, 'Xcode Server configuration file not found: applying defaults');
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

    konsole.log(null, 'Number of node processes to start: ' + (specifiedNumOfCPUs + 1) + ' (1 master + ' + specifiedNumOfCPUs + ' workers)');

    redisClass.client().set(k.XCSRedisSpecifiedNumOfCPUs, specifiedNumOfCPUs);

    if (process.env.DEBUG) {
        var flags = process.env.DEBUG.toLowerCase();
        // Override the default value and turn on session debug
        if (flags.indexOf('xcsd:session') !== -1) {
            k.XCSDebugConnectSession = true;
        }
    }

    if (process.env.LOG_LEVEL) {
        var logLevel = parseInt(process.env.LOG_LEVEL, 10);

        if (logLevel < k.XCSKonsoleLogLevels.debug) {
            logLevel = k.XCSKonsoleLogLevels.debug;
        } else if (logLevel > k.XCSKonsoleLogLevels.error) {
            logLevel = k.XCSKonsoleLogLevels.error;
        }

        k.XCSKonsoleLogLevel = logLevel;
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

        // write the pid file

        function AGCWritePIDFile(next) {
                if (cluster.isMaster || cluster.isDisabled) {

                    konsole.log(null, '[XCSNode - Global config] write the pid file');

                    fs.writeFile(k.XCSMasterProcessPIDFilePath, process.pid, function AGCWritePIDFileCallback(err) {
                        if (err) {
                            konsole.error(null, '[XCSNode - Global config] error writing the pid file: ' + JSON.stringify(err));
                        } else {
                            konsole.log(null, '[XCSNode - Global config] pid file saved. The PID is: ' + process.pid);
                        }
                        return next(err);
                    });

                } else {
                    return next();
                }

        },

        // Session UUID management

        function AGCSessionUUIDManagement(next) {
                if (cluster.isWorker || cluster.isDisabled) {

                    konsole.log(null, '[XCSNode] Generate a new UUID for the session.');

                    // Generate a new UUID for the session
                    redisClass.client().set(k.XCSSessionSecretKey, uuid.v4(), 'NX', function AGCSessionSetSecretKeyCallback() {
                        redisClass.client().get(k.XCSSessionSecretKey, function AGCSessionGetSecretKeyCallback(err, reply) {
                            if (err) {
                                konsole.error(null, '[XCSNode] Could not obtain a session UUID: ' + JSON.stringify(err));
                                return process.exit(1);
                            }

                            app.set('sessionUUID', reply);

                            next();
                        });
                    });
                } else {
                    next();
                }
        },

        function AGCSetupDelegationStore(next) {
                konsole.log(null, '[XCSNode - Redis] setup delegation store');
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