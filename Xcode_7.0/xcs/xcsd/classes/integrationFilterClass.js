/*
    XCSIntegrationFilterClass
    A class dedicated to interact with CouchDB and Redis.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    async = require('async'),
    dbCoreClass = require('./dbCoreClass.js'),
    botClass = require('./botClass.js'),
    integrationSearchClass = require('./integrationSearchClass.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

/* XCSIntegrationFilterClass object */

function XCSIntegrationFilterClass() {}

XCSIntegrationFilterClass.prototype.filterIntegrationsForBotDispatcher = function filterIntegrationsForBotDispatcher(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Filter - filterIntegrationsForBotDispatcher] ' + req.method + ' ' + req.url,
        filter = (req.params.filter || req.query.filter),
        tag = (req.params.tag || req.query.tag),
        bots = req.query.bots,
        filteredIntegrations = [];

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    function returnBadRequest(reason) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: reason
        });
    }

    // Verify we support the filter
    if (!tag) {
        if (filter) {
            var filters = [k.XCSLatest, k.XCSFailed, k.XCSSucceeded, k.XCSTag];
            if (filters.indexOf(filter) === -1) {
                konsole.error(req, '[Integration Filter - filterIntegrationsForBotDispatcher] filter not recognized: ' + filter);
                return returnBadRequest('filter \'' + filter + '\' is not supported');
            }
        }
    } else {
        filter = k.XCSTag;
    }

    function joinIntegrations_internal(botUUID, results, filterCallback) {
        if (results.length > 0) {
            integrationSearchClass.joinSubDocumentsForIntegrations(req, results, true, function IFFilterIntegrationsJoinIntegrations(err, joinedIntegrations) {
                if (err) {
                    konsole.error(req, '[Integration Filter - filterIntegrationsForBotDispatcher] joinSubDocumentsForIntegrations error: ' + JSON.stringify(err));
                    return filterCallback(err);
                } else {
                    if (joinedIntegrations.length > 0) {
                        filteredIntegrations.push(joinedIntegrations[0]);
                    }
                    return filterCallback();
                }
            });
        } else {
            konsole.log(req, '[Integration Filter - filterIntegrationsForBotDispatcher] skipping joinSubDocumentsForIntegrations');
            return filterCallback();
        }
    }

    function prepareFilter(botUUID, filterCallback) {
        filterIntegrations(req, filter, botUUID, tag, function IFFilterIntegrationsPrepareFilter(err, integrations) {
            if (err) {
                konsole.error(req, '[Integration Filter - filterIntegrations] error: ' + JSON.stringify(err));
                return filterCallback(err);
            } else {
                return joinIntegrations_internal(botUUID, integrations, filterCallback);
            }
        });
    }

    function dispatchFilter(filter, bots) {

        konsole.log(req, '[Integration Filter - filterIntegrations] number of bot UUIDs specified: ' + bots.length);

        async.eachSeries(bots, prepareFilter, function IFFilterIntegrationsDispatchFilter(err) {
            if (err) {
                konsole.error(req, '[Integration Filter - filterIntegrationsForBotDispatcher] error: ' + JSON.stringify(err));
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                konsole.log(req, '[Integration Filter - filterIntegrationsForBotDispatcher] matches found: ' + filteredIntegrations.length);
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedResponse(res, 200, filteredIntegrations);
            }
        });
    }

    if (!bots) {
        botClass.listAllBots(req, function IFFilterIntegrationsListAllBots(err, bots) {
            if (err) {
                konsole.error(req, '[Integration Filter - filterIntegrations] error: ' + JSON.stringify(err));
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                konsole.log(req, '[Integration Filter - filterIntegrations] retrieving the bot UUIDs');
                var botsUUIDs = [];
                bots.forEach(function IFFilterIntegrationsApply(bot) {
                    botsUUIDs.push(bot._id);
                });
                dispatchFilter(filter, botsUUIDs);
            }
        });
    } else {
        try {
            bots = JSON.parse(bots);
        } catch (e) {
            return returnBadRequest(JSON.stringify(e));
        }

        if (Object.prototype.toString.call(bots) !== '[object Array]') {
            bots = [bots];
        }
        dispatchFilter(filter, bots);
    }

};

/* Module exports */

module.exports = new XCSIntegrationFilterClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function filterIntegrations(req, filter, botUUID, tag, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle;

    if (tag) {
        functionTitle = '[Integration Filter - filterIntegrations] filter  \'' + filter + '\' with: ' + tag;
    } else {
        functionTitle = '[Integration Filter - filterIntegrations] filter: \'' + filter + '\'';
    }

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = {
            descending: true,
            limit: 1,
            include_docs: true
        },
        design_name = k.XCSDesignDocumentFilter,
        view_name;

    if (k.XCSFailed === filter) {
        view_name = k.XCSDesignDocumentViewFilterLastFailed;
    } else if (k.XCSSucceeded === filter) {
        view_name = k.XCSDesignDocumentViewFilterLastSucceeded;
    } else if (k.XCSTag === filter) {
        view_name = k.XCSDesignDocumentViewFilterTag;
    } else if (k.XCSLatest === filter) {
        view_name = k.XCSDesignDocumentViewFilterLastCompletedIntegration;
    }

    if (tag) {
        if (unitTestUUID) {
            query.endkey = [unitTestUUID, botUUID, tag];
            query.startkey = [unitTestUUID, botUUID, tag, {}];

        } else {
            query.endkey = [botUUID, tag];
            query.startkey = [botUUID, tag, {}];
        }
    } else {
        if (unitTestUUID) {
            query.endkey = [unitTestUUID, botUUID];
            query.startkey = [unitTestUUID, botUUID, {}];

        } else {
            query.endkey = [botUUID];
            query.startkey = [botUUID, {}];
        }
    }

    konsole.log(req, '[Integration Filter - filterIntegrations] using: ' + design_name + '/' + view_name);

    dbCoreClass.findDocumentsWithQuery(req, design_name, view_name, query, function IFFilterIntegrationsFindDocuments(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && err.status !== 404) {
            konsole.error(req, '[Integration Filter - filterIntegrations] error: ' + JSON.stringify(err));
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs);
        }
    });

}