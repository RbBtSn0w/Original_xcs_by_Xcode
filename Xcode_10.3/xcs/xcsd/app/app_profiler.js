'use strict';

var k = require('../constants.js'),
    logger = require('../util/logger.js');

module.exports = function app_profiler_init() {

    if (k.XCSProfilerActive) {
        var Snitch;
        try {
            Snitch = require('speedsnitch');
        } catch (e) {
            logger.error('Profiling is enabled but speedsnitch is not installed. Run \'npm install speedsnitch\' to install it.');
            process.exit(1);
        }

        logger.info('The profiler is active.');
    } else {
        logger.debug('The profiler is disabled.');
    }

};