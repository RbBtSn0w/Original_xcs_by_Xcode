'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    aclClass = require('../classes/aclClass.js'),
    botClass = require('../classes/botClass.js'),
    databaseClass = require('../classes/databaseClass.js'),
    redisClass = require('../classes/redisClass.js'),
    routes_utils = require('./routes_utils.js'),
    xcsutil = require('../util/xcsutil.js');

var prepareRequest = routes_utils.prepareRequest,
    requireClientCertificate = authClass.requireClientCertificate.bind(authClass),
    verifyIfServiceIsEnabledAllowCertificate = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceAdministratorRole = authClass.enforceAdministratorRole.bind(authClass),
    enforceBotCreatorRole = authClass.enforceBotCreatorRole.bind(authClass);

module.exports = function routes_debug_init(app) {

    app.get(k.XCSAPIBasePath + '/debug/acls/list', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceAdministratorRole, aclClass.listACLs.bind(aclClass));
    app.delete(k.XCSAPIBasePath + '/debug/bots', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceBotCreatorRole, botClass.removeAll.bind(botClass));
    app.get(k.XCSAPIBasePath + '/debug/design', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, enforceAdministratorRole, databaseClass.allDesignDocuments.bind(databaseClass));
    app.get(k.XCSAPIBasePath + '/debug/hotpaths/:filepath?', prepareRequest, verifyIfServiceIsEnabledAllowCertificate, redisClass.hotpaths.bind(redisClass));
    app.post(k.XCSAPIBasePath + '/debug/redis/flush', prepareRequest, requireClientCertificate, redisClass.flush.bind(redisClass));

    app.post(k.XCSAPIBasePath + '/debug/maintenance-tasks/fake-tasks', xcsutil.generateFakeMaintenanceTasks.bind(xcsutil));
    app.post(k.XCSAPIBasePath + '/debug/init-phase/enable', xcsutil.enableManualInitPhase);
    app.post(k.XCSAPIBasePath + '/debug/init-phase/disable', xcsutil.disableManualInitPhase);

};