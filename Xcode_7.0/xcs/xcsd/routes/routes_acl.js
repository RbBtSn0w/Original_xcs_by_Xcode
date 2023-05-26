'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    aclClass = require('../classes/aclClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceAdministratorRole = authClass.enforceAdministratorRole.bind(authClass);

module.exports = function routes_acl_init(app) {

    app.get(k.XCSAPIBasePath + '/acls', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceAdministratorRole, aclClass.findACL.bind(aclClass));
    app.get(k.XCSAPIBasePath + '/acls/expanded', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceAdministratorRole, aclClass.findAndExpandACL.bind(aclClass));
    app.patch(k.XCSAPIBasePath + '/acls/:id', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceAdministratorRole, aclClass.updateACL.bind(aclClass));

};