'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    databaseClass = require('../classes/databaseClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass);

module.exports = function routes_database_init(app) {

    app.get(k.XCSAPIBasePath + '/active_tasks', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, databaseClass.activeCouchDBTasks.bind(databaseClass));
    app.get(k.XCSAPIBasePath + '/is_compaction_active', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, databaseClass.isCompactionActive.bind(databaseClass));
    app.get(k.XCSAPIBasePath + '/fragmentation_index', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, databaseClass.fragmentationIndex.bind(databaseClass));
    app.post(k.XCSAPIBasePath + '/compact', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, databaseClass.compact.bind(databaseClass));
    app.post(k.XCSAPIBasePath + '/reindex', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, databaseClass.reindexDatabase.bind(databaseClass));
};