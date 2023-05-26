/*
    XCSBotStatsClass
    A class dedicated to manage bot statistics.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

/* XCSBotStatsClass object */

function XCSBotStatsClass() {}

XCSBotStatsClass.prototype.findDocumentWithUUID = function XCSDBCoreClassFindDocumentWithUUID(req, doc_UUID, doc_type, cb) {
    var self = this;
    self.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

XCSBotStatsClass.prototype.lastCleanIntegration = function lastCleanIntegration(req, botUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] last clean integration';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {
            include_docs: false,
            descending: true
        },
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    if (!botUUID) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the bot ID has not been specified'
        });
    }

    if (unitTestUUID) {
        query.endkey = [unitTestUUID, botUUID, '2014-01-01T00:00:00.000Z'];
        query.startkey = [unitTestUUID, botUUID, '2099-12-31T23:59:59.999Z', {}];
    } else {
        query.endkey = [botUUID, '2014-01-01T00:00:00.000Z'];
        query.startkey = [botUUID, '2099-12-31T23:59:59.999Z', {}];
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewLastCleanIntegration, query, function BOTSLastCleanIntegrationCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs[0]);
        }
    });

};

XCSBotStatsClass.prototype.bestSuccessStreak = function bestSuccessStreak(req, botUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] best success streak';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {
            include_docs: false,
            descending: true
        },
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    if (!botUUID) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the bot ID has not been specified'
        });
    }

    if (unitTestUUID) {
        query.endkey = [unitTestUUID, botUUID, 1];
        query.startkey = [unitTestUUID, botUUID, 999999999, {}];
    } else {
        query.endkey = [botUUID, 1];
        query.startkey = [botUUID, 999999999, {}];
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewSuccessStreak, query, function BOTSBestSuccessStreakCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs[0]);
        }
    });

};

XCSBotStatsClass.prototype.numberOfIntegrations = function numberOfIntegrations(req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] number of integrations';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, error);
    }

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewIntegrationsPerDay, query, function BOTSNumberOfIntegrationsCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return sumDocValues(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.numberOfCommits = function numberOfCommits(req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] number of commits';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, error);
    }

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentCommit, k.XCSDesignDocumentViewCommitsPerDay, query, function BOTSNumberOfCommitsCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return sumDocValues(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.averageIntegrationTime = function averageIntegrationTime(req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] average integration time';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, error);
    }

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewAverageIntegrationTime, query, function BOTSAverageIntegrationTimeCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.testAdditionRate = function testAdditionRate(req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] test addition rate';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, error);
    }

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewTestAdditionRate, query, function BOTSTestAdditionRateCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.analysisWarningStats = function analysisWarningStats(req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] analysis warning stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, error);
    }

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewAnalysisWarningStats, query, function BOTSAnalysisWarningStatsCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.testFailureStats = function testFailureStats(req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] test failure stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, error);
    }

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewTestFailureStats, query, function BOTSTestFailureStatsCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.errorStats = function errorStats(req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] error stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, error);
    }

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewErrorStats, query, function BOTSErrorStatsCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.regressedPerfTestStats = function regressedPerfTestStats(req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] regressed perf test stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, error);
    }

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewRegressedPerfTestStats, query, function BOTSRegressedPerfTestStatsCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.warningStats = function warningStats(req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] warning stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, error);
    }

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewWarningStats, query, function BOTSWarningStatsCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.improvedPerfTestStats = function improvedPerfTestStats(req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] improved perf test stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, error);
    }

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewImprovedPerfTestStats, query, function BOTSImprovedPerfTestStatsCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.testsStats = function testsStats(req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] tests stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, error);
    }

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewTestsStats, query, function BOTSTestsStatsCallback(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

XCSBotStatsClass.prototype.ccDeltaStats = function ccDeltaStats(req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot Stats] Code Coverage delta stats';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, error);
    }

    // We don't need group level
    delete query.group_level;

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationNumberPerDay, query, function (err, integrationDayStats) {
        if (err && (404 !== err.status)) {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            if (0 === integrationDayStats.length) {
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, null, 0);
            } else {

                // Sort the results by integration number
                integrationDayStats.sort(function (integrationA, integrationB) {
                    return integrationA.number - integrationB.number;
                });

                // Build a map (integration number -> integration result)
                var integrationMap = {};

                for (var stat in integrationDayStats) {
                    if (integrationDayStats.hasOwnProperty(stat)) {
                        integrationMap[integrationDayStats[stat].number] = integrationDayStats[stat];
                    }
                }

                var integrationNumbers = Object.keys(integrationMap),
                    count = integrationNumbers.length,
                    firstIntegration = integrationDayStats[0],
                    lastIntegration = integrationDayStats[count - 1],
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
                } else {
                    ccDelta = lastIntegration.codeCoveragePercentage - firstIntegration.codeCoveragePercentage;
                }

                return xcsutil.safeCallback(cb, null, ccDelta);
            }
        }
    });

};

/* Module exports */

module.exports = new XCSBotStatsClass();

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

function relativeStandardDeviationWithStat(aggregatedStat, cb) {

    if ((aggregatedStat.avg > 0) && (aggregatedStat.count > 1)) {
        var pwrSum = Math.pow(aggregatedStat.sum - aggregatedStat.avg, 2),
            stdDev = Math.sqrt(pwrSum / (aggregatedStat.count - 1));
        aggregatedStat.stdDev = (stdDev / aggregatedStat.avg) * 100.0;

    }

    return xcsutil.safeCallback(cb, null, aggregatedStat);

}

function calculateAggregatedStats(stats, cb) {

    var aggregatedStat = initializedStat();

    if (stats.length) {
        var sum = 0,
            count = 0,
            tempMin = Number.MAX_VALUE,
            tempMax = Number.MAX_VALUE * -1;

        for (var stat in stats) {
            if (stats.hasOwnProperty(stat)) {
                var tempStat = stats[stat].value;

                if (tempStat.min < tempMin) {
                    tempMin = tempStat.min;
                }

                if (tempStat.max > tempMax) {
                    tempMax = tempStat.max;
                }

                sum += tempStat.sum;
                count += tempStat.count;
            }
        }

        aggregatedStat.count = count;
        aggregatedStat.sum = sum;
        aggregatedStat.avg = sum / count;
        aggregatedStat.min = tempMin;
        aggregatedStat.max = tempMax;

        return relativeStandardDeviationWithStat(aggregatedStat, cb);
    } else {
        return xcsutil.safeCallback(cb, null, aggregatedStat);
    }

}

function calculateDayDeltaForDateFromDate(inDate, inSecondDate) {

    if (!inDate || !inSecondDate) {
        return undefined;
    }

    // Strip everything but the day/month/year from the supplied dates.
    var inSecondDateStripped = new Date(inSecondDate.getFullYear(), inSecondDate.getMonth(), inSecondDate.getDate());
    var inDateStripped = new Date(inDate.getFullYear(), inDate.getMonth(), inDate.getDate());

    // If the difference between the two dates is zero, the day delta is 0.
    var dateDifference = inSecondDateStripped.getTime() - inDateStripped.getTime();

    // If the difference is greater than zero, the supplied date is before the stripped today date.
    // Otherwise if the difference is less than zero, the supplied date is after the stripped today
    // date. We negate the result here so one full day in the past is returned as -1.
    if (dateDifference > 0) {
        return -1 * ((dateDifference / (1000 * 60 * 60)) / 24);
    } else if (dateDifference < 0) {
        return ((Math.abs(dateDifference) / (1000 * 60 * 60)) / 24);
    }

    return 0;

}

function prepareQuery(req, botUUID, on_date, since_date, query) {

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

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

    xcsutil.logLevelInc(req);

    var value = [],
        future = [2099, 12, 31, 23, 59, 59],
        group_level;

    query.include_docs = false;
    query.descending = true;

    // Insert the botUUID if it has been specified
    if (botUUID) {
        value.splice(0, 0, botUUID);
        future.splice(0, 0, botUUID);
    }

    // Insert the unitTestUUID if it has been specified
    if (unitTestUUID) {
        value.splice(0, 0, unitTestUUID);
        future.splice(0, 0, unitTestUUID);
    }

    var on_date_components;
    if (on_date) {
        on_date_components = xcsutil.dateComponentsFromDate(new Date(on_date));
    }

    var since_date_components;
    if (since_date) {
        since_date_components = xcsutil.dateComponentsFromDate(new Date(since_date));
    }

    if (on_date_components) {
        value = value.concat(on_date_components);
        if (unitTestUUID) {
            group_level = 5;
        } else {
            group_level = 4;
        }
        value = value.slice(0, group_level);
        query.startkey = value.concat({});
    } else if (since_date_components) {
        value = value.concat(since_date_components);

        // To determine what level we should use, we need to determine the day delta between now
        // and the since date we were passed.

        var day_delta = calculateDayDeltaForDateFromDate(new Date(), new Date(since_date));
        if (day_delta <= 1) { // 24 hours
            group_level = 5;
        } else if (day_delta <= 7) { // 7 days
            group_level = 4;
        } else if (day_delta <= 31) { // 1 month
            group_level = 3;
        } else if (day_delta <= 365) { // 1 year
            group_level = 2;
        } else {
            group_level = 1;
        }

        if (unitTestUUID) {
            group_level += 1;
        }

        value = value.slice(0, group_level);
        future = future.slice(0, group_level);
        query.startkey = future.concat({});
    }

    query.endkey = value;
    query.group_level = value.length;

    xcsutil.logLevelDec(req);

    return null;
}

/*
 Average, Standard Deviation and Relative Standard Deviation
 http://www.chem.tamu.edu/class/fyp/mathrev/std-dev.pdf
*/

function sumDocValues(docs, cb) {
    var sum = 0;

    for (var i = 0; i < docs.length; i++) {
        sum += docs[i].value;
    }

    return xcsutil.safeCallback(cb, null, sum);
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