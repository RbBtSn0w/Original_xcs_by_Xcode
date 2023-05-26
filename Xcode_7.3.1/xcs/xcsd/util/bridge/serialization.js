'use strict';

var objc = require('./objc.js'),
    $ = objc.$;

/*!
 * Converts the given JavaScript object into an XML Property List, and returns the results via callback.
 * @param jsonData The object you want to serialize. This must be JSON-serializable.
 * @param callback The callback to be fired when the results are available, which will take two parameters: an error
 * parameter, and a Buffer representing the resulting Property List data.
 */
exports.createPropertyList = function (jsonObj, callback) {
	var objCObject = objc.convertToNSDictionary(jsonObj);
	if (!objCObject) {
		return callback({status: 400, message: 'Could not convert JSON object to Objective-C object.'});
	}

    objc.tryError($.NSPropertyListSerialization, 'dataWithPropertyList', objCObject, 'format', $.NSPropertyListXMLFormat_v1_0, 'options', 0, 'error', function (err, plistData) {
        if (err) {
			return callback({status: 500, message: 'Could not convert object to property list: ' + err('localizedDescription')('UTF8String')});
        }

		var dataLength = plistData('length'),
			buffer = plistData('bytes').reinterpret(dataLength);

		callback(null, buffer);
    });
};
