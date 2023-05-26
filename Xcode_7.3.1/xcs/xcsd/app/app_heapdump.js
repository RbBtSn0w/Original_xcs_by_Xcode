'use strict';

var heapdump;

var logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js');

module.exports = function app_heapdump_init(app, cb) {

    try {

        heapdump = require('heapdump');
        logger.info('HeapDump is installed and activated. To force a snapshot, run \'sudo kill -USR2 ' + process.pid + '\'');

    } catch (e) {
        logger.debug('HeapDump is not installed. To use it, run \'npm install heapdump\'');
    }

    return xcsutil.safeCallback(cb);

};
