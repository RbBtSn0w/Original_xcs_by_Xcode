'use strict';

// Node modules

var express = require('express'),
    async = require('async'),
    cluster = require('cluster');

// XCSNode modules

var logger = require('./util/logger.js'),
    xcsutil = require('./util/xcsutil.js'),
    delegation = require('./util/delegation.js'),
    settings = require('./classes/settingsClass.js'),
    k = require('./constants.js'),
    redisClass = require('./classes/redisClass.js');

// App

var app = express(),
    restoreInitPhaseInterval;

// Start ============================================================================
logger.info('Starting xcsd in', app.get('env'), 'mode.');

// Report the process(es) pid(s)

if (cluster.isMaster || cluster.isDisabled) {
    bootstrap();
} else {
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

        logger.info('Initializing: checking if CouchDB maintenance is required.');

        require('./classes/databaseClass.js').reindexDatabase_internal(null, function () {

            // Now that we've incited CouchDb to reindex the database, we need to determine whether CouchDB is busy
            // indexing views (maintenance tasks). If so, we need to go into 'maintenance mode' first until everything
            // has been completed.

            logger.debug('Initializing: checking for in-flight maintenance tasks.');

            xcsutil.maintenanceTasks_internal(function (err, tasks) {
                if (err) {
                    logger.error('Error checking for in-flight maintenance tasks:', err);
                    process.exit(1);
                } else {
                    if (tasks.length > 0) {
                        var results = JSON.stringify(tasks);
                        redisClass.client().set(k.XCSRedisMaintenanceTasksResults, results);

                        logger.debug('There are', tasks.length, 'maintenance tasks currently running.');
                        redisClass.client().set(k.XCSRedisMaintenanceTasksPhase, '1', function () {
                            startXCS();
                        });
                    } else {
                        logger.debug('There are no maintenance tasks running.');
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
                logger.error('Could not start xcsd:', err);
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
                require('./app/app_redis.js')(function APPRedisInitCallback(err) {
                    return next(err);
                });
        },

        function (next) {
            require('./app/app_background_queue.js')(next);
        },

        // Global configuration =============================================================

        function APPGlobalConfiguration(next) {
                require('./app/app_global_config.js')(app, function APPGlobalConfigurationCallback(err) {
                    return next(err);
                });
        },

        // Delegation cleanup ===============================================================

        function APPSDelegationCleanup(next) {
                if (cluster.isMaster) {
                    delegation.cleanAll(function () {
                        return next();
                    });
                } else {
                    return next();
                }
        }

    ],
        function APPFinalizer(err) {
            if (err) {
                logger.error('Could not continue starting xcsd:', err);
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
                require('./app/app_profiler.js')(function APPST1GProfilerInitCallback(err) {
                    return xcsutil.safeCallback(cb, err);
                });
            }
        },
        function APPST1GFinalizer(err) {
            if (err) {
                logger.error('Could not complete tier 1 initialization:', err);
            } else {
                serialTier2Group();
            }

        });

}

function serialTier2Group() {

    async.series([

        // Setup the error handler ==========================================================

        function APPST2GErrorHandler(next) {
                require('./error_handler.js')();
                return next();
        },

        // Secure server setup ===============================================================

        function APPST2GSecureServerSetup(next) {
                require('./app/app_secure_server_setup.js')(app, function APPST2GSecureServerSetupCallback(err) {
                    return next(err);
                });
        },

        // Worker management setup ===========================================================

        function APPST2GWorkerManagement(next) {
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
                    logger.info('Cycling workers is disabled. This may cause memory usage of processes to get out of control.');
                    return next();
                } else {
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
                                logger.error('Could not load current maintenance tasks:', err);
                            } else {
                                if (0 === tasks.length) {
                                    logger.debug('There are no current maintenance tasks, attempting to continue with startup.');
                                    settings.findOrCreateSettingsDocument(null, function (err, doc) {
                                        if (err) {
                                            logger.error('Could not load the settings for xcsd:', err);
                                            process.exit(1);
                                        } else {
                                            var isServiceEnabled = doc[k.XCSServiceEnabledKey];

                                            logger.info('The xcsd service is', (isServiceEnabled ? 'enabled.' : 'disabled.'));

                                            redisClass.client().set(k.XCSRedisServiceEnabledOriginalState, (isServiceEnabled ? '1' : '0'));
                                            redisClass.client().del(k.XCSRedisMaintenanceTasksPhase);
                                            redisClass.client().set(k.XCSRedisServiceInitPhase, '0');
                                            redisClass.client().del(k.XCSRedisMaintenanceTasksResults);

                                            redisClass.client().get(k.XCSRedisMaintenanceTasksPhase, function (err, reply) {
                                                logger.debug('Current maintenance tasks phase:', reply);

                                                clearInterval(restoreInitPhaseInterval);

                                                // Now that xcsd is ready, kick-off an ACL expansion
                                                require('./classes/aclClass.js').askODToExpandACLDocument(null, function () {
                                                    if (err && (531 !== err.status)) {
                                                        var message = 'Unable to load and cache the ACL document: ' + err.message;
                                                        logger.warn(message);
                                                    } else {
                                                        logger.debug('Successfully performed initial reload of ACLs.');
                                                    }
                                                });

                                                require('./app/app_default_documents.js')(app);
                                                require('./app/app_cleanup.js')();
                                                require('./app/app_OTA_install.js')();

                                                var workerManagementClass = require('./app/app_worker_management.js');
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
                logger.error('Could not start xcsd due to an error in initialization:', err);
                return process.exit(1);
            }
        });

}
