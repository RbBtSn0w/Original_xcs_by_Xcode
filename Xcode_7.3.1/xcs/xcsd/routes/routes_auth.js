'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    prepareRequest = require('./routes_utils.js').prepareRequest;

var router = express.Router();
router.all('/auth/*', prepareRequest);

router.post('/auth/login', auth.login);
router.post('/auth/force_login', auth.force_login);
router.post('/auth/logout', auth.logout);
router.get('/auth/islogged', auth.isLogged);
router.get('/auth/isBotCreator', auth.isBotCreator);

module.exports = router;
