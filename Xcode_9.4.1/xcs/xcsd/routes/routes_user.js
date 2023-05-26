'use strict';

var express = require('express'),
    user = require('../classes/userClass.js');

var prepareRequest = require('./routes_utils.js').prepareRequest;

var router = express.Router();
router.all('/users/*', prepareRequest);

router.get('/users/:name/canCreateRepositories', user.canCreateRepositories);
router.get('/users/:name/canViewBots', user.canViewBots);
router.get('/users/:name/canCreateBots', user.canCreateBots);
router.get('/users/canAnyoneCreateRepositories', user.canAnyoneCreateRepositories);
router.get('/users/canAnyoneViewBots', user.canAnyoneViewBots);
router.get('/users/canAnyoneCreateBots', user.canAnyoneCreateBots);

router.get('/users/:email/picture', user.userPicture);

module.exports = router;