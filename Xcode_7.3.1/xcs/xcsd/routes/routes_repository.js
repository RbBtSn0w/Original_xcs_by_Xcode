'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    repository = require('../classes/repositoryClass.js');

var prepareRequest = require('./routes_utils.js').prepareRequest,
    enforceBotViewerRole = auth.enforceBotViewerRole,
    enforceHostedRepositoryCreatorRole = auth.enforceHostedRepositoryCreatorRole;

var router = express.Router();

router.route('/repositories')
    .all(prepareRequest)
    .get(enforceBotViewerRole, repository.list)
    .post(enforceHostedRepositoryCreatorRole, repository.create);

module.exports = router;
