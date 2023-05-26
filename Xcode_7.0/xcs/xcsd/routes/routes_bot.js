'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    botClass = require('../classes/botClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceBotCreatorRole = authClass.enforceBotCreatorRole.bind(authClass),
    enforceBotViewerRole = authClass.enforceBotViewerRole.bind(authClass),
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded;

module.exports = function routes_bot_init(app) {

    // Bot
    app.get(k.XCSAPIBasePath + '/bots/:id', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, botClass.findBot.bind(botClass));
    app.patch(k.XCSAPIBasePath + '/bots/:id', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, botClass.update.bind(botClass));
    app.delete(k.XCSAPIBasePath + '/bots/:id/:rev?', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, botClass.remove.bind(botClass));

    // Bot List
    app.post(k.XCSAPIBasePath + '/bots', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, setTTLInDocumentIfNeeded, botClass.create.bind(botClass));
    app.get(k.XCSAPIBasePath + '/bots', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, botClass.list.bind(botClass));

    // Bot Duplication
    app.post(k.XCSAPIBasePath + '/bots/:id/duplicate', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, botClass.duplicate.bind(botClass));

    // Bot Stats
    app.get(k.XCSAPIBasePath + '/bots/:id/stats', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, botClass.stats.bind(botClass));

};