'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    version = require('../classes/versionClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    requireClientCertificate = auth.requireClientCertificate;

var router = express.Router();
router.all('/versions*', prepareRequest);

router.get('/versions', version.findVersion);
router.patch('/versions/:id', requireClientCertificate, version.update);

module.exports = router;
