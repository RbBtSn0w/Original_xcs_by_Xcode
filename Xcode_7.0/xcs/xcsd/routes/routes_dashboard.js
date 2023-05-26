'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    xcsutil = require('../util/xcsutil.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequestSkipVersionCheck = routes_utils.prepareRequestSkipVersionCheck;

module.exports = function routes_dashboard_init(app) {

    app.get(k.XCSAPIBasePath + '/dashboard*', prepareRequestSkipVersionCheck, xcsutil.dashboard);

};