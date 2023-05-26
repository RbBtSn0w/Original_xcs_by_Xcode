'use strict';

var _ = require('underscore'),
    cluster = require('cluster'),
    async = require('async'),
    Promise = require('bluebird');

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    scheduler = require('../util/scheduler.js'),
    xcsutil = require('../util/xcsutil.js');

module.exports = Promise.method(function app_cycle_workers_init(app) {
    var specifiedNumOfCPUs = app.get(k.XCSRedisSpecifiedNumOfCPUs),
        multiNodeNoRecycle = app.get('multi-node-no-recycle');

    if (cluster.isDisabled || (1 === specifiedNumOfCPUs) || (true === multiNodeNoRecycle)) {
        logger.info('Cycling workers is disabled. This may cause memory usage of processes to get out of control.');
        return;
    }

    if (cluster.isWorker) {
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
    } else {
        logger.debug('Scheduling half-hourly recycling of worker processes.');
        for (var j = 22; j < 60; j += 30) {
            scheduler.scheduleHourlyAtTime(j, cycleProcessesAsNeeded);
        }
    }
});

/***************************************************************************************************

    Private Section

***************************************************************************************************/

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
    let workers = Object.keys(cluster.workers);
    if (workers.length < 2) {
        return;
    }

    logger.debug('Cycling workers. Current workers:', workers);
    let oldestProcess = _.min(workers);

    logger.info('Terminating worker', oldestProcess, 'because it is the oldest request worker.');
    terminateWorker(oldestProcess, true);
}
