'use strict';

var uuid = require('node-uuid');

var logger = require('../logger.js');

var objc = require('./objc.js'),
    $ = objc.$;

objc.importSharedFramework('XCSCore');
objc.importSharedFramework('DVTSourceControl');

function withTemporaryDirectory(cb) {
    var sshKeyURL = $.NSURL('fileURLWithPath', $.NSTemporaryDirectory()('stringByAppendingPathComponent', $.NSUUID('UUID')('UUIDString')));
    logger.debug('Temporarily storing SSH keys in', sshKeyURL);
    cb(sshKeyURL, function(done) {
        $.NSFileManager('defaultManager')('removeItemAtURL', sshKeyURL, 'error', null);

        var args = Array.prototype.slice.call(arguments, 1);
        done.apply(this, args);
    });
}

var defaultBlueprintOptions = {
    authenticationStrategy: true,
    locations: true,
    branchAndTagLocations: true,
    repositoryStates: true,
    anonymousURLs: false,
    authenticationCredentials: false,
    revisions: false,
    favorites: false
};

var blueprintOptionsConstants = {
    authenticationStrategy: $.DVTSourceControlWorkspaceBlueprintIncludeAuthenticationStrategy,
    locations: $.DVTSourceControlWorkspaceBlueprintIncludeLocations,
    branchAndTagLocations: $.DVTSourceControlWorkspaceBlueprintIncludeBranchAndTagLocations,
    repositoryStates: $.DVTSourceControlWorkspaceBlueprintIndicateRepositoryStates,
    anonymousURLs: $.DVTSourceControlWorkspaceBlueprintAnonymizeURLs,
    authenticationCredentials: $.DVTSourceControlWorkspaceBlueprintIncludeAuthenticationCredentials,
    revisions: $.DVTSourceControlWorkspaceBlueprintIncludeLocationRevisions,
    favorites: $.DVTSourceControlWorkspaceBlueprintIndicateFavoriteStatus
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

var callbacks = {};

function registerCallback(cb) {
    var id = uuid();
    logger.debug('Registering FFI callback', id);
    callbacks[id] = cb;
    return id;
}

function unregisterCallback(id) {
    logger.debug('Unregistering FFI callback', id);
    delete callbacks[id];
    logger.debug('There are now', Object.keys(callbacks).length, 'registered FFI callbacks.');
}

/*!
 * Validates the authentication information in the provided blueprint, and returns the results.
 * @param blueprint The blueprint, as a JavaScript object.
 * @param callback The optional callback to be fired after validation, which will take two parameters: an error parameter,
 * and a JavaScript object representing the error summary from xcsbridge.
 */
exports.preflight = function (blueprint, callback) {

    logger.debug('Preflighting source control blueprint.');

    // get the JSON version of the blueprint
    var blueprintDictionary = objc.convertToNSDictionary(blueprint);

    withTemporaryDirectory(function (sshKeyURL, done) {
        var blueprint = $.DVTSourceControlWorkspaceBlueprint('alloc')('initWithDictionary', blueprintDictionary, 'sshKeyDirectory', sshKeyURL);
        if (!blueprint) {
            return done(callback, {status: 400, message: 'Could not initialize blueprint from dictionary representation.'});
        }
        
        var cbID;
        var cb = $(function (self, errorsAndRepositories, generalError) {
            unregisterCallback(cbID);
            
            var errorCount = errorsAndRepositories ? errorsAndRepositories('count') : 0;
            logger.debug('Validated SCM authentication. General error?', generalError !== null, 'Error count:', errorCount);

            var result = $.XCSBlueprintOperationResult('alloc')('init');
            result('setGlobalError', generalError);

            objc.keyedForEach(errorsAndRepositories, function (error, repo) {
                result('addError', error, 'forRepositoryID', blueprint('serializedIdentifierForRepository', repo));
            });

            var jsonResult = objc.convertToJSONObject(result);
            if (!jsonResult) {
                return done(callback, {status: 500, message: 'Could not serialize preflight response to JSON.'});
            }

            done(callback, null, jsonResult);
        }, ['v', ['?', '@', '@']]);
        cbID = registerCallback(cb);

        blueprint('validateAuthenticationWithCompletionBlock', cb);
    });
};

exports.listBranches = function (blueprint, callback) {

    logger.debug('Listing remote branches for source control blueprint.');

    // get the JSON version of the blueprint
    var blueprintDictionary = objc.convertToNSDictionary(blueprint);

    withTemporaryDirectory(function (sshKeyURL, done) {
        var blueprint = $.DVTSourceControlWorkspaceBlueprint('alloc')('initWithDictionary', blueprintDictionary, 'sshKeyDirectory', sshKeyURL);
        if (!blueprint) {
            return done(callback, { status: 400, message: 'Could not initialize blueprint from dictionary representation.' });
        }

        var cbID;
        var cb = $(function (self, locations, repositoriesToErrors, generalError) {
            unregisterCallback(cbID);

            logger.debug('Listed remote branches.');

            var result = $.XCSListBranchesResult('alloc')('init');
            if (generalError) {
                logger.error('Error listing remote branches: ', generalError('localizedDescription')('UTF8String'));
                result('setGlobalError', generalError);
            }

            objc.keyedForEach(repositoriesToErrors, function (error, repo) {
                result('addError', error, 'forRepositoryID', blueprint('serializedIdentifierForRepository', repo));
            });

            objc.keyedForEach(locations, function (branches, repo) {
                objc.indexedForEach(branches, function (scmBranch) {
                    var errorsRef = $.alloc($.NSArray).ref();
                    var branch = $.XCSBranch('alloc')('initWithName', scmBranch('name'), 'isPrimary', scmBranch('isPrimaryBranch'), 'validationErrors', errorsRef);
                    if (branch) {
                        result('addBranch', branch, 'forRepositoryID', blueprint('serializedIdentifierForRepository', repo));
                    } else {
                        var errors = errorsRef.deref();
                        result('addError', errors('firstObject'), 'forRepositoryID', blueprint('serializedIdentifierForRepository', repo));
                    }
                });
            });

            var jsonResult = objc.convertToJSONObject(result);
            if (!jsonResult) {
                return done(callback, { status: 500, message: 'Could not serialize preflight response to JSON.' });
            }

            done(callback, null, jsonResult);
        }, ['v', ['?', '@', '@']]);

        cbID = registerCallback(cb);

        blueprint('validateAuthenticationAndListBranchesWithCompletionBlock', cb);
    });
};

exports.checkForUpdates = function (blueprint, callback) {

    logger.debug('Checking for remote updates for source control blueprint.');

    // get the JSON version of the blueprint
    var blueprintDictionary = objc.convertToNSDictionary(blueprint);

    withTemporaryDirectory(function (sshKeyURL, done) {
        var blueprint = $.DVTSourceControlWorkspaceBlueprint('alloc')('initWithDictionary', blueprintDictionary, 'sshKeyDirectory', sshKeyURL);
        if (!blueprint) {
            return done(callback, {status: 400, message: 'Could not initialize blueprint from dictionary representation.'});
        }
        
        var cbID;
        
        var cb = $(function (self, hasUpdates, generalError) {
            logger.debug('Checked for SCM updates. General error?', generalError !== null, 'has updates?', hasUpdates);
            unregisterCallback(cbID);

            var result = {};
            result.hasUpdates = hasUpdates;
            if (generalError) {
                result.globalError = objc.convertErrorToJSONObject(generalError);
            }

            done(callback, null, result);
        }, ['v', ['?', 'B', '@']]);
        
        cbID = registerCallback(cb);

        blueprint('checkForUpdatesWithCompletionBlock', cb);
    });
};

exports.merge = function (existing, merge, callback) {

    logger.debug('Merging two source control blueprints.');

    var existingBlueprintDict = objc.convertToNSDictionary(existing),
        mergeBlueprintDict = objc.convertToNSDictionary(merge);

    withTemporaryDirectory(function (sshKeyURL, done) {
        var existingBlueprint = $.DVTSourceControlWorkspaceBlueprint('alloc')('initWithDictionary', existingBlueprintDict, 'sshKeyDirectory', sshKeyURL);
        if (!existingBlueprint) {
            return done(callback, {status: 400, message: 'Could not initialize blueprint from dictionary representation.'});
        }

        var mergeBlueprint = $.DVTSourceControlWorkspaceBlueprint('alloc')('initWithDictionary', mergeBlueprintDict, 'sshKeyDirectory', sshKeyURL);
        if (!mergeBlueprint) {
            return done(callback, {status: 400, message: 'Could not initialize blueprint from dictionary representation.'});
        }

        existingBlueprint('mergeWithBlueprint', mergeBlueprint);

        var flags = blueprintOptionsToFlags({revisions: true, authenticationCredentials: true});
        logger.debug('Serializing merged blueprint with option flags:', flags);
        var mergedBlueprintDict = existingBlueprint('dictionaryRepresentationWithOptions', flags);

        var jsonDict = objc.convertToJSONObject(mergedBlueprintDict);
        if (!jsonDict) {
            return done(callback, {status: 500, message: 'Could not serialize blueprint to JSON.'});
        }

        done(callback, null, jsonDict);
    });
};

exports.getMissingCredentials = function (blueprint, credentials, callback) {

    logger.debug('Merging blueprint with missing credentials from existing blueprint.');

    var existingBlueprintDict = objc.convertToNSDictionary(blueprint),
        mergeBlueprintDict = objc.convertToNSDictionary(credentials);

    withTemporaryDirectory(function (sshKeyURL, done) {
        var existingBlueprint = $.DVTSourceControlWorkspaceBlueprint('alloc')('initWithDictionary', existingBlueprintDict, 'sshKeyDirectory', sshKeyURL);
        if (!existingBlueprint) {
            return done(callback, {status: 400, message: 'Could not initialize blueprint from dictionary representation.'});
        }

        var mergeBlueprint = $.DVTSourceControlWorkspaceBlueprint('alloc')('initWithDictionary', mergeBlueprintDict, 'sshKeyDirectory', sshKeyURL);
        if (!mergeBlueprint) {
            return done(callback, {status: 400, message: 'Could not initialize blueprint from dictionary representation.'});
        }

        existingBlueprint('getMissingCredentialsFromBlueprint', mergeBlueprint);

        var flags = blueprintOptionsToFlags({revisions: true, authenticationCredentials: true});
        logger.debug('Serializing merged blueprint with option flags:', flags);
        var mergedBlueprintDict = existingBlueprint('dictionaryRepresentationWithOptions', flags);

        var jsonDict = objc.convertToJSONObject(mergedBlueprintDict);
        if (!jsonDict) {
            return done(callback, {status: 500, message: 'Could not serialize blueprint to JSON.'});
        }

        done(callback, null, jsonDict);
    });
};

/*!
 * Strips the provided blueprint of its authentication information, and returns a new version.
 * @param blueprint The blueprint, as a JavaScript object.
 * @param callback The optional callback to be fired after validation, which will take two parameters: an error parameter,
 * and a JavaScript object representing the new version of the blueprint.
 */
exports.removeCredentialsFromBlueprint = function (blueprint, callback) {
    exports.transformBlueprint(blueprint, {anonymousURLs: true}, callback);
};

exports.transformBlueprint = function (blueprint, options, callback) {
    logger.debug('Transforming blueprint using options:', options);

    var blueprintDictionary = objc.convertToNSDictionary(blueprint);

    withTemporaryDirectory(function (sshKeyURL, done) {
        var blueprint = $.DVTSourceControlWorkspaceBlueprint('alloc')('initWithDictionary', blueprintDictionary, 'sshKeyDirectory', sshKeyURL);
        if (!blueprint) {
            return done(callback, {status: 400, message: 'Could not initialize blueprint from dictionary representation.'});
        }

        var flags = blueprintOptionsToFlags(options);
        logger.debug('Serializing transformed blueprint with option flags:', flags);
        var transformedBlueprintDict = blueprint('dictionaryRepresentationWithOptions', flags);

        var jsonDict = objc.convertToJSONObject(transformedBlueprintDict);
        if (!jsonDict) {
            return done(callback, {status: 500, message: 'Could not serialize blueprint to JSON.'});
        }

        done(callback, null, jsonDict);
    });
};
