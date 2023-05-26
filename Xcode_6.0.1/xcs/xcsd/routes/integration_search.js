'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    async = require('async'),
    db_core = require('./db_core.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    security = require('../util/xcssecurity.js'),
    url = require('url');

var integration_search = {};

integration_search.joinSubDocumentsForIntegrations = function (req, integrations, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - joinSubDocumentsForIntegrations] number of integrations to join: ' + integrations.length;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    if (!integrations) {
        var error = {};
        error.status = 400;
        error.message = 'Bad request';
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    if (0 === integrations.length) {
        xcsutil.logLevelDec(req);
        return cb(null);
    }

    var queryBase = {
        include_docs: true,
    };

    async.each(integrations, function (integration, callback) {
        if (k.XCSIntegrationStepTypeCompleted === integration.currentStep) {
            var query = JSON.parse(JSON.stringify(queryBase));
            query.key = integration._id;

            db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsSubDocuments, query, function (err, docs) {

                // Not finding documents doesn't mean it's an error. Let's report true errors instead.

                if (err && err.status !== 404) {
                    konsole.log(req, '[Integration Search - joinSubDocumentsForIntegrations] Error: ' + err.message);
                    return callback(err);
                } else {
                    for (var i = 0; i < docs.length; i++) {
                        var doc = docs[i],
                            property = doc.doc_type;
                        integration[property] = doc[property];
                    }
                    return callback();
                }

            });
        } else {
            return callback();
        }
    }, function (err) {
        if (err) {
            konsole.error(req, '[Integration Search - joinSubDocumentsForIntegrations] error: ' + err.message);
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            konsole.log(req, '[Integration Search - joinSubDocumentsForIntegrations] done.');
            xcsutil.logLevelDec(req);
            return cb(null, integrations);
        }
    });

};

integration_search.findIntegrationsForBotDispatcher = function (req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationsForBotDispatcher] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    // Verify we support the filter
    if (req.params.filter) {
        var filters = [k.XCSNonFatal, k.XCSWithBuildResultSummary];
        if (filters.indexOf(req.params.filter) === -1) {
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedErrorResponse(res, {
                status: 400,
                message: 'Bad request'
            });
        }
    }

    var self = integration_search;

    if (req.query.last) {

        // Dispatcher to deal with the last integrations
        self.findLastIntegrationsForBot(req, res);

    } else if (req.query.from) {

        // Dispatcher used to deal with range-based integration queries (both next and previous)
        self.findIntegrationsForBot(req, res);

    } else if (req.query.number) {

        // Dispatcher used to deal with bot/integration number based queries
        self.findIntegrationWithNumber(req, res);

    } else if (req.params.filter) {

        // Dispatcher to deal with the last integrations
        self.findLastIntegrationsForBot(req, res);

    } else {

        // Dispatcher to deal with all integrations
        self.findLastIntegrationsForBot(req, res);

    }

};

integration_search.findIntegrationWithUUID = function (req, integrationUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationWithUUID] find integration with UUID: ' + integrationUUID + '...',
        self = integration_search;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    if (!integrationUUID) {
        var error = {};
        error.status = 400;
        error.message = 'Bad request';
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    db_core.findDocumentWithUUID(req, integrationUUID, k.XCSDesignDocumentIntegration, function (err, integration) {
        if (err) {
            konsole.error(req, '[Integration Search - findIntegrationWithUUID] error: ' + err.message);
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            konsole.log(req, '[Integration Search - findIntegrationWithUUID] joining integration subdocuments...');
            self.joinSubDocumentsForIntegrations(req, [integration], function (err, joinedIntegrations) {
                if (err) {
                    konsole.error(req, '[Integration Search - findIntegrationWithUUID] error: ' + err.message);
                    xcsutil.logLevelDec(req);
                    return cb(err);
                } else {
                    konsole.log(req, '[Integration Search - findIntegrationWithUUID] done.');
                    xcsutil.logLevelDec(req);
                    return cb(null, joinedIntegrations[0]);
                }
            });
        }
    });

};

integration_search.findIntegrationWithNumberForBotWithUUID = function (req, integrationNumber, botUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationWithNumberForBotWithUUID] find integration with UUID...',
        self = integration_search;

    konsole.log(req, functionTitle);

    self.findIntegrationsWithNumbersForBotWithUUID(req, [integrationNumber], botUUID, function (err, joinedIntegrations) {
        xcsutil.logLevelDec(req);
        if (err) {
            konsole.error(req, '[Integration Search - findIntegrationWithNumberForBotWithUUID] error: ' + err.message);
            return cb(err);
        } else {
            return cb(null, joinedIntegrations[0]);
        }
    });

};

integration_search.findIntegrationsWithNumbersForBotWithUUID = function (req, integrationNumbers, botUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationWithNumberForBotWithUUID] find integration with UUID...',
        error = {},
        self = integration_search,
        from,
        to;

    konsole.log(req, functionTitle);

    if (!integrationNumbers || (0 === integrationNumbers.length) || !botUUID) {
        error.status = 400;
        error.message = 'Bad request: integration numbers or bot ID missing';
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    if (integrationNumbers.length > 1) {
        integrationNumbers.sort(function (a, b) {
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
        include_docs: true,
        limit: 1
    };

    // Select the view based on the query string.
    // The default view XCSDesignDocumentViewIntegrationsByNumber.

    var view_byNumber = k.XCSDesignDocumentViewIntegrationsByNumber,
        filter = (req ? req.params.filter : null);

    if (filter === k.XCSNonFatal) {
        view_byNumber = k.XCSDesignDocumentViewLastNonFatalIntegrationsByNumber;
    }

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, view_byNumber, query, function (err, docs) {
        if (err) {
            konsole.error(req, '[Integration Search - findIntegrationWithNumberForBotWithUUID] error: ' + err.message);
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            if (docs.length > 0) {
                konsole.log(req, '[Integration Search - findIntegrationWithNumberForBotWithUUID] found.');
                self.joinSubDocumentsForIntegrations(req, docs, function (err, joinedIntegrations) {
                    xcsutil.logLevelDec(req);
                    if (err) {
                        return cb(err);
                    } else {
                        return cb(null, joinedIntegrations);
                    }
                });
            } else {
                error.status = 404;
                error.message = 'Not found';
                xcsutil.logLevelDec(req);
                return cb(error);
            }
        }
    });

};

integration_search.findCommitWithUUID = function (req, commitUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findCommitWithUUID] find commit with UUID...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    if (!commitUUID) {
        var error = {};
        error.status = 400;
        error.message = 'Bad request';

        xcsutil.logLevelDec(req);
        return cb(error);
    }

    var query = {
        include_docs: true,
        key: commitUUID
    };

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentCommit, k.XCSDesignDocumentViewAllCommits, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err) {
            return cb(err);
        } else {
            return cb(null, docs[0]);
        }
    });

};

integration_search.findIssueWithUUID = function (req, issueUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIssueWithUUID] find issue with UUID...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    if (!issueUUID) {
        var error = {};
        error.status = 400;
        error.message = 'Bad request';

        xcsutil.logLevelDec(req);
        return cb(error);
    }

    var query = {
        include_docs: true,
        key: issueUUID
    };

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentIssue, k.XCSDesignDocumentViewAllIssues, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err) {
            return cb(err);
        } else {
            return cb(null, docs[0]);
        }
    });

};

integration_search.findCommitsForIntegration = function (req, integrationUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findCommitsForIntegration] findCommitsForIntegration...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var query = {
        include_docs: true,
        key: integrationUUID
    };

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentCommit, k.XCSDesignDocumentViewCommitsByIntegrationID, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        cb(err, docs);
    });

};

integration_search.findCommits = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findCommits] find commit history with integration UUID...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        self = integration_search;

    if (!integrationUUID) {
        xcsutil.profilerSummary(req);
        var error = {};
        error.status = 400;
        error.message = 'Bad request';
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, error);
    }

    self.findCommitsForIntegration(req, integrationUUID, function (err, docs) {

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

integration_search.findIssuesForIntegration = function (req, integrationUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIssuesForIntegration] findIssuesForIntegration...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var query = {
        include_docs: true,
        key: integrationUUID
    };

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentIssue, k.XCSDesignDocumentViewIssuesByIntegrationID, query, function (err, docs) {
        if (err) {
            konsole.log(req, '[Integration Search - findIssuesForIntegration] error: ' + err.message);
        } else {
            konsole.log(req, '[Integration Search - findIssuesForIntegration] success.');
        }
        xcsutil.logLevelDec(req);
        return cb(err, docs);
    });

};

integration_search.findIntegrationsByState = function (req, query, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationsByState] find integration by state: ' + query.startkey + '...',
        self = integration_search;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsByStep, query, function (err, docs) {
        if (err && err.status === 404) {
            // Not found: not a true error. Just return an empty array.

            xcsutil.logLevelDec(req);
            return cb(null, []);
        } else if (err) {
            // Any other error, we pass along.

            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            // We found integrations, so we join them.
            self.joinSubDocumentsForIntegrations(req, docs, function (err, joinedIntegrations) {

                xcsutil.logLevelDec(req);
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, joinedIntegrations);
                }
            });
        }
    });

};

integration_search.findPendingIntegrations = function (req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findPendingIntegrations] find pending integrations...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var self = integration_search,
        query = {
            include_docs: true
        };

    query.startkey = [k.XCSIntegrationStepTypePending];
    query.endkey = [k.XCSIntegrationStepTypePending, {}];

    self.findIntegrationsByState(req, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        xcsutil.profilerSummary(req);
        return cb(err, docs && docs.filter(function (doc) {
            // only return integrations that aren't from a unit test
            return !doc.xcsunittest;
        }));
    });

};

integration_search.findLastIntegrationsForBotWithQuery = function (req, view_name, botUUID, query, cb) {

    xcsutil.logLevelInc(req);

    var timerName = '[Integration] findLastIntegrationsForBotWithQuery',
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    konsole.log(req, timerName);

    if (req && req.snitch) {
        req.snitch.title = timerName;
        req.snitch.next(timerName);
    }

    konsole.log(req, '[Integration] unitTestUUID: ' + unitTestUUID);
    konsole.log(req, '[Integration] botUUID: ' + botUUID);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, view_name, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err) {
            return cb(err);
        } else {
            if (0 === docs.length) {
                return cb(null, []);
            } else {
                return cb(null, docs);
            }
        }
    });

};

function processSummaryOnlyResults(summary_only, integrations, cb) {

    if (summary_only === 'true') {
        var integrationSummaries = integrations.map(function (integration) {

            var buildResultSummary = integration.buildResultSummary;

            // Make sure the integration contains build results data...
            if (buildResultSummary) {
                return {
                    _id: integration._id,
                    integrationNumber: integration.number,
                    integrationStep: integration.currentStep,
                    buildResultSummary: buildResultSummary
                };
            } else {
                return {
                    _id: integration._id,
                    integrationNumber: integration.number,
                    integrationStep: integration.currentStep
                };
            }

        });

        return cb(null, integrationSummaries);
    } else {
        return cb(null, integrations);
    }

}

integration_search.findLastIntegrationsForBot = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var timerName = '[Integration] ' + req.method + ' ' + req.url;
    konsole.log(req, timerName);

    if (req && req.snitch) {
        req.snitch.title = timerName;
        req.snitch.next(timerName);
    }

    var botUUID = req.params.id,
        lastNumberOfIntegrationsRequested = parseInt(req.query.last, 10),
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        query = {
            limit: 1,
            descending: false
        },
        error = {},
        summary_only = req.query.summary_only,
        self = integration_search;

    if (!summary_only) {
        summary_only = false;
    }

    // Select the view based on the query string.
    // The default view isXCSDesignDocumentViewLastIntegrationForBot.

    var view_last = k.XCSDesignDocumentViewLastIntegrationForBot,
        view_byNumber = k.XCSDesignDocumentViewIntegrationsByNumber,
        filter = req.params.filter;

    if (filter === k.XCSNonFatal) {
        view_last = k.XCSDesignDocumentViewLastNonFatalIntegrationForBot;
        view_byNumber = k.XCSDesignDocumentViewLastNonFatalIntegrationsByNumber;
    } else if (filter === k.XCSWithBuildResultSummary) {
        view_last = k.XCSDesignDocumentViewLastNonFatalIntegrationWithBuildResultSummaryForBot;
        view_byNumber = k.XCSDesignDocumentViewLastNonFatalIntegrationsByNumber;
    }

    if (!botUUID) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        error.status = 400;
        error.message = 'Bad request';
        return xcsutil.standardizedErrorResponse(res, error);
    }

    // Safety check: make any value less than zero the last integration
    if (isNaN(lastNumberOfIntegrationsRequested)) {
        lastNumberOfIntegrationsRequested = 10;
    } else if (lastNumberOfIntegrationsRequested < 1) {
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

    self.findLastIntegrationsForBotWithQuery(req, view_last, botUUID, query, function (err, integrations) {
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

                self.findIntegrationWithNumberForBotWithUUID(req, lastIntegrationNumber, botUUID, function (err, integration) {
                    if (err && (err.status !== 404)) {
                        xcsutil.profilerSummary(req);
                        xcsutil.logLevelDec(req);
                        xcsutil.logLevelCheck(req, logLevel);
                        return xcsutil.standardizedErrorResponse(res, err);
                    } else {
                        processSummaryOnlyResults(summary_only, [integration], function (err, results) {
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

                self.findLastIntegrationsForBotWithQuery(req, view_byNumber, botUUID, query, function (err, integrations) {
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

                        processSummaryOnlyResults(summary_only, integrations, function (err, results) {
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

integration_search.findIntegrationsForBotWithQuery = function (req, view_name, botUUID, query, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        self = integration_search;

    if (unitTestUUID) {
        functionTitle = '[Integration Search - findIntegrationsForBotWithQuery] find last integrations for unit test/bot: ' + unitTestUUID + '/' + botUUID + '...';
    } else {
        functionTitle = '[Integration Search - findIntegrationsForBotWithQuery] find last integrations for bot: ' + botUUID + '...';
    }

    konsole.log(req, functionTitle);

    konsole.debug('[Integration Search - findIntegrationsForBotWithQuery] findLastIntegrationsForBotWithQuery query: ' + JSON.stringify(query, null, 4));

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, view_name, query, function (err, docs) {
        if (err) {
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            self.joinSubDocumentsForIntegrations(req, docs, function (err, joinedIntegrations) {
                xcsutil.logLevelDec(req);
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, joinedIntegrations);
                }
            });
        }
    });

};

integration_search.findIntegrationsForBot = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationsForBot] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    var self = integration_search,
        from,
        to,
        badRequest = false,
        query = {
            include_docs: true
        },
        summary_only = req.query.summary_only;

    if (!summary_only) {
        summary_only = 'false';
    }

    var view_byNumber = k.XCSDesignDocumentViewIntegrationsByNumber,
        filter = req.params.filter;

    if (filter === k.XCSNonFatal) {
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
            badRequest = true;
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
            badRequest = true;
        } else {
            konsole.log(req, '[Integration Search - findIntegrationsForBot] integration range: ' + from + ' <- ' + to + '; limit: ' + query.limit + ' (bot ' + botUUID + ')');
        }

    } else {

        // All: put a limit of 10 so we don't send *everything*
        query.limit = 10;
    }

    if (!botUUID || badRequest) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }

    self.findIntegrationsForBotWithQuery(req, view_byNumber, botUUID, query, function (err, integrations) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            processSummaryOnlyResults(summary_only, integrations, function (err, results) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedResponse(res, 200, results);
            });
        }
    });

};

integration_search.findIntegrationCountForBot = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationCountForBot] number of integrations' + '...';

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

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentBot, k.XCSDesignDocumentViewIntegrationCountPerBot, query, function (err, docs) {
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

integration_search.findIntegrationWithNumber = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegrationWithNumber]' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var botUUID = req.params.id,
        integrationNumber = parseInt(req.query.number, 10),
        self = integration_search;

    self.findIntegrationWithNumberForBotWithUUID(req, integrationNumber, botUUID, function (err, integration) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, integration);
        }
    });

};

integration_search.findIssues = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIssues] find issues with integration UUID...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id;

    var self = integration_search;

    if (!integrationUUID) {
        var error = {};
        error.status = 400;
        error.message = 'Bad request';
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, error);
    }

    self.findIssuesForIntegration(req, integrationUUID, function (err, docs) {
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

integration_search.findOrphanedIntegrations = function (req, res) {
    var logLevel = xcsutil.logLevelInc(req);
    var functionTitle = '[Integration Search - findOrphanedIntegrations] ' + req.method + ' ' + req.url + '...';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var clientIdentity = req.connection.getPeerCertificate(),
        fingerprint = clientIdentity.fingerprint;

    var query = {
        key: fingerprint,
        include_docs: true
    };

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsOrphaned, query, function (err, docs) {
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

integration_search.findIntegration = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findIntegration] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        self = integration_search;

    self.findIntegrationWithUUID(req, integrationUUID, function (err, integration) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            if (integration) {
                // if this is the build service assigned to this integration, annotate with credentials
                if (req.connection.authorized) {
                    var clientIdentity = req.connection.getPeerCertificate();
                    if (clientIdentity && clientIdentity.fingerprint && integration.buildServiceFingerprint === clientIdentity.fingerprint) {
                        var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
                        return keychain.findItem(req, integration._id, integration.bot._id, function (err, blueprintBuf) {

                            // if an error happens, we don't want to abort, but we should log it
                            if (err) {
                                konsole.log(req, '[Integration Search - findIntegration] Error annotating integration with credentials: ' + err);
                            } else {
                                // parse the blueprint and annotate the integration
                                var blueprint = JSON.parse(blueprintBuf.toString('utf8'));
                                integration.bot.configuration.sourceControlBlueprint = blueprint;
                            }

                            xcsutil.profilerSummary(req);
                            xcsutil.logLevelDec(req);
                            xcsutil.logLevelCheck(req, logLevel);

                            return xcsutil.standardizedResponse(res, 200, integration);
                        });
                    }
                }

                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedResponse(res, 200, integration);
            } else {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedErrorResponse(res, {
                    status: 404,
                    message: 'Not found'
                });
            }
        }
    });

};

integration_search.listByState = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - listByState] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var queryObject = url.parse(req.url, true).query,
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = {
            include_docs: true
        },
        self = integration_search;

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

    self.findIntegrationsByState(req, query, function (err, docs) {
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

integration_search.findTestsForDevice = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findTestsForDevice] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req && req.params.id,
        deviceUUID = req && req.params.did,
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = {
            include_docs: true
        };

    var error = {};

    if (!integrationUUID || !deviceUUID) {
        error.status = 400;
        error.message = 'Bad request';
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, error);
    }

    if (unitTestUUID) {
        query.startkey = [unitTestUUID, integrationUUID, deviceUUID];
        query.endkey = [unitTestUUID, integrationUUID, deviceUUID, {}];
    } else {
        query.startkey = [integrationUUID, deviceUUID];
        query.endkey = [integrationUUID, deviceUUID, {}];
    }

    konsole.log(req, '[Integration Search - findTestsForDevice] integration: ' + integrationUUID);
    konsole.log(req, '[Integration Search - findTestsForDevice] deviceUUID: ' + deviceUUID);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentTest, k.XCSDesignDocumentViewTestsForIntegrationByDevice, query, function (err, docs) {
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

integration_search.findTestsWithKeyPath = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findTestsWithKeyPath] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req && req.params.id,
        keyPath = req && req.params.keyPath,
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        deviceIdentifier = req && req.params.deviceIdentifier,
        query = {
            include_docs: true
        };

    var error = {};

    if (!integrationUUID || !keyPath) {
        error.status = 400;
        error.message = 'Bad request';
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, error);
    }

    if (unitTestUUID) {
        if (deviceIdentifier) {
            query.startkey = [unitTestUUID, integrationUUID, keyPath, deviceIdentifier];
            query.endkey = [unitTestUUID, integrationUUID, keyPath, deviceIdentifier, {}];
        } else {
            query.startkey = [unitTestUUID, integrationUUID, keyPath];
            query.endkey = [unitTestUUID, integrationUUID, keyPath, {}];
        }
    } else {
        if (deviceIdentifier) {
            query.startkey = [integrationUUID, keyPath, deviceIdentifier];
            query.endkey = [integrationUUID, keyPath, deviceIdentifier, {}];
        } else {
            query.startkey = [integrationUUID, keyPath];
            query.endkey = [integrationUUID, keyPath, {}];
        }
    }

    konsole.log(req, '[Integration Search - findTestsWithKeyPath] integration: ' + integrationUUID);
    konsole.log(req, '[Integration Search - findTestsWithKeyPath] keyPath: ' + keyPath);

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsTestInfo, query, function (err, docs) {
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


integration_search.findTestsForIntegration = function (req, integrationID, unitTestUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration Search - findTestsForIntegration] integrationID: ' + integrationID;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
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

    db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentTest, k.XCSDesignDocumentViewTestsForIntegrationByDevice, query, function (err, docs) {
        xcsutil.logLevelDec(req);
        if (err && err.status !== 404) {
            return cb(err);
        } else {
            return cb(null, docs);
        }
    });
};

/* Module exports */
module.exports = integration_search;
