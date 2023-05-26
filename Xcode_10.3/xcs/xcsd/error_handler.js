'use strict';

var util = require('util');
var logger = require('./util/logger.js');

module.exports = function error_handler_init() {

    process.on('uncaughtException', function EHUncaughtExceptionEvent(err) {
        logger.error('An unhandled exception occurred:', util.inspect(err), '\n', err.stack);
        process.exit(1);
    });

    // I'm not sure this event ever happens. -mjm
    process.on('timeout', function EHTimeoutEvent() {
        logger.info('Process got timeout event.');
    });

    // Same for this one. -mjm
    process.on('error', function EHErrorEvent(err) {
        logger.error('Process produced an error:', err);
    });

    process.on('exit', function EHExitEvent(code) {
        logger.error('Process is exiting with code', code);
    });

};
