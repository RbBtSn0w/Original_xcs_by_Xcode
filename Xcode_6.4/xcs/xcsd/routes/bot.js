'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    async = require('async'),
    fs = require('fs'),
    path = require('path'),
    bridge = require('../util/xcsbridge.js'),
    security = require('../util/xcssecurity.js'),
    scheduler = require('../util/scheduler.js'),
    te = require('../util/turboevents.js'),
    db_core = require('./db_core.js'),
    bot_stats = require('./bot_stats.js'),
    integration_search = require('./integration_search.js'),
    auth = require('./auth.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    redis = require('../classes/redisClass.js'),
    delegation = require('../util/delegation.js');


var bot = {};

/**
 * Create
 */

bot.create = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - create] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var body = req.body,
        self = bot;

    if (!body) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }

    // Strip the authentication information out of the blueprint
    var authedBlueprint = body.configuration.sourceControlBlueprint;

    async.waterfall([

    function (callback) {
                bridge.sourceControl.removeCredentialsFromBlueprint(authedBlueprint, function (errMessage, cleanBlueprint) {
                    if (errMessage) {
                        callback({
                            status: 500,
                            message: errMessage
                        });
                    } else {
                        callback(null, cleanBlueprint);
                    }
                });
        },
            function (cleanBlueprint, callback) {
                // Swap in the clean blueprint
                body.configuration.sourceControlBlueprint = cleanBlueprint;

                // Add the sequential integration counter
                body.integration_counter = 1;

                db_core.createDocument(req, k.XCSDesignDocumentBot, body, function (err, url, newBot) {
                    if (err) {
                        callback(err);
                    } else {
                        redis.delDynamicQuery(req, k.XCSDesignDocumentBot);
                        callback(null, url, newBot);
                    }
                });
        },
            function (url, newBot, callback) {
                // Store the auth'd blueprint in the keychain
                var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
                keychain.addItem(req, k.XCSKeychainTemplate, JSON.stringify(authedBlueprint), newBot._id, null, function (errMessage) {
                    if (errMessage) {
                        callback({
                            status: 500,
                            message: errMessage
                        });
                    } else {
                        callback(null, url, newBot);
                    }
                });
        }
        ],
        function (err, url, newBot) {
            if (err) {
                konsole.error(req, '[Bot - create] Error: ' + err.status + ' - ' + err.message);
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                xcsutil.logLevelDec(req);

                // Reschedule
                self.schedulePeriodicBotRuns(req);

                // emit a notification
                te.broadcast(k.XCSIsListenerForBotUpdates, k.XCSEmitNotificationBotCreated, {
                    _id: newBot._id
                });

                res.writeHead(201, url);
                xcsutil.profilerSummary(req);
                return xcsutil.standardizedResponseWrite(res, newBot);
            }
        });

};

/**
 * Read
 */

bot.findBotWithUUID = function (req, botUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - findBotWithUUID] find bot with UUID: ' + botUUID + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var error = {};

    if (!botUUID) {
        error.status = 400;
        error.message = 'Bad Request';
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    db_core.findDocumentWithUUID(req, botUUID, k.XCSDesignDocumentBot, function (err, bot) {
        xcsutil.logLevelDec(req);
        if (err) {
            return cb(err);
        } else {
            return cb(null, bot);
        }
    });

};

bot.nextBotIntegrationNumber = function (req, botUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - nextBotIntegrationNumber] find the next bot integration number...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var error = {};

    if (!botUUID) {
        error.status = 400;
        error.message = 'Bad Request';
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    function fetchBotAndIncrementIntegrationNumber(botUUID, cb) {
        db_core.findDocumentWithUUIDUsingOptionalCaching(req, botUUID, k.XCSDesignDocumentBot, false, function (err, existingBot) {
            if (err) {
                konsole.error(req, '[Bot - nextBotIntegrationNumber] error: ' + err.message);
                return cb(err);
            } else {
                var assumedNextIntegrationNumber = existingBot.integration_counter,
                    changes = {
                        integration_counter: assumedNextIntegrationNumber + 1,
                        _rev: existingBot._rev
                    };

                konsole.debug(req, '[Bot - nextBotIntegrationNumber] updating bot ' + existingBot._id + ' with: ' + JSON.stringify(changes));

                db_core.updateDocumentWithUUID(req, existingBot._id, changes, k.XCSDesignDocumentBot, function (err) {
                    if (err) {
                        if (409 === err.status) {
                            fetchBotAndIncrementIntegrationNumber(botUUID, cb);
                        } else {
                            konsole.error(req, '[Bot - nextBotIntegrationNumber] error: ' + err.message);
                            xcsutil.logLevelDec(req);
                            return cb(err);
                        }
                    } else {
                        konsole.log(req, '[Bot - nextBotIntegrationNumber] next integration number assigned: ' + assumedNextIntegrationNumber);
                        xcsutil.logLevelDec(req);
                        return cb(null, existingBot, assumedNextIntegrationNumber);
                    }
                });
            }
        });
    }

    fetchBotAndIncrementIntegrationNumber(botUUID, cb);
};



bot.findBot = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - findBot] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id,
        self = bot;

    self.findBotWithUUID(req, botUUID, function (err, bot) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            if (bot) {
                return xcsutil.standardizedResponse(res, 200, bot);
            } else {
                return xcsutil.standardizedErrorResponse(res, {
                    status: 404,
                    message: 'Not found'
                });
            }
        }
    });

};

bot.listAllBots = function (req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    if (req) {
        functionTitle = '[Bot - listAllBots] ' + req.method + ' ' + req.url + '...';
    } else {
        functionTitle = '[Bot - listAllBots] list all bots...';
    }

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    redis.getDynamicQuery(req, k.XCSDesignDocumentBot, function (err, docs) {
        if (err) {
            opFailed(err);
        } else if (docs) {
            konsole.log(req, '[Bot - listAllBots] list of bots found in Redis.');
            opSucceeded(JSON.parse(docs));
        } else {
            konsole.log(req, '[Bot - listAllBots] find the list of bots in CouchDB');

            var query = {
                include_docs: true
            };

            if (unitTestUUID) {
                query.startkey = [unitTestUUID];
                query.endkey = [unitTestUUID, {}];
            }

            db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewAllBots, query, function (err, docs) {
                // Not finding documents doesn't mean it's an error. Let's report true errors instead.
                if (err && err.status !== 404) {
                    opFailed(err);
                } else {
                    redis.setDynamicQuery(req, k.XCSDesignDocumentBot, JSON.stringify(docs), function (err, wasSaved) {
                        if (wasSaved) {
                            konsole.log(req, '[Bot - listAllBots] list of bots found. Cache the results to Redis.');
                        }
                        // Even if there's an error (i.e. Redis suddenly went down), we can still continue since
                        // the next request would be redirected to CouchDB.
                        opSucceeded(docs);
                    });
                }

            });
        }
    });

    function opFailed(err) {
        xcsutil.logLevelDec(req);
        return cb(err);

    }

    function opSucceeded(docs) {
        xcsutil.logLevelDec(req);
        return cb(null, docs);
    }

};

bot.list = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req),
        self = bot;

    var functionTitle = '[Bot - list] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    self.listAllBots(req, function (err, bots) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedResponse(res, 200, bots);
        }

    });

};

bot.stats = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - stats] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    // The date is assumed to be in UTC format.

    var botUUID = req.params.id,
        on_date = req.query.on_date,
        since_date = req.query.since_date;

    konsole.log(req, '[Bot - stats] botUUID: ' + botUUID);

    function obtainStats() {
        async.parallel({

                lastCleanIntegration: function (cb) {
                    bot_stats.lastCleanIntegration(req, botUUID, function (err, object) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, object);
                        } else {
                            return cb(err);
                        }
                    });
                },
                bestSuccessStreak: function (cb) {
                    bot_stats.bestSuccessStreak(req, botUUID, function (err, object) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, object);
                        } else {
                            return cb(err);
                        }
                    });
                },
                numberOfIntegrations: function (cb) {
                    bot_stats.numberOfIntegrations(req, botUUID, on_date, since_date, function (err, sum) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, sum);
                        } else {
                            return cb(err);
                        }
                    });
                },
                numberOfCommits: function (cb) {
                    bot_stats.numberOfCommits(req, botUUID, on_date, since_date, function (err, sumOfCommits) {
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, sumOfCommits);
                        } else {
                            return cb(err);
                        }
                    });
                },
                averageIntegrationTime: function (cb) {
                    bot_stats.averageIntegrationTime(req, botUUID, on_date, since_date, function (err, averageIntegrationTimeObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, averageIntegrationTimeObject);
                        } else {
                            return cb(err);
                        }
                    });
                },
                testAdditionRate: function (cb) {
                    bot_stats.testAdditionRate(req, botUUID, on_date, since_date, function (err, testAdditionRateObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, testAdditionRateObject.sum);
                        } else {
                            return cb(err);
                        }
                    });
                },
                analysisWarnings: function (cb) {
                    bot_stats.analysisWarningStats(req, botUUID, on_date, since_date, function (err, analysisWarningObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, analysisWarningObject);
                        } else {
                            return cb(err);
                        }
                    });
                },
                testFailures: function (cb) {
                    bot_stats.testFailureStats(req, botUUID, on_date, since_date, function (err, testFailureObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, testFailureObject);
                        } else {
                            return cb(err);
                        }
                    });
                },
                errors: function (cb) {
                    bot_stats.errorStats(req, botUUID, on_date, since_date, function (err, errorObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, errorObject);
                        } else {
                            return cb(err);
                        }
                    });
                },
                regressedPerfTests: function (cb) {
                    bot_stats.regressedPerfTestStats(req, botUUID, on_date, since_date, function (err, regressedPerfTestObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, regressedPerfTestObject);
                        } else {
                            return cb(err);
                        }
                    });
                },
                warnings: function (cb) {
                    bot_stats.warningStats(req, botUUID, on_date, since_date, function (err, warningObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, warningObject);
                        } else {
                            return cb(err);
                        }
                    });
                },
                improvedPerfTests: function (cb) {
                    bot_stats.improvedPerfTestStats(req, botUUID, on_date, since_date, function (err, improvedPerfTestObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, improvedPerfTestObject);
                        } else {
                            return cb(err);
                        }
                    });
                },
                tests: function (cb) {
                    bot_stats.testsStats(req, botUUID, on_date, since_date, function (err, testsObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return cb(null, testsObject);
                        } else {
                            return cb(err);
                        }
                    });
                },
            },
            function (err, results) {
                if (err) {
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {

                    var result = {
                        lastCleanIntegration: results.lastCleanIntegration,
                        bestSuccessStreak: results.bestSuccessStreak,
                        numberOfIntegrations: results.numberOfIntegrations,
                        numberOfCommits: results.numberOfCommits,
                        averageIntegrationTime: results.averageIntegrationTime,
                        testAdditionRate: results.testAdditionRate,
                        analysisWarnings: results.analysisWarnings,
                        testFailures: results.testFailures,
                        errors: results.errors,
                        regressedPerfTests: results.regressedPerfTests,
                        warnings: results.warnings,
                        improvedPerfTests: results.improvedPerfTests,
                        tests: results.tests,
                    };

                    if (on_date) {
                        result.onDate = on_date;
                    } else if (since_date) {
                        result.sinceDate = since_date;
                    }

                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedResponse(res, 200, result);
                }
            });
    }

    // Use the first integration if no dates have been specified
    if (!on_date && !since_date) {
        integration_search.findIntegrationWithNumberForBotWithUUID(req, 1, botUUID, function (err, integration) {
            if (err) {
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                since_date = integration.endedTime.replace(/[\"]+/g, '');
                konsole.log(req, '[Bot - stats] since_date: ' + since_date);
                obtainStats();
            }
        });
    } else {
        if (on_date) {
            on_date = on_date.replace(/[\"]+/g, '');
            konsole.log(req, '[Bot - stats] on_date: ' + on_date);
        } else if (since_date) {
            since_date = since_date.replace(/[\"]+/g, '');
            konsole.log(req, '[Bot - stats] since_date: ' + since_date);
        }
        obtainStats();
    }

};

/**
 * Update
 */

bot.update = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - update] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    // Verify that the body has been specified
    var set_props = req.body[k.XCSSetProperties],
        unset_props = req.body[k.XCSUnsetProperties];

    if (!set_props && !unset_props) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }

    var botUUID = req.params.id,
        self = bot;

    // if a blueprint is provided, snag it now...
    var authedBlueprint = set_props.configuration && set_props.configuration.sourceControlBlueprint;

    if (req.query.overwriteBlueprint === 'true') {
        // ... and make a copy
        authedBlueprint = JSON.parse(JSON.stringify(authedBlueprint));
    } else if (authedBlueprint) {
        authedBlueprint = null;
        delete set_props.configuration.sourceControlBlueprint;
    }

    konsole.warn(req, '[Bot - update] WARNING! authedBlueprint: ' + authedBlueprint);

    function finishUpdate(body) {
        // reschedule
        self.schedulePeriodicBotRuns(req);

        // emit a notification
        te.broadcast(k.XCSIsListenerForBotUpdates, k.XCSEmitNotificationBotUpdated, {
            _id: botUUID
        });
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        return xcsutil.standardizedResponse(res, 200, body);
    }

    function doPatch() {
        // Retrieve the bot to be patched
        self.findBotWithUUID(req, botUUID, function (err, bot) {
            if (err) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedErrorResponse(res, err);
            }

            // Patch every property specified in the body, except those we don't want to merge against
            var noMergeProps = ['configuration', 'lastRevisionBlueprint'];
            for (var key in set_props) {
                if (set_props.hasOwnProperty(key)) {
                    // if this is the configuration, we need to take care to preserve the old blueprint if we're told to
                    if (key === 'configuration' && !set_props[key].sourceControlBlueprint) {
                        set_props[key].sourceControlBlueprint = bot[key].sourceControlBlueprint;
                    }

                    if (noMergeProps.indexOf(key) > -1) {
                        bot[key] = set_props[key];
                    } else {
                        bot[key] = db_core.patchObjectWithObject(req, bot[key], set_props[key]);
                    }
                }
            }

            db_core.updateDocumentWithUUID(req, botUUID, bot, k.XCSDesignDocumentBot, function (err, body) {
                if (err) {
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    redis.delDynamicQuery(req, k.XCSDesignDocumentBot);

                    // Store the auth'd blueprint in the keychain, if we were asked to
                    if (authedBlueprint && !authedBlueprint.DVTSourceControlWorkspaceBlueprintDontUpdate) {
                        var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
                        keychain.removeItem(req, k.XCSKeychainTemplate, botUUID, function () {

                            // We could get an error if this doesn't exist in the Keychain, so let's not pay attention to any errors
                            // if it really couldn't be removed, we'll get a "duplicate" error when we try to insert, which is enough

                            keychain.addItem(req, k.XCSKeychainTemplate, JSON.stringify(authedBlueprint), botUUID, null, function (errMessage) {
                                if (errMessage) {
                                    xcsutil.profilerSummary(req);
                                    xcsutil.logLevelDec(req);
                                    xcsutil.logLevelCheck(req, logLevel);
                                    return xcsutil.standardizedErrorResponse(res, {
                                        status: 500,
                                        message: errMessage
                                    });
                                } else {
                                    finishUpdate(body);
                                }
                            });
                        });
                    } else {
                        finishUpdate(body);
                    }
                }
            });

        });
    }

    // Strip the authentication information out of the blueprint if one is provided
    if (authedBlueprint && !authedBlueprint.DVTSourceControlWorkspaceBlueprintDontUpdate) {
        bridge.sourceControl.removeCredentialsFromBlueprint(authedBlueprint, function (errMessage, cleanBlueprint) {

            if (errMessage) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedErrorResponse(res, {
                    status: 500,
                    message: errMessage
                });
            }

            // Swap in the clean blueprint
            set_props.configuration.sourceControlBlueprint = cleanBlueprint;
            doPatch();
        });
    } else {
        doPatch();
    }
};

/**
 * Remove
 */

function removeAssetDirectory(req, botUUID, cb) {

    if (req && req.snitch) {
        req.snitch.next('[Bot - removeAssetDirectory] removeAssetDirectory');
    }

    fs.readdir(k.XCSIntegrationAssets, function (err, files) {
        if (err) {
            cb(err);
        } else {
            var dirFound = files.some(function (dir) {
                var pathTest = new RegExp('^' + botUUID);

                if (pathTest.test(dir)) {
                    xcsutil.removeDirectory(path.join(k.XCSIntegrationAssets, dir), cb);
                    return true;
                }

                return false;
            });

            if (!dirFound) {
                cb({
                    status: 404,
                    message: 'Could not find asset directory for bot.'
                });
            }
        }
    });
}

function removeBotIntegrations(req, botUUID, cb) {

    xcsutil.logLevelInc(req);

    var query = {
            key: botUUID,
            include_docs: true
        },
        integration = require('./integration.js');

    integration_search.findIntegrationsForBotWithQuery(req, k.XCSDesignDocumentViewIntegrationsByBot, botUUID, query, function (err, integrations) {
        if (err && err.status !== 404) {
            xcsutil.logLevelDec(req);
            cb(err);
        } else if (!integrations) {
            xcsutil.logLevelDec(req);
            return cb();
        } else {
            async.each(integrations, function (theIntegration, cb) {
                integration.removeIntegration(req, theIntegration, cb);
            }, function () {
                xcsutil.logLevelDec(req);
                return cb();
            });
        }
    });
}

bot.remove = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - remove] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var self = bot,
        botUUID = req.params.id,
        botRev = req.params.rev;

    function doRemove() {
        db_core.removeDocument(req, botUUID, botRev, function (err) {
            if (err) {
                if (409 === err.status) {
                    // Retrieve the bot to be patched
                    self.findBotWithUUID(req, botUUID, function (err, bot) {
                        if (err) {
                            xcsutil.profilerSummary(req);
                            xcsutil.logLevelDec(req);
                            xcsutil.logLevelCheck(req, logLevel);

                            // Perhaps the document doesn't exist any longer?
                            // In any event, there is little we can do about this now.

                            return xcsutil.standardizedErrorResponse(res, err);
                        } else {
                            // Reset the revision we've just obtained
                            botRev = bot._rev;
                            doRemove();
                        }
                    });
                } else {
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedErrorResponse(res, err);
                }
            } else {
                redis.delDynamicQuery(req, k.XCSDesignDocumentBot);

                // reschedule
                self.schedulePeriodicBotRuns(req);

                removeBotIntegrations(req, botUUID, function (err) {
                    if (err) {
                        konsole.log(req, '[Bot - remove] Error deleting bot integrations: ' + err.message);
                    }

                    // emit a notification
                    te.broadcast(k.XCSIsListenerForBotUpdates, k.XCSEmitNotificationBotRemoved, {
                        _id: botUUID
                    });

                    removeAssetDirectory(req, botUUID, function (err) {
                        if (err) {
                            konsole.log(req, '[Bot - remove] Error deleting asset directory for bot: ' + err);
                        }

                        xcsutil.profilerSummary(req);
                        xcsutil.logLevelDec(req);
                        return xcsutil.standardizedResponse(res, 204);
                    });
                });
            }
        });
    }

    doRemove();

};

bot.removeAll = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - removeAll] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    var self = bot;

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        query = {
            include_docs: false
        };

    if (unitTestUUID) {
        query.startkey = [unitTestUUID];
        query.endkey = [unitTestUUID, {}];
    }

    db_core.removeAll(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewAllBots, query, function (err) {
        if (err && err.status !== 404) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            redis.delDynamicQuery(req, k.XCSDesignDocumentBot);

            // reschedule
            self.schedulePeriodicBotRuns(req);

            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

/**
 * Preflight and Reflight
 */

bot.preflight = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - preflight] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    bridge.sourceControl.preflight(req.body, function (err, result) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: err.message
            });
        } else {
            return xcsutil.standardizedResponse(res, 200, result);
        }
    });
};

bot.reflight = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - reflight] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id;

    var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
    keychain.findItem(req, k.XCSKeychainTemplate, botUUID, function (err, blueprintBuf) {
        if (err) {
            konsole.error(req, '[Bot - reflight] error: ' + err.message);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: err.message
            });
        } else {
            var blueprint = JSON.parse(blueprintBuf.toString('utf8'));
            bridge.sourceControl.preflight(blueprint, function (err, result) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                if (err) {
                    return xcsutil.standardizedErrorResponse(res, {
                        status: 500,
                        message: err.message
                    });
                } else {
                    return xcsutil.standardizedResponse(res, 200, result);
                }
            });
        }
    });
};

/**
 * Scheduled integrations
 */

bot.schedulePeriodicBotRuns = function (req) {

    auth.verifyIfServiceIsEnabledAllowCertificate(req, null, function (err) {
        if (!err) {
            // forward just the requestUUID, for logging purposes
            var args = (req && req.requestUUID) ? [{
                requestUUID: req.requestUUID,
                headers: req.headers,
                url: req.url
    }] : [];

            delegation.invoke('schedulePeriodicBotRuns', req, args, function () {
                konsole.log(req, '[Bot - schedulePeriodicBotRuns] Rebuilding periodic schedule');

                var self = bot;

                // cancel all pending bot schedule tasks
                scheduler.cancelTasksMatchingFilter(function (task) {
                    return (task.botScheduled);
                });

                // find any bots on the system
                self.listAllBots(req, function (err, bots) {
                    if (err) {
                        konsole.error(req, '[Bot - schedulePeriodicBotRuns] error: ' + err.message);
                    } else {
                        konsole.log(req, '[Bot - schedulePeriodicBotRuns] found ' + bots.length + ' bots');

                        bots.forEach(function (bot) {
                            // define what will get run when the schedule fires
                            function botIntegrator() {
                                var integration = require('./integration.js');
                                integration_search.findPendingIntegrations(req, function (err, docs) {
                                    if (!docs.some(function (integration) {
                                        return integration.bot._id === bot._id;
                                    })) {
                                        konsole.log(req, '[Bot - schedulePeriodicBotRuns] Adding integration for bot "' + bot.name + '" according to schedule');
                                        integration.addPendingIntegration(null, bot._id, false, function (err) {
                                            if (err) {
                                                konsole.log(req, '[Bot - schedulePeriodicBotRuns] Error creating scheduled integration: ' + err.message);
                                            }
                                        });
                                    } else {
                                        konsole.log(req, '[Bot - schedulePeriodicBotRuns] Skipping adding integration for bot "' + bot.name + '" since a pending integration already exists');
                                    }
                                });
                            }

                            if (bot.configuration.scheduleType === 1) // periodic
                            {
                                konsole.log(req, '[Bot - schedulePeriodicBotRuns] Bot "' + bot.name + '" has periodic schedule');
                                var task = null;
                                var minuteString = ((bot.configuration.minutesAfterHourToIntegrate < 10) ? '0' : '') + bot.configuration.minutesAfterHourToIntegrate;

                                // hourly
                                if (bot.configuration.periodicScheduleInterval === 1) {
                                    konsole.log(req, '[Bot - schedulePeriodicBotRuns] findLastIntegrationsForBotWithQuery: hourly at ' + bot.configuration.minutesAfterHourToIntegrate + ' minutes after the hour');
                                    task = scheduler.scheduleHourlyAtTime(bot.configuration.minutesAfterHourToIntegrate, botIntegrator);
                                }

                                // daily
                                else if (bot.configuration.periodicScheduleInterval === 2) {
                                    konsole.log(req, '[Bot - schedulePeriodicBotRuns] Will run daily at ' + bot.configuration.hourOfIntegration + ':' + minuteString);
                                    task = scheduler.scheduleDailyAtTime(bot.configuration.hourOfIntegration, bot.configuration.minutesAfterHourToIntegrate, botIntegrator);
                                }

                                // weekly
                                else if (bot.configuration.periodicScheduleInterval === 3) {
                                    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                    var day = (bot.configuration.weeklyScheduleDay % 7); // wrap around Sunday
                                    konsole.log(req, '[Bot - schedulePeriodicBotRuns] Will run weekly on ' + days[day] + ' at ' + bot.configuration.hourOfIntegration + ':' + minuteString);
                                    task = scheduler.scheduleWeeklyAtTime(day, bot.configuration.hourOfIntegration, bot.configuration.minutesAfterHourToIntegrate, botIntegrator);
                                }

                                // annotate the task so we can find it later
                                if (task) {
                                    task.botScheduled = true;
                                }
                            }
                        });
                    }
                });
            });
        }
    });

};

function checkBotForUpdates(req, bot) {

    xcsutil.logLevelInc(req);

    if (req && req.snitch) {
        req.snitch.next('[Bot - checkBotForUpdates] checkBotForUpdates');
    }

    if (bot.lastRevisionBlueprint) {
        var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
        keychain.findItem(req, k.XCSKeychainTemplate, bot._id, function (err, blueprintBuf) {
            if (err) {
                konsole.log(req, '[Bot - checkBotForUpdates] Error fetching authenticated blueprint from keychain using (' + k.XCSKeychainTemplate + '/' + bot._id + '). Reason: ' + err);
                xcsutil.logLevelDec(req);
                return;
            }

            var authedBlueprint = JSON.parse(blueprintBuf.toString('utf8'));
            bridge.sourceControl.merge(bot.lastRevisionBlueprint, authedBlueprint, function (err, mergedBlueprint) {
                if (err) {
                    konsole.log(req, '[Bot - checkBotForUpdates] Error merging blueprints: ' + err);
                    xcsutil.logLevelDec(req);
                    return;
                }

                bridge.sourceControl.checkForUpdates(mergedBlueprint, function (err, result) {
                    if (err) {
                        xcsutil.logLevelDec(req);
                        konsole.log(req, '[Bot - checkBotForUpdates] Error checking for updates: ' + err);
                        return;
                    } else if (result.hasUpdates) {
                        konsole.log(req, '[Bot - checkBotForUpdates] Bot has updates available.');
                        var integration = require('./integration.js');
                        integration_search.findPendingIntegrations(req, function (err, docs) {
                            if (!docs.some(function (integration) {
                                xcsutil.logLevelDec(req);
                                return integration.bot._id === bot._id;
                            })) {
                                konsole.log(req, '[Bot - checkBotForUpdates] Adding integration for bot');
                                integration.addPendingIntegration(null, bot._id, false, function (err) {
                                    if (err) {
                                        konsole.log(req, '[Bot - checkBotForUpdates] Error creating scheduled integration: ' + err.message);
                                    }
                                    xcsutil.logLevelDec(req);
                                    return;
                                });
                            } else {
                                konsole.log(req, '[Bot - checkBotForUpdates] Skipping adding integration for bot "' + bot.name + '" since a pending integration already exists');
                                xcsutil.logLevelDec(req);
                                return;
                            }
                        });
                    } else {
                        konsole.log(req, '[Bot - checkBotForUpdates] Bot has no updates available.');
                        xcsutil.logLevelDec(req);
                        return;
                    }
                });
            });
        });
    } else {
        xcsutil.logLevelDec(req);
        return;
    }
}

bot.scheduleCommitPolling = function (req) {

    auth.verifyIfServiceIsEnabledAllowCertificate(req, null, function (err) {
        if (!err) {
            // forward just the requestUUID, for logging purposes
            var args = (req && req.requestUUID) ? [{
                requestUUID: req.requestUUID,
                headers: req.headers,
                url: req.url
    }] : [];

            delegation.invoke('scheduleCommitPolling', req, args, function () {
                konsole.log(req, '[Bot - scheduleCommitPolling] Rebuilding poll-for-commit schedule');

                var self = bot;

                function checkBotsForUpdates() {
                    konsole.log(req, '[Bot - scheduleCommitPolling] Checking bots for SCM updates');

                    self.listAllBots(req, function (err, bots) {
                        if (err) {
                            konsole.error(req, '[Bot - scheduleCommitPolling] error while checking bots for updates: ' + err.message);
                        } else {
                            konsole.log(req, '[Bot - scheduleCommitPolling] Found ' + bots.length + ' bots.');

                            bots.forEach(function (bot) {
                                if (bot.configuration.scheduleType === 2) { // on commit
                                    konsole.log(req, '[Bot - scheduleCommitPolling] Bot "' + bot.name + '" has on commit schedule');
                                    checkBotForUpdates(req, bot);
                                }
                            });
                        }
                    });
                }

                for (var i = 0; i < 60; i += k.XCSPollForCommitInterval) {
                    scheduler.scheduleHourlyAtTime(i, checkBotsForUpdates);
                }
            });
        }
    });

};

/* Module exports */
module.exports = bot;