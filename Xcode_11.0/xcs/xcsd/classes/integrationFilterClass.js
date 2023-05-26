'use strict';

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    async = require('async'),
    dbCoreClass = require('./dbCoreClass.js'),
    botClass = require('./botClass.js'),
    integrationSearchClass = require('./integrationSearchClass.js'),
    xcsutil = require('../util/xcsutil.js');

/* XCSIntegrationFilterClass object */

function XCSIntegrationFilterClass() {}

XCSIntegrationFilterClass.prototype.filterIntegrationsForBotDispatcher = function filterIntegrationsForBotDispatcher(req, res) {



    var log = logger.withRequest(req),
        functionTitle = '[Integration Filter - filterIntegrationsForBotDispatcher] ' + req.method + ' ' + req.url,
        filter = (req.params.filter || req.query.filter),
        tag = (req.params.tag || req.query.tag),
        bots = req.query.bots,
        filteredIntegrations = [];

    log.info('Filtering integrations for bot.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    function returnBadRequest(reason) {
        xcsutil.profilerSummary(req);


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
                log.error('Could not filter integrations because the filter provided is not supported:', filter);
                return returnBadRequest('Integration filter \'' + filter + '\' is not supported');
            }
        }
    } else {
        log.debug('A tag was provided, using the tag filter.');
        filter = k.XCSTag;
    }

    function joinIntegrations_internal(botUUID, results, filterCallback) {
        if (results.length > 0) {
            integrationSearchClass.joinSubDocumentsForIntegrations(req, results, true, function IFFilterIntegrationsJoinIntegrations(err, joinedIntegrations) {
                if (err) {
                    log.error('Error attempting to join integration subdocuments:', err);
                    return filterCallback(err);
                } else {
                    if (joinedIntegrations.length > 0) {
                        filteredIntegrations.push(joinedIntegrations[0]);
                    }
                    return filterCallback();
                }
            });
        } else {
            log.debug('No results found, no need to join integration subdocuments.');
            return filterCallback();
        }
    }

    function prepareFilter(botUUID, filterCallback) {
        filterIntegrations(req, filter, botUUID, tag, function IFFilterIntegrationsPrepareFilter(err, integrations) {
            if (err) {
                log.error('Could not filter integrations:', err);
                return filterCallback(err);
            } else {
                return joinIntegrations_internal(botUUID, integrations, filterCallback);
            }
        });
    }

    function dispatchFilter(filter, bots) {

        log.info('Filtering integrations for', bots.length, 'bots.');

        async.eachSeries(bots, prepareFilter, function IFFilterIntegrationsDispatchFilter(err) {
            if (err) {
                xcsutil.profilerSummary(req);


                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                log.info('Found', filteredIntegrations.length, 'integrations matching filter.');
                xcsutil.profilerSummary(req);
                integrationSearchClass.synthesizeMissingIntegrationProperties(req, filteredIntegrations, function () {
                    return xcsutil.standardizedResponse(res, 200, filteredIntegrations);
                });
            }
        });
    }

    if (req.params.id) {
        log.debug("Found bot ID", req.params.id, "in URL, using that bot.");
        dispatchFilter(filter, [req.params.id]);
        return;
    }

    if (!bots) {
        log.debug('No bots specified, using all bots.');
        botClass.listAllBots(req, function IFFilterIntegrationsListAllBots(err, bots) {
            if (err) {
                log.error('Could not list bots for filtering integrations:', err);
                xcsutil.profilerSummary(req);


                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                log.debug('Found all bots, filtering using those bot IDs.');
                var botsUUIDs = bots.map(function(b) {
                    return b._id;
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

module.exports = xcsutil.bindAll(new XCSIntegrationFilterClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function filterIntegrations(req, filter, botUUID, tag, cb) {



    var log = logger.withRequest(req),
        functionTitle;

    if (tag) {
        log.info('Applying integration filter', filter, 'with tag', tag);
        functionTitle = '[Integration Filter - filterIntegrations] filter  \'' + filter + '\' with: ' + tag;
    } else {
        log.info('Applying integration filter', filter);
        functionTitle = '[Integration Filter - filterIntegrations] filter: \'' + filter + '\'';
    }

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

    dbCoreClass.findDocumentsWithQuery(req, design_name, view_name, query, function IFFilterIntegrationsFindDocuments(err, docs) {

        if (err && err.status !== 404) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs);
        }
    });

}
