'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var heapdump;

var konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

module.exports = function app_heapdump_init(app, cb) {

    konsole.log(null, '*************** HeapDump init: pid ' + process.pid);

    try {

        heapdump = require('heapdump');

        konsole.info(null, '[XCSNode - Initialization] The module \'heapdump\' is installed and activated (pid ' + process.pid + ')');
        konsole.info(null, '[XCSNode - Initialization] You can force a snapshot by sending the node.js process a SIGUSR2 signal:');
        konsole.info(null, '[XCSNode - Initialization]     $ sudo kill -USR2 ' + process.pid);

    } catch (e) {

        konsole.info(null, '[XCSNode - Initialization] The module \'heapdump\' is not installed.');
        konsole.info(null, '[XCSNode - Initialization] To install \'heapdump\' via Terminal: npm install heapdump');
    }

    return xcsutil.safeCallback(cb);

};

/***************************************************************************************************

    Private Section

***************************************************************************************************/