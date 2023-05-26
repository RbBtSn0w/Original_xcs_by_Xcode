'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    bot = require('../classes/botClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded,
    enforceBotCreatorRole = auth.enforceBotCreatorRole,
    enforceBotViewerRole = auth.enforceBotViewerRole;

var router = express.Router();

router.route('/bots/:id')
    .get(prepareRequest, enforceBotViewerRole, bot.findBot)
    .patch(prepareRequest, enforceBotCreatorRole, bot.update);

router.delete('/bots/:id/:rev?', prepareRequest, enforceBotCreatorRole, bot.remove);

router.route('/bots')
    .get(prepareRequest, enforceBotViewerRole, bot.list)
    .post(prepareRequest, enforceBotCreatorRole, setTTLInDocumentIfNeeded, bot.create);

router.post('/bots/:id/duplicate', prepareRequest, enforceBotCreatorRole, bot.duplicate);
router.get('/bots/:id/stats', prepareRequest, enforceBotViewerRole, bot.stats);

module.exports = router;
