'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    notification = require('../classes/notificationClass.js');

var prepareRequest = require('./routes_utils.js').prepareRequest,
    enforceBotViewerRole = auth.enforceBotViewerRole;

var router = express.Router();
router.post('/report/bots/:id?', prepareRequest, enforceBotViewerRole, notification.sendBotReport);
router.post('/report/integrations/:id?', prepareRequest, enforceBotViewerRole, notification.sendIntegrationReport);

module.exports = router;