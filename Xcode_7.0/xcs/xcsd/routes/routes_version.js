'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    versionClass = require('../classes/versionClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    requireClientCertificate = authClass.requireClientCertificate.bind(authClass),
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceAdministratorRole = authClass.enforceAdministratorRole.bind(authClass),
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded;

module.exports = function routes_version_init(app) {

    app.get(k.XCSAPIBasePath + '/versions', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, versionClass.findVersion.bind(versionClass));
    app.post(k.XCSAPIBasePath + '/versions', prepareRequest, requireClientCertificate, enforceAdministratorRole, setTTLInDocumentIfNeeded, versionClass.create.bind(versionClass));
    app.patch(k.XCSAPIBasePath + '/versions/:id', prepareRequest, requireClientCertificate, enforceAdministratorRole, versionClass.update.bind(versionClass));

};