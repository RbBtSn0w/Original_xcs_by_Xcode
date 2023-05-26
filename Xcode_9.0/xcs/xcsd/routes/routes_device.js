'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    device = require('../classes/deviceClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded,
    requireClientCertificate = auth.requireClientCertificate,
    enforceBotViewerRole = auth.enforceBotViewerRole;

var router = express.Router();
router.all('/devices*', prepareRequest);

router.route('/devices')
    .get(enforceBotViewerRole, device.list)
    .post(requireClientCertificate, setTTLInDocumentIfNeeded, device.create);

router.get('/devices/server', enforceBotViewerRole, device.server);

router.route('/devices/:id')
    .get(enforceBotViewerRole, device.find)
    .patch(requireClientCertificate, device.update);

router.delete('/devices/:id/:rev', requireClientCertificate, device.remove);

module.exports = router;
