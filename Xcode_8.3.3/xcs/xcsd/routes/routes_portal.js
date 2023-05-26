'use strict';

var express = require('express'),
    portal = require('../classes/portalClass.js');

var prepareRequest = require('./routes_utils.js').prepareRequest,
    enforceAdministratorRole = require('../classes/authClass.js').enforceAdministratorRole;

var router = express.Router();
router.post('/portal/requestSync', prepareRequest, enforceAdministratorRole, portal.sync);

module.exports = router;
