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
    return Promise.resolve()
        .then(require('./app/app_redis.js'))
        .then(require('./app/app_background_queue.js'))
        .then(() => require('./app/app_global_config.js')(app))
        .then(cleanUpDelegation)
        .then(require('./app/app_heapdump.js'))
        .then(require('./app/app_profiler.js'))
        .then(require('./error_handler.js'))
        .then(() => require('./app/app_secure_server_setup.js')(app))
        .then(() => require('./app/app_init_phase.js')(app))
        .then(require('./app/app_worker_management.js'))
        .then(() => require('./app/app_cycle_workers.js')(app))
        .then(() => require('./app/app_dashboard.js')(app))
        .then(startXCS)
        .catch(err => {
            logger.error('Could not start xcsd:', err);
            process.exit(1);
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
