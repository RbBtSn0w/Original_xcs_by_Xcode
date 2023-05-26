'use strict';

const express = require('express'),
      auth = require('../classes/authClass.js'),
      xcode = require('../classes/xcode.js'),
      routes_utils = require('./routes_utils.js');

const prepareRequest = routes_utils.prepareRequest,
      setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded,
      requireClientCertificate = auth.requireClientCertificate,
      enforceBotViewerRole = auth.enforceBotViewerRole;

let router = express.Router();
router.all('/xcodes*', prepareRequest);

router.route('/xcodes')
    .get(enforceBotViewerRole, xcode.list)
    .post(requireClientCertificate, setTTLInDocumentIfNeeded, xcode.create);

router.route('/xcodes/:id')
    .patch(requireClientCertificate, xcode.update)
    .delete(requireClientCertificate, xcode.remove);

module.exports = router;
