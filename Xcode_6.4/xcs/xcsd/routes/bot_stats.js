'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    db_core = require('./db_core.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

var bot_stats = {};

bot_stats.lastCleanIntegration = function (req, botUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] last clean integration...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var error = {},
        query = {
            include_docs: false,
            descending: true
        },
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    if (!botUUID) {
        error.status = 400;
        error.message = 'Bad Request';
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    if (unitTestUUID) {
        query.endkey = [unitTestUUID, botUUID, '2014-01-01T00:00:00.000Z'];
        query.startkey = [unitTestUUID, botUUID, '2099-12-31T23:59:59.999Z', {}];
    } else {
        query.endkey = [botUUID, '2014-01-01T00:00:00.000Z'];
        query.startkey = [botUUID, '2099-12-31T23:59:59.999Z', {}];
    }

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewLastCleanIntegration, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err) {
            return cb(err);
        } else {
            return cb(null, docs[0]);
        }
    });

};

bot_stats.bestSuccessStreak = function (req, botUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] best success streak...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var error = {},
        query = {
            include_docs: false,
            descending: true
        },
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    if (!botUUID) {
        error.status = 400;
        error.message = 'Bad Request';
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    if (unitTestUUID) {
        query.endkey = [unitTestUUID, botUUID, 1];
        query.startkey = [unitTestUUID, botUUID, 999999999, {}];
    } else {
        query.endkey = [botUUID, 1];
        query.startkey = [botUUID, 999999999, {}];
    }

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewSuccessStreak, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err) {
            return cb(err);
        } else {
            return cb(null, docs[0]);
        }
    });

};

bot_stats.numberOfIntegrations = function (req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] number of integrations...';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    konsole.log(req, functionTitle);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewIntegrationsPerDay, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return cb(err);
        } else {
            return sumDocValues(docs, cb);
        }
    });

};

bot_stats.numberOfCommits = function (req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] number of commits...';


    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    konsole.log(req, functionTitle);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentCommit, k.XCSDesignDocumentViewCommitsPerDay, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return cb(err);
        } else {
            return sumDocValues(docs, cb);
        }
    });

};

bot_stats.averageIntegrationTime = function (req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] average integration time...';


    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    konsole.log(req, functionTitle);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewAverageIntegrationTime, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return cb(err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

bot_stats.testAdditionRate = function (req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] test addition rate...';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    konsole.log(req, functionTitle);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewTestAdditionRate, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return cb(err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

bot_stats.analysisWarningStats = function (req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] analysis warning stats...';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    konsole.log(req, functionTitle);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewAnalysisWarningStats, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return cb(err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

bot_stats.testFailureStats = function (req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] test failure stats...';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    konsole.log(req, functionTitle);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewTestFailureStats, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return cb(err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

bot_stats.errorStats = function (req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] error stats...';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    konsole.log(req, functionTitle);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewErrorStats, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return cb(err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

bot_stats.regressedPerfTestStats = function (req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] regressed perf test stats...';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    konsole.log(req, functionTitle);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewRegressedPerfTestStats, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return cb(err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

bot_stats.warningStats = function (req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] warning stats...';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    konsole.log(req, functionTitle);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewWarningStats, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return cb(err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

bot_stats.improvedPerfTestStats = function (req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] improved perf test stats...';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    konsole.log(req, functionTitle);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewImprovedPerfTestStats, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return cb(err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

bot_stats.testsStats = function (req, botUUID, on_date, since_date, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Bot] tests stats...';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {};

    var error = prepareQuery(req, botUUID, on_date, since_date, query);
    if (error) {
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    konsole.log(req, functionTitle);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewTestsStats, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err && (404 !== err.status)) {
            return cb(err);
        } else {
            return aggregatedStats(docs, cb);
        }
    });

};

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

    if (req && req.snitch) {
        req.snitch.next('[Bot Stats] prepareQuery');
    }

    // If the unitTestUUID has been specified, the botUUID must exist
    if (unitTestUUID && !botUUID) {
        return {
            status: 400,
            message: 'Bad request: (unitTestUUID && !botUUID)'
        };
    }

    // The botUUID must exist
    if (!botUUID) {
        return {
            status: 400,
            message: 'Bad request: (!botUUID)'
        };
    }

    // One of the two date arguments must exist
    if (!on_date && !since_date) {
        return {
            status: 400,
            message: 'Bad request: (!on_date && !since_date)'
        };
    }

    // The query must exist
    if (!query) {
        return {
            status: 400,
            message: 'Bad request: (!query)'
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

    // No error
    return null;
}

/**
 * Utilities
 */

/*
 Average, Standard Deviation and Relative Standard Deviation
 http://www.chem.tamu.edu/class/fyp/mathrev/std-dev.pdf
*/

function sumDocValues(docs, cb) {
    var sum = 0;

    for (var i = 0; i < docs.length; i++) {
        sum += docs[i].value;
    }

    return cb(null, sum);
}

function aggregatedStats(stats, cb) {

    if (Array.isArray(stats)) {
        switch (stats.length) {
        case 0:
            return cb(null, initializedStat());
        default:
            return calculateAggregatedStats(stats, cb);
        }
    } else {
        throw new Error('[BotStats - calculateAggregatedStats] parameter \'stats\' is not an array.');
    }
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
        return cb(null, aggregatedStat);
    }
}

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
    return cb(null, aggregatedStat);
}

module.exports = bot_stats;