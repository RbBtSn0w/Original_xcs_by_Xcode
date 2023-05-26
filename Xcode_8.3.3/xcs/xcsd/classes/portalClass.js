'use strict';

var k = require('../constants.js'),
    xcsutil = require('../util/xcsutil.js'),
    logger = require('../util/logger.js'),
    te = require('../util/turboevents.js');

/* XCSPortalClass object */

function XCSPortalClass() {}

XCSPortalClass.prototype.sync = function sync(req, res) {
    this.emitSyncMessage();
    return xcsutil.standardizedResponse(res, 204);
};

XCSPortalClass.prototype.emitSyncMessage = function emitSyncMessage() {
    logger.debug('Requesting xcscontrol to sync ADC portal data.');
    try {
        te.broadcast(k.XCSIsListenerForPortalSyncRequests, k.XCSEmitNotificationNotificationRequestPortalSync);
    } catch (e) {
        logger.error('Error while syncing ADC portal data:', e);
    }
};

module.exports = xcsutil.bindAll(new XCSPortalClass());