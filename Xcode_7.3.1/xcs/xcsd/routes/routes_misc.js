'use strict';

var express = require('express'),
    dbCore = require('../classes/dbCoreClass.js'),
    xcsutil = require('../util/xcsutil.js');

var prepareRequest = require('./routes_utils.js').prepareRequest;

var router = express.Router();

router.delete('/unittests', prepareRequest, dbCore.removeUnitTestDocs);
router.get('/ping', xcsutil.ping);
router.get('/hostname', prepareRequest, xcsutil.hostname);
router.get('/maintenance-tasks', xcsutil.maintenanceTasks);

module.exports = router;
