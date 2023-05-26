'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    integrationSearch = require('../classes/integrationSearchClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    enforceBotViewerRole = auth.enforceBotViewerRole;

var router = express.Router();

// Integration Build Queue
router.get('/queues/integrations', prepareRequest, enforceBotViewerRole, integrationSearch.integrationBuildQueue);

module.exports = router;