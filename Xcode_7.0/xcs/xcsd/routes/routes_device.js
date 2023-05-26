'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    deviceClass = require('../classes/deviceClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    requireClientCertificate = authClass.requireClientCertificate.bind(authClass),
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceBotViewerRole = authClass.enforceBotViewerRole.bind(authClass),
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded;

module.exports = function routes_device_init(app) {

    app.post(k.XCSAPIBasePath + '/devices', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, deviceClass.create.bind(deviceClass));
    app.get(k.XCSAPIBasePath + '/devices', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, deviceClass.list.bind(deviceClass));
    app.get(k.XCSAPIBasePath + '/devices/server', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, deviceClass.server.bind(deviceClass));
    app.get(k.XCSAPIBasePath + '/devices/:id', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, deviceClass.find.bind(deviceClass));
    app.patch(k.XCSAPIBasePath + '/devices/:id', prepareRequest, requireClientCertificate, deviceClass.update.bind(deviceClass));
    app.delete(k.XCSAPIBasePath + '/devices/:id/:rev', prepareRequest, requireClientCertificate, deviceClass.remove.bind(deviceClass));

};