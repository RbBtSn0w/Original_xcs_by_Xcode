'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    platformClass = require('../classes/platformClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    requireClientCertificate = authClass.requireClientCertificate.bind(authClass),
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceBotViewerRole = authClass.enforceBotViewerRole.bind(authClass),
    setTTLInDocumentIfNeeded = routes_utils.setTTLInDocumentIfNeeded;

module.exports = function routes_platform_init(app) {

    app.post(k.XCSAPIBasePath + '/platforms', prepareRequest, requireClientCertificate, setTTLInDocumentIfNeeded, platformClass.save.bind(platformClass));
    app.get(k.XCSAPIBasePath + '/platforms', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotViewerRole, platformClass.list.bind(platformClass));

};