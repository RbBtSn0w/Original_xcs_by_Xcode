'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    toolchainClass = require('../classes/toolchainClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded,
    requireClientCertificate = auth.requireClientCertificate,
    enforceBotViewerRole = auth.enforceBotViewerRole;

var router = express.Router();

router.route('/toolchains')
    .all(prepareRequest)
    .get(enforceBotViewerRole, toolchainClass.list)
    .post(requireClientCertificate, setTTLInDocumentIfNeeded, toolchainClass.save);

router.delete('/toolchains/:id/:rev', enforceBotViewerRole, toolchainClass.remove);

module.exports = router;
