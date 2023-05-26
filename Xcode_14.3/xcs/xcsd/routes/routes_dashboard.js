'use strict';

var express = require('express'),
    xcsutil = require('../util/xcsutil.js'),
    prepareRequestSkipVersionCheck = require('./routes_utils.js').prepareRequestSkipVersionCheck;

var router = express.Router();

router.get('/dashboard*', prepareRequestSkipVersionCheck, xcsutil.dashboard);

module.exports = router;
