'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    botClass = require('../classes/botClass.js'),
    scmClass = require('../classes/scmClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    requireClientCertificate = authClass.requireClientCertificate.bind(authClass),
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceBotCreatorRole = authClass.enforceBotCreatorRole.bind(authClass);

module.exports = function routes_scm_init(app) {

    // this is a legacy URL for older clients
    app.post(k.XCSAPIBasePath + '/bots/preflight', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, botClass.preflight.bind(botClass));

    app.post(k.XCSAPIBasePath + '/scm/preflight', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, botClass.preflight.bind(botClass));
    app.post(k.XCSAPIBasePath + '/scm/branches', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, botClass.listBranches.bind(botClass));

    app.post(k.XCSAPIBasePath + '/bots/:id/reflight', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, botClass.reflight.bind(botClass));
    app.post(k.XCSAPIBasePath + '/bots/:id/branches', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, botClass.reflightBranches.bind(botClass));
    app.get(k.XCSAPIBasePath + '/bots/:id/blueprint', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, scmClass.findBotBlueprint.bind(scmClass));

    app.get(k.XCSAPIBasePath + '/integrations/:id/blueprint', prepareRequest, requireClientCertificate, scmClass.findIntegrationBlueprint.bind(scmClass));

};