'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    issueClass = require('../classes/issueClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    requireClientCertificate = authClass.requireClientCertificate.bind(authClass),
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceBotCreatorRole = authClass.enforceBotCreatorRole.bind(authClass),
    enforceBotViewerRole = authClass.enforceBotViewerRole.bind(authClass),
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded;

module.exports = function routes_issue_init(app) {

    app.get(k.XCSAPIBasePath + '/integrations/:id/issues', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, issueClass.issuesForIntegration.bind(issueClass));
    app.post(k.XCSAPIBasePath + '/integrations/:id/issues', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, issueClass.create.bind(issueClass));
    app.post(k.XCSAPIBasePath + '/integrations/:id/bulk_issues', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, issueClass.bulkCreateIssues.bind(issueClass));
    app.post(k.XCSAPIBasePath + '/integrations/:id/issues/:issueID/silence', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, issueClass.silence.bind(issueClass));
    app.post(k.XCSAPIBasePath + '/integrations/:id/issues/:issueID/unsilence', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, issueClass.unsilence.bind(issueClass));
    app.post(k.XCSAPIBasePath + '/integrations/:id/issues/:issueID/associations', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, issueClass.addAssociation.bind(issueClass));
    app.delete(k.XCSAPIBasePath + '/integrations/:id/issues/:issueID/associations', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, issueClass.removeAssociation.bind(issueClass));

};