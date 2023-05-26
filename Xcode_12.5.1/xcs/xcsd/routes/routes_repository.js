'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    repository = require('../classes/repositoryClass.js');

var prepareRequest = require('./routes_utils.js').prepareRequest,
    enforceRemovedHostedRepositorySupport = auth.enforceRemovedHostedRepositorySupport;

var router = express.Router();

router.route('/repositories')
    .all(prepareRequest)
    .get(enforceRemovedHostedRepositorySupport, repository.list)
    .post(enforceRemovedHostedRepositorySupport, repository.create);

module.exports = router;
