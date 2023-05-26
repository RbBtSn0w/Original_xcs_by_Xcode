'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    settingsClass = require('../classes/settingsClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    requireClientCertificate = authClass.requireClientCertificate.bind(authClass),
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceAdministratorRole = authClass.enforceAdministratorRole.bind(authClass);

module.exports = function routes_settings_init(app) {

    app.get(k.XCSAPIBasePath + '/settings', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceAdministratorRole, settingsClass.findSettings.bind(settingsClass));
    app.get(k.XCSAPIBasePath + '/settings/list', prepareRequest, requireClientCertificate, settingsClass.list.bind(settingsClass));
    app.patch(k.XCSAPIBasePath + '/settings/:id', prepareRequest, requireClientCertificate, settingsClass.update.bind(settingsClass));
    app.delete(k.XCSAPIBasePath + '/settings/:id/:rev', prepareRequest, requireClientCertificate, settingsClass.remove.bind(settingsClass));
    app.delete(k.XCSAPIBasePath + '/settings', prepareRequest, requireClientCertificate, settingsClass.removeAll.bind(settingsClass));

    app.post(k.XCSAPIBasePath + '/settings/service/enable', requireClientCertificate, settingsClass.enableService.bind(settingsClass));
    app.post(k.XCSAPIBasePath + '/settings/service/disable', requireClientCertificate, settingsClass.disableService.bind(settingsClass));

};