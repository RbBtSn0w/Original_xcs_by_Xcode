'use strict';

const express = require('express');
const agent = require('../classes/agentClass.js');
const auth = require('../classes/authClass.js');

const prepareRequest = require('./routes_utils.js').prepareRequest;
const enforceBotViewerRole = auth.enforceBotViewerRole;

const router = express.Router();

router.all('/builders', prepareRequest);

router.get('/builders', enforceBotViewerRole, agent.list);

module.exports = router;
