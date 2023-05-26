'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    platformClass = require('../classes/platformClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded,
    requireClientCertificate = auth.requireClientCertificate,
    enforceBotViewerRole = auth.enforceBotViewerRole;

var router = express.Router();

router.route('/platforms')
    .all(prepareRequest)
    .get(enforceBotViewerRole, platformClass.list)
    .post(requireClientCertificate, setTTLInDocumentIfNeeded, platformClass.save);

module.exports = router;
