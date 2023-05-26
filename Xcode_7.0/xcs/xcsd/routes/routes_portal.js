'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    portalClass = require('../classes/portalClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceAdministratorRole = authClass.enforceAdministratorRole.bind(authClass);

module.exports = function routes_portal_init(app) {

    app.post(k.XCSAPIBasePath + '/portal/requestSync', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceAdministratorRole, portalClass.sync.bind(portalClass));

};