'use strict';

var cluster = require('cluster');

var logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('../classes/redisClass.js');

module.exports = function app_redis_init(cb) {

    if (cluster.isMaster || cluster.isDisabled) {

        logger.debug('Deleting existing dashboard key.');

        // Reset the Dashboard hash upon reboot
        redisClass.client().del('XCSDashboard key', function () {
            return xcsutil.safeCallback(cb);
        });

    } else {
        return xcsutil.safeCallback(cb);
    }
};
