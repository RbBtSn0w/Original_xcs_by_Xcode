'use strict';

const cluster = require('../classes/worker/clusterProvider.js');
const workers = require('../classes/worker.js');
const Promise = require('bluebird');

module.exports = function manageWorkers() {
    if (cluster.isMaster && !cluster.isDisabled) {
        return workers.initializeMaster();
    } else {
        return Promise.resolve();
    }
};