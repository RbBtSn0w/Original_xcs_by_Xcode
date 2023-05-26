/*
    XCSWorkerManagementClass
    A class dedicated to manage xcsd worker processes.
*/

'use strict';

var cluster = require('cluster');

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    redisClass = require('../classes/redisClass.js'),
    delegation = require('../util/delegation.js'),
    healthClass = require('../classes/healthClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    sharedDocClass = require('../classes/sharedDocClass.js');

var manageWorkersTimeout = null;

// needs to happen before any workers are spawned
require('../classes/healthClass.js');

function XCSWorkerManagementClass() {}

XCSWorkerManagementClass.prototype.init = function init(app, cb) {

    var self = this;

    if (cluster.isMaster && !cluster.isDisabled) {

        logger.debug('Clearing out old cluster information from Redis.');

        var r = redisClass.client();
        redisClass.deleteWithPattern(null, 'cluster:*', function AWMRedisClearOldClusterMappings() {

            // prepare delegation
            var skipSetKillAllWorkersTimeout = true;

            // handle termination behavior
            cluster.on('exit', function AWMClusterExitEvent(oldWorker, code, signal) {

                logger.info('Worker process', oldWorker.id, 'is exiting');
                logger.debug('Worker', oldWorker.id, 'exiting with code', code, 'and signal', signal);

                r.del('cluster:' + oldWorker.id, function AWMRedisClearOldWorker() {
                    r.del('cluster-mem:' + oldWorker.id, function AWMRedisClearClusterMem() {
                        logger.debug('Removed Redis references to worker', oldWorker.id);

                        delegation.cleanupWorkerWithID(oldWorker.id, function AWMClearOldClusterMappings() {

                            // We only want to spawn a new worker during the following cases:
                            //      1) log rolling (SIGHUP)
                            //      2) hard kill (due to an unresponsive worker).
                            //      3) Segfaults
                            //      4) exit gracefully (worker with the highest footprint)
                            // In some cases, we want to terminate the workers without spawning new workers. In this case we'll use SIGTERM,
                            // which gets ignored below.

                            if (workerKilledIntentionally(code, signal)) {
                                logger.debug('Worker', oldWorker.id, 'was intentionally terminated with', signal, 'signal, not replacing with new worker.');
                            } else {
                                logger.info('Replacing worker', oldWorker.id, 'with a new worker');
                                self.startWorker(app);
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
        logger.debug('Canceled previous timeout for killing all workers.');
    }

    var workerIDs = Object.keys(cluster.workers);

    logger.debug('Starting all workers. Currently there are', workerIDs.length, 'workers running.');

    if (skipSetKillAllWorkersTimeout) {
        logger.debug('Starting a new batch of workers immediately, without killing existing workers first.');
        spawnWorkers(self, app, serviceEnabled, function AWMStartAllWorkersSpawnWorkersSkipKillWorkers() {
            return startXCS(app, cb);
        });
    } else {
        logger.debug('Killing all workers, then starting a new batch of workers.');
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
            logger.debug('Timeout fired. Killing all existing workers.');
            killAllWorkers(cb);
        }, k.XCSManageAllWorkersTimeout);

        logger.debug('Waiting', k.XCSManageAllWorkersTimeout / 1000, 'seconds, then killing existing workers.');
    }
};

XCSWorkerManagementClass.prototype.startWorker = function startWorker(app, callback) {

    var self = this;

    var w = cluster.fork(),
        r = redisClass.client();

    r.set('cluster:' + w.id, w.process.pid);

    logger.debug('Starting worker', w.id, 'with PID', w.process.pid);

    w.on('message', function AWMStartWorkerMessageEventCallback(msg) {
        if (msg.command === 'ManageWorkers') {
            if (msg.enabled) {
                logger.info('The service has been enabled. Starting all workers.');
                self.startAllWorkers(app, msg.enabled);
            } else {
                logger.info('The service has been disabled. Replacing existing workers with a single basic worker.');
                self.setKillAllWorkersTimeout(function AWMStartWorkerSetKillAllWorkersTimeout() {
                    self.startWorker(app);
                });
            }
        }
    });

    var workerIDs = Object.keys(cluster.workers);
    logger.debug('Done starting worker.', (workerIDs ? workerIDs.length : 0), 'workers have currently been started.');

    return xcsutil.safeCallback(callback);

};

/* Module exports */

module.exports = new XCSWorkerManagementClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function workerKilledIntentionally(code, signal) {
    return signal === 'SIGTERM' && code !== 1;
}

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

    logger.info('Killing', numWorkers, 'existing workers.');

    for (var i = 0; i < numWorkers; i++) {
        var workerID = workerIDs[i];
        logger.debug('Killing worker', workerID, 'by sending it a TERM signal.');
        cluster.workers[workerID].kill('SIGTERM');
    }

    manageWorkersTimeout = undefined;
    logger.debug('Done killing existing workers.');

    return xcsutil.safeCallback(cb);
}

function spawnWorkers(self, app, serviceEnabled, cb) {

    var specifiedNumOfCPUs,
        workerCount,
        numberStarted;

    logger.debug('Starting worker processes.');

    redisClass.client().get(k.XCSRedisSpecifiedNumOfCPUs, function (err, reply) {
        if (err) {
            logger.error('Unable to obtain number of workers to start from Redis:', err);
        } else {
            specifiedNumOfCPUs = parseInt(reply, 10);
            workerCount = serviceEnabled ? specifiedNumOfCPUs : 1;
            numberStarted = workerCount;

            logger.info('Attempting to start', workerCount, 'workers.');

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
        logger.debug('Finished starting a worker.');
        numberStarted--;
        if (0 === numberStarted) {
            logger.info('Done starting', workerCount, 'worker processes.');
            return xcsutil.safeCallback(cb);
        }
    }

}
