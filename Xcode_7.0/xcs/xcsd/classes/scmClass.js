'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var async = require('async');

var k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    security = require('../util/xcssecurity.js'),
    xcsbridge = require('../util/xcsbridge.js'),
    integrationSearch = require('../classes/integrationSearchClass.js');

function XCSSCMClass() {}

XCSSCMClass.prototype.findIntegrationBlueprint = function findIntegrationBlueprint(req, res) {

    xcsutil.logLevelInc(req);
    konsole.log(req, '[SCM - findIntegrationBlueprint]');

    var self = this,
        integrationID = req.params.id;

    async.waterfall([
        function SCMFindIntegrationBlueprintFindIntegration(cb) {
            integrationSearch.findIntegrationWithUUID(req, integrationID, false, cb);
        },
        function SCMFindIntegrationBlueprintCheckPrivileges(integration, cb) {
            var clientIdentity = req.connection.getPeerCertificate();

            if (clientIdentity && clientIdentity.fingerprint && integration.buildServiceFingerprint === clientIdentity.fingerprint) {
                return cb(null, integration); // pass the integration on through
            }

            // Some debugging info to figure out why we would enter this state...
            konsole.log('[SCM - findIntegrationBlueprint] clientIdentity: ' + clientIdentity);
            konsole.log('[SCM - findIntegrationBlueprint] clientIdentity.fingerprint: ' + (clientIdentity ? clientIdentity.fingerprint : 'undefined'));
            konsole.log('[SCM - findIntegrationBlueprint] integration.buildServiceFingerprint: ' + integration.buildServiceFingerprint);

            cb({
                status: 403,
                message: 'Forbidden: not authorized to view this information'
            });
        },
        function SCMFindIntegrationBlueprintFind(integration, cb) {
            self.findBlueprint(req, integration.bot._id, integrationID, {
                include_auth: true
            }, cb);
        }
    ], function (err, blueprint) {
        xcsutil.logLevelDec(req);
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.standardizedResponse(res, 200, blueprint);
        }
    });

};

XCSSCMClass.prototype.findBotBlueprint = function findBotBlueprint(req, res) {

    xcsutil.logLevelInc(req);
    konsole.log(req, '[SCM - findBotBlueprint]');

    var self = this,
        botID = req.params.id;

    async.waterfall([
        function SCMFindIntegrationBlueprintFind(cb) {
            self.findBlueprint(req, botID, null, null, cb);
        }
    ], function (err, blueprint) {
        xcsutil.logLevelDec(req);
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.standardizedResponse(res, 200, blueprint);
        }
    });
};

XCSSCMClass.prototype.findBlueprint = function findBlueprint(req, botID, /* optional */ integrationID, options, cb) {

    xcsutil.logLevelInc(req);
    konsole.log(req, '[SCM - findBlueprint] bot: ' + botID + ', integration: ' + integrationID);

    async.waterfall([
        function SCMFindBlueprintLoad(cb) {
            scmLoadBlueprint(req, botID, integrationID, cb);
        },
        function SCMFindBlueprintSanitize(blueprint, cb) {
            scmSanitizeBlueprint(req, blueprint, options, cb);
        }
    ], function (err, blueprint) {
        xcsutil.logLevelDec(req);
        cb(err, blueprint);
    });
};

function scmLoadBlueprint(req, botID, /* optional */ integrationID, cb) {
    var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
    var keychainItemName = integrationID || k.XCSKeychainTemplate;

    keychain.findItem(req, keychainItemName, botID, function SCMLoadBlueprintFindItem(err, blueprintBuf) {
        if (err) {
            cb(err);
        } else {
            cb(null, JSON.parse(blueprintBuf.toString('utf8')));
        }
    });
}

/*
 * valid options keys:
 *   include_auth
 */
function scmSanitizeBlueprint(req, blueprint, options, cb) {
    var opts = [];

    options = options || {};
    if (options.include_auth) {
        opts = ['--with-auth'];
    } else {
        opts = ['--no-auth-strategies'];
    }

    xcsbridge.sourceControl.transformBlueprint(blueprint, opts, cb);
}

module.exports = new XCSSCMClass();