/*
    XCSBotClass
    A class dedicated to interact with bot operations.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var async = require('async'),
    fs = require('fs'),
    path = require('path');

var k = require('../constants.js'),
    bridge = require('../util/xcsbridge.js'),
    security = require('../util/xcssecurity.js'),
    scheduler = require('../util/scheduler.js'),
    te = require('../util/turboevents.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    botStatsClass = require('./botStatsClass.js'),
    integrationSearchClass = require('./integrationSearchClass.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('./redisClass.js'),
    delegation = require('../util/delegation.js');

/* XCSBotClass object */

function XCSBotClass() {}

XCSBotClass.prototype.create = function create(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - create] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        body = req.body;

    createBot_internal(req, res, self, body, true, function (err, newBot) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.logLevelDec(req);
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedResponse(res, 201, newBot);
        }
    });

};

XCSBotClass.prototype.duplicate = function duplicate(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - create] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        botUUID = req.params.id,
        body = req.body;

    async.waterfall([
        function (callback) {
                self.findBotWithUUID(req, botUUID, callback);
        },
        function (bot, callback) {

                var keys = Object.keys(body);
                if (keys.length > 0) {
                    for (var key in body) {
                        if (body.hasOwnProperty(key)) {
                            xcsutil.upsertValueForKeyPathInObject(bot, key, body[key]);
                        }
                    }

                }

                callback(null, bot);
        },
        function (bot, callback) {
                // Initialize the state of the bot to a pristine condition
                delete bot._id;
                delete bot._rev;
                delete bot.lastRevisionBlueprint;
                bot.integration_counter = 1;
                callback(null, bot);
        },
        function (bot, callback) {
                uniqueBotNameWithValue(req, bot.name, self, function (err, uniqueName) {
                    if (err) {
                        callback(err);
                    } else {
                        bot.name = uniqueName;
                        callback(null, bot);
                    }
                });
        },
        function (bot, callback) {
                createBot_internal(req, res, self, bot, false, callback);
        },
        function (newBot, callback) {
                var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
                keychain.findItem(req, k.XCSKeychainTemplate, botUUID, function (err, blueprintBuf) {
                    if (err) {
                        callback(err);
                    } else {
                        var newBlueprint = JSON.parse(blueprintBuf.toString('utf8'));
                        keychain.addItem(req, k.XCSKeychainTemplate, JSON.stringify(newBlueprint), newBot._id, null, function (err) {
                            if (err) {
                                callback(err);
                            } else {
                                callback(null, newBot);
                            }
                        });
                    }
                });
        }],
        function (err, newBot) {
            if (err) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                xcsutil.logLevelDec(req);
                xcsutil.profilerSummary(req);
                return xcsutil.standardizedResponse(res, 201, newBot);
            }
        });

};

XCSBotClass.prototype.findBotWithUUID = function findBotWithUUID(req, botUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - findBotWithUUID] find bot with UUID: ' + botUUID;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!botUUID) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the bot ID has not been specified'
        });
    }

    dbCoreClass.findDocumentWithUUID(req, botUUID, k.XCSDesignDocumentBot, function BOTFindBotWithUUID(err, bot) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, bot);
        }
    });

};

XCSBotClass.prototype.nextBotIntegrationNumber = function nextBotIntegrationNumber(req, botUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - nextBotIntegrationNumber] find the next bot integration number';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!botUUID) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the bot ID has not been specified'
        });
    }

    function fetchBotAndIncrementIntegrationNumber(botUUID, cb) {
        dbCoreClass.findDocumentWithUUIDUsingOptionalCaching(req, botUUID, k.XCSDesignDocumentBot, false, function BOTFetchBotAndIncrementIntegrationNumberFindDocument(err, existingBot) {
            if (err) {
                return xcsutil.safeCallback(cb, err);
            } else {
                var assumedNextIntegrationNumber = existingBot.integration_counter,
                    changes = {
                        integration_counter: assumedNextIntegrationNumber + 1,
                        _rev: existingBot._rev
                    };

                konsole.debug(req, '[Bot - nextBotIntegrationNumber] updating bot ' + existingBot._id + ' with: ' + JSON.stringify(changes));

                dbCoreClass.updateDocumentWithUUID(req, existingBot._id, changes, true, k.XCSDesignDocumentBot, function BOTFetchBotAndIncrementIntegrationNumberUpdateDocument(err) {
                    if (err) {
                        if (409 === err.status) {
                            fetchBotAndIncrementIntegrationNumber(botUUID, cb);
                        } else {
                            xcsutil.logLevelDec(req);
                            return xcsutil.safeCallback(cb, err);
                        }
                    } else {
                        konsole.log(req, '[Bot - nextBotIntegrationNumber] next integration number assigned: ' + assumedNextIntegrationNumber);
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb, null, existingBot, assumedNextIntegrationNumber);
                    }
                });
            }
        });
    }

    fetchBotAndIncrementIntegrationNumber(botUUID, cb);
};

XCSBotClass.prototype.findBot = function findBot(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - findBot] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id,
        self = this;

    self.findBotWithUUID(req, botUUID, function BOTFindBot(err, bot) {
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
                    message: 'Not found: ' + err.message
                });
            }
        }
    });

};

XCSBotClass.prototype.listAllBots = function listAllBots(req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    if (req) {
        functionTitle = '[Bot - listAllBots] ' + req.method + ' ' + req.url;
    } else {
        functionTitle = '[Bot - listAllBots] list all bots';
    }

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    redisClass.getDynamicQuery(req, k.XCSDesignDocumentBot, function BOTListAllBotsRedisGetDynamicQuery(err, docs) {
        if (err) {
            opFailed(err);
        } else if (docs) {
            docs = JSON.parse(docs);
            konsole.log(req, '[Bot - listAllBots] number of documents found in Redis: ' + docs.length);
            opSucceeded(docs);
        } else {
            konsole.log(req, '[Bot - listAllBots] find the list of bots in CouchDB');

            var query = {
                include_docs: true
            };

            if (unitTestUUID) {
                query.startkey = [unitTestUUID];
                query.endkey = [unitTestUUID, {}];
            }

            dbCoreClass.listAllDocuments(req, k.XCSDesignDocumentBot, function BOTListAllBotsFindDocuments(err, docs) {
                // Not finding documents doesn't mean it's an error. Let's report true errors instead.
                if (err && err.status !== 404) {
                    opFailed(err);
                } else {
                    konsole.log(req, '[Bot - listAllBots] number of documents found in CouchDB: ' + docs.length);
                    redisClass.setDynamicQuery(req, k.XCSDesignDocumentBot, JSON.stringify(docs), function BOTListAllBotsRedisSetDynamicQuery(err, wasSaved) {
                        if (wasSaved) {
                            konsole.log(req, '[Bot - listAllBots] list of bots retrieved. Cache the results to Redis.');
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
        return xcsutil.safeCallback(cb, err);

    }

    function opSucceeded(docs) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, null, docs);
    }

};

XCSBotClass.prototype.list = function list(req, res) {

    var logLevel = xcsutil.logLevelInc(req),
        self = this;

    var functionTitle = '[Bot - list] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.listAllBots(req, function BOTListAllBots(err, bots) {
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

XCSBotClass.prototype.stats = function stats(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - stats] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id,
        on_date = req.query.on_date,
        since_date = req.query.since_date,
        self = this;

    konsole.log(req, '[Bot - stats] botUUID: ' + botUUID);

    if (!botUUID) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the bot ID has not been specified'
        });
    }

    function obtainStats() {
        async.parallel({

                lastCleanIntegration: function BOTStatsLastCleanIntegration(cb) {
                    botStatsClass.lastCleanIntegration(req, botUUID, function BOTStatsLastCleanIntegrationCallback(err, object) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, object);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                bestSuccessStreak: function (cb) {
                    botStatsClass.bestSuccessStreak(req, botUUID, function BOTStatsBestSuccessStreak(err, object) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, object);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                numberOfIntegrations: function (cb) {
                    botStatsClass.numberOfIntegrations(req, botUUID, on_date, since_date, function BOTStatsNumberOfIntegrations(err, sum) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, sum);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                numberOfCommits: function (cb) {
                    botStatsClass.numberOfCommits(req, botUUID, on_date, since_date, function BOTStatsNumberOfCommits(err, sumOfCommits) {
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, sumOfCommits);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                averageIntegrationTime: function (cb) {
                    botStatsClass.averageIntegrationTime(req, botUUID, on_date, since_date, function BOTStatsAverageIntegrationTime(err, averageIntegrationTimeObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, averageIntegrationTimeObject);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                testAdditionRate: function (cb) {
                    botStatsClass.testAdditionRate(req, botUUID, on_date, since_date, function BOTStatsTestAdditionRate(err, testAdditionRateObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, testAdditionRateObject.sum);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                analysisWarnings: function (cb) {
                    botStatsClass.analysisWarningStats(req, botUUID, on_date, since_date, function BOTStatsAnalysisWarnings(err, analysisWarningObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, analysisWarningObject);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                testFailures: function (cb) {
                    botStatsClass.testFailureStats(req, botUUID, on_date, since_date, function BOTStatsTestFailures(err, testFailureObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, testFailureObject);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                errors: function (cb) {
                    botStatsClass.errorStats(req, botUUID, on_date, since_date, function BOTStatsErrors(err, errorObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, errorObject);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                regressedPerfTests: function (cb) {
                    botStatsClass.regressedPerfTestStats(req, botUUID, on_date, since_date, function BOTStatsRegressedPerfTests(err, regressedPerfTestObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, regressedPerfTestObject);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                warnings: function (cb) {
                    botStatsClass.warningStats(req, botUUID, on_date, since_date, function BOTStatsWarnings(err, warningObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, warningObject);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                improvedPerfTests: function (cb) {
                    botStatsClass.improvedPerfTestStats(req, botUUID, on_date, since_date, function BOTStatsImprovedPerfTests(err, improvedPerfTestObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, improvedPerfTestObject);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                tests: function (cb) {
                    botStatsClass.testsStats(req, botUUID, on_date, since_date, function BOTStatsTests(err, testsObject) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, testsObject);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                ccDelta: function (cb) {
                    botStatsClass.ccDeltaStats(req, botUUID, on_date, since_date, function BOTStatsTests(err, ccDelta) {
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, ccDelta);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
            },
            function BOTStatsFinalizer(err, results) {
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
                        codeCoveragePercentageDelta: results.ccDelta
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

    self.findBotWithUUID(req, botUUID, function BOTUpdateDoPatch(err) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            // If no parameters have been specified, we'll set 'since_date' to a year ago.
            if (!on_date && !since_date) {
                if (!on_date && !since_date) {
                    var now = new Date(),
                        aYearAgo = new Date(now);
                    aYearAgo.setDate(aYearAgo.getDate() - 365);
                    since_date = aYearAgo.toISOString();
                }
            } else {
                if (on_date) {
                    on_date = on_date.replace(/[\"]+/g, '');
                    konsole.log(req, '[Bot - stats] on_date: ' + on_date);
                } else if (since_date) {
                    since_date = since_date.replace(/[\"]+/g, '');
                    konsole.log(req, '[Bot - stats] since_date: ' + since_date);
                }
            }

            obtainStats();
        }
    });

};

XCSBotClass.prototype.update = function update(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - update] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var body = xcsutil.patchBodyForClient(req);

    // Verify that the body has been specified
    if (!body) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body is empty'
        });
    }

    var botUUID = req.params.id,
        self = this;

    // if a blueprint is provided, snag it now...
    var authedBlueprint = body.configuration && body.configuration.sourceControlBlueprint;

    if (req.query.overwriteBlueprint === 'true') {
        // ... and make a copy
        authedBlueprint = JSON.parse(JSON.stringify(authedBlueprint));
    } else if (authedBlueprint) {
        authedBlueprint = null;
        delete body.configuration.sourceControlBlueprint;
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
        self.findBotWithUUID(req, botUUID, function BOTUpdateDoPatch(err, bot) {
            if (err) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedErrorResponse(res, err);
            }

            // Patch every property specified in the body, except those we don't want to merge against
            var noMergeProps = ['configuration', 'lastRevisionBlueprint'];
            for (var key in body) {
                if (body.hasOwnProperty(key)) {
                    // if this is the configuration, we need to take care to preserve the old blueprint if we're told to
                    if (key === 'configuration' && !body[key].sourceControlBlueprint) {
                        body[key].sourceControlBlueprint = bot[key].sourceControlBlueprint;
                    }

                    if (noMergeProps.indexOf(key) > -1) {
                        bot[key] = body[key];
                    } else {
                        bot[key] = xcsutil.patchDocumentWithObject(bot[key], body[key]);
                    }
                }
            }

            bridge.core.validate('XCSBot', bot, function BOTUpdateDoPatchVsalidateBot(err, validationErrors) {
                if (err) {
                    // If err, something went really wrong here, probably a programming error
                    return xcsutil.standardizedErrorResponse(res, {
                        status: 500,
                        message: 'Internal Server Error (xcsbridge): ' + JSON.stringify(err)
                    });
                } else {
                    if (validationErrors && validationErrors.length > 0) {
                        // If (validationErrors && validationErrors.length > 0), the body content failed validation
                        return xcsutil.standardizedErrorResponse(res, {
                            status: 400,
                            message: validationErrors[0],
                            reasons: validationErrors
                        });
                    } else {
                        // All clear: retrieve the bot to be patched
                        dbCoreClass.updateDocumentWithUUID(req, botUUID, bot, false, k.XCSDesignDocumentBot, function BOTUpdateDocument(err, body) {
                            if (err) {
                                xcsutil.profilerSummary(req);
                                xcsutil.logLevelDec(req);
                                xcsutil.logLevelCheck(req, logLevel);
                                return xcsutil.standardizedErrorResponse(res, err);
                            } else {
                                redisClass.delDynamicQuery(req, k.XCSDesignDocumentBot);

                                // Store the auth'd blueprint in the keychain, if we were asked to
                                if (authedBlueprint && !authedBlueprint.DVTSourceControlWorkspaceBlueprintDontUpdate) {
                                    // merge in any credentials we already had.
                                    var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);

                                    keychain.findItem(req, k.XCSKeychainTemplate, botUUID, function BOTUpdateFindKeychainTemplate(err, blueprintBuf) {
                                        function botUpdateReplaceKeychainItem(newBlueprint) {
                                            keychain.removeItem(req, k.XCSKeychainTemplate, botUUID, function BOTUpdateRemoveKeychainTemplate() {

                                                // We could get an error if this doesn't exist in the Keychain, so let's not pay attention to any errors
                                                // if it really couldn't be removed, we'll get a "duplicate" error when we try to insert, which is enough

                                                keychain.addItem(req, k.XCSKeychainTemplate, JSON.stringify(newBlueprint), botUUID, null, function BOTUpdateDocumentAddItemToKeychain(errMessage) {
                                                    if (errMessage) {
                                                        xcsutil.profilerSummary(req);
                                                        xcsutil.logLevelDec(req);
                                                        xcsutil.logLevelCheck(req, logLevel);
                                                        return xcsutil.standardizedErrorResponse(res, {
                                                            status: 500,
                                                            message: 'Internal Server Error (keychain): ' + errMessage
                                                        });
                                                    } else {
                                                        finishUpdate(body);
                                                    }
                                                });
                                            });
                                        }

                                        if (err) {
                                            botUpdateReplaceKeychainItem(authedBlueprint);
                                        } else {
                                            var oldBlueprint = JSON.parse(blueprintBuf.toString('utf8'));

                                            bridge.sourceControl.getMissingCredentials(authedBlueprint, oldBlueprint, function (err, newBlueprint) {
                                                if (err) {
                                                    // with an error, just use the blueprint we were given.
                                                    botUpdateReplaceKeychainItem(authedBlueprint);
                                                } else {
                                                    botUpdateReplaceKeychainItem(newBlueprint);
                                                }
                                            });
                                        }
                                    });

                                } else {
                                    finishUpdate(body);
                                }
                            }
                        });
                    }
                }
            });
        });

    }

    // Strip the authentication information out of the blueprint if one is provided
    if (authedBlueprint && !authedBlueprint.DVTSourceControlWorkspaceBlueprintDontUpdate) {
        bridge.sourceControl.removeCredentialsFromBlueprint(authedBlueprint, function BOTUpdateRemoveCredentialsFromBlueprint(errMessage, cleanBlueprint) {

            if (errMessage) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedErrorResponse(res, {
                    status: 500,
                    message: 'Internal Server Error (xcsbridge): ' + errMessage
                });
            }

            // Swap in the clean blueprint
            body.configuration.sourceControlBlueprint = cleanBlueprint;
            doPatch();
        });
    } else {
        doPatch();
    }
};

XCSBotClass.prototype.remove = function remove(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - remove] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        botUUID = req.params.id,
        botRev = req.params.rev;

    function doRemove() {
        dbCoreClass.removeDocument(req, botUUID, botRev, function BOTRemoveDocument(err) {
            if (err) {
                if (409 === err.status) {
                    // Retrieve the bot to be patched
                    self.findBotWithUUID(req, botUUID, function BOTRemoveDocumentFindBot(err, bot) {
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
                redisClass.delDynamicQuery(req, k.XCSDesignDocumentBot);

                // reschedule
                self.schedulePeriodicBotRuns(req);

                removeBotIntegrations(req, botUUID, function BOTRemoveDocumentRemoveBotIntegrations(err) {
                    if (err && err.status !== 404) {
                        konsole.error(req, '[Bot - remove] Error deleting bot integrations: ' + JSON.stringify(err));
                    }

                    // emit a notification
                    te.broadcast(k.XCSIsListenerForBotUpdates, k.XCSEmitNotificationBotRemoved, {
                        _id: botUUID
                    });

                    removeAssetDirectory(req, botUUID, function BOTRemoveDocumentRemoveAssetDirectory(err) {
                        if (err && err.status !== 404) {
                            konsole.error(req, '[Bot - remove] Error deleting asset directory for bot: ' + JSON.stringify(err));
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

XCSBotClass.prototype.removeAll = function removeAll(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - removeAll] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    var self = this;

    if (req && req.snitch) {
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

    dbCoreClass.removeAll(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewAllBots, query, function BOTRemoveAll(err) {
        if (err && err.status !== 404) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            redisClass.delDynamicQuery(req, k.XCSDesignDocumentBot);

            // reschedule
            self.schedulePeriodicBotRuns(req);

            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

XCSBotClass.prototype.preflight = function preflight(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - preflight] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    bridge.sourceControl.preflight(req.body, function BOTPreflight(err, result) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: 'Internal Server Error (xcsbridge): ' + err.message
            });
        } else {
            return xcsutil.standardizedResponse(res, 200, result);
        }
    });
};

XCSBotClass.prototype.listBranches = function listBranches(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - listBranches] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    bridge.sourceControl.listBranches(req.body, function BOTListBranches(err, result) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: 'Internal Server Error (xcsbridge): ' + err.message
            });
        } else {
            return xcsutil.standardizedResponse(res, 200, result);
        }
    });
};

XCSBotClass.prototype.reflight = function reflight(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - reflight] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id;

    var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
    keychain.findItem(req, k.XCSKeychainTemplate, botUUID, function BOTReflightFindItem(err, blueprintBuf) {
        if (err) {
            err.message = '[Bot - reflight] error: ' + JSON.stringify(err);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: 'Internal Server Error (keychain): ' + err.message
            });
        } else {
            var blueprint = JSON.parse(blueprintBuf.toString('utf8'));
            bridge.sourceControl.preflight(blueprint, function BOTReflightPreflight(err, result) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                if (err) {
                    return xcsutil.standardizedErrorResponse(res, {
                        status: 500,
                        message: 'Internal Server Error (xcsbridge): ' + err.message
                    });
                } else {
                    return xcsutil.standardizedResponse(res, 200, result);
                }
            });
        }
    });
};

XCSBotClass.prototype.reflightBranches = function reflightBranches(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - reflightBranches] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id,
        clientBlueprint = req.body;

    async.waterfall([

        function BOTReflightFindItem(cb) {
            var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
            keychain.findItem(req, k.XCSKeychainTemplate, botUUID, cb);
        },
        function BOTReflightMergeBlueprint(blueprintBuf, cb) {
            var blueprint = JSON.parse(blueprintBuf.toString('utf8'));
            if (clientBlueprint && Object.keys(clientBlueprint).length > 0) {
                bridge.sourceControl.getMissingCredentials(clientBlueprint, blueprint, cb);
            } else {
                return xcsutil.safeCallback(cb, null, blueprint);
            }
        },
        function BOTReflightListBranches(blueprint, cb) {
            bridge.sourceControl.listBranches(blueprint, cb);
        }
    ], function (err, result) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (err) {
            konsole.error(req, '[Bot - reflightBranches] error: ' + JSON.stringify(err));
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: 'Internal Server Error (xcsbridge): ' + err.message
            });
        } else {
            return xcsutil.standardizedResponse(res, 200, result);
        }
    });
};

XCSBotClass.prototype.schedulePeriodicBotRuns = function schedulePeriodicBotRuns(req) {

    var self = this;

    xcsutil.checkIfRequestCanBeServiced(function (err, isInitPhaseOn, isInitPhaseOnManual, serviceIsEnabled) {

        if (err) {
            konsole.log(req, '[Bot - schedulePeriodicBotRuns] skipping. Reason: ' + JSON.stringify(err));
        } else if (('1' === isInitPhaseOn) || ('1' === isInitPhaseOnManual)) {
            konsole.log(req, '[Bot - schedulePeriodicBotRuns] skipping. Reason: xcsd is still in the init phase.');
        } else if (false === serviceIsEnabled) {
            konsole.log(req, '[Bot - schedulePeriodicBotRuns] skipping. Reason: xcsd is disabled.');
        } else {
            // forward just the requestUUID, for logging purposes
            var args = (req && req.requestUUID) ? [{
                requestUUID: req.requestUUID,
                headers: req.headers,
                url: req.url
    }] : [];

            delegation.invoke('schedulePeriodicBotRuns', req, args, function BOTSchedulePeriodicBotRuns() {
                konsole.log(req, '[Bot - schedulePeriodicBotRuns] Rebuilding periodic schedule');

                // cancel all pending bot schedule tasks
                scheduler.cancelTasksMatchingFilter(function BOTSchedulePeriodicBotRunsCancelTasksMatchingFilter(task) {
                    return (task.botScheduled);
                });

                // find any bots on the system
                self.listAllBots(req, function BOTSchedulePeriodicBotRunsListAllBots(err, bots) {
                    if (err) {
                        konsole.error(req, '[Bot - schedulePeriodicBotRuns] error: ' + JSON.stringify(err));
                    } else {
                        konsole.log(req, '[Bot - schedulePeriodicBotRuns] found ' + bots.length + ' bots');

                        bots.forEach(function BOTSchedulePeriodicBotRunsApply(bot) {

                            // define what will get run when the schedule fires
                            function botIntegrator() {
                                var integrationClass = require('./integrationClass.js');
                                integrationSearchClass.findPendingIntegrations(req, function BOTSchedulePeriodicBotRunsFindPendingIntegrations(err, docs) {

                                    if (!docs.some(function BOTSchedulePeriodicBotRunsFindPendingIntegrationsApply(integration) {
                                            return integration.bot._id === bot._id;
                                        })) {
                                        konsole.log(req, '[Bot - schedulePeriodicBotRuns] Adding integration for bot "' + bot.name + '" according to schedule');
                                        integrationClass.addPendingIntegration(null, bot._id, false, function BOTSchedulePeriodicBotRunsAddPendingIntegration(err) {
                                            if (err) {
                                                konsole.error(req, '[Bot - schedulePeriodicBotRuns] Error creating scheduled integration: ' + JSON.stringify(err));
                                            }
                                        });
                                    } else {
                                        konsole.log(req, '[Bot - schedulePeriodicBotRuns] Skipping adding integration for bot "' + bot.name + '" since a pending integration already exists');
                                    }
                                });
                            }

                            // Skip bots generated via unit tests
                            if (undefined === bots[k.XCSUnitTestHeader]) {
                                if (bot.configuration.scheduleType === k.XCSBotScheduleType.periodic.value) { // periodic
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
                            }
                        });
                    }
                });
            });
        }

    });

};

XCSBotClass.prototype.scheduleCommitPolling = function scheduleCommitPolling(req) {

    var self = this;

    xcsutil.checkIfRequestCanBeServiced(function (err, isInitPhaseOn, isInitPhaseOnManual, serviceIsEnabled) {

        if (err) {
            konsole.log(req, '[Bot - scheduleCommitPolling] skipping. Reason: ' + JSON.stringify(err));
        } else if (('1' === isInitPhaseOn) || ('1' === isInitPhaseOnManual)) {
            konsole.log(req, '[Bot - scheduleCommitPolling] skipping. Reason: xcsd is still in the init phase.');
        } else if (false === serviceIsEnabled) {
            konsole.log(req, '[Bot - scheduleCommitPolling] skipping. Reason: xcsd is disabled.');
        } else {
            // forward just the requestUUID, for logging purposes
            var args = (req && req.requestUUID) ? [{
                requestUUID: req.requestUUID,
                headers: req.headers,
                url: req.url
    }] : [];

            delegation.invoke('scheduleCommitPolling', req, args, function BOTScheduleCommitPolling() {
                konsole.log(req, '[Bot - scheduleCommitPolling] Rebuilding poll-for-commit schedule');

                function checkBotsForUpdates() {
                    konsole.log(req, '[Bot - scheduleCommitPolling] Checking bots for SCM updates');

                    self.listAllBots(req, function BOTScheduleCommitPollingListAllBots(err, bots) {
                        if (err) {
                            konsole.error(req, '[Bot - scheduleCommitPolling] error while checking bots for updates: ' + JSON.stringify(err));
                        } else {
                            konsole.log(req, '[Bot - scheduleCommitPolling] Found ' + bots.length + ' bots.');

                            bots.forEach(function BOTScheduleCommitPollingApply(bot) {

                                // Skip bots generated via unit tests
                                if (undefined === bots[k.XCSUnitTestHeader]) {
                                    var scheduleType = bot.configuration.scheduleType;
                                    konsole.log(req, '[Bot - scheduleCommitPolling] Bot "' + bot.name + '" schedule type: ' + xcsutil.stringForScheduleType(scheduleType));
                                    if (scheduleType === k.XCSBotScheduleType.onCommit.value) { // on commit
                                        konsole.log(req, '[Bot - scheduleCommitPolling] Bot "' + bot.name + '": checking for updates');
                                        checkBotForUpdates(req, bot);
                                    }
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

module.exports = new XCSBotClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function createBot_internal(req, res, self, body, addKeychainItem, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - createBot_internal] creating bot';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!body) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'The body is empty'
        });
    }

    // Strip the authentication information out of the blueprint
    var authedBlueprint = body.configuration.sourceControlBlueprint;

    async.waterfall([

    function BOTCreateRemoveCredentialsFromBlueprint(callback) {
                bridge.sourceControl.removeCredentialsFromBlueprint(authedBlueprint, function BOTCreateRemoveCredentialsFromBlueprintCallback(errMessage, cleanBlueprint) {
                    if (errMessage) {
                        callback({
                            status: 500,
                            message: 'Internal Server Error (xcsbridge): ' + errMessage
                        });
                    } else {
                        callback(null, cleanBlueprint);
                    }
                });
        },
            function BOTCreateValidateBot(cleanBlueprint, callback) {
                bridge.core.validate('XCSBot', body, function BOTCreateValidateBotCallback(err, validationErrors) {
                    if (err) {
                        // If err, something went really wrong here, probably a programming error
                        callback({
                            status: 500,
                            message: 'Internal Server Error (xcsbridge): ' + JSON.stringify(err)
                        });
                    } else {
                        if (validationErrors && validationErrors.length > 0) {
                            // If (validationErrors && validationErrors.length > 0), the body content failed validation
                            callback({
                                status: 400,
                                message: validationErrors[0],
                                reasons: validationErrors
                            });
                        } else {
                            // All clear
                            callback(null, cleanBlueprint);
                        }
                    }

                });
        },
            function BOTCreateDocument(cleanBlueprint, callback) {
                // Swap in the clean blueprint
                body.configuration.sourceControlBlueprint = cleanBlueprint;

                // Add the sequential integration counter
                body.integration_counter = 1;

                dbCoreClass.createDocument(req, k.XCSDesignDocumentBot, body, function BOTCreateDocumentCallback(err, url, newBot) {
                    if (err) {
                        callback(err);
                    } else {
                        redisClass.delDynamicQuery(req, k.XCSDesignDocumentBot);
                        callback(null, url, newBot);
                    }
                });
        },
            function BOTCreateStoreBlueprintInKeychain(url, newBot, callback) {
                if (addKeychainItem) {
                    // Store the auth'd blueprint in the keychain
                    var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
                    keychain.addItem(req, k.XCSKeychainTemplate, JSON.stringify(authedBlueprint), newBot._id, null, function BOTCreateStoreBlueprintInKeychainCallback(errMessage) {
                        if (errMessage) {
                            callback({
                                status: 500,
                                message: errMessage
                            });
                        } else {
                            callback(null, url, newBot);
                        }
                    });
                } else {
                    callback(null, url, newBot);
                }
        }
        ],
        function BOTCreateFinalizer(err, url, newBot) {
            if (err) {
                err.message = '[Bot - create] Error: ' + JSON.stringify(err);
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, err);
            } else {

                // Reschedule
                self.schedulePeriodicBotRuns(req);

                // emit a notification
                te.broadcast(k.XCSIsListenerForBotUpdates, k.XCSEmitNotificationBotCreated, {
                    _id: newBot._id
                });

                xcsutil.logLevelDec(req);

                res.set(k.XCSResponseLocation, url);

                return xcsutil.safeCallback(cb, null, newBot);
            }
        });

}

function removeAssetDirectory(req, botUUID, cb) {

    var functionTitle = '[Bot - removeAssetDirectory] removeAssetDirectory';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    fs.readdir(k.XCSIntegrationAssets, function BOTRemoveAssetDirectoryReadDir(err, files) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var dirFound = files.some(function BOTRemoveAssetDirectoryApply(dir) {
                var pathTest = new RegExp('^' + botUUID);

                if (pathTest.test(dir)) {
                    xcsutil.removeDirectory(path.join(k.XCSIntegrationAssets, dir), cb);
                    return true;
                }

                return false;
            });

            if (!dirFound) {
                return xcsutil.safeCallback(cb, {
                    status: 404,
                    message: 'Not found: could not find asset directory for bot'
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
        integrationClass = require('./integrationClass.js');

    integrationSearchClass.findIntegrationsForBotWithQuery(req, k.XCSDesignDocumentViewIntegrationsByBot, botUUID, query, false, function BOTRemoveBotIntegrationsFind(err, integrations) {
        if (err && err.status !== 404) {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else if (!integrations) {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb);
        } else {
            async.each(integrations, function BOTRemoveBotIntegrationsApply(theIntegration, cb) {
                integrationClass.removeIntegration(req, theIntegration, cb);
            }, function BOTRemoveBotIntegrationsCallbackFinalizer() {
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb);
            });
        }
    });
}

function checkBotForUpdates(req, bot) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot - checkBotForUpdates] checkBotForUpdates for bot: ' + bot.name;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (bot.lastRevisionBlueprint) {
        var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
        keychain.findItem(req, k.XCSKeychainTemplate, bot._id, function BOTCheckBotForUpdatesFindItem(err, blueprintBuf) {
            if (err) {
                konsole.error(req, '[Bot - checkBotForUpdates] Error fetching authenticated blueprint from keychain using (' + k.XCSKeychainTemplate + '/' + bot._id + '). Reason: ' + JSON.stringify(err));
                xcsutil.logLevelDec(req);
                return;
            }

            var authedBlueprint = JSON.parse(blueprintBuf.toString('utf8'));
            bridge.sourceControl.merge(bot.lastRevisionBlueprint, authedBlueprint, function BOTCheckBotForUpdatesSourceMerge(err, mergedBlueprint) {
                if (err) {
                    konsole.error(req, '[Bot - checkBotForUpdates] Error merging blueprints. Reason : ' + JSON.stringify(err));
                    xcsutil.logLevelDec(req);
                    return;
                }

                konsole.log(req, '[Bot - checkBotForUpdates] Checking if bot "' + bot.name + '" has any updates available');

                bridge.sourceControl.checkForUpdates(mergedBlueprint, function BOTCheckBotForUpdatesSourceCheckForUpdates(err, result) {
                    if (err) {
                        konsole.error(req, '[Bot - checkBotForUpdates] Error checking for updates. Reason: ' + JSON.stringify(err));
                        xcsutil.logLevelDec(req);
                        return;
                    } else if (result.hasUpdates) {

                        konsole.log(req, '[Bot - checkBotForUpdates] Bot ' + bot.name + ' has updates available.');

                        integrationSearchClass.findPendingIntegrations(req, function BOTCheckBotForUpdatesFindPendingIntegrations(err, docs) {

                            //Add a pending integration for the specified bot ID *only* if we don't have one pending already
                            if (!docs.some(function BOTCheckBotForUpdatesFindPendingIntegrationsApply(integration) {
                                    xcsutil.logLevelDec(req);
                                    return integration.bot._id === bot._id;
                                })) {

                                konsole.log(req, '[Bot - checkBotForUpdates] Adding integration for bot ' + bot.name);

                                require('./integrationClass.js').addPendingIntegration(req, bot._id, false, function BOTCheckBotForUpdatesAddPendingIntegration(err) {
                                    if (err) {
                                        konsole.error(req, '[Bot - checkBotForUpdates] Unable to integrate bot "' + bot.name + '". Reason: ' + JSON.stringify(err));
                                    } else {
                                        konsole.log(req, '[Bot - checkBotForUpdates] Integration for bot "' + bot.name + '" added successfully.');
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
                        konsole.log(req, '[Bot - checkBotForUpdates] Bot "' + bot.name + '" has no updates available.');
                        xcsutil.logLevelDec(req);
                        return;
                    }
                });
            });
        });
    } else {
        konsole.log(req, '[Bot - checkBotForUpdates] Bot "' + bot.name + '" doesn\'t have a last revision blueprint. Skipping update.');
        xcsutil.logLevelDec(req);
        return;
    }
}

function uniqueBotNameWithValue(req, existingBotName, self, cb) {

    function isBotNameUnique(uniqueName, botList, isBotNameUniqueCallback) {
        async.filter(botList, function (bot, filterCallback) {
            filterCallback(bot.name === uniqueName);
        }, function (results) {
            isBotNameUniqueCallback(results);
        });
    }

    self.listAllBots(req, function (err, botList) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var uniqueName,
                nameIsUnique = false,
                index = 0;

            async.until(function () {
                return (true === nameIsUnique);
            }, function (untilCallback) {

                if (0 === index) {
                    uniqueName = existingBotName;
                } else {
                    uniqueName = existingBotName + '-' + index;
                }

                isBotNameUnique(uniqueName, botList, function (results) {
                    nameIsUnique = (0 === results.length);
                    index += 1;
                    return xcsutil.safeCallback(untilCallback);
                });

            }, function (err) {
                return xcsutil.safeCallback(cb, err, uniqueName);
            });
        }
    });
}