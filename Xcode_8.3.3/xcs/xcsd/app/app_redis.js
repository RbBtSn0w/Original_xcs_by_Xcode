'use strict';

var Promise = require('bluebird');
var cluster = require('cluster');

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    redisClass = require('../classes/redisClass.js');

module.exports = Promise.method(function app_redis_init() {
    if (cluster.isMaster || cluster.isDisabled) {
        logger.debug('Deleting existing dashboard key.');
        return redisClass.client().del('XCSDashboard key').then(() => {
            logger.debug('Deleting any existing graceful shutdown request.');
            return redisClass.client().del(k.XCSRedisGracefulShutdownRequested);
        });
    }
});