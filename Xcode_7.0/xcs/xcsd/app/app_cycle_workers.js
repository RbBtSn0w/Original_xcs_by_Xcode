'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var _ = require('underscore'),
    cluster = require('cluster'),
    async = require('async');

var k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    scheduler = require('../util/scheduler.js'),
    redisClass = require('../classes/redisClass.js'),
    xcsutil = require('../util/xcsutil.js');

module.exports = function app_cycle_workers_init(app, cb) {
    if (cluster.isWorker) {
        for (var i = 0; i < 60; i += 5) {
            scheduler.scheduleHourlyAtTime(i, updateMemoryUsage);
        }

        process.on('message', function ACWMessageEvent(msg) {
            if (msg.command === 'ExitGraceful') {

                console.log('***************[Cycle Workers - init] ExitGraceful');

                var processPID = process.pid;

                process.on('exit', function ACWRecycleWorkerExitEvent() {
                    konsole.log(null, '\n\n\n[Cycle Workers - init] all servers on process with PID ' + processPID + ' are closed now. Recycling worker...\n\n');
                });

                async.parallel([

                    function ACWShutdownNonSecureServer(callback) {
                        try {
                            app.get('server').close(function ACWShutdownNonSecureServerCallback() {
                                konsole.log(null, '[Cycle Workers - init][PID ' + processPID + '] shut down non-secure server.');
                                return xcsutil.safeCallback(callback);
                            });
                        } catch (e) {
                            if (k.XCSServerNotRunning !== e.message.toLowerCase()) {
                                konsole.log(null, '[Cycle Workers - init][PID ' + processPID + '] server close failure : ' + e.message);
                                return xcsutil.safeCallback(callback, e.message);
                            } else {
                                return xcsutil.safeCallback(callback);
                            }
                        }
                    },
                    function ACWShutdownSecureServer(callback) {
                        try {
                            app.get('secureServer').close(function ACWShutdownSecureServerCallback() {
                                konsole.log(null, '[Cycle Workers - init][PID ' + processPID + '] shut down secure server.');
                                return xcsutil.safeCallback(callback);
                            });
                        } catch (e) {
                            if (k.XCSServerNotRunning !== e.message.toLowerCase()) {
                                konsole.log(null, '[Cycle Workers - init][PID ' + processPID + '] secureServer close failure : ' + e.message);
                                return xcsutil.safeCallback(callback, e.message);
                            } else {
                                return xcsutil.safeCallback(callback);
                            }
                        }
                    },
                    function ACWsecureWithClientAuthServer(callback) {
                        try {
                            app.get('secureServerWithClientAuth').close(function ACWsecureWithClientAuthServerCallback() {
                                konsole.log(null, '[Cycle Workers - init][PID ' + processPID + '] shut down secure-with-client-auth server.');
                                return xcsutil.safeCallback(callback);
                            });
                        } catch (e) {
                            if (k.XCSServerNotRunning !== e.message.toLowerCase()) {
                                konsole.log(null, '[Cycle Workers - init][PID ' + processPID + '] secureServerWithClientAuth close failure : ' + e.message);
                                return xcsutil.safeCallback(callback, e.message);
                            } else {
                                return xcsutil.safeCallback(callback);
                            }
                        }
                    }
                ], function ACWFinalizer(err) {
                    if (err) {
                        konsole.error(null, '[Cycle Workers - init][PID ' + processPID + '] error attempting to close all servers: ' + JSON.stringify(err));
                    } else {
                        konsole.log(null, '[Cycle Workers - init][PID ' + processPID + '] all servers are closed. Waiting ' + k.XCSManageAllWorkersTimeout / 1000 + ' seconds to serve the responses');
                    }

                    setTimeout(function ACWManageAllWorkersTimeout() {
                        konsole.log(null, '[Cycle Workers - init][PID ' + processPID + '] done waiting, exiting now.');
                        if (process !== undefined && process !== null) {
                            terminateWorker(cluster.worker.id, true);
                        }
                    }, k.XCSManageAllWorkersTimeout);
                });

                setTimeout(function ACWManageAllWorkersSentinelTimeout() {
                    konsole.log(null, '[Cycle Workers - init][PID ' + processPID + '] process took too long to close, forcing exit.');
                    if (process !== undefined && process !== null) {
                        terminateWorker(cluster.worker.id, false);
                    }
                }, 120000);
            }
        });

        updateMemoryUsage(cb);
    } else if (cluster.isMaster && !cluster.isDisabled) {
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
    konsole.debug(null, '[Cycle Workers - updateMemoryUsage] requested to update memory for worker ' + cluster.worker.id);
    redisClass.client().set('cluster-mem:' + cluster.worker.id, process.memoryUsage().rss + '', 'EX', 420, function ACWUpdateMemoryUsageCallback() {
        konsole.debug(null, '[Cycle Workers - updateMemoryUsage] cluster ' + cluster.worker.id + ' updated its memory usage');
        return xcsutil.safeCallback(cb);
    });
}

function terminateWorker(workerID, cleanly) {
    if (cluster.workers) {
        var worker = cluster.workers[workerID];

        if (worker) {
            konsole.log(null, '[Cycle Workers - terminateWorker][PID ' + worker.process.pid + '] terminating worker ' + workerID + ', cleanly? ' + cleanly);

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
            konsole.error(null, '[Cycle Workers - cycleProcessesAsNeeded] error loading cluster memory usage from Redis: ' + JSON.stringify(err));
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

            konsole.log(null, '[Cycle Workers - cycleProcessesAsNeeded] terminating worker with highest footprint: ' + highestUsage);
            terminateWorker(highestUsage, true);
        }
    });
}