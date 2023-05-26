'use strict';

var te = require('./turboevents.js'),
    k = require('../constants.js'),
    logger = require('./logger.js'),
    xcsutil = require('./xcsutil.js');

module.exports.hardwareInfo = function hardwareInfo(req, res) {
    const log = logger.withRequest(req);

    log.info('Getting hardware information');
               
    te.inquire(k.XCSIsBuildService, k.XCSEmitNotificationGetHardwareInfo, {}, function(responseData) {
        var computerName = responseData[k.XCSEmitNotificationResponseKeyComputerName];
        var hardwareUUID = responseData[k.XCSEmitNotificationResponseKeyHardwareUUID];
                              
           if (computerName && hardwareUUID) {
               xcsutil.standardizedResponse(res, 200, {
                   computerName: computerName,
                   hardwareUUID: hardwareUUID
               });
           } else {
               xcsutil.standardizedResponse(res, 500, {});
           }
    });
};
