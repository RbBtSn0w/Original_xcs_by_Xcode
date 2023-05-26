'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    repositoryClass = require('../classes/repositoryClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceBotViewerRole = authClass.enforceBotViewerRole.bind(authClass),
    enforceHostedRepositoryCreatorRole = authClass.enforceHostedRepositoryCreatorRole.bind(authClass);

module.exports = function routes_repository_init(app) {

    app.get(k.XCSAPIBasePath + '/repositories', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, repositoryClass.list.bind(repositoryClass));
    app.post(k.XCSAPIBasePath + '/repositories', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceHostedRepositoryCreatorRole, repositoryClass.create.bind(repositoryClass));

};