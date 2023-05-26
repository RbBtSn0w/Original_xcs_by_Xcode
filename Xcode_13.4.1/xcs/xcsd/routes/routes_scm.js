'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    bot = require('../classes/botClass.js'),
    scm = require('../classes/scmClass.js');

var prepareRequest = require('./routes_utils.js').prepareRequest,
    requireClientCertificate = auth.requireClientCertificate,
    enforceBotCreatorRole = auth.enforceBotCreatorRole;

var router = express.Router();

// this is a legacy URL for older clients
router.post('/bots/preflight', prepareRequest, enforceBotCreatorRole, bot.preflight);

router.all('/scm/*', prepareRequest, enforceBotCreatorRole);
router.post('/scm/preflight', bot.preflight);
router.post('/scm/branches', bot.listBranches);

router.post('/bots/:id/reflight', prepareRequest, enforceBotCreatorRole, bot.reflight);
router.post('/bots/:id/branches', prepareRequest, enforceBotCreatorRole, bot.reflightBranches);
router.post('/bots/checkBotsForUpdates', prepareRequest, enforceBotCreatorRole, bot.checkBotsForUpdates);
router.get('/bots/:id/blueprint', prepareRequest, enforceBotCreatorRole, scm.findBotBlueprint);

router.get('/integrations/:id/blueprint', prepareRequest, requireClientCertificate, scm.findIntegrationBlueprint);

module.exports = router;
