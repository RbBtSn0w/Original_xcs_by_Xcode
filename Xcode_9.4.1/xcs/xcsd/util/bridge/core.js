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

    var jsonDict = objc.convertToNSObject(jsonData);
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

/**
 * Looks up the full name of a user using OpenDirectory.
 *
 * @param {string} username The short name of the user to lookup.
 * @param {function} cb Callback returning an error or the full name of the username (possibly null).
 */
exports.fullNameForUsername = function (username, cb) {
    const picUtility = $.XCSUserPictureUtility('alloc')('init');
    picUtility('fullNameForUsername', $(username), 'completionHandler', $((self, fullName, err) => {
        if (err) {
            xcsutil.safeCallback(cb, {
                status: 500,
                message: err('localizedDescription')('UTF8String')
            });
        } else {
            if (fullName) {
                xcsutil.safeCallback(cb, null, fullName('UTF8String'));
            } else {
                xcsutil.safeCallback(cb);
            }
        }
    }, ['v', ['?', '@', '@']]));
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

/**
 * Builds an array of user-friendly descriptions of the configuration changes.
 *
 * Calls to XCSCore to do this so that the logic can be reused between email reports and Xcode's
 * integration reports.
 *
 * @param {Object} changes  The changes to describe.
 * @return {string[]} A list of lines of descriptions.
 */
exports.changesDescriptions = function (changes) {
    let jsonObject = objc.convertToNSObject(changes);
    let changesObj = $.XCSIntegrationChanges('alloc')('initWithContents', jsonObject, 'service', null, 'validationErrors', null);
    if (!changesObj) {
        logger.error('Could not create integration changes object, failed validation.');
        return null;
    }

    return objc.convertToJSONObject(changesObj('descriptions'));
};
