'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var konsole = require('./util/konsole.js');

module.exports = function (process) {

    process.on('uncaughtException', function (err) {
        konsole.error(null, '[xcsnode] uncaughtException:', err.message);
        konsole.error(null, '[xcsnode] stack trace:', err.stack);
        process.exit(1);
    });

    process.on('timeout', function () {
        konsole.log(null, '[xcsnode] timeout');
    });

    process.on('error', function (err) {
        konsole.log(null, '[xcsnode] error: ' + err);
    });

    process.on('exit', function (err) {
        konsole.log(null, '[xcsnode] exit: ' + err);
    });

};