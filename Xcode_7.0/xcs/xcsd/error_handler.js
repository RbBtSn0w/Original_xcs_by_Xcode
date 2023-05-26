'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var util = require('util');

var konsole = require('./util/konsole.js');

module.exports = function error_handler_init() {

    process.on('uncaughtException', function EHUncaughtExceptionEvent(err) {
        konsole.error(null, '[xcsnode] uncaughtException:', util.inspect(err));
        konsole.error(null, '[xcsnode] stack trace:', err.stack);
        process.exit(1);
    });

    process.on('timeout', function EHTimeoutEvent() {
        konsole.log(null, '[xcsnode] timeout');
    });

    process.on('error', function EHErrorEvent(err) {
        konsole.error(null, '[xcsnode] error: ' + JSON.stringify(err));
    });

    process.on('exit', function EHExitEvent(err) {
        konsole.log(null, '[xcsnode] exit: ' + JSON.stringify(err));
    });

};