'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    issue = require('../classes/issueClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded,
    requireClientCertificate = auth.requireClientCertificate,
    enforceBotCreatorRole = auth.enforceBotCreatorRole,
    enforceBotViewerRole = auth.enforceBotViewerRole;

var router = express.Router();

router.route('/integrations/:id/issues')
    .all(prepareRequest)
    .get(enforceBotViewerRole, issue.issuesForIntegration)
    .post(requireClientCertificate, setTTLInDocumentIfNeeded, issue.create);

router.post('/integrations/:id/bulk_issues', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, issue.bulkCreateIssues);

router.post('/integrations/:id/issues/:issueID/silence', prepareRequest, enforceBotCreatorRole, issue.silence);
router.post('/integrations/:id/issues/:issueID/unsilence', prepareRequest, enforceBotCreatorRole, issue.unsilence);

router.route('/integrations/:id/issues/:issueID/associations')
    .all(prepareRequest, enforceBotViewerRole)
    .post(issue.addAssociation)
    .delete(issue.removeAssociation);

module.exports = router;
