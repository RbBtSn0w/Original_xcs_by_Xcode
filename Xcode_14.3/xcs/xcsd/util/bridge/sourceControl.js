'use strict';

var k = require('../../constants.js');
var te = require('../turboevents.js');

var logger = require('../logger.js');

var defaultBlueprintOptions = {
    authenticationStrategy: true,
    locations: true,
    branchAndTagLocations: true,
    repositoryStates: true,
    anonymousURLs: false,
    authenticationCredentials: false,
    revisions: false,
    favorites: false,
    domainCredentials: false,
    additionalValidationRepositories: true
};

var blueprintOptionsConstants = {
    authenticationStrategy: 1 << 2,
    locations: 1 << 4,
    branchAndTagLocations: 1 << 6,
    repositoryStates: 1 << 7,
    anonymousURLs: 1 << 1,
    authenticationCredentials: 1 << 3,
    revisions: 1 << 5,
    favorites: 1 << 8,
    domainCredentials: 1 << 12,
    additionalValidationRepositories: 1 << 13
};

function blueprintOptionsToFlags(options) {
    var flags = 0,
        realOptions = require('underscore').extend({}, defaultBlueprintOptions, options || {});

    Object.keys(realOptions).forEach(function (key) {
        if (realOptions[key]) {
            flags |= blueprintOptionsConstants[key];
        }
    });

    return flags;
}

/*!
 * Validates the authentication information in the provided blueprint, and returns the results.
 * @param blueprint The blueprint, as a JavaScript object.
 * @param callback The optional callback to be fired after validation, which will take two parameters: an error parameter,
 * and a JavaScript object representing the error summary from xcsbridge.
 */
exports.preflight = function (blueprint, callback) {

    logger.debug('Preflighting source control blueprint.');
    
    var payload = {};
    payload[k.XCSEmitNotificationMessageKeyBlueprintDictionary] = blueprint;
    
    te.inquire(k.XCSIsBuildService, k.XCSEmitNotificationPreflight, payload, function(responseData) {
         callback(null, responseData);
    });
};

exports.listBranches = function (blueprint, skipRepositoryIdentifiers, callback) {

    logger.debug('`Listing remote branches for source control blueprint.`');
    
    var payload = {};
    payload[k.XCSEmitNotificationMessageKeyBlueprintDictionary] = blueprint;
    payload[k.XCSEmitNotificationMessageKeySkipRepositoryIdentifiers] = skipRepositoryIdentifiers;
    
    te.inquire(k.XCSIsBuildService, k.XCSEmitNotificationListBranches, payload, function(responseData) {
         callback(null, responseData);
    });
};

exports.checkForUpdates = function (blueprint, callback) {

    logger.debug('Checking for remote updates for source control blueprint.');
    
    var payload = {};
    payload[k.XCSEmitNotificationMessageKeyBlueprintDictionary] = blueprint;
    
    te.inquire(k.XCSIsBuildService, k.XCSEmitNotificationCheckForUpdates, payload, function(responseData) {
         callback(null, responseData);
    });
};

exports.merge = function (existing, merge, callback) {

    logger.debug('Merging two source control blueprints.');
    
    var payload = {};
    payload[k.XCSEmitNotificationMessageKeyBlueprintDictionary] = existing;
    payload[k.XCSEmitNotificationMessageKeyBlueprintDictionaryToMergeWith] = merge;
    payload[k.XCSEmitNotificationMessageKeyBlueprintFlags] = blueprintOptionsToFlags({
        revisions: true,
        authenticationCredentials: true,
        domainCredentials: true
    });
     
     te.inquire(k.XCSIsBuildService, k.XCSEmitNotificationMergeBlueprints, payload, function(responseData) {
          callback(null, responseData);
     });
};

exports.getMissingCredentials = function (blueprint, credentials, callback) {

    logger.debug('Merging blueprint with missing credentials from existing blueprint.');
    
    var payload = {};
    payload[k.XCSEmitNotificationMessageKeyBlueprintDictionary] = blueprint;
    payload[k.XCSEmitNotificationMessageKeyBlueprintCredentials] = credentials;
    payload[k.XCSEmitNotificationMessageKeyBlueprintFlags] = blueprintOptionsToFlags({
        revisions: true,
        authenticationCredentials: true,
        domainCredentials: true
    });
     
     te.inquire(k.XCSIsBuildService, k.XCSEmitNotificationGetMissingCredentials, payload, function(responseData) {
          callback(null, responseData);
     });
};

/*!
 * Strips the provided blueprint of its authentication information, and returns a new version.
 * @param blueprint The blueprint, as a JavaScript object.
 * @param callback The optional callback to be fired after validation, which will take two parameters: an error parameter,
 * and a JavaScript object representing the new version of the blueprint.
 */
exports.removeCredentialsFromBlueprint = function (blueprint, callback) {
    exports.transformBlueprint(blueprint, {
        anonymousURLs: true
    })
    .then(transformedBlueprint => callback(null, transformedBlueprint))
    .catch(error => callback(error, null));
};

exports.transformBlueprint = async function (blueprint, options) {
    logger.debug('Transforming blueprint using options:', options);
    
    var payload = {};
    payload[k.XCSEmitNotificationMessageKeyBlueprintDictionary] = blueprint;
    payload[k.XCSEmitNotificationMessageKeyBlueprintFlags] = blueprintOptionsToFlags(options);
    
    return new Promise(function(resolve, reject) {
       te.inquire(k.XCSIsBuildService, k.XCSEmitNotificationTransformBlueprint, payload, function(responseData) {
            resolve(responseData);
       });
   });
};
