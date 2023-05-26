'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    integration = require('../classes/integrationClass.js'),
    integrationSearch = require('../classes/integrationSearchClass.js'),
    integrationFilter = require('../classes/integrationFilterClass.js'),
    createIntegration = require('../classes/integration/create.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded,
    requireClientCertificate = auth.requireClientCertificate,
    enforceBotCreatorRole = auth.enforceBotCreatorRole,
    enforceBotViewerRole = auth.enforceBotViewerRole;

var router = express.Router();

// *** DEPRECATED
router.get('/bots/:id/integrations/count', prepareRequest, enforceBotViewerRole, integrationSearch.findIntegrationCountForBot);
router.post('/integrations/bulk_import_tests', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, integration.bulk_import_tests);
router.get('/integrations/running', prepareRequest, enforceBotViewerRole, integrationSearch.listRunning);
router.get('/integrations/filter/tag/:tag/:bots?', prepareRequest, enforceBotViewerRole, integrationFilter.filterIntegrationsForBotDispatcher);
router.get('/integrations/filter/:filter/:bots?', prepareRequest, enforceBotViewerRole, integrationFilter.filterIntegrationsForBotDispatcher);

// *** PRIVATE ***
router.get('/integrations/orphaned', prepareRequest, requireClientCertificate, integrationSearch.findOrphanedIntegrations);
router.patch('/integrations/:id', prepareRequest, requireClientCertificate, integration.update);
router.post('/integrations/bulk-import-tests', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, integration.bulk_import_tests);
router.post('/integrations/:id/commits', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, integration.saveCommitHistory);
router.post('/integrations/:id/request', prepareRequest, requireClientCertificate, integration.requestIntegration);
router.post('/integrations/bulk-import-integrations', prepareRequest, requireClientCertificate, integration.bulk_import_integrations);

// Bot Integrations
router.post('/bots/:id/integrations', prepareRequest, enforceBotViewerRole, setTTLInDocumentIfNeeded, createIntegration.create);
router.get('/bots/:id/integrations/:filter?', prepareRequest, enforceBotViewerRole, integrationSearch.findIntegrationsForBotDispatcher);

// Integration Tags
router.route('/integrations/:id/tags')
    .all(prepareRequest, enforceBotViewerRole)
    .post(integration.addTags)
    .delete(integration.removeTags);

// Integration List
router.get('/integrations/:id', prepareRequest, enforceBotViewerRole, integrationSearch.findIntegration);
// [TODO] add support for tag, bots, filter
router.get('/integrations?', prepareRequest, enforceBotViewerRole, integrationSearch.findIntegrationsDispatcher);

router.get('/integrations/:id/test/:keyPath/:deviceIdentifier?', prepareRequest, enforceBotViewerRole, integrationSearch.findTestsWithKeyPath);
router.post('/integrations/:id/test/batch/:deviceIdentifier?', prepareRequest, enforceBotViewerRole, integrationSearch.findTestsBatchWithKeyPaths);
router.get('/integrations/:id/commits', prepareRequest, enforceBotViewerRole, integrationSearch.findCommits);
router.post('/integrations/:id/cancel', prepareRequest, enforceBotViewerRole, integration.cancel);
router.delete('/integrations/:id', prepareRequest, enforceBotCreatorRole, integration.remove);
router.get('/integrations/:id/tests_for_device/:did', prepareRequest, enforceBotViewerRole, integrationSearch.findTestsForDevice);

router.delete('/integrations/:id/:rev', prepareRequest, enforceBotCreatorRole, integration.remove);

module.exports = router;