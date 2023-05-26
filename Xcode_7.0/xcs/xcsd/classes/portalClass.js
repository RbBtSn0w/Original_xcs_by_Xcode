/*
    XCSPortalClass
    A class dedicated to interact with CouchDB and Redis.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('./authClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js'),
    te = require('../util/turboevents.js');

/* XCSPortalClass object */

function XCSPortalClass() {}

XCSPortalClass.prototype.findDocumentWithUUID = function XCSDBCoreClassFindDocumentWithUUID(req, doc_UUID, doc_type, cb) {
    var self = this;
    self.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

XCSPortalClass.prototype.sync = function sync(req, res) {

    var self = this;

    authClass.verifyIfServiceIsEnabledAllowCertificate(req, null, function PORSync(err) {
        if (!err) {
            var functionTitle = '[Portal] ' + req.method + ' ' + req.url;
            konsole.log(req, functionTitle);

            if (req && req.snitch) {
                req.snitch.next(functionTitle);
            }

            self.emitSyncMessage();
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

XCSPortalClass.prototype.emitSyncMessage = function emitSyncMessage() {
    konsole.log(null, '[Portal] Triggering sync');
    te.broadcast(k.XCSIsListenerForPortalSyncRequests, k.XCSEmitNotificationNotificationRequestPortalSync);
};

/* Module exports */

module.exports = new XCSPortalClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/