/*
    XCSBotStatsClass
    A class dedicated to manage bot statistics.
*/

'use strict';

var _ = require('underscore'),
    k = require('../constants.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js');

/* XCSBotStatsClass object */

function XCSBotStatsClass() {}

XCSBotStatsClass.prototype.lastCleanIntegration = function lastCleanIntegration(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] last clean integration';

    log.info('Finding last clean integration for bot', botUUID);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!botUUID) {
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the bot ID has not been specified'
        });
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    delete query.group_level;

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewLastCleanIntegration, query, function BOTSLastCleanIntegrationCallback(err, docs) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling lastCleanIntegration:', docs.length);
            return xcsutil.safeCallback(cb, null, docs[0]);
        }
    });

};

XCSBotStatsClass.prototype.bestSuccessStreak = function bestSuccessStreak(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] best success streak';

    log.info('Finding best success streak for bot', botUUID);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!botUUID) {
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the bot ID has not been specified'
        });
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    delete query.group_level;

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewSuccessStreak, query, function BOTSBestSuccessStreakCallback(err, docs) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling bestSuccessStreak:', docs.length);
            return xcsutil.safeCallback(cb, null, docs[0]);
        }
    });

};

XCSBotStatsClass.prototype.numberOfIntegrations = function numberOfIntegrations(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] number of integrations';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    log.info('Finding number of integrations for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewIntegrationsPerDay, query, function BOTSNumberOfIntegrationsCallback(err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling numberOfIntegrations:', docs.length);
            return sumDocValues(_.pluck(docs, 'value'), cb);
        }
    });

};

XCSBotStatsClass.prototype.numberOfCommits = function numberOfCommits(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] number of commits';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    log.info('Finding number of commits for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentCommit, k.XCSDesignDocumentViewCommitsPerDay, query, function BOTSNumberOfCommitsCallback(err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling numberOfCommits:', docs.length);
            return sumDocValues(_.pluck(docs, 'value'), cb);
        }
    });

};

XCSBotStatsClass.prototype.averageIntegrationTime = function averageIntegrationTime(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] average integration time';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    delete query.group_level;

    log.info('Finding average integration time for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewAverageIntegrationTime, query, function BOTSAverageIntegrationTimeCallback(err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling averageIntegrationTime:', docs.length);
            return statsWithValueList(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.testAdditionRate = function testAdditionRate(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] test addition rate';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    log.info('Finding test addition rate for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewTestAdditionRate, query, function BOTSTestAdditionRateCallback(err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling testAdditionRate:', docs.length);
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.analysisWarningStats = function analysisWarningStats(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] analysis warning stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    log.info('Finding analysis warning stats for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewAnalysisWarningStats, query, function BOTSAnalysisWarningStatsCallback(err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling analysisWarningStats:', docs.length);
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.testFailureStats = function testFailureStats(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] test failure stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    log.info('Finding test failure stats for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewTestFailureStats, query, function BOTSTestFailureStatsCallback(err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling testFailureStats:', docs.length);
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.errorStats = function errorStats(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] error stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    log.info('Finding error stats for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewErrorStats, query, function BOTSErrorStatsCallback(err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling errorStats:', docs.length);
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.regressedPerfTestStats = function regressedPerfTestStats(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] regressed perf test stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    log.info('Finding regressed performance test stats for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewRegressedPerfTestStats, query, function BOTSRegressedPerfTestStatsCallback(err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling regressedPerfTestStats:', docs.length);
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.warningStats = function warningStats(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] warning stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    log.info('Finding warning stats for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewWarningStats, query, function BOTSWarningStatsCallback(err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling warningStats:', docs.length);
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.improvedPerfTestStats = function improvedPerfTestStats(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] improved perf test stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    log.info('Finding improved performance test stats for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewImprovedPerfTestStats, query, function BOTSImprovedPerfTestStatsCallback(err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling improvedPerfTestStats:', docs.length);
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.testsStats = function testsStats(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] tests stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    log.info('Finding test stats for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewTestsStats, query, function BOTSTestsStatsCallback(err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling testsStats:', docs.length);
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.ccDeltaStats = function ccDeltaStats(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] Code Coverage delta stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    // We don't need group level
    delete query.group_level;

    log.info('Finding code coverage delta stats for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationNumberPerDay, query, function (err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling ccDeltaStats:', docs.length);
            if (0 === docs.length) {
                return xcsutil.safeCallback(cb, null, 0);
            } else {

                // Reject the results that don't contain CC percentage data
                docs = _.reject(docs, function (stat) {
                    return !stat.codeCoveragePercentage;
                });

                // Sort the results by integration number
                docs.sort(function (integrationA, integrationB) {
                    return integrationA.number - integrationB.number;
                });

                // Build a map (integration number -> integration result)
                var integrationMap = {};

                for (var stat in docs) {
                    if (docs.hasOwnProperty(stat)) {
                        integrationMap[docs[stat].number] = docs[stat];
                    }
                }

                var integrationNumbers = Object.keys(integrationMap),
                    count = integrationNumbers.length,
                    firstIntegration = docs[0],
                    lastIntegration = docs[count - 1],
                    ccDelta = 0;

                if (1 === count) {
                    // Find the previous integration
                    var beforeIntegration = integrationMap[firstIntegration.number - 1];

                    // Does it exist?
                    if (beforeIntegration) {
                        if (!beforeIntegration.codeCoveragePercentage) {
                            ccDelta = lastIntegration.codeCoveragePercentage;
                        } else {
                            ccDelta = lastIntegration.codeCoveragePercentage - beforeIntegration.codeCoveragePercentage;
                        }
                    } else {
                        ccDelta = 0;
                    }
                } else if (count > 1) {
                    ccDelta = lastIntegration.codeCoveragePercentage - firstIntegration.codeCoveragePercentage;
                }

                return xcsutil.safeCallback(cb, null, ccDelta);
            }
        }
    });

};

XCSBotStatsClass.prototype.numberOfSuccessfulIntegrations = function numberOfSuccessfulIntegrations(req, botUUID, on_date, since_date, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Bot Stats] Number of successful integrations per bot';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        return xcsutil.safeCallback(cb, error);
    }

    log.info('Finding the number of successful integrations per bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewNumberOfSuccessfulIntegrationsPerBot, query, function (err, docs) {
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('#BotStats docs found calling numberOfSuccessfulIntegrations:', docs.length);
            let numberOfSuccessfulIntegrations = (docs && docs.length > 0 ? docs.length : 0);
            return xcsutil.safeCallback(cb, null, numberOfSuccessfulIntegrations);
        }
    });

};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSBotStatsClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function initializedStat() {

    return {
        sum: 0,
        count: 0,
        min: 0,
        max: 0,
        avg: 0,
        stdDev: 0
    };

}

/*
 Average, Standard Deviation and Relative Standard Deviation
 http://www.chem.tamu.edu/class/fyp/mathrev/std-dev.pdf
*/

function relativeStandardDeviationWithStat(aggregatedStat) {

    if ((aggregatedStat.avg > 0) && (aggregatedStat.count > 1)) {
        var pwrSum = Math.pow(aggregatedStat.sum - aggregatedStat.avg, 2),
            stdDev = Math.sqrt(pwrSum / (aggregatedStat.count - 1));
        return (stdDev / aggregatedStat.avg) * 100.0;
    }

    return 0;
}

function sumDocValues(docs, cb) {
    var sum = docs.reduce((total, value) => total + value, 0);
    return xcsutil.safeCallback(cb, null, sum);
}

function statsWithValueList(values, cb) {

    var aggregatedStat = initializedStat();

    if (values.length) {
        var sum = 0,
            count = 0,
            tempMin = Number.MAX_VALUE,
            tempMax = Number.MAX_VALUE * -1;

        for (var i = 0, len = values.length; i < len; i++) {
            let value = values[i];
            if (value < tempMin) {
                tempMin = value;
            }

            if (value > tempMax) {
                tempMax = value;
            }

            sum += value;
            count += 1;
        }

        aggregatedStat.count = count;
        aggregatedStat.sum = sum;
        aggregatedStat.avg = sum / count;
        aggregatedStat.min = tempMin;
        aggregatedStat.min = tempMin;
        aggregatedStat.max = tempMax;
        aggregatedStat.sumsqr = values.map(a => Math.pow(a, 2)).reduce((a, b) => a + b);
        aggregatedStat.stdDev = relativeStandardDeviationWithStat(aggregatedStat);
    }

    return xcsutil.safeCallback(cb, null, aggregatedStat);

}

function calculateAggregatedStats(stats, cb) {

    var aggregatedStat = initializedStat();

    if (stats.length) {
        stats = _.pluck(stats, 'value');
        aggregatedStat.min = _.min(_.pluck(stats, 'min'));
        aggregatedStat.max = _.max(_.pluck(stats, 'max'));
        aggregatedStat.count = _.pluck(stats, 'count').reduce(function (a, b) {
            return a + b;
        }, 0);
        aggregatedStat.sum = _.pluck(stats, 'sum').reduce(function (a, b) {
            return a + b;
        }, 0);
        aggregatedStat.avg = aggregatedStat.sum / aggregatedStat.count;
        aggregatedStat.sumsqr = _.pluck(stats, 'sum').map(a => Math.pow(a, 2)).reduce((a, b) => a + b);
        aggregatedStat.stdDev = relativeStandardDeviationWithStat(aggregatedStat);
    }

    return xcsutil.safeCallback(cb, null, aggregatedStat);

}

function aggregatedStats(stats, cb) {

    if (Array.isArray(stats)) {
        switch (stats.length) {
        case 0:
            return xcsutil.safeCallback(cb, null, initializedStat());
        default:
            return calculateAggregatedStats(stats, cb);
        }
    } else {
        throw new Error('[BotStats - calculateAggregatedStats] parameter \'stats\' is not an array.');
    }
}

function prepareQuery(req, botUUID, on_date, since_date, query) {

    var functionTitle = '[Bot Stats] prepareQuery';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!botUUID) {
        return {
            status: 400,
            message: 'the bot ID has not been specified'
        };
    }

    // One of the two date arguments must exist
    if (!on_date && !since_date) {
        return {
            status: 400,
            message: 'the properties "on_date" and/or "since_date" have not been specified'
        };
    }

    // The query must exist
    if (!query) {
        return {
            status: 400,
            message: 'the query has not been specified'
        };
    }

    if (on_date) {
        return prepareQueryOnDate(req, botUUID, on_date, query);
    } else if (since_date) {
        return prepareQuerySinceDate(req, botUUID, since_date, query);
    }
}

function prepareQueryOnDate(req, botUUID, on_date, query) {

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    var functionTitle = '[Bot Stats] prepareQueryOnDate';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!on_date) {
        return {
            status: 400,
            message: 'the property "on_date" has not been specified'
        };
    }

    // Set the default query parameters:
    query.group_level = 8; // group level: botUUID, YYYY, MM, DD, HH, MM, SS, MS
    query.include_docs = false;
    query.descending = true;

    // Example query:
    //                startkey=["44c0b1ad7699b8d360ee4b381b011b71", 2016, 8, 4, 1, 50, 46, 796]
    //                &endkey=["44c0b1ad7699b8d360ee4b381b011b71", 2016, 8, 1, 1, 50, 46, 796,{}]
    //                &descending=true

    let today = new Date(on_date);
    let since = new Date(on_date);

    let today_date_components = xcsutil.dateComponentsFromDate(today);
    let since_date_components = xcsutil.dateComponentsFromDate(since);

    // Adjust the milliseconds since the value is not inclusive
    since_date_components[6] = since_date_components[6] - 1;

    // Set the key range
    query.startkey = today_date_components;
    query.endkey = since_date_components;

    // Prepend the bot UUID
    query.startkey.splice(0, 0, botUUID);
    query.endkey.splice(0, 0, botUUID);

    // Prepend the unit test UUID if applicable
    if (unitTestUUID) {
        query.group_level += 1;
        query.startkey.splice(0, 0, unitTestUUID);
        query.endkey.splice(0, 0, unitTestUUID);
    }

    // Resize the keys based on group level
    query.startkey = query.startkey.slice(0, query.group_level);
    query.endkey = query.endkey.slice(0, query.group_level);

    // Append the {} signal at the end of the array
    query.endkey = query.endkey.concat({});
}

function prepareQuerySinceDate(req, botUUID, since_date, query) {

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    var functionTitle = '[Bot Stats] prepareQuerySinceDate';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!since_date) {
        return {
            status: 400,
            message: 'the property "since_date" has not been specified'
        };
    }

    // Set the default query parameters:
    query.group_level = 8; // group level: botUUID, YYYY, MM, DD, HH, MM, SS, MS
    query.include_docs = false;
    query.descending = true;

    // Example query:
    //                startkey=["44c0b1ad7699b8d360ee4b381b011b71", 2016, 8, 4, 1, 50, 46, 796]
    //                &endkey=["44c0b1ad7699b8d360ee4b381b011b71", 2016, 8, 1, 1, 50, 46, 796,{}]
    //                &descending=true

    let today = new Date();
    let since = new Date(since_date);

    let today_date_components = xcsutil.dateComponentsFromDate(today);
    let since_date_components = xcsutil.dateComponentsFromDate(since);

    // Adjust the milliseconds since the value is not inclusive
    since_date_components[6] = since_date_components[6] - 1;

    // Set the key range
    query.startkey = today_date_components;
    query.endkey = since_date_components;

    // Prepend the bot UUID
    query.startkey.splice(0, 0, botUUID);
    query.endkey.splice(0, 0, botUUID);

    // Prepend the unit test UUID if applicable
    if (unitTestUUID) {
        query.group_level += 1;
        query.startkey.splice(0, 0, unitTestUUID);
        query.endkey.splice(0, 0, unitTestUUID);
    }

    // Resize the keys based on group level
    query.startkey = query.startkey.slice(0, query.group_level);
    query.endkey = query.endkey.slice(0, query.group_level);

    // Swap dates if needed
    if (since > today) {
        query.startkey = since_date_components;
        query.endkey = today_date_components;
    }

    // Append the {} signal at the end of the array
    query.endkey = query.endkey.concat({});
}