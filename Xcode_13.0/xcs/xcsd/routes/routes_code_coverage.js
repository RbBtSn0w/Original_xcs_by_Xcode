'use strict';

var express = require('express'),
    auth = require('../classes/authClass'),
    codeCoverage = require('../classes/codeCoverageClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded,
    requireClientCertificate = auth.requireClientCertificate,
    enforceBotViewerRole = auth.enforceBotViewerRole;

var router = express.Router();

router.get('/integrations/:id/coverage?', prepareRequest, enforceBotViewerRole, setTTLInDocumentIfNeeded, codeCoverage.integrationWithCoverageData);

// DEPRECATED
router.get('/code_coverage/integration/:id', prepareRequest, enforceBotViewerRole, setTTLInDocumentIfNeeded, codeCoverage.findIntegration);

// *** PRIVATE ***
router.post('/code_coverage/bulk_import', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, codeCoverage.bulk_import);
router.post('/code_coverage/integration/:id/bulk_import', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, codeCoverage.bulk_import);
router.post('/code_coverage/integration/keypath', prepareRequest, enforceBotViewerRole, setTTLInDocumentIfNeeded, codeCoverage.findFileByKeyPath);
router.post('/code_coverage/integration/:id/cache', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, codeCoverage.cacheCodeCoverageIntegration);

// PRIVATE
router.post('/code_coverage/bulk_import', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, codeCoverage.bulk_import);
router.post('/code_coverage/integration/keypath', prepareRequest, enforceBotViewerRole, setTTLInDocumentIfNeeded, codeCoverage.findFileByKeyPath);

module.exports = router;
