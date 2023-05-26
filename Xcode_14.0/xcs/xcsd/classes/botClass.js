/*
    XCSBotClass
    A class dedicated to interact with bot operations.
*/

'use strict';

var async = require('async'),
    fs = require('fs'),
    path = require('path'),
    config = require('config'),
    _ = require('underscore');

var k = require('../constants.js'),
    Errors = require('../util/error.js'),
    bridge = require('../util/xcsbridge.js'),
    security = require('../util/xcssecurity.js'),
    scheduler = require('../util/scheduler.js'),
    te = require('../util/turboevents.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    botStatsClass = require('./botStatsClass.js'),
    integrationSearchClass = require('./integrationSearchClass.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('./redisClass.js');

var repositoryKeychain = security.openKeychain(config.get('keychain.repositories'));

/* XCSBotClass object */

function XCSBotClass() {}

XCSBotClass.prototype.create = function create(req, res, next) {
    var functionTitle = '[Bot - create] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        body = req.body;

    createBot_internal(req, res, self, body, true, function (err, newBot) {
        xcsutil.profilerSummary(req);
        if (err) {
            return next(err);
        } else {
            return xcsutil.standardizedResponse(res, 201, newBot);
        }
    });

};

XCSBotClass.prototype.duplicate = function duplicate(req, res, next) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot - duplicate] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        botUUID = req.params.id,
        body = req.body,
        oldBot,
        newBot;

    log.info('Duplicating bot', botUUID);

    async.waterfall([
        function (callback) {
                self.findBotWithUUID(req, botUUID, callback);
        },
        function (bot, callback) {
                oldBot = JSON.parse(JSON.stringify(bot));

                var keys = Object.keys(body);
                if (keys.length > 0) {
                    for (var key in body) {
                        if (body.hasOwnProperty(key)) {
                            xcsutil.upsertValueForKeyPathInObject(bot, key, body[key]);
                        }
                    }

                }

                bot.duplicatedFrom = bot._id;

                // Initialize the state of the bot to a pristine condition
                delete bot._id;
                delete bot._rev;
                delete bot.lastRevisionBlueprint;
                bot.integration_counter = 1;
                callback(null, bot);
        },
        function (bot, callback) {
                log.debug('Uniquifying bot name', bot.name, 'if needed');
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
        function (bot, callback) {
                newBot = bot;
                self.findBlueprintForBot(req, oldBot, callback);
        },
        function (blueprintBuf, callback) {
                var accountName = newBot.sourceControlBlueprintIdentifier || k.XCSKeychainTemplate;
                repositoryKeychain.addItem(req, accountName, blueprintBuf, newBot._id, null, callback);
        }],
        function (err) {
            xcsutil.profilerSummary(req);
            if (err) {
                return next(err);
            } else {
                return xcsutil.standardizedResponse(res, 201, newBot);
            }
        });

};

XCSBotClass.prototype.findBotWithUUID = function findBotWithUUID(req, botUUID, cb) {
    cb = xcsutil.callback(cb);
    var log = logger.withRequest(req),
        functionTitle = '[Bot - findBotWithUUID] find bot with UUID: ' + botUUID;

    log.info('Fetching bot', botUUID);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!botUUID) {
        return cb(new Errors.BadRequest('Could not find bot by identifier because no identifier was given.'));
    }

    dbCoreClass.findDocumentWithUUID(req, botUUID, k.XCSDesignDocumentBot, cb);
};

XCSBotClass.prototype.nextBotIntegrationNumber = function nextBotIntegrationNumber(req, botUUID, cb) {
    cb = xcsutil.callback(cb);
    var log = logger.withRequest(req),
        functionTitle = '[Bot - nextBotIntegrationNumber] find the next bot integration number';

    log.info('Claiming next integration number for bot', botUUID);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!botUUID) {
        return cb(new Errors.BadRequest('Could not increment integration number for bot because no bot identifier was given.'));
    }

    function fetchBotAndIncrementIntegrationNumber(botUUID, cb) {
        dbCoreClass.findDocumentWithUUIDUsingOptionalCaching(req, botUUID, k.XCSDesignDocumentBot, false, function BOTFetchBotAndIncrementIntegrationNumberFindDocument(err, existingBot) {
            if (err) {
                return cb(err);
            } else {
                var assumedNextIntegrationNumber = existingBot.integration_counter,
                    changes = {
                        integration_counter: assumedNextIntegrationNumber + 1,
                        _rev: existingBot._rev
                    };

                log.debug('Updating bot', existingBot._id, 'with changes:', changes);

                dbCoreClass.updateDocumentWithUUID(req, existingBot._id, changes, true, k.XCSDesignDocumentBot, function BOTFetchBotAndIncrementIntegrationNumberUpdateDocument(err) {
                    if (err) {
                        if (409 === err.status) {
                            fetchBotAndIncrementIntegrationNumber(botUUID, cb);
                        } else {
                            return cb(err);
                        }
                    } else {
                        log.info('Next integration number assigned:', assumedNextIntegrationNumber);
                        return cb(null, existingBot, assumedNextIntegrationNumber);
                    }
                });
            }
        });
    }

    fetchBotAndIncrementIntegrationNumber(botUUID, cb);
};

XCSBotClass.prototype.findBot = function findBot(req, res, next) {
    var functionTitle = '[Bot - findBot] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id,
        self = this;

    self.findBotWithUUID(req, botUUID, function BOTFindBot(err, bot) {
        xcsutil.profilerSummary(req);
        if (err) {
            if (err instanceof Errors.NotFound) {
                err = new Errors.NotFound('The requested bot could not be found because it does not exist.');
            }
            next(err);
        } else {
            return xcsutil.standardizedResponse(res, 200, bot);
        }
    });

};

XCSBotClass.prototype.listAllBots = function listAllBots(req, cb) {

    var log = logger.withRequest(req),
        functionTitle,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    log.info('Fetching all bots.');

    if (req) {
        functionTitle = '[Bot - listAllBots] ' + req.method + ' ' + req.url;
    } else {
        functionTitle = '[Bot - listAllBots] list all bots';
    }

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    redisClass.getDynamicQuery(req, k.XCSDesignDocumentBot, function BOTListAllBotsRedisGetDynamicQuery(err, docs) {
        if (err) {
            opFailed(err);
        } else if (docs) {
            docs = JSON.parse(docs);
            log.info('Found', docs.length, 'bots in Redis.');
            opSucceeded(docs);
        } else {
            log.debug('No bots found cached in Redis, fetching from CouchDB instead.');

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
                    log.info('Found', docs.length, 'bots in CouchDB.');
                    redisClass.setDynamicQuery(req, k.XCSDesignDocumentBot, JSON.stringify(docs), function BOTListAllBotsRedisSetDynamicQuery(err, wasSaved) {
                        if (wasSaved) {
                            log.debug('Successfully cached fetched bots in Redis.');
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
        return xcsutil.safeCallback(cb, err);
    }

    function opSucceeded(docs) {
        return xcsutil.safeCallback(cb, null, docs);
    }

};

XCSBotClass.prototype.list = function list(req, res) {

    var self = this;

    var functionTitle = '[Bot - list] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.listAllBots(req, function BOTListAllBots(err, bots) {
        if (err) {
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedResponse(res, 200, bots);
        }

    });

};

XCSBotClass.prototype.stats = function stats(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot - stats] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id,
        on_date = req.query.on_date,
        since_date = req.query.since_date,
        self = this;

    log.info('Loading statistics for bot', botUUID);

    if (!botUUID) {
        xcsutil.profilerSummary(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the bot ID has not been specified'
        });
    }

    function obtainStats() {
        async.parallel({

                lastCleanIntegration: function BOTStatsLastCleanIntegration(cb) {
                    var timeLastCleanIntegration = new Date().getTime();
                    botStatsClass.lastCleanIntegration(req, botUUID, on_date, since_date, function BOTStatsLastCleanIntegrationCallback(err, object) {
                        log.debug('#BotStats lastCleanIntegration took:', new Date().getTime() - timeLastCleanIntegration, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, object);
                        } else {
                            err.message = err.message + ' Bot stat: lastCleanIntegration';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                bestSuccessStreak: function (cb) {
                    var timeBestSuccessStreak = new Date().getTime();
                    botStatsClass.bestSuccessStreak(req, botUUID, on_date, since_date, function BOTStatsBestSuccessStreak(err, object) {
                        log.debug('#BotStats bestSuccessStreak took:', new Date().getTime() - timeBestSuccessStreak, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, object);
                        } else {
                            err.message = err.message + ' Bot stat: bestSuccessStreak';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                numberOfIntegrations: function (cb) {
                    var timeNumberOfIntegrations = new Date().getTime();
                    botStatsClass.numberOfIntegrations(req, botUUID, on_date, since_date, function BOTStatsNumberOfIntegrations(err, sum) {
                        log.debug('#BotStats numberOfIntegrations took:', new Date().getTime() - timeNumberOfIntegrations, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, sum);
                        } else {
                            err.message = err.message + ' Bot stat: numberOfIntegrations';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                numberOfCommits: function (cb) {
                    var timeNumberOfCommits = new Date().getTime();
                    botStatsClass.numberOfCommits(req, botUUID, on_date, since_date, function BOTStatsNumberOfCommits(err, sumOfCommits) {
                        log.debug('#BotStats numberOfCommits took:', new Date().getTime() - timeNumberOfCommits, 'ms');
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, sumOfCommits);
                        } else {
                            err.message = err.message + ' Bot stat: numberOfCommits';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                averageIntegrationTime: function (cb) {
                    var timeAverageIntegrationTime = new Date().getTime();
                    botStatsClass.averageIntegrationTime(req, botUUID, on_date, since_date, function BOTStatsAverageIntegrationTime(err, averageIntegrationTimeObject) {
                        log.debug('#BotStats averageIntegrationTime took:', new Date().getTime() - timeAverageIntegrationTime, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, averageIntegrationTimeObject);
                        } else {
                            err.message = err.message + ' Bot stat: averageIntegrationTime';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                testAdditionRate: function (cb) {
                    var timeTestAdditionRate = new Date().getTime();
                    botStatsClass.testAdditionRate(req, botUUID, on_date, since_date, function BOTStatsTestAdditionRate(err, testAdditionRateObject) {
                        log.debug('#BotStats testAdditionRate took:', new Date().getTime() - timeTestAdditionRate, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, testAdditionRateObject.sum);
                        } else {
                            err.message = err.message + ' Bot stat: testAdditionRate';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                analysisWarnings: function (cb) {
                    var timeAnalysisWarningStats = new Date().getTime();
                    botStatsClass.analysisWarningStats(req, botUUID, on_date, since_date, function BOTStatsAnalysisWarnings(err, analysisWarningObject) {
                        log.debug('#BotStats analysisWarningStats took:', new Date().getTime() - timeAnalysisWarningStats, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, analysisWarningObject);
                        } else {
                            err.message = err.message + ' Bot stat: analysisWarnings';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                testFailures: function (cb) {
                    var timeTestFailureStats = new Date().getTime();
                    botStatsClass.testFailureStats(req, botUUID, on_date, since_date, function BOTStatsTestFailures(err, testFailureObject) {
                        log.debug('#BotStats testFailureStats took:', new Date().getTime() - timeTestFailureStats, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, testFailureObject);
                        } else {
                            err.message = err.message + ' Bot stat: testFailures';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                errors: function (cb) {
                    var timeErrorStats = new Date().getTime();
                    botStatsClass.errorStats(req, botUUID, on_date, since_date, function BOTStatsErrors(err, errorObject) {
                        log.debug('#BotStats lastCleanIntegration took:', new Date().getTime() - timeErrorStats, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, errorObject);
                        } else {
                            err.message = err.message + ' Bot stat: errors';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                regressedPerfTests: function (cb) {
                    var timeRegressedPerfTestStats = new Date().getTime();
                    botStatsClass.regressedPerfTestStats(req, botUUID, on_date, since_date, function BOTStatsRegressedPerfTests(err, regressedPerfTestObject) {
                        log.debug('#BotStats lastCleanIntegration took:', new Date().getTime() - timeRegressedPerfTestStats, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, regressedPerfTestObject);
                        } else {
                            err.message = err.message + ' Bot stat: regressedPerfTests';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                warnings: function (cb) {
                    var timeWarningStats = new Date().getTime();
                    botStatsClass.warningStats(req, botUUID, on_date, since_date, function BOTStatsWarnings(err, warningObject) {
                        log.debug('#BotStats lastCleanIntegration took:', new Date().getTime() - timeWarningStats, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, warningObject);
                        } else {
                            err.message = err.message + ' Bot stat: warnings';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                improvedPerfTests: function (cb) {
                    var timeImprovedPerfTestStats = new Date().getTime();
                    botStatsClass.improvedPerfTestStats(req, botUUID, on_date, since_date, function BOTStatsImprovedPerfTests(err, improvedPerfTestObject) {
                        log.debug('#BotStats lastCleanIntegration took:', new Date().getTime() - timeImprovedPerfTestStats, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, improvedPerfTestObject);
                        } else {
                            err.message = err.message + ' Bot stat: improvedPerfTests';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                tests: function (cb) {
                    var timeTestsStats = new Date().getTime();
                    botStatsClass.testsStats(req, botUUID, on_date, since_date, function BOTStatsTests(err, testsObject) {
                        log.debug('#BotStats lastCleanIntegration took:', new Date().getTime() - timeTestsStats, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, testsObject);
                        } else {
                            err.message = err.message + ' Bot stat: tests';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                ccDelta: function (cb) {
                    var timeCCDeltaStats = new Date().getTime();
                    botStatsClass.ccDeltaStats(req, botUUID, on_date, since_date, function BOTStatsTests(err, ccDelta) {
                        log.debug('#BotStats lastCleanIntegration took:', new Date().getTime() - timeCCDeltaStats, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, ccDelta);
                        } else {
                            err.message = err.message + ' Bot stat: ccDelta';
                            return xcsutil.safeCallback(cb, err);
                        }
                    });
                },
                numberOfSuccessfulIntegrations: function (cb) {
                    var timeNumberOfSuccessfulIntegrations = new Date().getTime();
                    botStatsClass.numberOfSuccessfulIntegrations(req, botUUID, on_date, since_date, function BOTStatsTests(err, numberOfSuccessfulIntegrations) {
                        log.debug('#BotStats lastCleanIntegration took:', new Date().getTime() - timeNumberOfSuccessfulIntegrations, 'ms');
                        // Not found is OK...
                        if (!err || (err && (404 === err.status))) {
                            return xcsutil.safeCallback(cb, null, numberOfSuccessfulIntegrations);
                        } else {
                            err.message = err.message + ' Bot stat: numberOfSuccessfulIntegrations';
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
                        codeCoveragePercentageDelta: results.ccDelta,
                        numberOfSuccessfulIntegrations: results.numberOfSuccessfulIntegrations
                    };

                    if (on_date) {
                        result.onDate = on_date;
                    } else if (since_date) {
                        result.sinceDate = since_date;
                    }

                    xcsutil.profilerSummary(req);


                    return xcsutil.standardizedResponse(res, 200, result);
                }
            });
    }

    self.findBotWithUUID(req, botUUID, function BOTUpdateDoPatch(err) {
        if (err) {
            xcsutil.profilerSummary(req);


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
                    log.debug('Obtaining bot statistics for date', on_date);
                } else if (since_date) {
                    since_date = since_date.replace(/[\"]+/g, '');
                    log.debug('Obtaining bot statistics since date', since_date);
                }
            }

            obtainStats();
        }
    });

};

XCSBotClass.prototype.update = function update(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot - update] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var body = xcsutil.patchBodyForClient(req);

    // Verify that the body has been specified
    if (!body) {
        xcsutil.profilerSummary(req);


        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body is empty'
        });
    }

    var botUUID = req.params.id,
        self = this;

    log.info('Updating bot', botUUID);

    // if a blueprint is provided, snag it now...
    var authedBlueprint = body.configuration && body.configuration.sourceControlBlueprint;

    if (req.query.overwriteBlueprint === 'true') {
        // ... and make a copy
        authedBlueprint = JSON.parse(JSON.stringify(authedBlueprint));
        log.debug('Updating SCM blueprint was requested, we will overwrite the existing information.');
    } else if (authedBlueprint) {
        log.debug('Not asked to overwrite SCM blueprint. Will leave SCM information alone.');
        authedBlueprint = null;
        delete body.configuration.sourceControlBlueprint;
    }

    function finishUpdate(bot) {
        log.debug('Saving bot', botUUID);
        dbCoreClass.updateDocumentWithUUID(req, botUUID, bot, false, k.XCSDesignDocumentBot, function BOTUpdateDocument(err, body) {
            if (err) {
                xcsutil.profilerSummary(req);


                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                redisClass.delDynamicQuery(req, k.XCSDesignDocumentBot, function () {
                    // reschedule
                    self.reschedulePeriodicBotRuns(req);

                    // emit a notification
                    log.info('Notifying listeners of updated bot.');
                    te.broadcast(k.XCSIsListenerForBotUpdates, k.XCSEmitNotificationBotUpdated, {
                        _id: botUUID
                    });

                    xcsutil.profilerSummary(req);
                    return xcsutil.standardizedResponse(res, 200, body);
                });
            }
        });
    }

    function doPatch() {
        self.findBotWithUUID(req, botUUID, function BOTUpdateDoPatch(err, bot) {
            if (err) {
                xcsutil.profilerSummary(req);
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

            log.debug('Validating bot updates.');
            bridge.core.validate('XCSBot', bot, function BOTUpdateDoPatchValidateBot(err, validationErrors) {
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
                        // Store the auth'd blueprint in the keychain, if we were asked to
                        if (authedBlueprint && !authedBlueprint.DVTSourceControlWorkspaceBlueprintDontUpdate) {

                            log.debug('Updating SCM credentials.');
                            xcsutil.makeUUID(function (err, keychainUUID) {

                                // merge in any credentials we already had.
                                self.findBlueprintForBot(req, bot, function BOTUpdateFindKeychainTemplate(err, blueprintBuf) {
                                    function botUpdateReplaceKeychainItem(newBlueprint) {
                                        repositoryKeychain.addItem(req, keychainUUID, JSON.stringify(newBlueprint), botUUID, null, function BOTUpdateDocumentAddItemToKeychain(errMessage) {
                                            if (errMessage) {
                                                xcsutil.profilerSummary(req);


                                                return xcsutil.standardizedErrorResponse(res, {
                                                    status: 500,
                                                    message: 'Internal Server Error (keychain): ' + errMessage
                                                });
                                            } else {
                                                log.debug('Successfully saved SCM information under identifier', keychainUUID);
                                                bot.sourceControlBlueprintIdentifier = keychainUUID;
                                                finishUpdate(bot);
                                            }
                                        });
                                    }

                                    if (err) {
                                        log.warn('Could not find existing SCM credentials. Will simply add new credentials without merging.', err);
                                        botUpdateReplaceKeychainItem(authedBlueprint);
                                    } else {
                                        log.debug('Merging existing credentials with new SCM blueprint.');
                                        var oldBlueprint = JSON.parse(blueprintBuf.toString('utf8'));

                                        bridge.sourceControl.getMissingCredentials(authedBlueprint, oldBlueprint, function (err, newBlueprint) {
                                            if (err) {
                                                log.warn('Could not merge in missing credentials. Will simply add new credentials anyway.', err);
                                                // with an error, just use the blueprint we were given.
                                                botUpdateReplaceKeychainItem(authedBlueprint);
                                            } else {
                                                log.debug('Successfully merged in missing credentials. Saving SCM information.');
                                                botUpdateReplaceKeychainItem(newBlueprint);
                                            }
                                        });
                                    }
                                });
                            });

                        } else {
                            finishUpdate(bot);
                        }
                    }
                }
            });
        });

    }

    // Strip the authentication information out of the blueprint if one is provided
    if (authedBlueprint && !authedBlueprint.DVTSourceControlWorkspaceBlueprintDontUpdate) {
        log.debug('SCM information was provided. Stripping sensitive information for saving on bot.');
        bridge.sourceControl.removeCredentialsFromBlueprint(authedBlueprint, function BOTUpdateRemoveCredentialsFromBlueprint(errMessage, cleanBlueprint) {

            if (errMessage) {
                xcsutil.profilerSummary(req);


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

    var log = logger.withRequest(req),
        functionTitle = '[Bot - remove] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        botUUID = req.params.id,
        botRev = req.params.rev;

    function doRemove() {
        log.info('Removing bot', botUUID, 'with revision', botRev);

        dbCoreClass.removeDocument(req, botUUID, botRev, function BOTRemoveDocument(err) {
            if (err) {
                if (409 === err.status) {
                    // Retrieve the bot to be patched
                    self.findBotWithUUID(req, botUUID, function BOTRemoveDocumentFindBot(err, bot) {
                        if (err) {
                            xcsutil.profilerSummary(req);

                            // Perhaps the document doesn't exist any longer?
                            // In any event, there is little we can do about this now.

                            return xcsutil.standardizedErrorResponse(res, err);
                        } else {
                            // Reset the revision we've just obtained
                            log.debug('Conflict trying to remove', botUUID, 'so retrying.');
                            botRev = bot._rev;
                            return doRemove();
                        }
                    });
                } else {
                    xcsutil.profilerSummary(req);
                    return xcsutil.standardizedErrorResponse(res, err);
                }
            } else {
                redisClass.delDynamicQuery(req, k.XCSDesignDocumentBot, function () {
                    // reschedule
                    self.reschedulePeriodicBotRuns(req);

                    // emit a notification
                    te.broadcast(k.XCSIsListenerForBotUpdates, k.XCSEmitNotificationBotRemoved, {
                        _id: botUUID
                    });

                    require('./backgroundQueue.js').enqueue('bg', 'cleanDeletedBot', [botUUID], function () {
                        xcsutil.profilerSummary(req);
                        return xcsutil.standardizedResponse(res, 204);
                    });
                });
            }
        });
    }

    // Deleting the blueprint must happen first, because we need the bot to still exist to know which keychain item is correct.
    log.debug('Deleting blueprint for bot', botUUID);
    log.debug('foo', self.deleteBlueprintForBot);

    self.deleteBlueprintForBot(req, botUUID, () => {
        log.debug('Checking if there are assets to remove for bot', botUUID);

        // Move aside the asset directory immediately so files can no longer be downloaded for this bot (we'll delete them later).
        const assetsPath = config.get('path.assets');
        fs.readdir(assetsPath, (err, files) => {
            if (err) {
                doRemove();
            } else {
                log.info('Moving asset directory for bot', botUUID, 'aside #DeleteBot');

                const pathTest = new RegExp('^' + botUUID);
                let dirFound = files.find(dir => pathTest.test(dir));

                if (dirFound) {
                    let fullPath = path.join(assetsPath, dirFound);
                    log.debug('Found asset directory at', fullPath, '#DeleteBot');
                    xcsutil.movePath(fullPath, fullPath + '.deleted', doRemove);
                } else {
                    log.debug('No asset directory found, removing bot. #DeleteBot');
                    doRemove();
                }
            }
        });
    });
};

XCSBotClass.prototype.cleanDeletedBot = function cleanDeletedBot(botID, cb) {

    logger.debug('Cleaning deleted bot', botID, ' #DeleteBot');

    removeBotIntegrations(null, botID, function (err) {
        if (err && err.status !== 404) {
            logger.error('Could not remove integrations for bot:', err, ' #DeleteBot');
        }

        logger.debug('Removing asset directory for bot', botID, ' #DeleteBot');

        removeAssetDirectory(null, botID, function (err) {
            if (err && err.status !== 404) {
                logger.error('Could not remove asset directory for bot:', err, ' #DeleteBot');
            }

            cb();
        });
    });
};

XCSBotClass.prototype.removeAll = function removeAll(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot - removeAll] ' + req.method + ' ' + req.url;

    log.info('Removing all bots.');

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


            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            redisClass.delDynamicQuery(req, k.XCSDesignDocumentBot, function () {
                // reschedule
                self.reschedulePeriodicBotRuns(req);

                xcsutil.profilerSummary(req);

                return xcsutil.standardizedResponse(res, 204);
            });
        }
    });

};

XCSBotClass.prototype.preflight = function preflight(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot - preflight] ' + req.method + ' ' + req.url;

    log.info('Preflighting source control credentials for new bot.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    bridge.sourceControl.preflight(req.body, function BOTPreflight(err, result) {
        xcsutil.profilerSummary(req);


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

    var log = logger.withRequest(req),
        functionTitle = '[Bot - listBranches] ' + req.method + ' ' + req.url;

    log.info('Preflighting source control credentials and listing branches.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var blueprint = req.body;
    var skip = [];

    if (req.body.blueprint) {
        blueprint = req.body.blueprint;
        skip = req.body.skipRepositories || [];
    }

    bridge.sourceControl.listBranches(blueprint, skip, function BOTListBranches(err, result) {
        xcsutil.profilerSummary(req);


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

    var log = logger.withRequest(req),
        functionTitle = '[Bot - reflight] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        botUUID = req.params.id;

    log.info('Validating currently saved SCM credentials for bot', botUUID);

    async.waterfall([
        function (cb) {
            self.findBotWithUUID(req, botUUID, cb);
        },
        function (bot, cb) {
            self.findBlueprintForBot(req, bot, function (err, blueprintBuf) {
                if (err) {
                    err.message = 'Error while looking up keychain item for bot: ' + botUUID + ' Reason: ' + err.message;
                }
                cb(err, blueprintBuf);
            });
        },
        function (blueprintBuf, cb) {
            var blueprint = JSON.parse(blueprintBuf.toString('utf8'));
            bridge.sourceControl.preflight(blueprint, function (err, result) {
                if (err) {
                    log.error('Error while preflighting blueprint. Reason: ', err.message);
                }
                cb(err, result);
            });
        }
    ], function (err, result) {
        xcsutil.profilerSummary(req);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, result);
        }
    });
};

XCSBotClass.prototype.reflightBranches = function reflightBranches(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot - reflightBranches] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        botUUID = req.params.id,
        clientBlueprint = req.body,
        skip = [];

    if (req.body.blueprint) {
        clientBlueprint = req.body.blueprint;
        skip = req.body.skipRepositories || [];
    }

    log.info('Validating currently saved SCM credentials for bot', botUUID, 'and listing branches.');

    async.waterfall([
        function BOTReflightFindBot(cb) {
            self.findBotWithUUID(req, botUUID, cb);
        },
        function BOTReflightFindItem(bot, cb) {
            self.findBlueprintForBot(req, bot, (err, blueprintBuf) => {
                if (err) {
                    log.warn('Could not load existing blueprint to reuse credentials:', err);
                    cb(null, null);
                } else {
                    cb(err, blueprintBuf);
                }
            });
        },
        function BOTReflightMergeBlueprint(blueprintBuf, cb) {
            if (!blueprintBuf) {
                return cb(null, clientBlueprint);
            }

            var blueprint = JSON.parse(blueprintBuf.toString('utf8'));
            if (clientBlueprint && Object.keys(clientBlueprint).length > 0) {
                log.debug('Received a blueprint in the request, merging in existing credentials.');
                bridge.sourceControl.getMissingCredentials(clientBlueprint, blueprint, cb);
            } else {
                return xcsutil.safeCallback(cb, null, blueprint);
            }
        },
        function BOTReflightListBranches(blueprint, cb) {
            bridge.sourceControl.listBranches(blueprint, skip, cb);
        }
    ], function (err, result) {
        xcsutil.profilerSummary(req);

        if (err) {
            log.error('Error validating existing SCM credentials:', err);
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: 'Internal Server Error (xcsbridge): ' + err.message
            });
        } else {
            return xcsutil.standardizedResponse(res, 200, result);
        }
    });
};

XCSBotClass.prototype.reschedulePeriodicBotRuns = function (req) {
    var log = logger.withRequest(req);

    log.debug('Enqueuing job to rebuild periodic bot run schedule.');

    require('./backgroundQueue.js').enqueue('scheduler', 'periodic');
    require('./backgroundQueue.js').enqueue('scheduler', 'emailReportPeriodic');
};

XCSBotClass.prototype.schedulePeriodicBotRuns = function schedulePeriodicBotRuns(req, cb) {
    var log = logger.withRequest(req);

    log.debug('Rebuilding #Periodic bot schedule.');

    // cancel all pending bot schedule tasks
    scheduler.cancelTasksMatchingFilter(task => task.botScheduled);

    // find any bots on the system
    this.listAllBots(req, (err, bots) => {
        if (err) {
            log.error('Error retrieving bots to schedule:', err, '#Periodic');
            cb(err);
        } else {
            log.debug('Found', bots.length, 'bots. #Periodic');

            bots.forEach(bot => {
                var queue = require('./backgroundQueue.js');

                function botIntegrator() {
                    log.debug('Enqueuing integrate job for bot', bot._id);
                    queue.enqueue('bg', 'integrate', [bot._id, bot.name]);
                }

                // Skip bots generated via unit tests
                if (undefined === bot[k.XCSUnitTestHeader]) {
                    if (bot.configuration.scheduleType === k.XCSBotScheduleType.periodic.value) { // periodic
                        log.debug('Bot', bot.name, 'has #Periodic schedule.');
                        var task = null;
                        var minuteString = ((bot.configuration.minutesAfterHourToIntegrate < 10) ? '0' : '') + bot.configuration.minutesAfterHourToIntegrate;

                        // hourly
                        if (bot.configuration.periodicScheduleInterval === 1) {
                            log.debug('Scheduling bot', bot.name, 'hourly at', bot.configuration.minutesAfterHourToIntegrate, 'minutes after the hour. #Periodic');
                            task = scheduler.scheduleHourlyAtTime(bot.configuration.minutesAfterHourToIntegrate, botIntegrator);
                        }

                        // daily
                        else if (bot.configuration.periodicScheduleInterval === 2) {
                            log.debug('Scheduling bot', bot.name, 'daily at', bot.configuration.hourOfIntegration + ':' + minuteString, '#Periodic');
                            task = scheduler.scheduleDailyAtTime(bot.configuration.hourOfIntegration, bot.configuration.minutesAfterHourToIntegrate, botIntegrator);
                        }

                        // weekly
                        else if (bot.configuration.periodicScheduleInterval === 3) {
                            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            var day = (bot.configuration.weeklyScheduleDay % 7); // wrap around Sunday
                            log.debug('Scheduling bot', bot.name, 'weekly on', days[day], 'at', bot.configuration.hourOfIntegration + ':' + minuteString, '#Periodic');
                            task = scheduler.scheduleWeeklyAtTime(day, bot.configuration.hourOfIntegration, bot.configuration.minutesAfterHourToIntegrate, botIntegrator);
                        }

                        // annotate the task so we can find it later
                        if (task) {
                            task.botScheduled = true;
                        }
                    }
                }
            });

            cb();
        }
    });

};

XCSBotClass.prototype.checkBotsForUpdates = function checkBotsForUpdates(req, res) {
    logger.info('Checking bots for SCM updates. #PollForCommit');

    this.listAllBots(null, (err, bots) => {
        if (err) {
            logger.error('Error retrieving bots to check for updates:', err, '#PollForCommit');
            cb(err);
        } else {
            logger.debug('Found', bots.length, 'bots. #PollForCommit');

            async.each(bots, (bot, cb) => {
                // Skip bots generated via unit tests
                if (undefined === bots[k.XCSUnitTestHeader]) {
                    var scheduleType = bot.configuration.scheduleType;
                    logger.debug('Found bot', bot.name, 'with schedule type', xcsutil.stringForScheduleType(scheduleType), '#PollForCommit');
                    if (scheduleType === k.XCSBotScheduleType.onCommit.value) { // on commit
                        return checkBotForUpdates(null, bot, cb);
                    }
                }

                cb();
            }, err => {
                logger.debug('Finished checking bots for for SCM updates. #PollForCommit');
                return xcsutil.standardizedResponse(res, 204);
            });
        }
    });
};

XCSBotClass.prototype.findBlueprintForBot = function findBlueprintForBot(req, bot, cb) {
    cb = xcsutil.callback(cb);
    var log = logger.withRequest(req);

    log.debug('Finding blueprint for bot', bot._id, 'in the keychain.');

    var accountName = accountNameForKeychainItem(req, bot);
    log.debug('Looking up keychain item with account name', accountName, 'for bot', bot._id);

    repositoryKeychain.findItem(req, accountName, bot._id, cb);
};

XCSBotClass.prototype.deleteBlueprintForBot = function deleteBlueprintForBot(req, botID, cb) {
    const log = logger.withRequest(req);
    cb = xcsutil.callback(cb);

    log.debug('Deleting blueprint for bot', botID, 'from the keychain.');

    this.findBotWithUUID(req, botID, (err, bot) => {
        if (err) {
            return cb(err);
        }

        const accountName = accountNameForKeychainItem(req, bot);
        return repositoryKeychain.removeItem(req, accountName, bot._id, () => {
            // ignore any errors, keychain item could already be gone.
            cb();
        });
    });
};

const diffKeys = [
    'buildConfiguration',
    'buildEnvironmentVariables',
    'additionalBuildArguments',
    'builtFromClean',
    'codeCoveragePreference',
    'deviceSpecification',
    'disableAppThinning',
    'exportsProductFromArchive',
    'overrideToolchain',
    'performsAnalyzeAction',
    'performsArchiveAction',
    'performsTestAction',
    'periodicScheduleInterval',
    'scheduleType',
    'schemeName',
    'sourceControlBlueprint',
    'triggers'
];

XCSBotClass.prototype.diffConfiguration = async function diffConfiguration(req, oldBot, newBot) {
    const log = logger.withRequest(req);
    log.debug('Comparing bot configurations to create a diff.');

    if (!oldBot) {
        return {};
    }

    if (oldBot._id !== newBot._id) {
        throw new Error('Cannot create diff between two different bots.');
    }

    let oldConfig = oldBot.configuration;
    let newConfig = newBot.configuration;

    let diffs = {};

    diffKeys.forEach(async (key) => {
        let before = oldConfig[key],
            after = newConfig[key];
        if (!await isEqualForDiff(before, after, key)) {
            diffs[key] = {
                before, after
            };
        }
    });

    return diffs;
};

async function isEqualForDiff(before, after, key) {
    return _.isEqual(await sanitizeForDiff(before, key), await sanitizeForDiff(after, key));
}

async function sanitizeForDiff(value, key) {
    if (key === 'sourceControlBlueprint') {
        let newValue;
        try {
            newValue = await bridge.sourceControl.transformBlueprint(value, {
                authenticationStrategy: false,
                repositoryStates: false
            });
        } catch (e) {
            newValue = _.clone(value);
        }
        delete newValue.DVTSourceControlWorkspaceBlueprintIdentifierKey;
        return newValue;
    }

    return value;
}

XCSBotClass.prototype.combineControlledChanges = function combineControlledChanges(oldChanges, newChanges) {
    return combineChange(oldChanges, newChanges);
};

function applyCombinedChange(key, combinedChanges, oldChanges, newChanges) {
    let combined = combineChange(oldChanges[key], newChanges[key]);
    if (combined) {
        combinedChanges[key] = combined;
    }
}

function combineChanges(oldChanges, newChanges) {
    let keys = _.union(Object.keys(oldChanges), Object.keys(newChanges));
    let changes = {};

    keys.forEach(key => {
        applyCombinedChange(key, changes, oldChanges, newChanges);
    });

    if (_.isEmpty(changes)) {
        return null;
    }

    return changes;
}

function combineChange(oldChange, newChange) {
    if (!newChange) {
        return oldChange;
    }

    if (!oldChange) {
        return newChange;
    }

    // If the value is not a simple before/after pair, it's probably a dictionary of them.
    if (!oldChange.before && !oldChange.after) {
        return combineChanges(oldChange, newChange);
    }

    // If the property was changed back to its original value, that doesn't count as a change.
    if (_.isEqual(oldChange.before, newChange.after)) {
        return null;
    }

    return {
        before: oldChange.before,
        after: newChange.after
    };
}


/* Module exports */

var bot_class = xcsutil.bindAll(new XCSBotClass());
module.exports = bot_class;

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function accountNameForKeychainItem(req, bot) {
    return bot.sourceControlBlueprintIdentifier || k.XCSKeychainTemplate;
}

function createBot_internal(req, res, self, body, addKeychainItem, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot - createBot_internal] creating bot';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!body || Object.keys(body).length === 0) {

        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'The body is empty'
        });
    }

    log.info('Creating bot', body.name);

    // Strip the authentication information out of the blueprint
    var authedBlueprint = body.configuration.sourceControlBlueprint;

    async.waterfall([

        function BOTCreateKeychainUUID(callback) {
                xcsutil.makeUUID(callback);
        },

        function BOTCreateRemoveCredentialsFromBlueprint(keychainUUID, callback) {
                body.sourceControlBlueprintIdentifier = keychainUUID;

                log.debug('Removing authentication credentials from SCM information.');
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
                log.debug('Validating new bot.');
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

                log.debug('Creating bot document.');
                dbCoreClass.createDocument(req, k.XCSDesignDocumentBot, body, function BOTCreateDocumentCallback(err, url, newBot) {
                    if (err) {
                        callback(err);
                    } else {
                        redisClass.delDynamicQuery(req, k.XCSDesignDocumentBot, function () {
                            callback(null, url, newBot);
                        });
                    }
                });
        },
            function BOTCreateStoreBlueprintInKeychain(url, newBot, callback) {
                if (addKeychainItem) {
                    log.debug('Adding bot SCM information to the keychain.');
                    // Store the auth'd blueprint in the keychain
                    repositoryKeychain.addItem(req, newBot.sourceControlBlueprintIdentifier, JSON.stringify(authedBlueprint), newBot._id, null, function BOTCreateStoreBlueprintInKeychainCallback(errMessage) {
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
                err.message = 'Error creating bot: ' + err.message;

                return xcsutil.safeCallback(cb, err);
            } else {

                // Reschedule
                self.reschedulePeriodicBotRuns(req);

                // emit a notification
                log.info('Notifying listeners of newly created bot.');
                te.broadcast(k.XCSIsListenerForBotUpdates, k.XCSEmitNotificationBotCreated, {
                    _id: newBot._id
                });

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

    var assetsPath = config.get('path.assets');

    fs.readdir(assetsPath, function BOTRemoveAssetDirectoryReadDir(err, files) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var dirFound = files.some(function BOTRemoveAssetDirectoryApply(dir) {
                var pathTest = new RegExp('^' + botUUID);

                if (pathTest.test(dir)) {
                    xcsutil.removeDirectory(path.join(assetsPath, dir), cb);
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
    cb = xcsutil.callback(cb);

    var query = {
            key: botUUID,
            include_docs: true
        },
        integrationClass = require('./integrationClass.js');

    integrationSearchClass.findIntegrationsForBotWithQuery(req, k.XCSDesignDocumentViewIntegrationsByBot, botUUID, query, false, (err, integrations) => {
        if (err && err.status !== 404) {
            return cb(err);
        } else if (!integrations) {
            return cb();
        } else {
            async.eachLimit(integrations, 4, (theIntegration, cb) => {
                integrationClass.removeIntegration(req, theIntegration, false, cb);
            }, cb);
        }
    });
}

function checkBotForUpdates(req, bot, cb) {
    cb = xcsutil.callback(cb);

    var functionTitle = '[Bot - checkBotForUpdates] checkBotForUpdates for bot: ' + bot.name,
        log = logger.withRequest(req);

    log.debug('Bot', bot.name, 'has on-commit schedule, checking for updates. #PollForCommit');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (bot.lastRevisionBlueprint) {
        bot_class.findBlueprintForBot(req, bot, (err, blueprintBuf) => {
            if (err) {
                log.error('Error fetching SCM credentials for bot', bot.name, 'from the keychain:', err, '#PollForCommit');
                return cb(err);
            }
            
            var authedBlueprint = JSON.parse(blueprintBuf.toString('utf8'));
            bridge.sourceControl.merge(bot.lastRevisionBlueprint, authedBlueprint, (err, mergedBlueprint) => {
                if (err) {
                    log.error('Could not merge revision blueprint with auth blueprint for bot', bot.name + ':', err, '#PollForCommit');
                    return cb(err);
                }

                log.debug('Got merged blueprint for bot', bot.name, '#PollForCommit');
                bridge.sourceControl.checkForUpdates(mergedBlueprint, (err, result) => {
                    if (err) {
                        log.error('Error checking for updates on bot', bot.name + ':', err, '#PollForCommit');
                        return cb(err);
                    } else if (result.hasUpdates) {

                        var query = {
                            startkey: [k.XCSIntegrationStepTypeCheckout],
                            endkey: [k.XCSIntegrationStepTypeCheckout, {}],
                            include_docs: true
                        };

                        integrationSearchClass.findIntegrationsByState(req, query, false, (err, integrations) => {
                            if (err) {
                                log.error('Error while checking for integrations in', k.XCSIntegrationStepTypeCheckout, 'state. #PollForCommit');
                                return cb(err);
                            } else {
                                var botIsCheckingOut = integrations.some(integration => integration.bot._id === bot._id);

                                if (botIsCheckingOut) {
                                    log.info('An integration already exists in', k.XCSIntegrationStepTypeCheckout, 'state. Skipping. #PollForCommit');
                                    return cb();
                                } else {
                                    log.info('Bot', bot.name, 'has SCM updates available. #PollForCommit');
                                    require('./integration/create.js').addPendingIntegration(req, bot._id, null, err => {
                                        if (err) {
                                            if (err.status === 409) {
                                                log.debug('Did not add pending integration for bot', bot.name, 'because it already has a pending integration. #PollForCommit');
                                                cb();
                                            } else {
                                                log.error('Could not add pending integration for bot', bot.name + ':', err, '#PollForCommit');
                                                cb(err);
                                            }
                                        } else {
                                            log.debug('Added pending integration for bot', bot.name, '#PollForCommit');
                                            cb();
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        log.debug('Bot', bot.name, 'has no SCM updates available. #PollForCommit');
                        return cb();
                    }
                });
            });
        });
    } else {
        log.debug('Bot', bot.name, 'has no information about its last SCM checkout. Skipping update to avoid integrating in a loop. #PollForCommit');
        return cb();
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
