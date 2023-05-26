'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass);

module.exports = function routes_auth_init(app) {

    app.post(k.XCSAPIBasePath + '/auth/login', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, authClass.login.bind(authClass));
    app.post(k.XCSAPIBasePath + '/auth/force_login', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, authClass.force_login.bind(authClass));
    app.post(k.XCSAPIBasePath + '/auth/logout', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, authClass.logout.bind(authClass));
    app.get(k.XCSAPIBasePath + '/auth/islogged', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, authClass.isLogged.bind(authClass));
    app.get(k.XCSAPIBasePath + '/auth/isBotCreator', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, authClass.isBotCreator.bind(authClass));

};