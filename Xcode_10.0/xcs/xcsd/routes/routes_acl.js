'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    acl = require('../classes/aclClass.js'),
    prepareRequest = require('./routes_utils.js').prepareRequest;

var router = express.Router();
router.all('/acls*', prepareRequest, auth.enforceAdministratorRole); // all ACL endpoints require admin role

router.get('/acls', acl.findACL);
router.get('/acls/expanded', acl.findAndExpandACL);
router.patch('/acls/:id', acl.update);

module.exports = router;
