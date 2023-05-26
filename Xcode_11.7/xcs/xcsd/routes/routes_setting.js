'use strict';

var express = require('express'),
    auth = require('../classes/authClass.js'),
    settings = require('../classes/settingsClass.js');

var prepareRequest = require('./routes_utils.js').prepareRequest,
    requireClientCertificate = auth.requireClientCertificate,
    enforceAdministratorRole = auth.enforceAdministratorRole;

var router = express.Router();
router.all('/settings*', prepareRequest);

router.route('/settings')
    .get(enforceAdministratorRole, settings.findSettings)
    .delete(requireClientCertificate, settings.removeAll);

router.get('/settings/list', requireClientCertificate, settings.list);
router.patch('/settings/:id', requireClientCertificate, settings.update);
router.delete('/settings/:id/:rev', requireClientCertificate, settings.remove);
router.post('/settings/service/enable', requireClientCertificate, settings.enableService);
router.post('/settings/service/disable', requireClientCertificate, settings.disableService);

module.exports = router;
