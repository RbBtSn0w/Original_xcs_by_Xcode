'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    db_core = require('./db_core.js'),
    auth = require('./auth.js'),
    bot = require('./bot.js'),
    integration = require('./integration.js'),
    integration_search = require('./integration_search.js'),
    file = require('./file.js'),
    integration_filter = require('./integration_filter.js'),
    user = require('./user.js'),
    notifications = require('./notifications.js'),
    device = require('./device.js'),
    acl = require('./acl.js'),
    commit = require('./commit.js'),
    util = require('util'),
    xcsutil = require('../util/xcsutil.js'),
    database = require('./database.js'),
    konsole = require('../util/konsole.js'),
    portal = require('./portal.js'),
    repositories = require('./repositories.js'),
    version = require('./version.js'),
    health = require('./health.js'),
    cluster = require('cluster'),
    redis = require('../classes/redisClass.js'),
    settings = require('./settings.js');

function setTTLInDocumentIfNeeded(req, res, next) {
    var body = req.body,
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader];

    if (unitTestUUID) {
        var docs = req.body.docs;
        if (docs) {
            docs.forEach(function (doc) {
                xcsutil.setTTLInDocumentIfNeeded(req, doc);
            });
        } else {
            xcsutil.setTTLInDocumentIfNeeded(req, body);
        }
    }

    return next();
}

function prepareRequestSkipVersionCheck(req, res, next) {

    konsole.debug(req, '[prepareRequestSkipVersionCheck] request header contents: ' + util.inspect(req.headers));

    redis.incrHotpath(req);

    // Check if the session has been loaded
    if (req && !req.session) {
        konsole.warn(req, '[Routes - prepareRequestSkipVersionCheck] session not loaded! Pinging Redis...');
        redis.client().ping(function (err) {
            if (err) {
                konsole.error(req, '[Routes - prepareRequestSkipVersionCheck] Redis is not available!');
                auth.make401Response(req, res, function (err) {
                    return res.end(err.message);
                });
            } else {
                konsole.log(req, '[Routes - prepareRequestSkipVersionCheck] Redis is available.');
                continuePreparation();
            }
        });
    } else {
        continuePreparation();
    }

    function continuePreparation() {
        // Set the request UUID
        var requestUUID = req && req.headers[k.XCSRequestUUID],
            unitTestUUID = req && req.headers[k.XCSUnitTestHeader];

        if (requestUUID) {
            req.requestUUID = requestUUID + ((cluster.isDisabled) ? '' : ':' + cluster.worker.id);
        }

        // Initialize the log level
        req.logLevel = 0;

        xcsutil.displayLogRouteHeader(req);

        if (k.XCSProfilerActive) {
            var Snitch = require('speedsnitch');
            if (Snitch) {
                // Setup Snitch for the request
                var snitch = new Snitch();
                req.snitch = snitch;
            }
        }

        if (unitTestUUID) {
            xcsutil.displayLogDivision(req, '[START] loadAndCacheACLDocumentWithUUID');

            // Load the ACL document, if available
            auth.loadAndCacheACLDocumentWithUUID(req, function (err) {
                konsole.debug(req, '[prepareRequestSkipVersionCheck] auth cache: ' + util.inspect(req.authCache));
                xcsutil.displayLogDivision(req, '[ END ] loadAndCacheACLDocumentWithUUID');
                return next(err);
            });
        } else {
            // Do not load anything since it's a regular request
            return next();
        }
    }

}

function prepareRequest(req, res, next) {

    // We'll leave it like this for now to minimize the impact of the software update.
    prepareRequestSkipVersionCheck(req, res, next);
}

module.exports = function (app) {

    // Miscelaneous ===============================================================
    app.del(k.XCSAPIBasePath + '/unittests', prepareRequest, db_core.removeUnitTestDocs);
    app.get(k.XCSAPIBasePath + '/unittests/cleanup', xcsutil.unitTestCleanup);
    app.get(k.XCSAPIBasePath + '/ping', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, xcsutil.ping);
    app.get(k.XCSAPIBasePath + '/hostname', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, xcsutil.hostname);

    // Health =====================================================================
    app.get(k.XCSAPIBasePath + '/health', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, health.status.bind(health));
    app.get(k.XCSAPIBasePath + '/is_compaction_active', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, database.isCompactionActive.bind(database));
    app.get(k.XCSAPIBasePath + '/fragmentation_index', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, database.fragmentationIndex.bind(database));
    app.post(k.XCSAPIBasePath + '/compact', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, database.compact.bind(database));

    // Authentication =============================================================
    app.post(k.XCSAPIBasePath + '/auth/login', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.login);
    app.post(k.XCSAPIBasePath + '/auth/force_login', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.force_login);
    app.post(k.XCSAPIBasePath + '/auth/logout', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.logout);
    app.get(k.XCSAPIBasePath + '/auth/islogged', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.isLogged);
    app.get(k.XCSAPIBasePath + '/auth/isBotCreator', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.isBotCreator);

    // Bots =======================================================================
    app.post(k.XCSAPIBasePath + '/bots/preflight', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotCreatorRole, bot.preflight);
    app.post(k.XCSAPIBasePath + '/bots/:id/reflight', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotCreatorRole, bot.reflight);
    app.post(k.XCSAPIBasePath + '/bots', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotCreatorRole, setTTLInDocumentIfNeeded, bot.create);
    app.get(k.XCSAPIBasePath + '/bots', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, bot.list);
    app.get(k.XCSAPIBasePath + '/bots/:id', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, bot.findBot);
    app.patch(k.XCSAPIBasePath + '/bots/:id', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotCreatorRole, bot.update);
    app.del(k.XCSAPIBasePath + '/bots/:id/:rev', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotCreatorRole, bot.remove);
    app.del(k.XCSAPIBasePath + '/bots', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotCreatorRole, bot.removeAll);
    app.get(k.XCSAPIBasePath + '/bots/:id/stats', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, bot.stats);

    // Users ======================================================================
    app.get(k.XCSAPIBasePath + '/users/:name/canCreateRepositories', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, user.canCreateRepositories);
    app.get(k.XCSAPIBasePath + '/users/:name/canViewBots', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, user.canViewBots);
    app.get(k.XCSAPIBasePath + '/users/:name/canCreateBots', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, user.canCreateBots);
    app.get(k.XCSAPIBasePath + '/users/canAnyoneCreateRepositories', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, user.canAnyoneCreateRepositories);
    app.get(k.XCSAPIBasePath + '/users/canAnyoneViewBots', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, user.canAnyoneViewBots);
    app.get(k.XCSAPIBasePath + '/users/canAnyoneCreateBots', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, user.canAnyoneCreateBots);

    // Integrations ===============================================================
    app.post(k.XCSAPIBasePath + '/bots/:id/integrations', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotCreatorRole, setTTLInDocumentIfNeeded, integration.create);
    app.get(k.XCSAPIBasePath + '/bots/:id/integrations/count', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration_search.findIntegrationCountForBot);
    app.get(k.XCSAPIBasePath + '/bots/:id/integrations/:filter?', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration_search.findIntegrationsForBotDispatcher);
    app.get(k.XCSAPIBasePath + '/integrations', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration_search.listByState);
    app.get(k.XCSAPIBasePath + '/integrations/orphaned', prepareRequest, auth.requireClientCertificate, integration_search.findOrphanedIntegrations);
    app.get(k.XCSAPIBasePath + '/integrations/running', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration_search.listRunning);
    app.get(k.XCSAPIBasePath + '/integrations/:id', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration_search.findIntegration);
    app.get(k.XCSAPIBasePath + '/integrations/secure/:id', prepareRequest, auth.requireClientCertificate, integration_search.findIntegration);
    app.patch(k.XCSAPIBasePath + '/integrations/:id', prepareRequest, auth.requireClientCertificate, integration.update);
    app.del(k.XCSAPIBasePath + '/integrations', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotCreatorRole, integration.removeAll);
    app.post(k.XCSAPIBasePath + '/integrations/bulk_import_tests', prepareRequest, auth.requireClientCertificate, setTTLInDocumentIfNeeded, integration.bulk_import_tests);
    app.get(k.XCSAPIBasePath + '/integrations/:id/test/:keyPath/:deviceIdentifier?', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration_search.findTestsWithKeyPath);
    app.post(k.XCSAPIBasePath + '/integrations/:id/commits', prepareRequest, auth.requireClientCertificate, setTTLInDocumentIfNeeded, integration.saveCommitHistory);
    app.get(k.XCSAPIBasePath + '/integrations/:id/commits', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration_search.findCommits);
    app.post(k.XCSAPIBasePath + '/integrations/:id/issues', prepareRequest, auth.requireClientCertificate, setTTLInDocumentIfNeeded, integration.saveIntegrationIssues);
    app.get(k.XCSAPIBasePath + '/integrations/:id/issues', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration_search.findIssues);
    app.post(k.XCSAPIBasePath + '/integrations/:id/cancel', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotCreatorRole, integration.cancel);
    app.post(k.XCSAPIBasePath + '/integrations/:id/request', prepareRequest, auth.requireClientCertificate, integration.requestIntegration);
    app.post(k.XCSAPIBasePath + '/integrations/:id/tags', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration.addTags);
    app.del(k.XCSAPIBasePath + '/integrations/:id/tags', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration.removeTags);
    app.del(k.XCSAPIBasePath + '/integrations/:id/:rev', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotCreatorRole, integration.remove);
    app.get(k.XCSAPIBasePath + '/integrations/:id/tests_for_device/:did', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration_search.findTestsForDevice);
    app.get(k.XCSAPIBasePath + '/integrations/filter/tag/:tag/:bots?', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration_filter.filterIntegrationsForBotDispatcher);
    app.get(k.XCSAPIBasePath + '/integrations/filter/:filter/:bots?', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, integration_filter.filterIntegrationsForBotDispatcher);

    // Notifications ==============================================================
    app.post(k.XCSAPIBasePath + '/integrations/:id/notifications', prepareRequest, auth.requireClientCertificate, notifications.sendNotifications);

    // Files ======================================================================
    app.post(k.XCSAPIBasePath + '/integrations/:id/upload', prepareRequest, auth.requireClientCertificate, file.upload);
    app.get(k.XCSAPIBasePath + '/integrations/:id/assets', prepareRequestSkipVersionCheck, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, file.downloadIntegrationArchive);
    app.get(k.XCSAPIBasePath + '/integrations/:id/install_product', prepareRequestSkipVersionCheck, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, file.install);
    app.get(k.XCSAPIBasePath + '/integrations/:id/:token/install_manifest.plist', prepareRequestSkipVersionCheck, auth.verifyIfServiceIsEnabledAllowCertificate, auth.consumeAuthenticationToken, auth.enforceBotViewerRole, file.installManifest);
    app.get(k.XCSAPIBasePath + '/assets/token/:token/*', prepareRequestSkipVersionCheck, auth.verifyIfServiceIsEnabledAllowCertificate, auth.consumeAuthenticationToken, auth.enforceBotViewerRole, file.download);
    app.get(k.XCSAPIBasePath + '/assets/*', prepareRequestSkipVersionCheck, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, file.download);
    app.get(k.XCSAPIBasePath + '/profiles/ota.mobileconfig', prepareRequestSkipVersionCheck, auth.verifyIfServiceIsEnabledAllowCertificate, file.otaProfile);

    // Devices ====================================================================
    app.post(k.XCSAPIBasePath + '/devices', prepareRequest, auth.requireClientCertificate, setTTLInDocumentIfNeeded, device.create);
    app.get(k.XCSAPIBasePath + '/devices', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, device.list);
    app.get(k.XCSAPIBasePath + '/devices/server', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, device.server);
    app.get(k.XCSAPIBasePath + '/devices/:id', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, device.find);
    app.patch(k.XCSAPIBasePath + '/devices/:id', prepareRequest, auth.requireClientCertificate, device.update);
    app.del(k.XCSAPIBasePath + '/devices/:id/:rev', prepareRequest, auth.requireClientCertificate, device.remove);
    app.del(k.XCSAPIBasePath + '/devices', prepareRequest, auth.requireClientCertificate, device.removeAll);

    // ACL ========================================================================
    app.get(k.XCSAPIBasePath + '/acls', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceAdministratorRole, acl.findACL);
    app.get(k.XCSAPIBasePath + '/acls/list', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceAdministratorRole, acl.list);
    app.get(k.XCSAPIBasePath + '/acls/expanded', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceAdministratorRole, acl.findAndExpandACL);
    app.patch(k.XCSAPIBasePath + '/acls/:id', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceAdministratorRole, acl.update);

    // Version ====================================================================
    app.post(k.XCSAPIBasePath + '/versions', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceAdministratorRole, setTTLInDocumentIfNeeded, version.create);
    app.get(k.XCSAPIBasePath + '/versions', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, version.findVersion);
    app.get(k.XCSAPIBasePath + '/versions/list', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, version.list);
    app.patch(k.XCSAPIBasePath + '/versions/:id', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceAdministratorRole, version.update);
    app.del(k.XCSAPIBasePath + '/versions/:id/:rev', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceAdministratorRole, version.remove);
    app.del(k.XCSAPIBasePath + '/versions', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceAdministratorRole, version.removeAll);

    // Settings ===================================================================
    app.get(k.XCSAPIBasePath + '/settings', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceAdministratorRole, settings.findSettings);
    app.get(k.XCSAPIBasePath + '/settings/list', prepareRequest, auth.requireClientCertificate, settings.list);
    app.patch(k.XCSAPIBasePath + '/settings/:id', prepareRequest, auth.requireClientCertificate, settings.update);
    app.del(k.XCSAPIBasePath + '/settings/:id/:rev', prepareRequest, auth.requireClientCertificate, settings.remove);
    app.del(k.XCSAPIBasePath + '/settings', prepareRequest, auth.requireClientCertificate, settings.removeAll);

    // Commit =====================================================================
    app.del(k.XCSAPIBasePath + '/commits', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceAdministratorRole, commit.removeAll);

    // Portal =====================================================================
    app.post(k.XCSAPIBasePath + '/portal/requestSync', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceAdministratorRole, portal.sync);

    // Repositories ===============================================================
    app.get(k.XCSAPIBasePath + '/repositories', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceBotViewerRole, repositories.list);
    app.post(k.XCSAPIBasePath + '/repositories', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, auth.enforceHostedRepositoryCreatorRole, repositories.create);

    // Redis
    app.get(k.XCSAPIBasePath + '/hotpaths', prepareRequest, auth.verifyIfServiceIsEnabledAllowCertificate, redis.hotpaths);

};