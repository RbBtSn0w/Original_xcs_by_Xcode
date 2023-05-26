'use strict';

var express = require('express'),
    notification = require('../classes/notificationClass.js');

var prepareRequest = require('./routes_utils.js').prepareRequest,
    requireClientCertificate = require('../classes/authClass.js').requireClientCertificate;

var router = express.Router();
router.post('/integrations/:id/notifications', prepareRequest, requireClientCertificate, notification.sendNotifications);

module.exports = router;
