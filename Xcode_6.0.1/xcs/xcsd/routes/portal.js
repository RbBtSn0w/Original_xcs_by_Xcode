'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    auth = require('./auth.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js'),
    te = require('../util/turboevents.js');

var portal = {};

/**
 * Sync
 */

portal.sync = function (req, res) {

    auth.verifyIfServiceIsEnabledAllowCertificate(req, null, function (err) {
        if (!err) {
            var functionTitle = '[Portal] ' + req.method + ' ' + req.url;
            konsole.log(functionTitle);

            if (req && req.snitch) {
                req.snitch.title = functionTitle;
                req.snitch.next(functionTitle);
            }

            portal.emitSyncMessage();
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

portal.emitSyncMessage = function () {
    konsole.log(null, '[Portal] Triggering sync');
    te.broadcast(k.XCSIsListenerForPortalSyncRequests, k.XCSEmitNotificationNotificationRequestPortalSync);
};

/* Module exports */
module.exports = portal;