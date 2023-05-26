'use strict';

var _ = require('underscore'),
    cluster = require('cluster'),
    async = require('async');

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    scheduler = require('../util/scheduler.js'),
    redisClass = require('../classes/redisClass.js'),
    xcsutil = require('../util/xcsutil.js');

module.exports = function app_cycle_workers_init(app, cb) {
    if (cluster.isWorker) {

        logger.debug('Scheduling memory check-ins for every 5 minutes.');
        for (var i = 0; i < 60; i += 5) {
            scheduler.scheduleHourlyAtTime(i, updateMemoryUsage);
        }

        process.on('message', function ACWMessageEvent(msg) {
            if (msg.command === 'ExitGraceful') {

                logger.debug('Received request from master process to gracefully exit.');

                process.on('exit', function ACWRecycleWorkerExitEvent() {
                    logger.info('All servers on this worker are closed. Recycling.');
                });

                async.parallel([

                    function ACWShutdownNonSecureServer(callback) {
                        try {
                            app.get('server').close(function ACWShutdownNonSecureServerCallback() {
                                logger.debug('Successfully shut down non-secure HTTP server.');
                                return xcsutil.safeCallback(callback);
                            });
                        } catch (e) {
                            if (k.XCSServerNotRunning !== e.message.toLowerCase()) {
                                logger.error('Error trying to close non-secure server:', e.message);
                                return xcsutil.safeCallback(callback, e.message);
                            } else {
                                return xcsutil.safeCallback(callback);
                            }
                        }
                    },
                    function ACWShutdownSecureServer(callback) {
                        try {
                            app.get('secureServer').close(function ACWShutdownSecureServerCallback() {
                                logger.debug('Successfully shut down secure HTTP server.');
                                return xcsutil.safeCallback(callback);
                            });
                        } catch (e) {
                            if (k.XCSServerNotRunning !== e.message.toLowerCase()) {
                                logger.error('Error trying to close secure server:', e.message);
                                return xcsutil.safeCallback(callback, e.message);
                            } else {
                                return xcsutil.safeCallback(callback);
                            }
                        }
                    },
                    function ACWsecureWithClientAuthServer(callback) {
                        try {
                            app.get('secureServerWithClientAuth').close(function ACWsecureWithClientAuthServerCallback() {
                                logger.debug('Successfully shut down secure-with-client-auth server.');
                                return xcsutil.safeCallback(callback);
                            });
                        } catch (e) {
                            if (k.XCSServerNotRunning !== e.message.toLowerCase()) {
                                logger.error('Error trying to close secure-with-client-auth server:', e.message);
                                return xcsutil.safeCallback(callback, e.message);
                            } else {
                                return xcsutil.safeCallback(callback);
                            }
                        }
                    }
                ], function ACWFinalizer() {
                    logger.debug('All servers are closed. Waiting', k.XCSManageAllWorkersTimeout / 1000, 'seconds to serve the response.');

                    setTimeout(function ACWManageAllWorkersTimeout() {
                        logger.debug('Finished waiting for responses to finish. Exiting.');
                        if (process !== undefined && process !== null) {
                            terminateWorker(cluster.worker.id, true);
                        }
                    }, k.XCSManageAllWorkersTimeout);
                });

                setTimeout(function ACWManageAllWorkersSentinelTimeout() {
                    logger.warn('Took longer than 2 minutes to close all servers. Forcing exit of this worker.');
                    if (process !== undefined && process !== null) {
                        terminateWorker(cluster.worker.id, false);
                    }
                }, 120000);
            }
        });

        updateMemoryUsage(cb);
    } else if (cluster.isMaster && !cluster.isDisabled) {
        logger.debug('Scheduling half-hourly recycling of worker processes.');
        for (var j = 22; j < 60; j += 30) {
            scheduler.scheduleHourlyAtTime(j, cycleProcessesAsNeeded);
        }

        return xcsutil.safeCallback(cb);
    } else {
        return xcsutil.safeCallback(cb);
    }
};

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function updateMemoryUsage(cb) {
    logger.debug('Received request to update this worker\'s memory usage.');

    var memoryUsage = process.memoryUsage().rss + '';
    redisClass.client().set('cluster-mem:' + cluster.worker.id, memoryUsage, 'EX', 420, function ACWUpdateMemoryUsageCallback() {
        logger.debug('Updated our memory usage in Redis. We\'re currently using', memoryUsage, 'bytes.');
        return xcsutil.safeCallback(cb);
    });
}

function terminateWorker(workerID, cleanly) {
    if (cluster.workers) {
        var worker = cluster.workers[workerID];

        if (worker) {
            logger.debug('Terminating worker', workerID, 'with PID', worker.process.pid, cleanly ? 'gracefully' : 'forcefully');

            if (!cleanly) {
                worker.kill('SIGKILL');
            } else {
                worker.send({
                    command: 'ExitGraceful'
                });
            }
        }
    } else {
        process.exit(1);
    }
}

function cycleProcessesAsNeeded() {
    var workers = Object.keys(cluster.workers);
    if (workers.length < 2) {
        return;
    }

    var keys = workers.map(function ACWGetClusterMemKeysCallback(id) {
        return 'cluster-mem:' + id;
    });

    redisClass.client().mget(keys, function ACWGetClusterMemKeysCallback(err, results) {
        if (err) {
            logger.error('Error loading cluster memory usage from Redis:', err);
        } else {
            var memoryUsage = results.map(function ACWMemoryUsageCallback(usage) {
                return parseInt(usage, 10);
            });
            var deadProcesses = workers.filter(function ACWDeadProcessesCallback(key, index) {
                return !memoryUsage[index];
            });
            var highestUsage = _.max(workers, function ACWHighestUsageCallback(key, index) {
                return memoryUsage[index];
            });

            deadProcesses.forEach(function ACWTerminateDeadProcessCallback(workerID) {
                terminateWorker(workerID, false);
            });

            logger.info('Terminating worker', highestUsage, 'because it has the highest memory usage.');
            terminateWorker(highestUsage, true);
        }
    });
}
