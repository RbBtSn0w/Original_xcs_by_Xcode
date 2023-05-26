/*
    XCSWorkerManagementClass
    A class dedicated to manage xcsd worker processes.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var cluster = require('cluster');

var k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    redisClass = require('../classes/redisClass.js'),
    delegation = require('../util/delegation.js'),
    healthClass = require('../classes/healthClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    sharedDocClass = require('../classes/sharedDocClass.js');

var manageWorkersTimeout = null;

// needs to happen before any workers are spawned
require('../classes/healthClass.js');

/* XCSSettingsClass object */

function XCSWorkerManagementClass() {}

XCSWorkerManagementClass.prototype.init = function init(app, cb) {

    var self = this;

    if (cluster.isMaster && !cluster.isDisabled) {

        konsole.log(null, '[Worker management - init] clear out old cluster mappings.');

        // clear out old cluster mappings
        var r = redisClass.client();

        redisClass.deleteWithPattern(null, 'cluster:*', function AWMRedisClearOldClusterMappings() {

            // prepare delegation
            var skipSetKillAllWorkersTimeout = true;

            // handle termination behavior
            cluster.on('exit', function AWMClusterExitEvent(oldWorker, code, signal) {

                konsole.log(null, '[Worker management - init] cluster.on(exit) called');
                konsole.log(null, '[Worker management - init]     oldworker: ' + oldWorker.id);
                konsole.log(null, '[Worker management - init]     code: ' + code);
                konsole.log(null, '[Worker management - init]     signal: ' + signal);

                r.del('cluster:' + oldWorker.id, function AWMRedisClearOldWorker() {
                    r.del('cluster-mem:' + oldWorker.id, function AWMRedisClearClusterMem() {
                        konsole.log(null, '[Worker management - init] before delegation.cleanupWorkerWithID');
                        delegation.cleanupWorkerWithID(oldWorker.id, function AWMClearOldClusterMappings() {

                            // We only want to spawn a new worker during the following cases:
                            //      1) log rolling (SIGHUP)
                            //      2) hard kill (due to an unresponsive worker).
                            //      3) exit gracefully (worker with the highest footprint)
                            // In some cases, we want to terminate the workers without spawning new workers. In this case we'll use SIGTERM,
                            // which gets ignored below.

                            if (('SIGHUP' === signal) || ('SIGKILL' === signal) || (1 === code)) {
                                konsole.log(null, '[Worker management - init] starting new worker');
                                self.startWorker(app);
                            } else {
                                konsole.log(null, '[Worker management - init] skipping worker restart');
                            }

                        });
                    });
                });

            });

            redisClass.client().get(k.XCSRedisServiceEnabledOriginalState, function (err, reply) {
                var serviceIsEnabled = ('1' === reply ? true : false);
                self.startAllWorkers(app, serviceIsEnabled, skipSetKillAllWorkersTimeout, function AWMStartAllWorkers(err) {
                    return xcsutil.safeCallback(cb, err);
                });
            });

        });
    } else {

        process.on('message', function (msg) {
            if (msg[k.XCSHealth]) {
                healthClass.status_internal(null, function (healthInfo) {
                    if (healthInfo) {
                        var redis = redisClass.client(),
                            health = JSON.stringify(healthInfo);
                        redis.hmset('XCSDashboard key', k.XCSHealth, health, function () {
                            process.send({
                                type: k.XCSHealth
                            });
                        });
                    }
                });
            }
        });

        return startXCS(app, cb);
    }

};

XCSWorkerManagementClass.prototype.startAllWorkers = function startAllWorkers(app, serviceEnabled, skipSetKillAllWorkersTimeout, cb) {

    var self = this;

    // clear the killWorkersTimeout (in case one is already running)
    if (manageWorkersTimeout) {
        clearTimeout(manageWorkersTimeout);
        manageWorkersTimeout = undefined;
        konsole.log(null, '[Worker management - startAllWorkers] previous purging timeout has been canceled');
    }

    var workerIDs = Object.keys(cluster.workers);

    konsole.log(null, '[Worker management - startAllWorkers] number of existing workers: ' + workerIDs.length);

    if (skipSetKillAllWorkersTimeout) {
        konsole.log(null, '[Worker management - startAllWorkers] spawnWorkers');
        spawnWorkers(self, app, serviceEnabled, function AWMStartAllWorkersSpawnWorkersSkipKillWorkers() {
            return startXCS(app, cb);
        });
    } else {
        konsole.log(null, '[Worker management - startAllWorkers] setKillAllWorkersTimeout');
        self.setKillAllWorkersTimeout(function AWMStartAllWorkersSetKillAllWorkersTimeout() {
            spawnWorkers(self, app, serviceEnabled, function AWMSpawnWorkersKillWorkers() {
                return startXCS(app, cb);
            });
        });
    }

};

XCSWorkerManagementClass.prototype.setKillAllWorkersTimeout = function setKillAllWorkersTimeout(cb) {
    if (!manageWorkersTimeout) {
        manageWorkersTimeout = setTimeout(function AWMPurgeExistingWorkers() {
            konsole.log(null, '[Worker management - setKillAllWorkersTimeout] killAllWorkers');
            killAllWorkers(cb);
        }, k.XCSManageAllWorkersTimeout);
        konsole.log(null, '[Worker management - setKillAllWorkersTimeout] purging existing workers in: ' + k.XCSManageAllWorkersTimeout / 1000 + ' seconds');
    }
};

XCSWorkerManagementClass.prototype.startWorker = function startWorker(app, callback) {

    var self = this;

    var w = cluster.fork(),
        r = redisClass.client();

    r.set('cluster:' + w.id, w.process.pid);

    konsole.log(null, '[Worker management - startWorker] starting worker: ' + w.id);

    w.on('message', function AWMStartWorkerMessageEventCallback(msg) {
        if (msg.command === 'ManageWorkers') {

            konsole.log(null, '[Worker management - startWorker] enabled?: ' + msg.enabled);

            if (msg.enabled) {
                konsole.log(null, '[Worker management - startWorker] starting all workers');
                self.startAllWorkers(app, msg.enabled);
            } else {
                konsole.log(null, '[Worker management - startWorker] starting worker');
                self.setKillAllWorkersTimeout(function AWMStartWorkerSetKillAllWorkersTimeout() {
                    self.startWorker(app);
                });
            }
        }
    });

    var workerIDs = Object.keys(cluster.workers);
    konsole.log(null, '[Worker management - startWorker] number of workers currently spawned: ' + (workerIDs ? workerIDs.length : 0));

    return xcsutil.safeCallback(callback);

};

/* Module exports */

module.exports = new XCSWorkerManagementClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function startXCS(app, cb) {
    if (!cluster.isMaster || cluster.isDisabled) {
        require('./app_startXCS.js')(app, function AWMStartXCSCallback(err) {
            return xcsutil.safeCallback(cb, err);
        });
    } else {
        return xcsutil.safeCallback(cb);
    }
}

function killAllWorkers(cb) {
    var workerIDs = Object.keys(cluster.workers),
        numWorkers = workerIDs.length;

    konsole.log(null, '[Worker management - killAllWorkers] number of workers to purge: ' + numWorkers - 1);

    // don't kill the first worker since we still have to respond to xcscontrol requests
    for (var i = 0; i < numWorkers; i++) {
        var workerID = workerIDs[i];
        konsole.log(null, '[Worker management - killAllWorkers] purging worker: ' + workerID);
        cluster.workers[workerID].kill('SIGTERM');
    }

    manageWorkersTimeout = undefined;
    konsole.log(null, '[Worker management - killAllWorkers] done.');

    return xcsutil.safeCallback(cb);
}

function spawnWorkers(self, app, serviceEnabled, cb) {

    var specifiedNumOfCPUs,
        workerCount,
        numberStarted;

    konsole.log(null, '[Worker management - spawnWorkers] obtaining the number of workers to spawn');

    redisClass.client().get(k.XCSRedisSpecifiedNumOfCPUs, function (err, reply) {
        if (err) {
            konsole.error(null, '[Worker management - spawnWorkers] unable to obtain the number of specified CPUs. Reason: ' + JSON.stringify(err));
        } else {
            specifiedNumOfCPUs = parseInt(reply, 10);
            workerCount = serviceEnabled ? specifiedNumOfCPUs : 1;
            numberStarted = workerCount;

            konsole.log(null, '[Worker management - spawnWorkers] number of workers to start: ' + workerCount);

            // [Tito - DEBUG]
            // <rdar://problem/19376420> Can't add Xcode Server in Xcode preferences
            // Is the settings doc out-of-sync between Redis and CouchDB?

            sharedDocClass.printSettingsFromCouchAndRedis(null, function () {
                for (var i = 0; i < workerCount; i++) {
                    self.startWorker(app, finalizeWorkerStart);
                }
            });
        }
    });

    function finalizeWorkerStart() {
        numberStarted--;
        if (0 === numberStarted) {
            konsole.log(null, '[Worker management - spawnWorkers] done.');
            return xcsutil.safeCallback(cb);
        }
    }

}