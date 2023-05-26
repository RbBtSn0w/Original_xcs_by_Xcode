'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var cluster = require('cluster');

var konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('../classes/redisClass.js');

module.exports = function app_redis_init(cb) {

    konsole.log(null, '[XCSNode - Redis] Redis init');

    if (cluster.isMaster || cluster.isDisabled) {

        // Reset the Dashboard hash upon reboot
        redisClass.client().del('XCSDashboard key', function () {
            return xcsutil.safeCallback(cb);
        });

    } else {
        return xcsutil.safeCallback(cb);
    }
};