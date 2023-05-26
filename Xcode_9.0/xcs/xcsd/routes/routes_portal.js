'use strict';

var express = require('express'),
    upload = require('./upload.js'),
    findTeam = require('../classes/portal/find.js'),
    joinTeam = require('../classes/portal/join.js'),
    updateTeam = require('../classes/portal/update.js'),
    deleteTeam = require('../classes/portal/delete.js');

var prepareRequest = require('./routes_utils.js').prepareRequest,
    auth = require('../classes/authClass.js'),
    requireClientCertificate = auth.requireClientCertificate,
    enforceBotCreatorRole = auth.enforceBotCreatorRole;

var router = express.Router();

router.all('/teams*', prepareRequest);

router.route('/teams')
    .get(enforceBotCreatorRole, findTeam.list)
    .post(enforceBotCreatorRole, joinTeam.join);

router.route('/teams/:id')
    .get(enforceBotCreatorRole, findTeam.find)
    .patch(requireClientCertificate, updateTeam.update)
    .delete(enforceBotCreatorRole, deleteTeam.remove);

router.route('/teams/:id/identity')
    .get(requireClientCertificate, findTeam.downloadTeamIdentity)
    .post(upload.single('file'), enforceBotCreatorRole, joinTeam.upload);


router.all('/identities*', prepareRequest);

router.route('/identities')
    .get(enforceBotCreatorRole, findTeam.listIdentities)
    .post(upload.single('file'), enforceBotCreatorRole, joinTeam.addIdentity);

router.route('/identities/:id')
    .get(enforceBotCreatorRole, findTeam.findIdentity)
    .delete(enforceBotCreatorRole, deleteTeam.removeIdentity);

router.get('/identities/:id/download', requireClientCertificate, findTeam.downloadIdentity);


router.all('/profiles*', prepareRequest);

router.route('/profiles')
    .get(enforceBotCreatorRole, findTeam.listProfiles)
    .post(upload.single('file'), enforceBotCreatorRole, joinTeam.addProfile);

router.route('/profiles/:id')
    .get(enforceBotCreatorRole, findTeam.findProfile)
    .delete(enforceBotCreatorRole, deleteTeam.removeProfile);

router.get('/profiles/:id/download', requireClientCertificate, findTeam.downloadProfile);


module.exports = router;
