'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    dbCoreClass = require('../classes/dbCoreClass.js'),
    authClass = require('../classes/authClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass);

module.exports = function routes_misc_init(app) {

    app.delete(k.XCSAPIBasePath + '/unittests', prepareRequest, dbCoreClass.removeUnitTestDocs.bind(dbCoreClass));
    app.get(k.XCSAPIBasePath + '/ping', verifyIfServiceIsEnabledAllowCertificate, xcsutil.ping);
    app.get(k.XCSAPIBasePath + '/hostname', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, xcsutil.hostname);
    app.get(k.XCSAPIBasePath + '/maintenance-tasks', xcsutil.maintenanceTasks);

};