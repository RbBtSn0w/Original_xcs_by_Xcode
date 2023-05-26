'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    userClass = require('../classes/userClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass);

module.exports = function routes_user_init(app) {

    app.get(k.XCSAPIBasePath + '/users/:name/canCreateRepositories', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, userClass.canCreateRepositories.bind(userClass));
    app.get(k.XCSAPIBasePath + '/users/:name/canViewBots', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, userClass.canViewBots.bind(userClass));
    app.get(k.XCSAPIBasePath + '/users/:name/canCreateBots', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, userClass.canCreateBots.bind(userClass));
    app.get(k.XCSAPIBasePath + '/users/canAnyoneCreateRepositories', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, userClass.canAnyoneCreateRepositories.bind(userClass));
    app.get(k.XCSAPIBasePath + '/users/canAnyoneViewBots', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, userClass.canAnyoneViewBots.bind(userClass));
    app.get(k.XCSAPIBasePath + '/users/canAnyoneCreateBots', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, userClass.canAnyoneCreateBots.bind(userClass));

};