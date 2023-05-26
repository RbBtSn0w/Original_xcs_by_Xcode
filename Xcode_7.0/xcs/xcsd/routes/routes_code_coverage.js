'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass'),
    codeCoverageClass = require('../classes/codeCoverageClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    requireClientCertificate = authClass.requireClientCertificate.bind(authClass),
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceBotViewerRole = authClass.enforceBotViewerRole.bind(authClass),
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded;

module.exports = function routes_code_coverage_init(app) {

    // *** DEPRECATED
    app.get(k.XCSAPIBasePath + '/code_coverage/integration/:id', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, setTTLInDocumentIfNeeded, codeCoverageClass.findIntegration.bind(codeCoverageClass));

    // *** PRIVATE ***
    app.post(k.XCSAPIBasePath + '/code_coverage/bulk_import', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, codeCoverageClass.bulk_import.bind(codeCoverageClass));
    app.post(k.XCSAPIBasePath + '/code_coverage/integration/keypath', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, setTTLInDocumentIfNeeded, codeCoverageClass.findFileByKeyPath.bind(codeCoverageClass));

    // Code Coverage
    app.get(k.XCSAPIBasePath + '/integrations/:id/coverage?', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, setTTLInDocumentIfNeeded, codeCoverageClass.integrationWithCoverageData.bind(codeCoverageClass));
};