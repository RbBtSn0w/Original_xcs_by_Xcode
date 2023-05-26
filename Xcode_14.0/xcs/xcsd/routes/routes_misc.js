'use strict';

var express = require('express'),
    dbCore = require('../classes/dbCoreClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    shutdown = require('../classes/shutdown.js'),
    hardware = require('../util/hardware.js');

var prepareRequest = require('./routes_utils.js').prepareRequest;
var requireClientCertificate = require('../classes/authClass.js').requireClientCertificate;
var enforceBotCreatorRole = require('../classes/authClass.js').enforceBotCreatorRole;

var router = express.Router();

router.delete('/unittests', prepareRequest, dbCore.removeUnitTestDocs);
router.get('/ping', xcsutil.ping);
router.get('/hostname', prepareRequest, xcsutil.hostname);
router.get('/maintenance-tasks', xcsutil.maintenanceTasks);
router.put('/shutdown', prepareRequest, requireClientCertificate, shutdown.graceful);
router.get('/hardware', prepareRequest, enforceBotCreatorRole, hardware.hardwareInfo);

module.exports = router;
