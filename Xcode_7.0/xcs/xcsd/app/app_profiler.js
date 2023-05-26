'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

module.exports = function app_profiler_init(cb) {

    if (k.XCSProfilerActive) {

        var Snitch;

        try {
            Snitch = require('speedsnitch');
        } catch (e) {
            konsole.error(null, '[XCSNode - Profiler] Profiling is enabled but the required module \'speedsnitch\' is not installed.');
            konsole.error(null, '[XCSNode - Profiler] To install speedsnitch via Terminal: npm install speedsnitch');
            process.exit(1);
        }

        konsole.log(null, '[XCSNode - Profiler] The profiler is active.');

        return xcsutil.safeCallback(cb);

    } else {

        konsole.log(null, '[XCSNode - Profiler] The profiler is inactive.');

        return xcsutil.safeCallback(cb);

    }

};