'use strict';

// Node modules

var express = require('express'),
    async = require('async'),
    cluster = require('cluster');

// XCSNode modules

var konsole = require('./util/konsole.js'),
    xcsutil = require('./util/xcsutil.js'),
    delegation = require('./util/delegation.js'),
    settings = require('./classes/settingsClass.js'),
    k = require('./constants.js'),
    redisClass = require('./classes/redisClass.js');

// App

var app = express(),
    restoreInitPhaseInterval;

// Start ============================================================================

konsole.log(null, '*******************************************');
konsole.log(null, '*************** Xcode Server **************');
konsole.log(null, '*******************************************\n');

konsole.log(null, '[XCSNode - Initialization] running in mode: ' + app.get('env'));

// Report the process(es) pid(s)

if (cluster.isMaster || cluster.isDisabled) {
    konsole.log(null, '[XCSNode - Initialization] master pid: ' + process.pid + '\n');
    bootstrap();
} else {
    konsole.log(null, '[XCSNode - Initialization] worker ' + cluster.worker.id + ' pid: ' + process.pid + '\n');
    continueInitialization();
}


/***************************************************************************************************

    Introduction
    
    In theory, CouchDB is pretty good about not blocking database access. However, if the document
    to be retrieved requires an index that needs to be updated (or is non-existent), then it'll block
    until the index is available. Because this process can take time, we're putting a mechanism in
    place where we detect this situation and launch xcsd accordingly.
    
    What we do first is forcing a warm up by asking each of the views for any document (LIMIT 1). This
    causes CouchDB to update all indexes if needed. The next thing we do is to figure out whether
    the warm up causes any indexing going (maintenance task). If so, we start xcsd in limited mode,
    where call endpoints return HTTP 532 with a list of outstanding tasks.
    
    A timer is spawned to detect every 5 seconds whether all maintenance tasks have been completed.
    Once the list is empty, we restart xcsd only this time there won't be any new maintenance tasks
    and xcsd will then be able to service all requests.

***************************************************************************************************/

function bootstrap() {

    // CouchDB startup check. We perform the check in Redis above because in the case of CouchDB, we don't need to keep the variable around.
    require('./classes/couchdbClass.js')(function () {

        konsole.log(null, '[XCSNode - Initialization] asking CouchDB to verify if database maintenance is required.');

        require('./classes/databaseClass.js').reindexDatabase_internal(null, function () {

            // Now that we've incited CouchDb to reindex the database, we need to determine whether CouchDB is busy
            // indexing views (maintenance tasks). If so, we need to go into 'maintenance mode' first until everything
            // has been completed.

            konsole.log(null, '[XCSNode - Initialization] checking whether there are any maintenance tasks in-flight.');

            xcsutil.maintenanceTasks_internal(function (err, tasks) {
                if (err) {
                    konsole.error(null, '[XCSNode - Initialization] error while checking the maintenance tasks. Reason: ' + JSON.stringify(err));
                    konsole.error(null, '[XCSNode - Initialization] exiting now!');
                    process.exit(1);
                } else {
                    if (tasks.length > 0) {
                        var results = JSON.stringify(tasks);
                        redisClass.client().set(k.XCSRedisMaintenanceTasksResults, results);

                        konsole.log(null, '[XCSNode - Initialization] there are ' + tasks.length + ' maintenance tasks running.');
                        redisClass.client().set(k.XCSRedisMaintenanceTasksPhase, '1', function () {
                            startXCS();
                        });
                    } else {
                        konsole.log(null, '[XCSNode - Initialization] there are no maintenance tasks running.');
                        redisClass.client().del(k.XCSRedisMaintenanceTasksPhase);
                        redisClass.client().del(k.XCSRedisMaintenanceTasksResults);
                        startXCS();
                    }
                }
            });

        });

    });
}

/***************************************************************************************************

    startXCS()

***************************************************************************************************/

function startXCS() {
    if (cluster.isMaster || cluster.isDisabled) {
        xcsutil.disableManualInitPhase_internal(function (err) {
            if (err) {
                konsole.error(null, '[XCSNode - Initialization] unable to initialize. Reason: ' + JSON.stringify(err) + '. Exiting now.');
                process.exit(1);
            } else {

                // Assume the service state is disabled originally (we'll set it accordingly later; if we access CouchDB now, we may blocked
                // if there are maintenance tasks active)
                redisClass.client().set(k.XCSRedisServiceEnabledOriginalState, '1');
                redisClass.client().set(k.XCSRedisServiceInitPhase, '1');
                continueInitialization();
            }
        });
    } else {
        continueInitialization();
    }
}

/***************************************************************************************************

    continueInitialization()

***************************************************************************************************/

function continueInitialization() {

    async.series([

        // Redis init ========================================================================

        function APPRedisInit(next) {
                konsole.log(null, '*************** Redis init');
                require('./app/app_redis.js')(function APPRedisInitCallback(err) {
                    return next(err);
                });
        },

        // Global configuration =============================================================

        function APPGlobalConfiguration(next) {
                konsole.log(null, '*************** Global configuration');
                require('./app/app_global_config.js')(app, function APPGlobalConfigurationCallback(err) {
                    return next(err);
                });
        },

        // Delegation cleanup ===============================================================

        function APPSDelegationCleanup(next) {
                if (cluster.isMaster) {
                    konsole.log(null, '*************** Delegation cleanup');
                    delegation.cleanAll(function () {
                        return next();
                    });
                } else {
                    konsole.debug(null, '*************** Worker - Skipping Delegation cleanup');
                    return next();
                }
        }

    ],
        function APPFinalizer(err) {
            if (err) {
                konsole.error(null, '[XCSNode - Initialization] Could not start the service due to an underlying error: ' + JSON.stringify(err));
            } else {
                parallelTier1Group();
            }
        });

}

function parallelTier1Group() {

    async.parallel({

            // Heapdump initialization  =========================================================

            heapdumpInit: function APPST1GHeapDumpInit(cb) {
                require('./app/app_heapdump.js')(app, function APPST1GHeapDumpInitCallback(err) {
                    return xcsutil.safeCallback(cb, err);
                });
            },

            // Make sure speedsnitch is installed if the profiler is active  ====================

            profilerInit: function APPST1GProfilerInit(cb) {
                konsole.log(null, '*************** Profiler init');
                require('./app/app_profiler.js')(function APPST1GProfilerInitCallback(err) {
                    return xcsutil.safeCallback(cb, err);
                });
            },

            // log file handling via SIGHUP =====================================================

            logFileHandlingViaSIGHUP: function APPST1GLogFileHandlingSIGHUP(cb) {
                konsole.log(null, '*************** Log file handling via SIGHUP');
                require('./app/app_log_rolling.js')(function APPST1GLogFileHandlingSIGHUPCallback(err) {
                    return xcsutil.safeCallback(cb, err);
                });
            }
        },
        function APPST1GFinalizer(err) {
            if (err) {
                konsole.error(null, '[XCSNode - Tier 1 group initialization] Could not start the service due to an underlying error: ' + JSON.stringify(err));
            } else {
                serialTier2Group();
            }

        });

}

function serialTier2Group() {

    async.series([

        // Setup the error handler ==========================================================

        function APPST2GErrorHandler(next) {
                konsole.log(null, '*************** Error handler setup');
                require('./error_handler.js')();
                return next();
        },

        // Secure server setup ===============================================================

        function APPST2GSecureServerSetup(next) {
                konsole.log(null, '*************** Secure server setup');
                require('./app/app_secure_server_setup.js')(app, function APPST2GSecureServerSetupCallback(err) {
                    return next(err);
                });
        },

        // Worker management setup ===========================================================

        function APPST2GWorkerManagement(next) {
                konsole.log(null, '*************** Worker management setup');
                var workerManagementClass = require('./app/app_worker_management.js');
                workerManagementClass.init(app, function APPST2GWorkerManagementCallback(err) {
                    return next(err);
                });
        },

        // Cycling workers setup =============================================================

        function APPST2GCycleWorkers(next) {
                var specifiedNumOfCPUs = app.get(k.XCSRedisSpecifiedNumOfCPUs),
                    multiNodeNoRecycle = app.get('multi-node-no-recycle');

                if (cluster.isDisabled || (1 === specifiedNumOfCPUs) || (true === multiNodeNoRecycle)) {
                    konsole.log(null, '*************** Cycling workers setup: disabled');
                    return next();
                } else {
                    konsole.log(null, '*************** Cycling workers setup');
                    require('./app/app_cycle_workers.js')(app, next);
                }
        },

        // Restore init phase ===============================================================

        function APPST2GRestoreInitPhase(next) {

                // Setup a timer running every 5 seconds where check if there are any maintenance
                // tasks running. If so, continue checking until the list is empty. At that point,
                // clear the init phase and resume as expected.

                if (cluster.isMaster && !restoreInitPhaseInterval) {
                    restoreInitPhaseInterval = setInterval(function () {
                        xcsutil.maintenanceTasks_internal(function (err, tasks) {
                            if (err) {
                                konsole.error(null, '[XCSNode - Initialization] error while checking the maintenance tasks. Reason: ' + JSON.stringify(err));
                            } else {
                                if (0 === tasks.length) {
                                    settings.findOrCreateSettingsDocument(null, function (err, doc) {
                                        if (err) {
                                            konsole.error(null, '[XCSNode - Initialization] unable to access the settings. Reason: ' + JSON.stringify(err) + '. Exiting now.');
                                            process.exit(1);
                                        } else {
                                            var isServiceEnabled = doc[k.XCSServiceEnabledKey];

                                            konsole.log(null, '[XCSNode - Initialization] is service enabled?: ' + (isServiceEnabled ? 'true' : 'false'));

                                            redisClass.client().set(k.XCSRedisServiceEnabledOriginalState, (isServiceEnabled ? '1' : '0'));
                                            redisClass.client().del(k.XCSRedisMaintenanceTasksPhase);
                                            redisClass.client().set(k.XCSRedisServiceInitPhase, '0');
                                            redisClass.client().del(k.XCSRedisMaintenanceTasksResults);

                                            redisClass.client().get(k.XCSRedisMaintenanceTasksPhase, function (err, reply) {
                                                konsole.log(null, '[XCSNode - Initialization - startXCS] redisClass.client().get(k.XCSRedisMaintenanceTasksPhase: ' + reply);

                                                clearInterval(restoreInitPhaseInterval);

                                                // Now that xcsd is ready, kick-off an ACL expansion
                                                require('./classes/aclClass.js').askODToExpandACLDocument(null, function () {
                                                    if (err && (531 !== err.status)) {
                                                        var message = 'Unable to load and cache the ACL document. Reason: ' + err.message;
                                                        konsole.warn(null, '[XCSNode - Initialization] initial default ACL reload warning: ' + message);
                                                    } else {
                                                        konsole.log(null, '[XCSNode - Initialization] initial default ACL reload completed successfully');
                                                    }
                                                });

                                                konsole.log(null, '[XCSNode - Initialization] initial default document setup');
                                                require('./app/app_default_documents.js')(app);

                                                konsole.log(null, '[XCSNode - Initialization] initial cleanup of previously running integrations');
                                                require('./app/app_cleanup.js')();

                                                konsole.log(null, '[XCSNode - Initialization] initial OTA install setup');
                                                require('./app/app_OTA_install.js')();

                                                var workerManagementClass = require('./app/app_worker_management.js');
                                                konsole.log(null, '[XCSNode - Initialization - startXCS] isServiceEnabled: ' + isServiceEnabled);
                                                if (isServiceEnabled) {
                                                    workerManagementClass.startAllWorkers(app, isServiceEnabled);
                                                } else {
                                                    workerManagementClass.setKillAllWorkersTimeout(function AWMStartWorkerSetKillAllWorkersTimeout() {
                                                        workerManagementClass.startWorker(app);
                                                    });
                                                }

                                            });
                                        }
                                    });
                                } else {
                                    var results = JSON.stringify(tasks);
                                    redisClass.client().set(k.XCSRedisMaintenanceTasksResults, results);
                                }
                            }
                        });
                    }, 5 * 1000);
                }

                return next();
        },

        // Dashboard setup ===============================================================

        function APPST2GDashboardSetup(next) {
                require('./app/app_dashboard.js')(app, next);
        }

        ],
        function APPST2GFinalizer(err) {
            if (err) {
                konsole.error(null, '[XCSNode - Initialization] Could not start the service due to an underlying error: ' + JSON.stringify(err));
                return process.exit(1);
            }
        });

}