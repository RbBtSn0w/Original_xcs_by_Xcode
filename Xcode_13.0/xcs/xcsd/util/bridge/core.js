'use strict';

var xcsutil = require('../xcsutil.js'),
    logger = require('../logger.js'),
    k = require('../../constants.js'),
    te = require('../turboevents.js'),
    cp = require('child_process');

var XCSVALIDATOR_PATH = process.env.XCSVALIDATOR_PATH || '/Library/Developer/XcodeServer/CurrentXcodeSymlink/Contents/Developer/usr/bin/xcsvalidator';

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
    
    try {
        var args = ['validate-json', className];
        
        var validateJSONInvocation = cp.spawn(XCSVALIDATOR_PATH, args, {
            stdio: 'pipe'
        });

        var pid = validateJSONInvocation.pid;

        logger.debug('Invoking xcsvalidator', args, '-', '(PID ' + pid + ')');

        var stdinData = Buffer.from(JSON.stringify(jsonData));

        validateJSONInvocation.stdin.write(stdinData);
        validateJSONInvocation.stdin.end();

        // capture the output
        var stderrStr = '';

        validateJSONInvocation.stderr.setEncoding('utf8');
        validateJSONInvocation.stderr.on('data', function (str) {
            stderrStr += str;
        });

        validateJSONInvocation.on('close', function (exitCode) {
            if (exitCode === 0) {
                logger.debug('Successfully invoked xcsvalidator (PID:', pid + ')');
                xcsutil.safeCallback(callback);
            } else {
                var errors = JSON.parse(stderrStr)['errors'];
                logger.error('Failed invoking xcsvalidator (PID:', pid + ')', errors);
                xcsutil.safeCallback(callback, null, errors);
            }
        });

        validateJSONInvocation.on('error', function (err) {
            xcsutil.safeCallback(callback, null, [err]);
        });
    } catch (e) {
        xcsutil.safeCallback(callback, null, [`Exception invoking xcsvalidator tool: ${e.toString()}`]);
    }
};

/**
 * Looks up the full name of a user using OpenDirectory.
 *
 * @param {string} username The short name of the user to lookup.
 * @param {function} cb Callback returning an error or the full name of the username (possibly null).
 */
exports.fullNameForUsername = function (username, callback) {
    logger.debug('Getting full name for username', username);
    
    var payload = {};
    payload[k.XCSEmitNotificationMessageKeyUsername] = username;
    
    te.inquire(k.XCSIsBuildService, k.XCSEmitNotificationFullNameForUsername, payload, function(responseData) {
               var fullName = responseData[k.XCSEmitNotificationResponseKeyFullName];
               
               if (fullName) {
                    // Success
                    logger.debug('Got full name for username ' + username + ':' + fullName);
                    xcsutil.safeCallback(callback, null, fullName);
               } else {
                    var error = responseData[k.XCSEmitNotificationResponseKeyError];
               
                    if (error) {
                        logger.debug('Error encountered getting full name for username:', error);
               
                        xcsutil.safeCallback(callback, {
                            status: 500,
                            message: error
                        });
                    } else {
                        xcsutil.safeCallback(callback, {
                            status: 500,
                            message: "Unknown error"
                        });
                    }
               }
    });
};

exports.pictureForUser = function (email, cb) {
//    var picUtility = $.XCSUserPictureUtility('alloc')('init');
//    picUtility('userPictureWithEmail', $(email), 'completionHandler', $(function (self, data, err) {
//        if (err) {
//            xcsutil.safeCallback(cb, {
//                status: 500,
//                message: err('localizedDescription')('UTF8String')
//            });
//        } else {
//            if (data) {
//                xcsutil.safeCallback(cb, null, data('bytes').reinterpret(data('length')));
//            } else {
//                xcsutil.safeCallback(cb);
//            }
//        }
//    }, ['v', ['?', '@', '@']]));
    
    xcsutil.safeCallback(cb);
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
    // evaughan TODO: This method is a sync method, but if we move the code here to an Objective-C process,
    // the IPC to that process will be inherently async. We can't easily make this method async because
    // it is called from handlebars, which is a templating engine that requires the callouts to be sync.
    
//    let jsonObject = objc.convertToNSObject(changes);
//    let changesObj = $.XCSIntegrationChanges('alloc')('initWithContents', jsonObject, 'service', null, 'validationErrors', null);
//    if (!changesObj) {
//        logger.error('Could not create integration changes object, failed validation.');
//        return null;
//    }
//
//    return objc.convertToJSONObject(changesObj('descriptions'));
    
    return [];
};
