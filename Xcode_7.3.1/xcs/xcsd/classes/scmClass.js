'use strict';

var async = require('async'),
	config = require('config');

var logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js'),
    security = require('../util/xcssecurity.js'),
    xcsbridge = require('../util/xcsbridge.js'),
    botClass = require('../classes/botClass.js'),
    integrationSearch = require('../classes/integrationSearchClass.js');

var repositoryKeychain = security.openKeychain(config.get('keychain.repositories'));

function XCSSCMClass() {}

XCSSCMClass.prototype.findIntegrationBlueprint = function findIntegrationBlueprint(req, res) {

    var log = logger.withRequest(req),
        self = this,
        integrationID = req.params.id;

    log.info('Fetching SCM blueprint for integration', integrationID);

    async.waterfall([
        function SCMFindIntegrationBlueprintFindIntegration(cb) {
            integrationSearch.findIntegrationWithUUID(req, integrationID, false, cb);
        },
        function SCMFindIntegrationBlueprintCheckPrivileges(integration, cb) {
            var clientIdentity = req.connection.getPeerCertificate();

            if (clientIdentity && clientIdentity.fingerprint && integration.buildServiceFingerprint === clientIdentity.fingerprint) {
                log.debug('Client fingerprint matches fingerprint assigned to integration. Proceeding.');
                return cb(null, integration); // pass the integration on through
            }

            // Some debugging info to figure out why we would enter this state...
            log.warn('Client fingerprint does not match fingerprint assigned to integration.');
            log.debug('Client identity:', clientIdentity);
            log.debug('Client fingerprint', (clientIdentity ? clientIdentity.fingerprint : undefined), '!== integration fingerprint', integration.buildServiceFingerprint);

            cb({
                status: 403,
                message: 'Forbidden: not authorized to view this information'
            });
        },
        function SCMFindIntegrationBlueprintFind(integration, cb) {
            self.findBlueprint(req, integration.bot._id, integrationID, {authenticationCredentials: true}, cb);
        }
    ], function (err, blueprint) {

        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.standardizedResponse(res, 200, blueprint);
        }
    });

};

XCSSCMClass.prototype.findBotBlueprint = function findBotBlueprint(req, res) {



    var self = this,
        botID = req.params.id;

    async.waterfall([
        function SCMFindIntegrationBlueprintFind(cb) {
            self.findBlueprint(req, botID, null, {authenticationStrategy: false}, cb);
        }
    ], function (err, blueprint) {

        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.standardizedResponse(res, 200, blueprint);
        }
    });
};

XCSSCMClass.prototype.findBlueprint = function findBlueprint(req, botID, /* optional */ integrationID, options, cb) {


    var log = logger.withRequest(req);

    log.info('Loading blueprint for bot', botID, 'and integration', integrationID);
    log.debug('Blueprint serialization options:', options);

    async.waterfall([
        function SCMFindBlueprintLoad(cb) {
            scmLoadBlueprint(req, botID, integrationID, cb);
        },
        function SCMFindBlueprintSanitize(blueprint, cb) {
            xcsbridge.sourceControl.transformBlueprint(blueprint, options, cb);
        }
    ], function (err, blueprint) {

        cb(err, blueprint);
    });
};

function scmLoadBlueprint(req, botID, /* optional */ integrationID, cb) {
    var log = logger.withRequest(req);

    function returnBlueprint(err, blueprintBuf) {
        if (err) {
            cb(err);
        } else {
            cb(null, JSON.parse(blueprintBuf.toString('utf8')));
        }
    }

    if (integrationID) {
        log.debug('Loading integration-specific blueprint.');
        repositoryKeychain.findItem(req, integrationID, botID, returnBlueprint);
    } else {
        log.debug('Looking up bot to determine which keychain item holds the blueprint.');
        botClass.findBotWithUUID(req, botID, function (err, bot) {
            if (err) {
                cb(err);
            } else {
                botClass.findBlueprintForBot(req, bot, returnBlueprint);
            }
        });
    }
}

module.exports = xcsutil.bindAll(new XCSSCMClass());
