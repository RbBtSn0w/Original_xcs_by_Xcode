'use strict';

var xcsutil = require('../xcsutil.js'),
    logger = require('../logger.js');

var objc = require('./objc.js'),
    $ = objc.$;

objc.importSharedFramework('XCSCore');

/*!
 * Validates the JSON representation of an object of the specified class against XCSCore's validator.
 * @param className The name of the class represented by the JSON data (e.g., "XCSBot").
 * @param jsonData The object representation of the object to validate.
 * @param callback The callback to be fired after validation, which will take two parameters: an error parameter,
 * which will be a string description of any catastrohpic tool failures; an an array of validation error strings.
 * Both parameters will be null if validation succeeded.
 */
exports.validate = function (className, jsonData, callback) {
    logger.debug('Validating an instance of', className);

    var theClass = $[className];
    if (!theClass) {
        logger.debug('Available XCS classes:', Object.keys($).filter(function (name) {
            return name.indexOf('XCS') === 0;
        }));
        return xcsutil.safeCallback(callback, {
            status: 400,
            message: 'No class named ' + className + ' could be found.'
        });
    }

    logger.debug('Loaded class', theClass);

    var jsonDict = objc.convertToNSDictionary(jsonData);
    if (!jsonDict) {
        return xcsutil.safeCallback(callback, {
            status: 500,
            message: 'Could not deserialize JSON object.'
        });
    }

    if (!theClass('instancesRespondToSelector', 'initWithContents:service:validationErrors:')) {
        return xcsutil.safeCallback(callback, {
            status: 400,
            message: 'The class ' + className + ' does not support the standard validation API.'
        });
    }

    var validationErrorsRef = $.alloc($.NSArray).ref();
    if (!theClass('alloc')('initWithContents', jsonDict, 'service', null, 'validationErrors', validationErrorsRef)) {
        var errorsToReturn = [];
        var validationErrors = validationErrorsRef.deref();

        objc.indexedForEach(validationErrors, function (error) {
            errorsToReturn.push(error('localizedDescription')('UTF8String'));
        });

        return xcsutil.safeCallback(callback, null, errorsToReturn);
    }

    xcsutil.safeCallback(callback);
};

exports.pictureForUser = function (email, cb) {
    var picUtility = $.XCSUserPictureUtility('alloc')('init');
    picUtility('userPictureWithEmail', $(email), 'completionHandler', $(function (self, data, err) {
        if (err) {
            xcsutil.safeCallback(cb, {
                status: 500,
                message: err('localizedDescription')('UTF8String')
            });
        } else {
            if (data) {
                xcsutil.safeCallback(cb, null, data('bytes').reinterpret(data('length')));
            } else {
                xcsutil.safeCallback(cb);
            }
        }
    }, ['v', ['?', '@', '@']]));
};