'use strict';

var k = require('../../constants.js');
var te = require('../turboevents.js');
var logger = require('../logger.js');

/*!
 * Converts the given JavaScript object into an XML Property List, and returns the results via callback.
 * @param jsonData The object you want to serialize. This must be JSON-serializable.
 * @param callback The callback to be fired when the results are available, which will take two parameters: an error
 * parameter, and a Buffer representing the resulting Property List data.
 */
exports.createPropertyList = function (jsonObj, callback) {
    
    logger.debug('Converting JSON to XML property list.');
        
    te.inquire(k.XCSIsBuildService, k.XCSEmitNotificationCreatePropertyList, jsonObj, function(responseDict) {
        var error = responseDict[k.XCSEmitNotificationResponseKeyError];
        if (error) {
               callback({status: 500, message: 'Could not convert object to property list: ' + error});
           } else {
               var propertyListXML = responseDict[k.XCSEmitNotificationResponseKeyPropertyListXML];
               var buf = Buffer.from(propertyListXML);
               callback(null, buf);
           }
    });
};
