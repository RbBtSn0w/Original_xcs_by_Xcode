'use strict';

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js');

module.exports = function app_profiler_init(cb) {

    if (k.XCSProfilerActive) {

        var Snitch;

        try {
            Snitch = require('speedsnitch');
        } catch (e) {
            logger.error('Profiling is enabled but speedsnitch is not installed. Run \'npm install speedsnitch\' to install it.');
            process.exit(1);
        }

        logger.info('The profiler is active.');
        return xcsutil.safeCallback(cb);

    } else {

        logger.debug('The profiler is disabled.');
        return xcsutil.safeCallback(cb);

    }

};
