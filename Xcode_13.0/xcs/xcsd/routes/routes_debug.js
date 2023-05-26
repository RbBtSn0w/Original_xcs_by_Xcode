'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    acl = require('../classes/aclClass.js'),
    bot = require('../classes/botClass.js'),
    database = require('../classes/databaseClass.js'),
    redis = require('../classes/redisClass.js'),
    xcsutil = require('../util/xcsutil.js');

var prepareRequest = require('./routes_utils.js').prepareRequest,
    requireClientCertificate = auth.requireClientCertificate,
    enforceAdministratorRole = auth.enforceAdministratorRole,
    enforceBotCreatorRole = auth.enforceBotCreatorRole;

var router = express.Router();

router.get('/debug/acls/list', prepareRequest, enforceAdministratorRole, acl.listACLs);
router.delete('/debug/bots', prepareRequest, enforceBotCreatorRole, bot.removeAll);
router.get('/debug/design', prepareRequest, enforceAdministratorRole, database.allDesignDocuments);
router.get('/debug/hotpaths/:filepath?', prepareRequest, redis.hotpaths);
router.post('/debug/redis/flush', prepareRequest, requireClientCertificate, redis.flush);

module.exports = router;
