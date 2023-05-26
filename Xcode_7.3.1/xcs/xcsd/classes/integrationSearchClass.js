'use strict';

var _ = require('underscore'),
    async = require('async'),
    url = require('url');

var k = require('../constants.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    codeCoverageClass = require('./codeCoverageClass.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js');

/* XCSIntegrationSearchClass object */

function XCSIntegrationSearchClass() {}

XCSIntegrationSearchClass.prototype.joinSubDocumentsForIntegrations = function joinSubDocumentsForIntegrations(req, integrations, performJoin, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - joinSubDocumentsForIntegrations] number of integrations to join: ' + integrations.length;

    if (!integrations) {

        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the integrations has not been specified'
        });
    }

    if (false === performJoin) {

        return xcsutil.safeCallback(cb, null, integrations);
    }

    if (0 === integrations.length) {

        return xcsutil.safeCallback(cb, null);
    }

    log.debug('Joining subdocuments for', integrations.length, 'integrations.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var queryBase = {
        include_docs: true,
    };

    async.each(integrations, function INSJoinSubDocumentsForIntegrationsIterate(integration, callback) {
        if (k.XCSIntegrationStepTypeCompleted === integration.currentStep) {
            log.debug('Integration', integration._id, 'is completed, joining subdocuments.');
            var query = JSON.parse(JSON.stringify(queryBase));
            query.key = integration._id;

            dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsSubDocuments, query, function INSJoinSubDocumentsForIntegrationsIterateFindIntegration(err, docs) {

                // Not finding documents doesn't mean it's an error. Let's report true errors instead.

                if (err && err.status !== 404) {
                    err.message = 'Error while fetching subdocuments for integration: ' + err.message;
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
            log.debug('Integration', integration._id, 'is not completed, no need to join subdocuments.');
            return xcsutil.safeCallback(callback);
        }
    }, function INSJoinSubDocumentsForIntegrationsFinalizer(err) {
        if (err) {
            log.error('Error joining subdocuments for integrations:', err);

            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('Successfully joined integration subdocuments.');

            return xcsutil.safeCallback(cb, null, integrations);
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationsForBotDispatcher = function findIntegrationsForBotDispatcher(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findIntegrationsForBotDispatcher] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    log.info('Finding integrations for bot using query', req.query, 'and parameters:', req.params);

    // Verify we support the filter
    var filter = req.params.filter;
    if (filter) {
        var allowedSelections = [k.XCSNonFatal, k.XCSWithBuildResultSummary, 'with-build-results', 'non-fatal'];
        if (allowedSelections.indexOf(filter) === -1) {

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

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findIntegrationsDispatcher] ' + req.method + ' ' + req.url;

    log.info('Finding integrations using query', req.query);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    // Verify we support the filter
    var filters = Object.keys(req.query),
        allowedFilters = ['last', 'number', 'summary_only', 'count', 'id', 'running', 'tag', 'bots', 'filter', 'currentStep'],
        unsupportedFilters = _.difference(filters, allowedFilters);

    if (unsupportedFilters.length) {

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

        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'unable to parse the query string'
        });
    }

};


XCSIntegrationSearchClass.prototype.findIntegrationWithUUID = function findIntegrationWithUUID(req, integrationUUID, performJoin, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findIntegrationWithUUID] find integration with UUID: ' + integrationUUID,
        self = this;

    log.info('Finding integration', integrationUUID);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!integrationUUID) {

        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the integration ID has not been specified'
        });
    }

    dbCoreClass.findDocumentWithUUID(req, integrationUUID, k.XCSDesignDocumentIntegration, function INSFindIntegrationWithUUID(err, integration) {
        if (err) {
            log.error('Could not load integration', integrationUUID + ':', err);

            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug('Integration', integrationUUID, 'loaded successfully, joining integration subdocuments.');
            self.joinSubDocumentsForIntegrations(req, [integration], performJoin, function INSFindIntegrationWithUUIDJoin(err, joinedIntegrations) {
                if (err) {
                    log.error('Could not join subdocuments for integration', integrationUUID + ':', err);

                    return xcsutil.safeCallback(cb, err);
                } else {
                    log.debug('Successfully loaded full integration', integrationUUID);

                    return xcsutil.safeCallback(cb, null, joinedIntegrations[0]);
                }
            });
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationWithNumberForBotWithUUID = function findIntegrationWithNumberForBotWithUUID(req, integrationNumber, botUUID, performJoin, cb) {

    this.findIntegrationsWithNumbersForBotWithUUID(req, [integrationNumber], botUUID, performJoin, function INSFindIntegrationsWithNumbersForBotWithUUID(err, joinedIntegrations) {
        if (err) {

            return xcsutil.safeCallback(cb, err);
        } else {

            return xcsutil.safeCallback(cb, null, joinedIntegrations[0]);
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationsWithNumbersForBotWithUUID = function findIntegrationsWithNumbersForBotWithUUID(req, integrationNumbers, botUUID, performJoin, cb) {

    var log = logger.withRequest(req),
        error = {},
        self = this,
        from,
        to;

    log.info('Finding integrations', integrationNumbers, 'for bot', botUUID);

    if (!integrationNumbers || (0 === integrationNumbers.length)) {

        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the integration numbers have not been specified'
        });
    }

    if (!botUUID) {

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
            log.error('Could not load integrations:', err);

            return xcsutil.safeCallback(cb, err);
        } else {
            if (docs.length > 0) {
                log.debug('Found', docs.length, 'matching integrations.');
                self.joinSubDocumentsForIntegrations(req, docs, performJoin, function INSEmptyIssueDocumentJoin(err, joinedIntegrations) {

                    if (err) {
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        return xcsutil.safeCallback(cb, null, joinedIntegrations);
                    }
                });
            } else {
                error.status = 404;
                error.message = 'Not found';

                return xcsutil.safeCallback(cb, error);
            }
        }
    });

};

XCSIntegrationSearchClass.prototype.findCommitWithUUID = function findCommitWithUUID(req, commitUUID, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findCommitWithUUID] find commit with UUID';

    log.debug('Finding commits with document ID', commitUUID);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!commitUUID) {

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

        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs[0]);
        }
    });

};

XCSIntegrationSearchClass.prototype.findCommitsForIntegration = function findCommitsForIntegration(req, integrationUUID, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findCommitsForIntegration] findCommitsForIntegration';

    log.info('Fetching commits for integration', integrationUUID);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {
        include_docs: true,
        key: integrationUUID
    };

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentCommit, k.XCSDesignDocumentViewCommitsByIntegrationID, query, function INSFindCommitsForIntegration(err, docs) {

        return xcsutil.safeCallback(cb, err, docs);
    });

};

XCSIntegrationSearchClass.prototype.findCommits = function findCommits(req, res) {

    var functionTitle = '[Integration Search - findCommits] find commit history with integration UUID';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        self = this;

    self.findCommitsForIntegration(req, integrationUUID, function INSFindCommits(err, docs) {

        xcsutil.profilerSummary(req);


        // Not finding documents doesn't mean it's an error. Let's report true errors instead.

        if (err && err.status !== 404) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSIntegrationSearchClass.prototype.findIssuesForIntegration = function findIssuesForIntegration(req, integrationUUID, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findIssuesForIntegration] findIssuesForIntegration';

    log.debug('Finding issues for integration', integrationUUID);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query = {
        include_docs: true,
        key: integrationUUID
    };

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIssue, k.XCSDesignDocumentViewIssuesByIntegrationID, query, function INSFindIssuesForIntegration(err, docs) {

        return xcsutil.safeCallback(cb, err, docs);
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationsByState = function findIntegrationsByState(req, query, performJoin, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findIntegrationsByState] find integration by state: ' + query.startkey,
        self = this;

    log.debug('Fetching integrations with state', query.startkey);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsByStep, query, function INSFindIntegrationsByState(err, docs) {
        if (err && err.status === 404) {
            // Not found: not a true error. Just return an empty array.

            return xcsutil.safeCallback(cb, null, []);
        } else if (err) {
            // Any other error, we pass along.


            return xcsutil.safeCallback(cb, err);
        } else {
            self.joinSubDocumentsForIntegrations(req, docs, performJoin, function INSFindIntegrationsByStateJoin(err, joinedIntegrations) {


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

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findPendingIntegrations] find pending integrations';

    log.info('Fetching pending integrations.');

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

    var timerName = '[Integration] findLastIntegrationsForBotWithQuery';

    if (req && req.snitch) {
        req.snitch.next(timerName);
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, view_name, query, function INSFindLastIntegrationsForBotWithQuery(err, docs) {
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

function processResultSummaryResults(req, self, summary_only, integrations, cb) {

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
            self.synthesizeMissingIntegrationProperties(req, integrations, function () {
                return xcsutil.safeCallback(cb, null, integrations);
            });
        }
    }
}

XCSIntegrationSearchClass.prototype.findLastIntegrationsForBot = function findLastIntegrationsForBot(req, res) {

    var log = logger.withRequest(req),
        timerName = '[Integration] ' + req.method + ' ' + req.url;


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

    log.info('Finding last', lastNumberOfIntegrationsRequested, 'integrations for bot', botUUID);

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


                        return xcsutil.standardizedErrorResponse(res, err);
                    } else {
                        processResultSummaryResults(req, self, summary_only, [integration], function INSFindLastIntegrationForBotProcessResultSummaryResults(err, results) {
                            xcsutil.profilerSummary(req);


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


                        return xcsutil.standardizedErrorResponse(res, err);
                    } else {

                        // Safety net in case we have caught a 404
                        if ((integrations === undefined) || (integrations.length === 0)) {
                            xcsutil.profilerSummary(req);


                            return xcsutil.standardizedResponse(res, 200, []);
                        }

                        processResultSummaryResults(req, self, summary_only, integrations, function INSFindLastIntegrationsForBotProcessResultSummaryResults(err, results) {
                            xcsutil.profilerSummary(req);


                            return xcsutil.standardizedResponse(res, 200, results);
                        });
                    }
                });
            }
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationsForBotWithQuery = function findIntegrationsForBotWithQuery(req, view_name, botUUID, query, performJoin, cb) {

    var functionTitle,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        self = this;

    if (unitTestUUID) {
        functionTitle = '[Integration Search - findIntegrationsForBotWithQuery] find last integrations for unit test/bot: ' + unitTestUUID + '/' + botUUID;
    } else {
        functionTitle = '[Integration Search - findIntegrationsForBotWithQuery] find last integrations for bot: ' + botUUID;
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, view_name, query, function INSFindDocumentsWithQuery(err, docs) {
        if (err) {

            return xcsutil.safeCallback(cb, err);
        } else {
            self.joinSubDocumentsForIntegrations(req, docs, performJoin, function INSFindIntegrationsForBotWithQueryJoin(err, joinedIntegrations) {

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

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findIntegrationsForBot] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var reasons = [],
        botUUID = req.params.id,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    log.info('Finding integrations for bot', botUUID);

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
            log.debug('Finding integrations from', from, 'to', (from + query.limit - 1));
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
            log.debug('Finding integrations from', from, 'to', to, 'with limit', query.limit);
        }

    } else {

        // All: put a limit of k.XCSIntegrationsLimit so we don't send *everything*
        query.limit = k.XCSIntegrationsLimit;
    }

    if (reasons.length > 0) {
        xcsutil.profilerSummary(req);



        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: JSON.stringify(reasons),
            reasons: reasons
        });
    }

    self.findIntegrationsForBotWithQuery(req, view_byNumber, botUUID, query, true, function INSFindIntegrationsForBotQuery(err, integrations) {
        if (err) {
            xcsutil.profilerSummary(req);


            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            processResultSummaryResults(req, self, summary_only, integrations, function INSFindIntegrationsForBotQueryProcessResultSummaryResults(err, results) {
                xcsutil.profilerSummary(req);


                return xcsutil.standardizedResponse(res, 200, results);
            });
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationCountForBot = function findIntegrationCountForBot(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findIntegrationCountForBot] number of integrations';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id,
        query = {
            group_level: 1,
            startkey: [botUUID],
            endkey: [botUUID, {}]
        };

    log.info('Loading integration count for bot', botUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewIntegrationCountPerBot, query, function INSFindIntegrationCountForBot(err, docs) {
        if (err && (404 !== err.status)) {
            xcsutil.profilerSummary(req);


            return xcsutil.standardizedErrorResponse(res, err);
        } else {

            var count = 0;

            for (var i = 0; i < docs.length; i++) {
                count += docs[i].value;
            }

            xcsutil.profilerSummary(req);



            return xcsutil.standardizedResponse(res, 200, count);
        }
    });

};

XCSIntegrationSearchClass.prototype.findIntegrationWithNumber = function findIntegrationWithNumber(req, res) {



    var functionTitle = '[Integration Search - findIntegrationWithNumber]' + req.method + ' ' + req.url;

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


        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            processResultSummaryResults(req, self, summary_only, [integration], function (err, results) {
                return xcsutil.standardizedResponse(res, 200, results);
            });
        }
    });

};

XCSIntegrationSearchClass.prototype.findOrphanedIntegrations = function findOrphanedIntegrations(req, res) {

    var log = logger.withRequest(req),
        self = this,
        functionTitle = '[Integration Search - findOrphanedIntegrations] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var clientIdentity = req.connection.getPeerCertificate(),
        fingerprint = clientIdentity.fingerprint;

    var query = {
        key: fingerprint,
        include_docs: true
    };

    log.info('Fetching integrations that have been orphaned by build service', fingerprint);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsOrphaned, query, function INSFindOrphanedIntegrations(err, docs) {
        xcsutil.profilerSummary(req);
        if (err && err.status !== 404) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            self.synthesizeMissingIntegrationProperties(req, docs, function () {
                return xcsutil.standardizedResponse(res, 200, docs);
            });
        }
    });
};

XCSIntegrationSearchClass.prototype.findIntegration = function findIntegration(req, res) {

    var functionTitle = '[Integration Search - findIntegration] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = (req.params.id || req.query.id),
        self = this;

    self.findIntegrationWithUUID(req, integrationUUID, true, function INSFindIntegrationFindIntegration(err, integration) {
        xcsutil.profilerSummary(req);



        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else if (integration) {
            self.synthesizeMissingIntegrationProperties(req, [integration], function () {
                return xcsutil.standardizedResponse(res, 200, integration);
            });
        } else {
            return xcsutil.standardizedErrorResponse(res, {
                status: 404,
                message: 'Not found'
            });
        }
    });

};

XCSIntegrationSearchClass.prototype.listByState = function listByState(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - listByState] ' + req.method + ' ' + req.url;

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

    log.info('Listing integrations with state', queryObject.currentStep);

    self.listByState_internal(req, query, true, function INSListByState(err, docs) {
        xcsutil.profilerSummary(req);


        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSIntegrationSearchClass.prototype.listByState_internal = function INSListByState_internal(req, query, performJoin, cb) {

    var functionTitle = '[Integration Search - listByState_internal] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this;

    self.findIntegrationsByState(req, query, performJoin, function INSFindIntegrationsByState(err, docs) {

        return xcsutil.safeCallback(cb, err, docs);
    });

};

XCSIntegrationSearchClass.prototype.listRunning = function listRunning(req, res) {

    var log = logger.withRequest(req),
        self = this,
        functionTitle = '[Integration Search - listRunning] ' + req.method + ' ' + req.url;

    log.info('Listing currently running integrations.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = {
            include_docs: true
        };

    if (unitTestUUID) {
        query.startkey = [unitTestUUID];
        query.endkey = [unitTestUUID, {}];
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsRunning, query, function INSListRunning(err, docs) {
        xcsutil.profilerSummary(req);


        if (err && err.status === 404) {
            return xcsutil.standardizedResponse(res, 200, []);
        } else if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            self.synthesizeMissingIntegrationProperties(req, docs, function () {
                return xcsutil.standardizedResponse(res, 200, docs);
            });
        }
    });

};

XCSIntegrationSearchClass.prototype.findTestsForDevice = function findTestsForDevice(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findTestsForDevice] ' + req.method + ' ' + req.url;

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

    log.info('Fetching tests for integration', integrationUUID, 'and device', deviceUUID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentTest, k.XCSDesignDocumentViewTestsForIntegrationByDevice, query, function INSFindTestsForDevice(err, docs) {
        xcsutil.profilerSummary(req);


        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSIntegrationSearchClass.prototype.findTestsWithKeyPath_internal = function findTestsWithKeyPath_internal(req, integrationUUID, keyPath, deviceIdentifier, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findTestsWithKeyPath_internal] ' + integrationUUID + ' ' + keyPath;

    log.info('Fetching tests for integration', integrationUUID, 'with keypath', keyPath, 'and device', deviceIdentifier);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = {
            include_docs: true
        };

    if (!integrationUUID) {
        xcsutil.profilerSummary(req);

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

        if (err && err.status !== 404) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs);
        }
    });

};

XCSIntegrationSearchClass.prototype.findTestsBatchWithKeyPaths = function findTestsBatchWithKeyPaths(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findTestsBatchWithKeyPaths] ' + req.method + ' ' + req.url,
        self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req && req.params.id,
        keyPaths = (req && req.body && req.body.keyPaths || []),
        deviceIdentifier = req && req.params.deviceIdentifier;

    log.info('Fetching', keyPaths.length, 'batch tests for integration', integrationUUID, 'and device', deviceIdentifier);

    if ((0 === keyPaths.length) && deviceIdentifier) {
        xcsutil.profilerSummary(req);

        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the keypath cannot be undefined if the device identifier has been specified'
        });
    }

    var testResults = {};

    if (keyPaths.length > 0) {
        async.each(keyPaths, function INSFindTestsBatchWithKeyPathsIterator(keyPath, callback) {
            log.debug('Finding tests with keypath', keyPath);

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

            if (err) {
                log.error('Could not load tests:', err);

                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                log.debug('Found', Object.keys(testResults).length, 'tests.');

                return xcsutil.standardizedResponse(res, 200, testResults);
            }
        });
    } else {
        log.debug('Fetching all tests for this integration.');

        self.findTestsWithKeyPath_internal(req, integrationUUID, null, null, function INSFindTestsBatchForIntegration(err, docs) {
            xcsutil.profilerSummary(req);

            if (err) {
                log.error('Could not load tests:', err);

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
                    log.debug('Found', Object.keys(testResults).length, 'tests.');

                    return xcsutil.standardizedResponse(res, 200, testResults);
                });
            }
        });
    }

};

XCSIntegrationSearchClass.prototype.findTestsWithKeyPath = function findTestsWithKeyPath(req, res) {

    var functionTitle = '[Integration Search - findTestsWithKeyPath] ' + req.method + ' ' + req.url,
        self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req && req.params.id,
        keyPath = req && req.params.keyPath,
        deviceIdentifier = req && req.params.deviceIdentifier;

    self.findTestsWithKeyPath_internal(req, integrationUUID, keyPath, deviceIdentifier, function INSFindTestsWithKeyPathCallback(err, docs) {
        xcsutil.profilerSummary(req);


        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSIntegrationSearchClass.prototype.findTestsForIntegration = function findTestsForIntegration(req, integrationID, unitTestUUID, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - findTestsForIntegration] integrationID: ' + integrationID;

    log.debug('Finding tests for integration', integrationID);

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
        if (err && err.status !== 404) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs);
        }
    });
};

XCSIntegrationSearchClass.prototype.synthesizeMissingIntegrationProperties = function (req, integrationList, cb) {

    async.each(integrationList, function (integration, callback) {
        if (undefined === integration[k.XCSDesignDocumentViewIntegrationHasCoverageData]) {
            var integrationUUID = integration._id;
            codeCoverageClass.findCodeCoverageIntegrationMasterDocument(req, integrationUUID, function (err) {
                integration[k.XCSDesignDocumentViewIntegrationHasCoverageData] = !err;
                callback();
            });
        } else {
            callback();
        }
    }, function () {
        return xcsutil.safeCallback(cb);
    });

};

XCSIntegrationSearchClass.prototype.integrationBuildQueue = function (req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration Search - integrationBuildQueue] Retrieving the integration queue';

    log.debug('Retrieving the integration queue');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var query,
        integrationQueue,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    async.waterfall([
        function (callback) {
                log.debug('Building integrationQueue...');

                query = {
                    include_docs: true
                };

                if (unitTestUUID) {
                    query.startkey = [unitTestUUID];
                    query.endkey = [unitTestUUID, {}];
                }

                dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationQueue, query, callback);
        },
        function (docs, callback) {
                integrationQueue = docs;
                log.debug('Building botETAStats...');
                calculateBotETAStats(req, integrationQueue, callback);
        }
    ],
        function (err) {
            if (err && 404 !== err.status) {
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                if (err && 404 === err.status) {
                    integrationQueue = [];
                }
                return xcsutil.standardizedResponse(res, 200, integrationQueue);
            }
        });

};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSIntegrationSearchClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function calculateBotETAStats(req, integrationQueue, cb) {

    async.forEachOfSeries(integrationQueue, function (integration, index, eachCallback) {
            var query = {
                startkey: [integration.bot._id],
                endkey: [integration.bot._id, {}],
                group_level: 1,
                include_docs: false
            };
            dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewAverageIntegrationTime, query, function INSIntegrationBuildQueueStats(err, stats) {
                if (err && err.status !== 404) {
                    eachCallback(err);
                } else {

                    // Calculate the average time
                    if (stats.length > 0) {
                        var stat = stats[0].value;
                        stat.avg = (stat.sum / stat.count);
                        integration.durationStats = stat;
                    } else {
                        // Without stats, we cannot calculate the estimated completion time
                        return eachCallback({
                            status: 404
                        });
                    }

                    var expectedStartDate;

                    // Calculate the expected completion date
                    if (integration.startedTime) {

                        // This integration has started already, so the estimated completion date is started time + average integration time for the bot
                        expectedStartDate = new Date(integration.startedTime);
                        calculateEstimatedCompletionISODateString(integration, expectedStartDate);

                    } else {

                        if (0 === index) {

                            // This pending integration is the first in the list, so the estimated completed date
                            // is the expected start date + average integration time for the bot
                            expectedStartDate = new Date();
                            integration.expectedStartDate = expectedStartDate.toISOString();
                            calculateEstimatedCompletionISODateString(integration, expectedStartDate);

                        } else {

                            // This pending integration is not the first in the list, so the estimated completed date
                            // is the previous integration's expected completion date + average integration time for the bot
                            var previousIntegration = integrationQueue[index - 1];

                            integration.expectedStartDate = previousIntegration.expectedCompletionDate;
                            var previousExpectedCompletionDate = new Date(integration.expectedStartDate);

                            // Set the expected start date
                            calculateEstimatedCompletionISODateString(integration, previousExpectedCompletionDate);

                        }

                    }

                    eachCallback();
                }
            });
        },
        function (err) {
            if (err && (404 === err.status)) {
                err = null;
            }
            xcsutil.safeCallback(cb, err);
        });

}

function calculateEstimatedCompletionISODateString(integration, expectedCompletionDate) {
    expectedCompletionDate.setSeconds(expectedCompletionDate.getSeconds() + integration.durationStats.avg);
    integration.expectedCompletionDate = expectedCompletionDate.toISOString();
}