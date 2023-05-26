'use strict';

var express = require('express'),
    health = require('../classes/healthClass.js');

var prepareRequest = require('./routes_utils.js').prepareRequest;

var router = express.Router();
router.get('/health', prepareRequest, health.status);

module.exports = router;