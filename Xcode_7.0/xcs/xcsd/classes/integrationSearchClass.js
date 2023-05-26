/*
    XCSIntegrationSearchClass
    A class dedicated to interact with CouchDB and Redis.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var _ = require('underscore'),
    async = require('async'),
    url = require('url');

var k = require('../constants.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

/* XCSIntegrationSearchClass object */

function XCSIntegrationSearchClass() {}

XCSIntegrationSearchClass.prototype.findDocumentWithUUID = function XCSDBCoreClassFindDocumentWithUUID(req, doc_UUID, doc_type, cb) {
    var self = this;
    self.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

XCSIntegrationSearchClass.prototype.joinSubDocumentsForIntegrations = function joinSubDocumentsForIntegrations(req, integrations, performJoin, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - joinSubDocumentsForIntegrations] number of integrations to join: ' + integrations.length;

    if (!integrations) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the integrations has not been specified'
        });
    }

    if (false === performJoin) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, null, integrations);
    }

    if (0 === integrations.length) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, null);
    }

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var queryBase = {
        include_docs: true,
    };

    async.each(integrations, function INSJoinSubDocumentsForIntegrationsIterate(integration, callback) {
        if (k.XCSIntegrationStepTypeCompleted === integration.currentStep) {
            var query = JSON.parse(JSON.stringify(queryBase));
            query.key = integration._id;

            dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsSubDocuments, query, function INSJoinSubDocumentsForIntegrationsIterateFindIntegration(err, docs) {

                // Not finding documents doesn't mean it's an error. Let's report true errors instead.

                if (err && err.status !== 404) {
                    err.message = '[Integration Search - joinSubDocumentsForIntegrations] error while calling findDocumentsWithQuery: ' + err.message;
                    konsole.error(req, JSON.stringify(err));
                    return xcsutil.safeCallback(callback, err);
                } else {
                    for (var i = 0; i < docs.length; i++) {
                        var doc = docs[i],
                            property = doc.doc_type;
                        integration[property] = doc[property];
                    }
                    return xcsutil.safeCallback(callback);
                }

            });
        } else {
            return xcsutil.safeCallback(callback);
        }
    }, function INSJoinSubDocumentsForIntegrationsFinalizer(err) {
        if (err) {
            konsole.error(req, '[Integration Search - joinSubDocumentsForIntegrations] error: ' + JSON.stringify(err));
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            konsole.log(req, '[Integration Search - joinSubDocumentsForIntegrations] done.');
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, null, integrations);
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationsForBotDispatcher = function findIntegrationsForBotDispatcher(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationsForBotDispatcher] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    // Verify we support the filter
    var filter = req.params.filter;
    if (filter) {
        var allowedSelections = [k.XCSNonFatal, k.XCSWithBuildResultSummary, 'with-build-results', 'non-fatal'];
        if (allowedSelections.indexOf(filter) === -1) {
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedErrorResponse(res, {
                status: 400,
                message: 'selection \'' + filter + '\' is not supported'
            });
        }
    }

    // Verify we support the parameter
    var parameters = Object.keys(req.query),
        allowedParameters = ['filter', 'last', 'number', 'from', 'next', 'prev', 'count', 'summary_only'],
        unsupportedFilters = _.difference(parameters, allowedParameters);

    if (unsupportedFilters.length) {
        xcsutil.logLevelDec(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'filter(s) not supported: ' + unsupportedFilters
        });
    }

    var self = this;

    if (req.params.filter) {
        self.findLastIntegrationsForBot(req, res);
    } else if ((req.query.last) || (req.params.filter)) {
        self.findLastIntegrationsForBot(req, res);
    } else if (req.query.from) {
        self.findIntegrationsForBot(req, res);
    } else if (req.query.number) {
        self.findIntegrationWithNumber(req, res);
    } else if (req.query.count) {
        self.findIntegrationCountForBot(req, res);
    } else if (req.query.id) {
        self.findIntegration(req, res);
    } else if (req.query.running) {
        self.listRunning(req, res);
    } else if ((req.query.tag) || (req.query.filter)) {
        require('./integrationFilterClass.js').filterIntegrationsForBotDispatcher(req, res);
    } else {
        self.findLastIntegrationsForBot(req, res);
    }

};

XCSIntegrationSearchClass.prototype.findIntegrationsDispatcher = function findIntegrationsDispatcher(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationsDispatcher] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    // Verify we support the filter
    var filters = Object.keys(req.query),
        allowedFilters = ['last', 'number', 'summary_only', 'count', 'id', 'running', 'tag', 'bots', 'filter', 'currentStep'],
        unsupportedFilters = _.difference(filters, allowedFilters);

    if (unsupportedFilters.length) {
        xcsutil.logLevelDec(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'filter(s) not supported: ' + unsupportedFilters
        });
    }

    var self = this;

    if (req.query.last || req.query[k.XCSNonFatal] || req.query['non-fatal']) {
        self.findLastIntegrationsForBot(req, res);
    } else if (req.query.count) {
        self.findIntegrationCountForBot(req, res);
    } else if (req.query.id) {
        self.findIntegration(req, res);
    } else if (req.query.currentStep) {
        self.listByState(req, res);
    } else if (req.query.running) {
        self.listRunning(req, res);
    } else if ((req.query.tag) || (req.query.filter)) {
        require('./integrationFilterClass.js').filterIntegrationsForBotDispatcher(req, res);
    } else {
        xcsutil.logLevelDec(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'unable to parse the query string'
        });
    }

};


XCSIntegrationSearchClass.prototype.findIntegrationWithUUID = function findIntegrationWithUUID(req, integrationUUID, performJoin, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationWithUUID] find integration with UUID: ' + integrationUUID,
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!integrationUUID) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the integration ID has not been specified'
        });
    }

    dbCoreClass.findDocumentWithUUID(req, integrationUUID, k.XCSDesignDocumentIntegration, function INSFindIntegrationWithUUID(err, integration) {
        if (err) {
            konsole.error(req, '[Integration Search - findIntegrationWithUUID] error: ' + JSON.stringify(err));
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            konsole.log(req, '[Integration Search - findIntegrationWithUUID] joining integration subdocuments');
            self.joinSubDocumentsForIntegrations(req, [integration], performJoin, function INSFindIntegrationWithUUIDJoin(err, joinedIntegrations) {
                if (err) {
                    konsole.error(req, '[Integration Search - findIntegrationWithUUID] error: ' + JSON.stringify(err));
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, err);
                } else {
                    konsole.log(req, '[Integration Search - findIntegrationWithUUID] done.');
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, null, joinedIntegrations[0]);
                }
            });
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationWithNumberForBotWithUUID = function findIntegrationWithNumberForBotWithUUID(req, integrationNumber, botUUID, performJoin, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationWithNumberForBotWithUUID] find integration ' + integrationNumber + ' with bot UUID:' + botUUID,
        self = this;

    konsole.log(req, functionTitle);

    self.findIntegrationsWithNumbersForBotWithUUID(req, [integrationNumber], botUUID, performJoin, function INSFindIntegrationsWithNumbersForBotWithUUID(err, joinedIntegrations) {
        if (err) {
            konsole.error(req, '[Integration Search - findIntegrationWithNumberForBotWithUUID] error: ' + JSON.stringify(err));
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, null, joinedIntegrations[0]);
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationsWithNumbersForBotWithUUID = function findIntegrationsWithNumbersForBotWithUUID(req, integrationNumbers, botUUID, performJoin, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationsWithNumbersForBotWithUUID] find integrations with bot UUID: ' + botUUID,
        error = {},
        self = this,
        from,
        to;

    konsole.log(req, functionTitle);

    if (!integrationNumbers || (0 === integrationNumbers.length)) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the integration numbers have not been specified'
        });
    }

    if (!botUUID) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the bot ID has not been specified'
        });
    }

    if (integrationNumbers.length > 1) {
        integrationNumbers.sort(function INSEmptyIssueDocumentSort(a, b) {
            return a - b;
        });
        from = integrationNumbers[0];
        to = integrationNumbers[integrationNumbers.length - 1];
    } else {
        from = integrationNumbers[0];
        to = integrationNumbers[0];
    }

    var query = {
        startkey: [botUUID, from],
        endkey: [botUUID, to, {}],
        include_docs: true
    };

    // Select the view based on the query string.
    // The default view XCSDesignDocumentViewIntegrationsByNumber.

    var view_byNumber = k.XCSDesignDocumentViewIntegrationsByNumber,
        filter = (req ? req.params.filter : null);

    if (filter === k.XCSNonFatal || filter === 'non-fatal') {
        view_byNumber = k.XCSDesignDocumentViewLastNonFatalIntegrationsByNumber;
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, view_byNumber, query, function INSEmptyIssueDocument(err, docs) {
        if (err) {
            konsole.error(req, '[Integration Search - findIntegrationsWithNumbersForBotWithUUID] error: ' + JSON.stringify(err));
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            if (docs.length > 0) {
                konsole.log(req, '[Integration Search - findIntegrationsWithNumbersForBotWithUUID] found.');
                self.joinSubDocumentsForIntegrations(req, docs, performJoin, function INSEmptyIssueDocumentJoin(err, joinedIntegrations) {
                    xcsutil.logLevelDec(req);
                    if (err) {
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        return xcsutil.safeCallback(cb, null, joinedIntegrations);
                    }
                });
            } else {
                error.status = 404;
                error.message = 'Not found';
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, error);
            }
        }
    });

};

XCSIntegrationSearchClass.prototype.findCommitWithUUID = function findCommitWithUUID(req, commitUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findCommitWithUUID] find commit with UUID';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!commitUUID) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the commit ID has not been specified'
        });
    }

    var query = {
        include_docs: true,
        key: commitUUID
    };

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentCommit, k.XCSDesignDocumentViewAllCommits, query, function INSFindCommitWithUUID(err, docs) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs[0]);
        }
    });

};

XCSIntegrationSearchClass.prototype.findIssueWithUUID = function findIssueWithUUID(req, issueUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIssueWithUUID] find issue with UUID';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!issueUUID) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the issue ID has not been specified'
        });
    }

    var query = {
        include_docs: true,
        key: issueUUID
    };

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIssue, k.XCSDesignDocumentViewAllIssues, query, function INSFindIssueWithUUID(err, docs) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs[0]);
        }
    });

};

XCSIntegrationSearchClass.prototype.findCommitsForIntegration = function findCommitsForIntegration(req, integrationUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findCommitsForIntegration] findCommitsForIntegration';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {
        include_docs: true,
        key: integrationUUID
    };

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentCommit, k.XCSDesignDocumentViewCommitsByIntegrationID, query, function INSFindCommitsForIntegration(err, docs) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, err, docs);
    });

};

XCSIntegrationSearchClass.prototype.findCommits = function findCommits(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findCommits] find commit history with integration UUID';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        self = this;

    self.findCommitsForIntegration(req, integrationUUID, function INSFindCommits(err, docs) {

        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);

        // Not finding documents doesn't mean it's an error. Let's report true errors instead.

        if (err && err.status !== 404) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSIntegrationSearchClass.prototype.findIssuesForIntegration = function findIssuesForIntegration(req, integrationUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIssuesForIntegration] findIssuesForIntegration';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {
        include_docs: true,
        key: integrationUUID
    };

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIssue, k.XCSDesignDocumentViewIssuesByIntegrationID, query, function INSFindIssuesForIntegration(err, docs) {
        if (err) {
            konsole.log(req, '[Integration Search - findIssuesForIntegration] error: ' + JSON.stringify(err));
        } else {
            konsole.log(req, '[Integration Search - findIssuesForIntegration] success.');
        }
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, err, docs);
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationsByState = function findIntegrationsByState(req, query, performJoin, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationsByState] find integration by state: ' + query.startkey,
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsByStep, query, function INSFindIntegrationsByState(err, docs) {
        if (err && err.status === 404) {
            // Not found: not a true error. Just return an empty array.
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, null, []);
        } else if (err) {
            // Any other error, we pass along.

            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            self.joinSubDocumentsForIntegrations(req, docs, performJoin, function INSFindIntegrationsByStateJoin(err, joinedIntegrations) {

                xcsutil.logLevelDec(req);
                if (err) {
                    return xcsutil.safeCallback(cb, err);
                } else {
                    return xcsutil.safeCallback(cb, null, joinedIntegrations);
                }
            });
        }
    });

};

XCSIntegrationSearchClass.prototype.findPendingIntegrations = function findPendingIntegrations(req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findPendingIntegrations] find pending integrations';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        query = {
            include_docs: true
        },
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    query.startkey = [k.XCSIntegrationStepTypePending];
    query.endkey = [k.XCSIntegrationStepTypePending, {}];

    self.findIntegrationsByState(req, query, false, function INSFindPendingIntegrationsFindIntegrationsByState(err, docs) {
        xcsutil.logLevelDec(req);
        xcsutil.profilerSummary(req);
        return xcsutil.safeCallback(cb, err, docs && docs.filter(function INSFindPendingIntegrationsFindIntegrationsByStateFilter(doc) {
            if (unitTestUUID) {
                // If the request comes from a unit test, select its documents
                return (unitTestUUID === doc.xcsunittest);
            } else {
                // If it's a regular request, filter out any unit test document
                return (doc.xcsunittest ? false : true);
            }
        }));
    });

};

XCSIntegrationSearchClass.prototype.findLastIntegrationsForBotWithQuery = function findLastIntegrationsForBotWithQuery(req, view_name, botUUID, query, cb) {

    xcsutil.logLevelInc(req);

    var timerName = '[Integration] findLastIntegrationsForBotWithQuery',
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    konsole.log(req, timerName);

    if (req && req.snitch) {
        req.snitch.next(timerName);
    }

    konsole.log(req, '[Integration] unitTestUUID: ' + unitTestUUID);
    konsole.log(req, '[Integration] botUUID: ' + botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, view_name, query, function INSFindLastIntegrationsForBotWithQuery(err, docs) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            if (0 === docs.length) {
                return xcsutil.safeCallback(cb, null, []);
            } else {
                return xcsutil.safeCallback(cb, null, docs);
            }
        }
    });

};

function processResultSummaryResults(req, summary_only, integrations, cb) {

    var clientVersion = req && req.headers[k.XCSClientVersion];

    // If no version has been specified, assume the latest version
    if (!clientVersion) {
        clientVersion = k.XCSAPIVersion;
    }

    var clientVersionNumber = parseInt(clientVersion, 10),
        integrationSummaries = [];

    if (clientVersionNumber <= 2) {
        if (summary_only === 'true') {
            integrationSummaries = integrations.map(function INSProcessResultSummaryResults(integration) {

                var buildResultSummary = integration.buildResultSummary,
                    result = {
                        _id: integration._id,
                        integrationNumber: integration.number,
                        integrationStep: integration.currentStep,
                        integrationResult: integration.result
                    };

                // Make sure the integration contains build results data...
                if (buildResultSummary) {
                    result.buildResultSummary = buildResultSummary;
                }

                return result;
            });

            return xcsutil.safeCallback(cb, null, integrationSummaries);
        } else {
            return xcsutil.safeCallback(cb, null, integrations);
        }
    } else {
        if (summary_only === 'true') {
            for (var i = 0; i < integrations.length; i++) {
                if (integrations[i].buildResultSummary) {
                    integrationSummaries.push(integrations[i].buildResultSummary);
                }
            }
            return xcsutil.safeCallback(cb, null, integrationSummaries);
        } else {
            return xcsutil.safeCallback(cb, null, integrations);
        }
    }
}

XCSIntegrationSearchClass.prototype.findLastIntegrationsForBot = function findLastIntegrationsForBot(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var timerName = '[Integration] ' + req.method + ' ' + req.url;
    konsole.log(req, timerName);

    if (req && req.snitch) {
        req.snitch.next(timerName);
    }

    var botUUID = (req.params.id || req.query.id),
        lastNumberOfIntegrationsRequested = parseInt(req.query.last, 10),
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        summary_only = (req.query[k.XCSSummaryOnly] || req.query['summary-only']),
        self = this;

    if ((!lastNumberOfIntegrationsRequested) || (lastNumberOfIntegrationsRequested < 1)) {
        lastNumberOfIntegrationsRequested = k.XCSIntegrationsLimit;
    }

    var query = {
        limit: lastNumberOfIntegrationsRequested,
        descending: false
    };

    if (!summary_only) {
        summary_only = false;
    }

    // Select the view based on the query string.
    // The default view isXCSDesignDocumentViewLastIntegrationForBot.

    var view_last = k.XCSDesignDocumentViewLastIntegrationForBot,
        view_byNumber = k.XCSDesignDocumentViewIntegrationsByNumber,
        filter = req.params.filter;

    if ((filter === k.XCSNonFatal) || req.query[k.XCSNonFatal] || req.query['non-fatal']) {
        view_last = k.XCSDesignDocumentViewLastNonFatalIntegrationForBot;
        view_byNumber = k.XCSDesignDocumentViewLastNonFatalIntegrationsByNumber;
    } else if ((filter === k.XCSWithBuildResultSummary) || (req.params[k.XCSWithBuildResultSummary]) || (filter === 'with-build-results') || (req.params['with-build-results'])) {
        view_last = k.XCSDesignDocumentViewLastNonFatalIntegrationWithBuildResultSummaryForBot;
        view_byNumber = k.XCSDesignDocumentViewLastNonFatalIntegrationsByNumber;
    }

    if (!botUUID) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the bot ID has not been specified'
        });
    }

    if (isNaN(lastNumberOfIntegrationsRequested)) {
        // Safety check: if all integrations have been requested, limit it to k.XCSIntegrationsLimit
        lastNumberOfIntegrationsRequested = k.XCSIntegrationsLimit;
    } else if (lastNumberOfIntegrationsRequested < 1) {
        // Safety check: make any value less than zero the last integration
        lastNumberOfIntegrationsRequested = 1;
    }

    if (unitTestUUID) {
        query.startkey = [unitTestUUID, botUUID];
        query.endkey = [unitTestUUID, botUUID, {}];
        query.group_level = 2;
    } else {
        query.startkey = [botUUID];
        query.endkey = [botUUID, {}];
        query.group_level = 1;
    }

    self.findLastIntegrationsForBotWithQuery(req, view_last, botUUID, query, function INSFindLastIntegrationsForBotQuery(err, integrations) {
        if (err && (err.status !== 404)) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {

            // Safety net in case we have caught a 404
            if ((integrations === undefined) || (integrations.length === 0)) {
                xcsutil.profilerSummary(req);
                return xcsutil.standardizedResponse(res, 200, []);
            }

            if (1 === lastNumberOfIntegrationsRequested) {

                var lastIntegrationNumber = integrations[0].value;

                self.findIntegrationWithNumberForBotWithUUID(req, lastIntegrationNumber, botUUID, true, function INSFindLastIntegrationForBotUUID(err, integration) {
                    if (err && (err.status !== 404)) {
                        xcsutil.profilerSummary(req);
                        xcsutil.logLevelDec(req);
                        xcsutil.logLevelCheck(req, logLevel);
                        return xcsutil.standardizedErrorResponse(res, err);
                    } else {
                        processResultSummaryResults(req, summary_only, [integration], function INSFindLastIntegrationForBotProcessResultSummaryResults(err, results) {
                            xcsutil.profilerSummary(req);
                            xcsutil.logLevelDec(req);
                            xcsutil.logLevelCheck(req, logLevel);
                            return xcsutil.standardizedResponse(res, 200, results);
                        });
                    }
                });

            } else {

                // Calculate the range of the last 'N' integrations we're looking for.
                var to = integrations[0].value,

                    // Reset the query
                    query = {
                        include_docs: true,
                        limit: lastNumberOfIntegrationsRequested,
                        descending: true
                    };

                if (unitTestUUID) {
                    query.startkey = [unitTestUUID, botUUID, to];
                    query.endkey = [unitTestUUID, botUUID, 1];
                } else {
                    query.startkey = [botUUID, to];
                    query.endkey = [botUUID, 1];
                }

                self.findLastIntegrationsForBotWithQuery(req, view_byNumber, botUUID, query, function INSFindLastIntegrationsForBotUUID(err, integrations) {
                    if (err && (err.status !== 404)) {
                        xcsutil.profilerSummary(req);
                        xcsutil.logLevelDec(req);
                        xcsutil.logLevelCheck(req, logLevel);
                        return xcsutil.standardizedErrorResponse(res, err);
                    } else {

                        // Safety net in case we have caught a 404
                        if ((integrations === undefined) || (integrations.length === 0)) {
                            xcsutil.profilerSummary(req);
                            xcsutil.logLevelDec(req);
                            xcsutil.logLevelCheck(req, logLevel);
                            return xcsutil.standardizedResponse(res, 200, []);
                        }

                        processResultSummaryResults(req, summary_only, integrations, function INSFindLastIntegrationsForBotProcessResultSummaryResults(err, results) {
                            xcsutil.profilerSummary(req);
                            xcsutil.logLevelDec(req);
                            xcsutil.logLevelCheck(req, logLevel);
                            return xcsutil.standardizedResponse(res, 200, results);
                        });
                    }
                });
            }
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationsForBotWithQuery = function findIntegrationsForBotWithQuery(req, view_name, botUUID, query, performJoin, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        self = this;

    if (unitTestUUID) {
        functionTitle = '[Integration Search - findIntegrationsForBotWithQuery] find last integrations for unit test/bot: ' + unitTestUUID + '/' + botUUID;
    } else {
        functionTitle = '[Integration Search - findIntegrationsForBotWithQuery] find last integrations for bot: ' + botUUID;
    }

    konsole.log(req, functionTitle);

    konsole.debug('[Integration Search - findIntegrationsForBotWithQuery] findLastIntegrationsForBotWithQuery query: ' + JSON.stringify(query, null, 4));

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, view_name, query, function INSFindDocumentsWithQuery(err, docs) {
        if (err) {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            self.joinSubDocumentsForIntegrations(req, docs, performJoin, function INSFindIntegrationsForBotWithQueryJoin(err, joinedIntegrations) {
                xcsutil.logLevelDec(req);
                if (err) {
                    return xcsutil.safeCallback(cb, err);
                } else {
                    return xcsutil.safeCallback(cb, null, joinedIntegrations);
                }
            });
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationsForBot = function findIntegrationsForBot(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationsForBot] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var reasons = [],
        botUUID = req.params.id,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    var self = this,
        from,
        to,
        query = {
            include_docs: true
        },
        summary_only = (req.query[k.XCSSummaryOnly] || req.query['summary-only']);

    if (!botUUID) {
        reasons.push('\'bot ID\' has not been specified');
    }

    if (!summary_only) {
        summary_only = 'false';
    }

    var view_byNumber = k.XCSDesignDocumentViewIntegrationsByNumber,
        filter = req.params.filter;

    if (filter === k.XCSNonFatal || filter === 'non-fatal') {
        view_byNumber = k.XCSDesignDocumentViewLastNonFatalIntegrationsByNumber;
    }

    if (req.query.from && req.query.next) {

        // Next: from -> to (ascending)
        from = parseInt(req.query.from, 10);
        to = 9999999;
        query.limit = parseInt(req.query.next, 10);

        if (unitTestUUID) {
            query.startkey = [unitTestUUID, botUUID, from];
            query.endkey = [unitTestUUID, botUUID, to, {}];
        } else {
            query.startkey = [botUUID, from];
            query.endkey = [botUUID, to, {}];
        }

        // Make sure we have a proper range
        if ((from < 1) || (to < 1) || (to < from)) {
            reasons.push('parameters \'from\' and \'to\' have not be properly specified');
        } else {
            konsole.log(req, '[Integration Search - findIntegrationsForBot] integration range: ' + from + ' -> ' + (from + query.limit - 1) + ' (bot ' + botUUID + ')');
        }

    } else if (req.query.from && req.query.prev) {

        // Previous: to <- from (descending)
        from = parseInt(req.query.from, 10);
        to = 0;

        if (unitTestUUID) {
            query.startkey = [unitTestUUID, botUUID, from];
            query.endkey = [unitTestUUID, botUUID, to, {}];
        } else {
            query.startkey = [botUUID, from];
            query.endkey = [botUUID, to, {}];
        }

        query.descending = true;
        query.limit = parseInt(req.query.prev, 10);

        if (to > from) {
            reasons.push('parameters \'to\' cannot be greater than \'from\'');
        } else {
            konsole.log(req, '[Integration Search - findIntegrationsForBot] integration range: ' + from + ' <- ' + to + '; limit: ' + query.limit + ' (bot ' + botUUID + ')');
        }

    } else {

        // All: put a limit of k.XCSIntegrationsLimit so we don't send *everything*
        query.limit = k.XCSIntegrationsLimit;
    }

    if (reasons.length > 0) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: JSON.stringify(reasons),
            reasons: reasons
        });
    }

    self.findIntegrationsForBotWithQuery(req, view_byNumber, botUUID, query, true, function INSFindIntegrationsForBotQuery(err, integrations) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            processResultSummaryResults(req, summary_only, integrations, function INSFindIntegrationsForBotQueryProcessResultSummaryResults(err, results) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedResponse(res, 200, results);
            });
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationCountForBot = function findIntegrationCountForBot(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationCountForBot] number of integrations';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id,
        query = {
            group_level: 1,
            startkey: [botUUID],
            endkey: [botUUID, {}]
        };

    konsole.log(req, functionTitle);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewIntegrationCountPerBot, query, function INSFindIntegrationCountForBot(err, docs) {
        if (err && (404 !== err.status)) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {

            var count = 0;

            for (var i = 0; i < docs.length; i++) {
                count += docs[i].value;
            }

            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

            return xcsutil.standardizedResponse(res, 200, count);
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationWithNumber = function findIntegrationWithNumber(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationWithNumber]' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id,
        integrationNumber = parseInt(req.query.number, 10),
        summary_only = (req.query[k.XCSSummaryOnly] || req.query['summary-only']),
        self = this;

    if (!summary_only) {
        summary_only = false;
    }

    self.findIntegrationWithNumberForBotWithUUID(req, integrationNumber, botUUID, true, function INSFindIntegrationWithNumber(err, integration) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            processResultSummaryResults(req, summary_only, [integration], function (err, results) {
                return xcsutil.standardizedResponse(res, 200, results);
            });
        }
    });

};

XCSIntegrationSearchClass.prototype.findIssues = function findIssues(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIssues] find issues with integration UUID';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        self = this;

    self.findIssuesForIntegration(req, integrationUUID, function INSFindIssues(err, docs) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSIntegrationSearchClass.prototype.findOrphanedIntegrations = function findOrphanedIntegrations(req, res) {
    var logLevel = xcsutil.logLevelInc(req);
    var functionTitle = '[Integration Search - findOrphanedIntegrations] ' + req.method + ' ' + req.url;
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var clientIdentity = req.connection.getPeerCertificate(),
        fingerprint = clientIdentity.fingerprint;

    var query = {
        key: fingerprint,
        include_docs: true
    };

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsOrphaned, query, function INSFindOrphanedIntegrations(err, docs) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (err && err.status !== 404) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });
};

XCSIntegrationSearchClass.prototype.findIntegration = function findIntegration(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegration] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = (req.params.id || req.query.id),
        self = this;

    self.findIntegrationWithUUID(req, integrationUUID, true, function INSFindIntegrationFindIntegration(err, integration) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else if (integration) {
            return xcsutil.standardizedResponse(res, 200, integration);
        } else {
            return xcsutil.standardizedErrorResponse(res, {
                status: 404,
                message: 'Not found'
            });
        }
    });

};

XCSIntegrationSearchClass.prototype.listByState = function listByState(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - listByState] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var queryObject = url.parse(req.url, true).query,
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = {
            include_docs: true
        },
        self = this;

    if (unitTestUUID) {
        if (queryObject && queryObject.currentStep) {
            query.startkey = [unitTestUUID, queryObject.currentStep];
            query.endkey = [unitTestUUID, queryObject.currentStep, {}];
        } else {
            query.startkey = [unitTestUUID];
            query.endkey = [unitTestUUID, {}];
        }
    } else {
        if (queryObject && queryObject.currentStep) {
            query.startkey = [queryObject.currentStep];
            query.endkey = [queryObject.currentStep, {}];
        }
    }

    self.listByState_internal(req, query, true, function INSListByState(err, docs) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSIntegrationSearchClass.prototype.listByState_internal = function INSListByState_internal(req, query, performJoin, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - listByState_internal] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this;

    self.findIntegrationsByState(req, query, performJoin, function INSFindIntegrationsByState(err, docs) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, err, docs);
    });

};

XCSIntegrationSearchClass.prototype.listRunning = function listRunning(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - listRunning] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = {
            include_docs: false
        };

    if (unitTestUUID) {
        query.startkey = [unitTestUUID];
        query.endkey = [unitTestUUID, {}];
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsRunning, query, function INSListRunning(err, docs) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err && err.status === 404) {
            return xcsutil.standardizedResponse(res, 200, []);
        } else if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSIntegrationSearchClass.prototype.findTestsForDevice = function findTestsForDevice(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findTestsForDevice] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req && req.params.id,
        deviceUUID = req && req.params.did,
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = {
            include_docs: true
        };

    if (unitTestUUID) {
        query.startkey = [unitTestUUID, integrationUUID, deviceUUID];
        query.endkey = [unitTestUUID, integrationUUID, deviceUUID, {}];
    } else {
        query.startkey = [integrationUUID, deviceUUID];
        query.endkey = [integrationUUID, deviceUUID, {}];
    }

    konsole.log(req, '[Integration Search - findTestsForDevice] integration: ' + integrationUUID);
    konsole.log(req, '[Integration Search - findTestsForDevice] deviceUUID: ' + deviceUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentTest, k.XCSDesignDocumentViewTestsForIntegrationByDevice, query, function INSFindTestsForDevice(err, docs) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSIntegrationSearchClass.prototype.findTestsWithKeyPath_internal = function findTestsWithKeyPath_internal(req, integrationUUID, keyPath, deviceIdentifier, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findTestsWithKeyPath_internal] ' + integrationUUID + ' ' + keyPath;

    konsole.log(req, '[Integration Search - findTestsWithKeyPath_internal] integration: ' + integrationUUID);
    konsole.log(req, '[Integration Search - findTestsWithKeyPath_internal] keyPath: ' + keyPath);
    konsole.log(req, '[Integration Search - findTestsWithKeyPath_internal] deviceIdentifier: ' + deviceIdentifier);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = {
            include_docs: true
        };

    if (!integrationUUID) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the integration ID has not been specified'
        });
    }

    if (unitTestUUID) {
        if (deviceIdentifier) {
            query.startkey = [unitTestUUID, integrationUUID, keyPath, deviceIdentifier];
            query.endkey = [unitTestUUID, integrationUUID, keyPath, deviceIdentifier, {}];
        } else if (keyPath) {
            query.startkey = [unitTestUUID, integrationUUID, keyPath];
            query.endkey = [unitTestUUID, integrationUUID, keyPath, {}];
        } else {
            query.startkey = [unitTestUUID, integrationUUID];
            query.endkey = [unitTestUUID, integrationUUID, {}];
        }
    } else {
        if (deviceIdentifier) {
            query.startkey = [integrationUUID, keyPath, deviceIdentifier];
            query.endkey = [integrationUUID, keyPath, deviceIdentifier, {}];
        } else if (keyPath) {
            query.startkey = [integrationUUID, keyPath];
            query.endkey = [integrationUUID, keyPath, {}];
        } else {
            query.startkey = [integrationUUID];
            query.endkey = [integrationUUID, {}];
        }
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsTestInfo, query, function INSFindTestsWithKeyPathInternal(err, docs) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        if (err && err.status !== 404) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs);
        }
    });

};

XCSIntegrationSearchClass.prototype.findTestsBatchWithKeyPaths = function findTestsBatchWithKeyPaths(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findTestsBatchWithKeyPaths] ' + req.method + ' ' + req.url,
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req && req.params.id,
        keyPaths = (req && req.body && req.body.keyPaths || []),
        deviceIdentifier = req && req.params.deviceIdentifier;

    if ((0 === keyPaths.length) && deviceIdentifier) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the keypath cannot be undefined if the device identifier has been specified'
        });
    }

    var testResults = {};

    if (keyPaths.length > 0) {
        konsole.log(req, '[Integration Search - findTestsBatchWithKeyPaths] number of keyPaths to retrieve: ' + keyPaths.length);

        async.each(keyPaths, function INSFindTestsBatchWithKeyPathsIterator(keyPath, callback) {

            konsole.log(req, '[Integration Search - findTestsBatchWithKeyPaths] asking for: ' + keyPath);

            self.findTestsWithKeyPath_internal(req, integrationUUID, keyPath, deviceIdentifier, function INSFindTestsBatchWithKeyPaths(err, docs) {
                if (err) {
                    callback(err);
                } else {
                    testResults[keyPath] = docs;
                    callback();
                }
            });

        }, function INSFindTestsBatchWithKeyPathsFinalizer(err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelCheck(req, logLevel);
            if (err) {
                konsole.error(req, '[Integration Search - findTestsBatchWithKeyPaths] error: ' + JSON.stringify(err));
                xcsutil.logLevelDec(req);
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                konsole.log(req, '[Integration Search - findTestsBatchWithKeyPaths] number of tests found: ' + Object.keys(testResults).length);
                xcsutil.logLevelDec(req);
                return xcsutil.standardizedResponse(res, 200, testResults);
            }
        });
    } else {
        konsole.log(req, '[Integration Search - findTestsBatchWithKeyPaths] retrieving all the integration tests');

        self.findTestsWithKeyPath_internal(req, integrationUUID, null, null, function INSFindTestsBatchForIntegration(err, docs) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelCheck(req, logLevel);
            if (err) {
                konsole.error(req, '[Integration Search - findTestsBatchWithKeyPaths] error: ' + JSON.stringify(err));
                xcsutil.logLevelDec(req);
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                // Organize the test results by document keypath
                async.each(docs, function INSFindTestsBatchForIntegrationIterator(doc, callback) {
                    var list = testResults[doc.keyPath];
                    if (!list) {
                        list = [];
                    }
                    list.push(doc);
                    testResults[doc.keyPath] = list;
                    return callback();
                }, function INSFindTestsBatchForIntegrationFinalizer() {
                    konsole.log(req, '[Integration Search - findTestsBatchWithKeyPaths] number of tests found: ' + Object.keys(testResults).length);
                    xcsutil.logLevelDec(req);
                    return xcsutil.standardizedResponse(res, 200, testResults);
                });
            }
        });
    }

};

XCSIntegrationSearchClass.prototype.findTestsWithKeyPath = function findTestsWithKeyPath(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findTestsWithKeyPath] ' + req.method + ' ' + req.url,
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req && req.params.id,
        keyPath = req && req.params.keyPath,
        deviceIdentifier = req && req.params.deviceIdentifier;

    self.findTestsWithKeyPath_internal(req, integrationUUID, keyPath, deviceIdentifier, function INSFindTestsWithKeyPathCallback(err, docs) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSIntegrationSearchClass.prototype.findTestsForIntegration = function findTestsForIntegration(req, integrationID, unitTestUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findTestsForIntegration] integrationID: ' + integrationID;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {
        include_docs: true
    };

    if (unitTestUUID) {
        query.startkey = [unitTestUUID, integrationID];
        query.endkey = [unitTestUUID, integrationID, {}];
    } else {
        query.startkey = [integrationID];
        query.endkey = [integrationID, {}];
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentTest, k.XCSDesignDocumentViewTestsForIntegrationByDevice, query, function INSFindTestsForIntegration(err, docs) {
        xcsutil.logLevelDec(req);
        if (err && err.status !== 404) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs);
        }
    });
};

/* Module exports */

module.exports = new XCSIntegrationSearchClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/