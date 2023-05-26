'use strict';

const express = require('express'),
      auth = require('../classes/authClass.js'),
      platform = require('../classes/platformClass.js'),
      routes_utils = require('./routes_utils.js');

const prepareRequest = routes_utils.prepareRequest,
      requireClientCertificate = auth.requireClientCertificate,
      enforceBotViewerRole = auth.enforceBotViewerRole;

let router = express.Router();

router.get('/platforms', prepareRequest, enforceBotViewerRole, platform.list);

router.route('/xcodes/:id/platforms')
    .all(prepareRequest)
    .get(enforceBotViewerRole, platform.listByXcode)
    .post(requireClientCertificate, platform.save);

module.exports = router;
