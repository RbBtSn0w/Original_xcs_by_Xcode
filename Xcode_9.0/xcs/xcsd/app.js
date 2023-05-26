'use strict';

var express = require('express'),
    cluster = require('cluster'),
    config = require('config'),
    Promise = require('bluebird');

var logger = require('./util/logger.js'),
    xcsutil = require('./util/xcsutil.js'),
    k = require('./constants.js'),
    redisClass = require('./classes/redisClass.js');

Promise.config(config.get('promise'));
const delegation = Promise.promisifyAll(require('./util/delegation.js'));

const app = express();

logger.info('Starting xcsd in', app.get('env'), 'mode.');
run();

function run() {
    return reindexDatabase()
        .then(resetInitPhase)
        .then(require('./app/app_redis.js'))
        .then(require('./app/app_background_queue.js'))
        .then(() => require('./app/app_global_config.js')(app))
        .then(cleanUpDelegation)
        .then(require('./app/app_heapdump.js'))
        .then(require('./app/app_profiler.js'))
        .then(require('./error_handler.js'))
        .then(() => require('./app/app_secure_server_setup.js')(app))
        .then(require('./app/app_worker_management.js'))
        .then(() => require('./app/app_cycle_workers.js')(app))
        .then(() => require('./app/app_init_phase.js')(app))
        .then(() => require('./app/app_dashboard.js')(app))
        .then(startXCS)
        .catch(err => {
            logger.error('Could not start xcsd:', err);
            process.exit(1);
        });
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

function reindexDatabase() {
    if (cluster.isMaster || cluster.isDisabled) {
        return new Promise((resolve, reject) => {
            // CouchDB startup check. We perform the check in Redis above because in the case of CouchDB, we don't need to keep the variable around.
            require('./classes/couchdbClass.js')(function() {
                logger.debug('Initializing: checking if CouchDB maintenance is required.');
                require('./classes/databaseClass.js').reindexDatabase_internal(null, function() {

                    // Now that we've incited CouchDb to reindex the database, we need to determine whether CouchDB is busy
                    // indexing views (maintenance tasks). If so, we need to go into 'maintenance mode' first until everything
                    // has been completed.

                    logger.debug('Initializing: checking for in-flight maintenance tasks.');
                    xcsutil.maintenanceTasks_internal(function(err, tasks) {
                        if (err) {
                            reject(err);
                        } else {
                            if (tasks.length > 0) {
                                var results = JSON.stringify(tasks);
                                redisClass.client().set(k.XCSRedisMaintenanceTasksResults, results);

                                logger.debug('There are', tasks.length, 'maintenance tasks currently running.');
                                resolve(redisClass.client().set(k.XCSRedisMaintenanceTasks, '1'));
                            } else {
                                logger.debug('There are no maintenance tasks running.');
                                resolve(Promise.all([redisClass.client().del(k.XCSRedisMaintenanceTasksPhase), redisClass.client().del(k.XCSRedisMaintenanceTasksResults)]));
                            }
                        }
                    });
                });
            });
        });
    } else {
        return Promise.resolve();
    }
}

const disableManualInitPhase = Promise.promisify(xcsutil.disableManualInitPhase_internal);
function resetInitPhase() {
    return Promise.try(() => {
        if (cluster.isMaster || cluster.isDisabled) {
            return disableManualInitPhase()
                .then(() => Promise.all([
                    redisClass.client().set(k.XCSRedisServiceEnabledOriginalState, '1'),
                    redisClass.client().set(k.XCSRedisServiceInitPhase, '1')
                ]));
        } else {
            return null;
        }
    });
}

function cleanUpDelegation() {
    if (cluster.isMaster) {
        return delegation.cleanAllAsync();
    } else {
        return Promise.resolve();
    }
}

function startXCS() {
    if (cluster.isWorker || cluster.isDisabled) {
        return require('./app/app_startXCS.js')(app);
    } else {
        return Promise.resolve();
    }
}
