'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    integrationClass = require('../classes/integrationClass.js'),
    integrationSearchClass = require('../classes/integrationSearchClass.js'),
    integrationFilterClass = require('../classes/integrationFilterClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    requireClientCertificate = authClass.requireClientCertificate.bind(authClass),
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceBotCreatorRole = authClass.enforceBotCreatorRole.bind(authClass),
    enforceBotViewerRole = authClass.enforceBotViewerRole.bind(authClass),
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded;

module.exports = function routes_integration_init(app) {

    // *** DEPRECATED
    app.get(k.XCSAPIBasePath + '/bots/:id/integrations/count', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationSearchClass.findIntegrationCountForBot.bind(integrationSearchClass));
    app.post(k.XCSAPIBasePath + '/integrations/bulk_import_tests', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, integrationClass.bulk_import_tests.bind(integrationClass));
    app.get(k.XCSAPIBasePath + '/integrations/running', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationSearchClass.listRunning.bind(integrationSearchClass));
    app.get(k.XCSAPIBasePath + '/integrations/filter/tag/:tag/:bots?', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationFilterClass.filterIntegrationsForBotDispatcher.bind(integrationFilterClass));
    app.get(k.XCSAPIBasePath + '/integrations/filter/:filter/:bots?', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationFilterClass.filterIntegrationsForBotDispatcher.bind(integrationFilterClass));
    //app.get(k.XCSAPIBasePath + '/integrations', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationClass.list.bind(integrationClass));

    // *** PRIVATE ***
    app.get(k.XCSAPIBasePath + '/integrations/orphaned', prepareRequest, requireClientCertificate, integrationSearchClass.findOrphanedIntegrations.bind(integrationSearchClass));
    app.patch(k.XCSAPIBasePath + '/integrations/:id', prepareRequest, requireClientCertificate, integrationClass.update.bind(integrationClass));
    app.post(k.XCSAPIBasePath + '/integrations/bulk-import-tests', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, integrationClass.bulk_import_tests.bind(integrationClass));
    app.post(k.XCSAPIBasePath + '/integrations/:id/commits', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, integrationClass.saveCommitHistory.bind(integrationClass));
    app.post(k.XCSAPIBasePath + '/integrations/:id/request', prepareRequest, requireClientCertificate, integrationClass.requestIntegration.bind(integrationClass));
    app.post(k.XCSAPIBasePath + '/integrations/bulk-import-integrations', prepareRequest, requireClientCertificate, integrationClass.bulk_import_integrations.bind(integrationClass));

    // Bot Integrations
    app.post(k.XCSAPIBasePath + '/bots/:id/integrations', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, setTTLInDocumentIfNeeded, integrationClass.create.bind(integrationClass));
    app.get(k.XCSAPIBasePath + '/bots/:id/integrations/:filter?', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationSearchClass.findIntegrationsForBotDispatcher.bind(integrationSearchClass));

    // Integration List
    app.get(k.XCSAPIBasePath + '/integrations/:id', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationSearchClass.findIntegration.bind(integrationSearchClass));
    // [TODO] add support for tag, bots, filter
    app.get(k.XCSAPIBasePath + '/integrations?', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationSearchClass.findIntegrationsDispatcher.bind(integrationSearchClass));

    // Integration Tags
    app.post(k.XCSAPIBasePath + '/integrations/:id/tags', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationClass.addTags.bind(integrationClass));
    app.delete(k.XCSAPIBasePath + '/integrations/:id/tags', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationClass.removeTags.bind(integrationClass));





    app.get(k.XCSAPIBasePath + '/integrations/:id/test/:keyPath/:deviceIdentifier?', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationSearchClass.findTestsWithKeyPath.bind(integrationSearchClass));
    app.post(k.XCSAPIBasePath + '/integrations/:id/test/batch/:deviceIdentifier?', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationSearchClass.findTestsBatchWithKeyPaths.bind(integrationSearchClass));
    app.get(k.XCSAPIBasePath + '/integrations/:id/commits', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationSearchClass.findCommits.bind(integrationSearchClass));
    app.post(k.XCSAPIBasePath + '/integrations/:id/cancel', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationClass.cancel.bind(integrationClass));
    app.delete(k.XCSAPIBasePath + '/integrations/:id/:rev', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, integrationClass.remove.bind(integrationClass));
    app.get(k.XCSAPIBasePath + '/integrations/:id/tests_for_device/:did', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, integrationSearchClass.findTestsForDevice.bind(integrationSearchClass));

};