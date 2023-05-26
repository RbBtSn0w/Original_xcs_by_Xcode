'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    healthClass = require('../classes/healthClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass);

module.exports = function routes_health_init(app) {

    app.get(k.XCSAPIBasePath + '/health', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, healthClass.status.bind(healthClass));

};