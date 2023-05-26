'use strict';

var Promise = require('bluebird');
var cluster = require('cluster');

var logger = require('../util/logger.js'),
    te = require('../util/turboevents.js'),
    redis = require('../classes/redisClass.js');

var subscriberClient;

module.exports = function () {
    return new Promise((resolve) => {
        require('../classes/backgroundQueue.js').connect(() => {
            if (cluster.isMaster || cluster.isDisabled) {
                subscriberClient = redis.createClient();
                subscriberClient.subscribe('socketMessages');

                subscriberClient.on('message', (channel, message) => {
                    logger.debug('Got published socket message from worker:', message);

                    try {
                        var args = JSON.parse(message);
                        te.broadcast.apply(te, args);
                    } catch (e) {
                        logger.error('Could not parse JSON for socket message:', e);
                    }
                });
            }

            resolve();
        });
    });
};