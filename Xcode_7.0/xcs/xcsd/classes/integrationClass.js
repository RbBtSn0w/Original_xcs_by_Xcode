/*
    XCSIntegrationClass
    A class dedicated to interact with CouchDB and Redis.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var async = require('async'),
    _ = require('underscore'),
    url = require('url'),
    util = require('util');

var k = require('../constants.js'),
    security = require('../util/xcssecurity.js'),
    te = require('../util/turboevents.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    bot_class = require('./botClass.js'),
    agentClass = require('./agentClass.js'),
    konsole = require('../util/konsole.js'),
    integrationSearchClass = require('./integrationSearchClass.js'),
    issueClass = require('./issueClass.js'),
    fileClass = require('./fileClass.js'),
    redisClass = require('./redisClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    bridge = require('../util/xcsbridge.js'),
    settingsClass = require('./settingsClass.js');

var addPendingIntegrationQueue;

/* XCSIntegrationClass object */

function XCSIntegrationClass() {
    this.integrationUpdateQueue = async.queue(update_internal_worker, 1);
}

XCSIntegrationClass.prototype.findDocumentWithUUID = function XCSDBCoreClassFindDocumentWithUUID(req, doc_UUID, doc_type, cb) {
    var self = this;
    self.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

XCSIntegrationClass.prototype.announcePendingIntegrations = function announcePendingIntegrations(req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - announcePendingIntegrations] announce pending integration';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    integrationSearchClass.findPendingIntegrations(req, function INAnnouncePendingIntegrations(err, pendingIntegrations) {
        if (err) {
            konsole.error(req, '[Integration - announcePendingIntegrations] error finding pending integrations: ' + JSON.stringify(err));
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        }

        async.filter(pendingIntegrations, function (integration, filterCallback) {
            filterCallback(undefined === integration[k.XCSUnitTestProperty]);
        }, function (filteredResults) {
            if (filteredResults.length > 0) {

                // Only advertise pending integrations when the service is enabled
                settingsClass.findOrCreateSettingsDocument(req, function (err, settings) {
                    if (err) {
                        konsole.error(req, '[Integration - announcePendingIntegrations] error finding ot creating the Settings document: ' + JSON.stringify(err));
                        xcsutil.profilerSummary(req);
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        if (true === settings.service_enabled) {
                            konsole.log(req, '[XCSNode TurboSocket] announcing pending integrations: ' + filteredResults.length);
                            te.broadcast(k.XCSIsBuildService, k.XCSEmitNotificationPendingIntegrations, {
                                count: filteredResults.length
                            });
                        }
                    }
                });

            } else {
                konsole.log(req, '[XCSNode TurboSocket] there are no pending integrations');
            }

            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb);
        });

    });
};

XCSIntegrationClass.prototype.requestIntegration = function requestIntegration(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var self = this,
        integrationID = req.params.id,
        identity = req.connection.getPeerCertificate();

    var functionTitle = '[Integration - requestIntegration] request integration: ' + integrationID;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.activateIntegration(req, integrationID, identity.fingerprint, function INRequestIntegrationActivateIntegration(err, integration) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (integration) {
            self.announcePendingIntegrations(req, function INRequestIntegrationAnnouncePendingIntegrations() {

                // We don't return an error because it happened during the broadcast. The integration has been
                // created, so it'll be announced some time in the future.

                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);

                return xcsutil.standardizedResponse(res, 204);
            });
        } else {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        }
    });

};

XCSIntegrationClass.prototype.addPendingIntegration = function addPendingIntegration(req, botUUID, shouldClean, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - addPendingIntegration] add pending integration for bot: ' + botUUID;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this;

    // Create a queue object with single concurrency (if needed)
    if (!addPendingIntegrationQueue) {
        addPendingIntegrationQueue = async.queue(function (task, callbackQueue) {
            integrationSearchClass.findPendingIntegrations(task.req, function (err, integrations) {
                if (err) {
                    konsole.error(task.req, '[Integration - addPendingIntegration] error while finding pending integrations: ' + JSON.stringify(err));
                    return callbackQueue(err);
                } else {

                    konsole.log(task.req, '[Integration - addPendingIntegration] number of pending integrations: ' + integrations.length);

                    if (integrations.length > 0) {
                        async.each(integrations, function (integration, callbackAsyncEach) {

                            if (task.botUUID === integration.bot._id) {
                                return callbackAsyncEach({
                                    status: 409,
                                    message: 'Conflict: the specified bot already has a pending integration'
                                });
                            } else {
                                return callbackAsyncEach();
                            }

                        }, function (err) {

                            if (err) {
                                konsole.error(task.req, '[Integration - addPendingIntegration] error: ' + JSON.stringify(err));
                                return callbackQueue(err);
                            } else {
                                addPendingIntegrationForBot(task.req, task.self, task.botUUID, task.shouldClean, callbackQueue);
                            }

                        });
                    } else {
                        addPendingIntegrationForBot(task.req, task.self, task.botUUID, task.shouldClean, callbackQueue);
                    }
                }
            });
        }, 1);
    }

    addPendingIntegrationQueue.push({
        req: req,
        self: self,
        botUUID: botUUID,
        shouldClean: shouldClean
    }, function (err, url, newIntegration) {
        if (err) {
            konsole.error(req, '[Integration - addPendingIntegration] error while adding a new pending integration: ' + JSON.stringify(err));
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            konsole.log(req, '[Integration - addPendingIntegration] pending integration added successfully.');
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, null, url, newIntegration);
        }
    });

};

XCSIntegrationClass.prototype.create = function create(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - create] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        shouldClean = !!req.body.shouldClean;

    self.addPendingIntegration(req, req.params.id, shouldClean, function INAddPendingIntegration(err, url, body) {
        if (err) {
            konsole.error(req, '[Integration - create] error: ' + JSON.stringify(err));
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            konsole.debug(req, '[Integration - create] integration created: ' + util.inspect(body));
            konsole.log(req, '[Integration - create] created integration number: ' + body.number);
            xcsutil.profilerSummary(req);

            res.set(k.XCSResponseLocation, url);

            return xcsutil.standardizedResponse(res, 201, body);
        }
    });

};

XCSIntegrationClass.prototype.list = function list(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - list] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = url.parse(req.url, true).query;

    if (!query) {
        query = {};
    }

    query.include_docs = true;

    if (!query.limit) {
        query.limit = 100;
    } else if ((query.limit <= 0) || (query.limit > 100)) {
        query.limit = 100;
    }

    if (unitTestUUID) {
        if (query.currentStep) {
            query.startkey = [unitTestUUID, query.currentStep];
            query.endkey = [unitTestUUID, query.currentStep, {}];
        } else {
            query.startkey = [unitTestUUID];
            query.endkey = [unitTestUUID, {}];
        }
    } else {
        if (query.currentStep) {
            query.startkey = [query.currentStep];
            query.endkey = [query.currentStep, {}];
        } else {
            query.startkey = [k.XCSIntegrationStepTypeCompleted];
            query.endkey = [k.XCSIntegrationStepTypeCompleted, {}];
        }
    }

    integrationSearchClass.listByState_internal(req, query, true, function (err, integrations) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, integrations);
        }
    });

};
XCSIntegrationClass.prototype.saveCommitHistory = function saveCommitHistory(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - saveCommitHistory] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        body = req.body;

    if (!body) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body has not been specified'
        });
    }

    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function INSaveCommitHistoryFindIntegration(err, integration) {

        xcsutil.profilerSummary(req);
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {

            // Make the commit date components UTC-compliant
            for (var key in body.commits) {
                if (body.commits.hasOwnProperty(key)) {
                    var some_commits = body.commits[key];
                    for (var i = 0; i < some_commits.length; i++) {
                        var timestampDate = new Date(some_commits[i].XCSCommitTimestamp);
                        some_commits[i].XCSCommitTimestampDate = xcsutil.dateComponentsFromDate(new Date(timestampDate));
                    }
                }
            }

            // Save the bot ID + tinyID in the body
            body.botID = integration.bot._id;
            body.botTinyID = integration.bot.tinyID;

            // Save the ended time as date components
            body.endedTimeDate = xcsutil.dateComponentsFromDate(new Date());

            dbCoreClass.createDocument(req, k.XCSDesignDocumentCommit, req.body, function INSaveCommitHistoryCreateDocument(err, url, body) {
                if (err) {
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    // Find the document we have just created
                    integrationSearchClass.findCommitWithUUID(req, body._id, function INSaveCommitHistoryFindCommit(err, commit) {
                        xcsutil.profilerSummary(req);
                        xcsutil.logLevelDec(req);
                        xcsutil.logLevelCheck(req, logLevel);
                        if (err) {
                            return xcsutil.standardizedErrorResponse(res, err);
                        } else {
                            res.set(k.XCSResponseLocation, url);

                            return xcsutil.standardizedResponse(res, 201, commit);
                        }
                    });
                }
            });
        }
    });

};

XCSIntegrationClass.prototype.saveIntegrationIssues = function saveIntegrationIssues(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - saveIntegrationIssues] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var body = req.body;

    if (!body) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body has not been specified'
        });
    }

    body.integration = req.params.id;

    dbCoreClass.createDocument(req, k.XCSDesignDocumentIssue, req.body, function INSaveIntegrationIssuesCreateDocument(err, url, body) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            // Find the document we have just created
            integrationSearchClass.findIssueWithUUID(req, body._id, function INSaveIntegrationIssuesFindIssue(err, issue) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                if (err) {
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    res.set(k.XCSResponseLocation, url);
                    return xcsutil.standardizedResponse(res, 201, issue);
                }
            });
        }
    });
};

/**
 * Update
 */

XCSIntegrationClass.prototype.update_internal = function update_internal(req, integrationUUID, changes, cb) {

    var self = this;

    self.integrationUpdateQueue.push({
        req: req,
        integrationUUID: integrationUUID,
        changes: changes
    }, cb);
};

XCSIntegrationClass.prototype.update = function update(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - update] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this;

    var body = xcsutil.patchBodyForClient(req);

    if (!body) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body is empty'
        });
    }

    var integrationUUID = req.params.id;

    self.update_internal(req, integrationUUID, body, function INUpdate(err, updatedDocument) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            // TODO: determine if the integration just completed, and if so, clean the keychain
            return xcsutil.standardizedResponse(res, 200, updatedDocument);
        }
    });

};

XCSIntegrationClass.prototype.saveFilenamePath = function saveFilenamePath(req, integrationUUID, filepath, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - saveFilenamePath] save file name path';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this;

    var file_path = encodeURIComponent(filepath).replace(/%2F/g, '/');

    self.update_internal(req, integrationUUID, {
        files: [file_path]
    }, function INSaveFilenamePath(err) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, err);
    });

};

XCSIntegrationClass.prototype.bulk_import_tests = function bulk_import_tests(req, res) {

    var logLevel = xcsutil.logLevelInc(req),
        self = this;

    var functionTitle = '[Integration - bulk_import_tests] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!req.body) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body is empty'
        });
    }

    if (!req.body.docs) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'property "docs" is missing from the body'
        });
    }

    // Save the integrationUUID (if present)
    var integrationUUID,
        docs = req.body.docs,
        testedDevices = req.body.testedDevices && req.body.testedDevices.testedDevices,
        testHierarchy = req.body.testHierarchy && req.body.testHierarchy.testHierarchy,
        perfMetricNames = req.body.perfMetricNames && req.body.perfMetricNames.perfMetricNames,
        perfMetricKeyPaths = req.body.perfMetricKeyPaths && req.body.perfMetricKeyPaths.perfMetricKeyPaths,
        payloadSize = req.headers[k.XCSPayloadSizeHeader];

    if (req.body.testedDevices) {
        integrationUUID = req.body.testedDevices[k.XCSDesignDocumentViewIntegrationSubDocUUID];
        docs.push(req.body.testedDevices);
        docs.push(req.body.testHierarchy);
        docs.push(req.body.perfMetricNames);
        docs.push(req.body.perfMetricKeyPaths);
    }

    konsole.log(req, '[Integration - bulk_import_tests] number of documents to import: ' + docs.length);

    if (payloadSize) {
        konsole.log(req, '[Integration - bulk_import_tests] payload size: ' + payloadSize);
    }

    konsole.log(req, '[Integration - bulk_import_tests] sending request to CouchDB');

    xcsutil.bulk_import(req, function (err) {

        if (err) {
            konsole.error(req, '[Integration - bulk_import_tests] error: ' + JSON.stringify(err));
        } else {
            konsole.log(req, '[Integration - bulk_import_tests] bulk import completed successfully');
        }

        if (integrationUUID) {

            konsole.log(req, '[Integration - bulk_import_tests] integrationUUID detected: finalizing test results');

            // By leaving the properties in the integration until it's been completed, we can eliminate the J64 race condition.
            // Because the integration *will always* have the subdocument data embedded until the integration has been completed,
            // subdocument queries shoulw always succeed.

            finalizeTestResults(req, integrationUUID, testedDevices, testHierarchy, perfMetricNames, perfMetricKeyPaths, self, function INBulkImportTestsRequestFinalizeResults(err) {
                if (err) {
                    return finishBulkImport(req, res, logLevel, err);
                } else {
                    return finishBulkImport(req, res, logLevel);
                }
            });

        } else {
            return finishBulkImport(req, res, logLevel);
        }

    });

};

XCSIntegrationClass.prototype.bulk_import_integrations = function bulk_import_integrations(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - bulk_import_integrations] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!req.body) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body is empty'
        });
    }

    if (!req.body.docs) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the property "docs" is missing from the body'
        });
    }

    var docs = req.body.docs,
        payloadSize = req.headers[k.XCSPayloadSizeHeader];

    konsole.log(req, '[Integration - bulk_import_integrations] number of documents to import: ' + docs.length);

    if (payloadSize) {
        konsole.log(req, '[Integration - bulk_import_integrations] payload size: ' + payloadSize);
    }

    konsole.log(req, '[Integration - bulk_import_integrations] sending request to CouchDB');

    xcsutil.bulk_import(req, function (err) {
        if (err) {
            konsole.error(req, '[Integration - bulk_import_integrations] error: ' + JSON.stringify(err));
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            konsole.log(req, '[Integration - bulk_import_integrations] bulk import completed successfully');
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

XCSIntegrationClass.prototype.activateIntegration = function activateIntegration(req, integrationUUID, assignedClientFingerprint, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - activateIntegration] activate integration',
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var newProps = {
        currentStep: k.XCSIntegrationStepTypePending
    };

    if (assignedClientFingerprint) {
        newProps[k.XCSBuildServiceFingerprint] = assignedClientFingerprint;
    }

    var alreadyAssignedError = {
        // HTTP 410 Gone, seems to make sense as this means the integration already got assigned.
        status: 410,
        message: 'This integration has already been assigned.'
    };

    async.waterfall([

        function INActivateIntegrationFindIntegration(cb) {
            integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, cb);
        },
        function INActivateIntegrationShouldReceiveIntegration(integration, cb) {
            agentClass.shouldReceiveIntegration(req, assignedClientFingerprint, integration, function INActivateIntegrationShouldReceiveIntegrationCallback(err, shouldReceive) {
                if (err) {
                    return xcsutil.safeCallback(cb, err);
                } else if (!shouldReceive) {
                    return xcsutil.safeCallback(cb, alreadyAssignedError); // TODO the error message should actually be different here.
                } else {
                    return xcsutil.safeCallback(cb);
                }
            });
        },
        function INActivateIntegrationRedisAssign(cb) {
            var assignedKey = 'assigned:' + integrationUUID;
            redisClass.client().set(assignedKey, assignedClientFingerprint, 'NX', function INActivateIntegrationRedisSet(err, reply) {
                if (reply) {
                    return xcsutil.safeCallback(cb);
                } else {
                    // With an empty reply, this means the set failed because there was already a value.
                    // Let's see if it was previously assigned to us, and we just happen to be asking for it again.
                    redisClass.client().get(assignedKey, function (err, reply) {
                        if (reply === assignedClientFingerprint) {
                            xcsutil.safeCallback(cb);
                        } else {
                            xcsutil.safeCallback(cb, alreadyAssignedError);
                        }
                    });
                }
            });
        },
        function INActivateIntegrationSetState(cb) {
            setState(req, integrationUUID, newProps, self, cb);
        }
    ], function INActivateIntegrationCallback(err, integration) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, err, integration);
    });
};

/**
 * Cancel
 */

XCSIntegrationClass.prototype.cancel = function cancel(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - cancel] ' + req.method + ' ' + req.url,
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id;

    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function INCancelFindIntegration(err, integration) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {

            var currentStep = integration.currentStep;

            // check what the current step is and only cancel if the proper state
            // is not XCSIntegrationStepTypeUnknown, XCSIntegrationStepTypePending
            // or XCSIntegrationStepTypeCompleted.

            if (k.XCSIntegrationStepTypeCompleted === currentStep) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);

                // If it's already canceled, they're probably just mashing the cancel button.
                // Avoid popping up errors for this case.
                if (k.XCSIntegrationResultCanceled === integration.result) {
                    return xcsutil.standardizedResponse(res, 204);
                } else {
                    return xcsutil.standardizedErrorResponse(res, {
                        status: 400,
                        message: 'the integration cannot be canceled because it has been completed already'
                    });
                }
            } else if (k.XCSIntegrationStepTypePending === currentStep) {
                setState(req, integrationUUID, {
                    currentStep: k.XCSIntegrationStepTypeCompleted,
                    result: k.XCSIntegrationResultCanceled,
                    startedTime: new Date(),
                    endedTime: new Date()
                }, self, function INCancelSetState(err) {
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    if (err) {
                        return xcsutil.standardizedErrorResponse(res, err);
                    } else {
                        return xcsutil.standardizedResponse(res, 204);
                    }
                });
            } else {
                // emit a notification
                te.broadcast(k.XCSIsBuildService, k.XCSEmitNotificationNotificationCancelIntegration, {
                    _id: integrationUUID,
                    botId: integration.bot._id
                });

                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);

                return xcsutil.standardizedResponse(res, 204);
            }

        }
    });

};

/**
 * Tags
 */

XCSIntegrationClass.prototype.addTags = function addTags(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - addTags] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        newTags = req.body[k.XCSTags];

    konsole.log(req, '[Integration - addTags] integration ID: ' + integrationUUID);
    konsole.log(req, '[Integration - addTags] tags to add: ' + newTags);

    if (!newTags) {
        var error = {
            status: 400,
            message: 'the tags have not been specified'
        };

        konsole.error(req, '[Integration - addTags] error: ' + JSON.stringify(error));

        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        return xcsutil.standardizedErrorResponse(res, error);
    }

    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function INAddTagsFindIntegration(err, integration) {
        if (err) {
            konsole.error(req, '[Integration - addTags - findIntegrationWithUUID] error: ' + JSON.stringify(err));
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var existingTags = (integration.tags || []);

            integration.tags = _.uniq(_.union(existingTags, newTags));

            dbCoreClass.updateDocumentWithUUID(req, integrationUUID, integration, false, k.XCSDesignDocumentIntegration, function INAddTagsUpdateIntegration(err, updatedIntegration) {
                if (err) {
                    konsole.error(req, '[Integration - addTags - updateDocumentWithUUID] error: ' + JSON.stringify(err));
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    konsole.log(req, '[Integration - addTags - updateDocumentWithUUID] updatedIntegration.tags: ' + updatedIntegration.tags);
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedResponse(res, 200, updatedIntegration);
                }
            });

        }
    });

};

XCSIntegrationClass.prototype.removeTags = function removeTags(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var integrationUUID = req.params.id,
        deletedTags = req.body[k.XCSTags],
        queryStringIsMalformed = false,
        error = {};

    if (!deletedTags) {
        try {
            deletedTags = JSON.parse(req.query.list);
        } catch (e) {
            queryStringIsMalformed = true;
        }
    }

    if (!_.isArray(deletedTags)) {
        queryStringIsMalformed = true;
    }

    if (queryStringIsMalformed) {
        error = {
            status: 400,
            message: 'the list of tags is malformed'
        };

        konsole.error(req, '[Integration - removeTags] error: ' + JSON.stringify(error));

        return xcsutil.standardizedErrorResponse(res, error);
    }

    if (0 === deletedTags.length) {
        error = {
            status: 400,
            message: 'the tags have not been specified'
        };

        konsole.error(req, '[Integration - removeTags] error: ' + JSON.stringify(error));

        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        return xcsutil.standardizedErrorResponse(res, error);
    }

    var functionTitle = '[Integration - removeTags] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    konsole.log(req, '[Integration - removeTags] integration ID: ' + integrationUUID);
    konsole.log(req, '[Integration - removeTags] tags to remove: ' + deletedTags);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function INRemoveTagsFindIntegration(err, integration) {
        if (err) {
            konsole.error(req, '[Integration - removeTags - findIntegrationWithUUID] error: ' + JSON.stringify(err));
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {

            var existingTags = (integration.tags || []);

            integration.tags = _.uniq(_.difference(existingTags, deletedTags));

            konsole.log(req, '[Integration - removeTags] new tags set: ' + integration.tags);

            // Update the integration with the new tag list
            dbCoreClass.updateDocumentWithUUID(req, integrationUUID, integration, false, k.XCSDesignDocumentIntegration, function INRemoveTagsUpdateDocument(err, updatedIntegration) {
                if (err) {
                    konsole.error(req, '[Integration - removeTags - updateDocumentWithUUID] error: ' + JSON.stringify(err));
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    konsole.log(req, '[Integration - removeTags - updateDocumentWithUUID] updatedIntegration.tags: ' + updatedIntegration.tags);
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedResponse(res, 200, updatedIntegration);
                }
            });

        }
    });

};

/**
 * Remove
 */

XCSIntegrationClass.prototype.remove = function remove(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - remove] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        integrationUUID = req.params.id;

    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function INRemoveFindIntegration(err, integration) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            self.removeIntegration(req, integration, function INRemoveIntegration(err) {

                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);

                if (err) {
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    return xcsutil.standardizedResponse(res, 204);
                }
            });
        }
    });
};

function removeAssociatedIntegrationDocuments(req, integrationID, cb) {
    function handler(cb) {
        return function INRemoveAssociatedIntegrationDocumentsHandlerCallback(err, docs) {
            if (err && err.status !== 404) {
                return xcsutil.safeCallback(cb, err);
            } else {
                if (!docs || 0 === docs.length) {
                    return xcsutil.safeCallback(cb);
                } else {
                    return xcsutil.safeCallback(cb, null, docs[0]);
                }
            }
        };
    }

    async.parallel([

        function INRemoveAssociatedIntegrationDocumentsFindIssuesForIntegration(cb) {
            integrationSearchClass.findIssuesForIntegration(req, integrationID, handler(cb));
        },
        function INRemoveAssociatedIntegrationDocumentsFindCommitsForIntegration(cb) {
            integrationSearchClass.findCommitsForIntegration(req, integrationID, handler(cb));
        },
        function INRemoveAssociatedIntegrationDocumentsFindTestsForIntegration(cb) {
            integrationSearchClass.findTestsForIntegration(req, integrationID, null, cb);
        }
    ], function INRemoveAssociatedIntegrationDocumentsFinalizer(err, results) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var toDelete = _.flatten(_.compact(results)).map(function INRemoveAssociatedIntegrationDocumentsFinalizerMap(doc) {
                return {
                    _id: doc._id,
                    _rev: doc._rev,
                    _deleted: true
                };
            });

            dbCoreClass.bulkUpdateDocuments(req, toDelete, null, cb);
        }
    });
}

XCSIntegrationClass.prototype.removeIntegration = function removeIntegration(req, theIntegration, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - removeIntegration] UUID: ' + theIntegration._id;

    konsole.log(req, functionTitle);

    var self = this;

    dbCoreClass.removeDocument(req, theIntegration._id, theIntegration._rev, function INRemoveIntegration(err) {
        if (err) {
            if (409 === err.status) {
                // Retrieve the integration to be patched
                integrationSearchClass.findIntegrationWithUUID(req, theIntegration._id, false, function INRemoveIntegrationFindIntegration(err, integration) {
                    if (err) {
                        // Perhaps the document doesn't exist any longer?
                        // In any event, there is little we can do about this now.
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        // Reset the revision we've just obtained and try again
                        self.removeIntegration(integration, cb);
                    }
                });
            } else {
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, err);
            }
        } else {
            // emit a notification
            te.broadcast(k.XCSIsListenerForIntegrationCancels, k.XCSEmitNotificationNotificationIntegrationRemoved, {
                _id: theIntegration._id,
                botId: theIntegration.bot._id
            });

            xcsutil.logLevelDec(req);

            async.parallel([

                function INRemoveIntegrationDeleteAssets(cb) {
                    fileClass.deleteAssetsForIntegration(theIntegration, function INRemoveIntegrationDeleteAssetsCallback(err) {
                        if (err && (404 !== err.status)) {
                            return xcsutil.safeCallback(cb, {
                                status: 500,
                                message: 'Internal Server Error (xcsd): ' + JSON.stringify(err)
                            });
                        } else {
                            return xcsutil.safeCallback(cb);
                        }
                    });
                },
                function INRemoveIntegrationRemoveAssociatedDocuments(cb) {
                    removeAssociatedIntegrationDocuments(req, theIntegration._id, cb);
                }
            ], cb);
        }
    });
};

/* Module exports */

module.exports = new XCSIntegrationClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function injectEndedTimeIntoIntegration(integration) {

    // Segment the 'endedTime' date + components
    var now = new Date(),
        then = new Date(integration.startedTime);

    integration.endedTime = now;
    integration.endedTimeDate = xcsutil.dateComponentsFromDate(now);
    integration.duration = (now.getTime() - then.getTime()) / 1000;
}

function update_internal_worker(task, cb) {

    var req = task.req,
        integrationUUID = task.integrationUUID,
        changes = task.changes;

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - update_internal_worker] update integration with UUID: ' + integrationUUID;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    konsole.log(req, functionTitle);

    var error = {};

    if (!changes) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the property "changes" has not been specified in the task'
        });
    }


    // Retrieve the integration to be patched
    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function INUpdateInternalWorkerFindIntegration(err, integration) {
        if (err) {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        }

        var integrationUUID = integration._id,
            emitStatus = false,
            previousStep = integration.currentStep,
            canUpdateAfterComplete = true;

        // Patch every property specified in the body
        for (var key in changes) {
            if (changes.hasOwnProperty(key)) {
                if (key === k.XCSCurrentStep || key === k.XCSResult) {
                    emitStatus = true;
                }
                if (key !== 'assetsPruned') {
                    canUpdateAfterComplete = false;
                }
                integration[key] = xcsutil.patchDocumentWithObject(integration[key], changes[key]);
            }
        }

        // Make sure the integration hasn't been completed
        if (!canUpdateAfterComplete && previousStep === k.XCSIntegrationStepTypeCompleted) {
            xcsutil.logLevelDec(req);
            error.status = 400;
            error.message = 'Forbidden: unable to update the integration. Reason: the integration has been marked as \'complete\'.';
            return xcsutil.safeCallback(cb, error);
        }

        function saveIntegrationWithChanges(integrationUUID, changes) {

            bridge.core.validate('XCSIntegration', changes, function INUpdateInternalWorkerValidateIntegration(err, validationErrors) {
                if (err) {
                    // If err, something went really wrong here, probably a programming error
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, {
                        status: 500,
                        message: 'Internal Server Error (xcsbridge): ' + JSON.stringify(err)
                    });
                } else {
                    if (validationErrors && validationErrors.length > 0) {
                        // If (validationErrors && validationErrors.length > 0), the body content failed validation
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb, {
                            status: 400,
                            message: JSON.stringify(validationErrors[0]),
                            reasons: validationErrors
                        });
                    } else {
                        // All clear: patch the integration
                        dbCoreClass.updateDocumentWithUUID(req, integrationUUID, changes, false, k.XCSDesignDocumentIntegration, function INUpdateInternalWorkerUpdateIntegration(err, updatedIntegration) {
                            if (err) {
                                xcsutil.logLevelDec(req);
                                return xcsutil.safeCallback(cb, err);
                            } else {
                                if (emitStatus) {
                                    te.broadcast(k.XCSIsListenerForIntegrationUpdates, k.XCSEmitNotificationNotificationStatus, {
                                        _id: integrationUUID,
                                        botId: updatedIntegration.bot._id,
                                        currentStep: updatedIntegration.currentStep,
                                        result: updatedIntegration.result
                                    });
                                }
                                xcsutil.logLevelDec(req);
                                return xcsutil.safeCallback(cb, null, updatedIntegration);
                            }
                        });

                    }
                }
            });
        }

        if (k.XCSIntegrationStepTypePreparing === integration.currentStep) {
            // Set the started time if the integration has been assigned
            integration.startedTime = new Date();
            saveIntegrationWithChanges(integrationUUID, integration);
        } else if (k.XCSIntegrationStepTypeCompleted === integration.currentStep) {
            issueClass.finalizeIntegrationIssues(req, integration, function INUpdateInternalWorkerFinalizeIntegrationIssues(err) {
                if (err) {
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, err);
                }

                // Timestamp the completion time
                injectEndedTimeIntoIntegration(integration);

                // Since the integration has been completed, we can safely remove the properties that
                // now exist in the integration sub-documents. This mechanism was needed to avoid an easy-to-reproduce
                // race condition on the J64, where the subdocuments where returned as <null> even though 'include_docs'
                // was specified. A bug in CouchDB? Perhaps the subdocuments view was indexed before the affected subdocuments
                // were persisted. That would explain why the early retrieval could have been incomplete.
                // By leaving the properties in the integration until it's been completed, we can eliminate the race condition
                // because the integration *will always* have the subdocument data embedded until the integration has been completed.

                delete integration.testedDevices;
                delete integration.testHierarchy;
                delete integration.perfMetricNames;
                delete integration.perfMetricKeyPaths;

                var integration_number = integration.number - 1,
                    botUUID = integration.bot._id;

                // If we have completed the integration, fetch the previous integration to figure out what the current success streak is.
                integrationSearchClass.findIntegrationWithNumberForBotWithUUID(req, integration_number, botUUID, false, function (err, previousIntegration) {
                    if (err && err.status !== 404) {
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        if (k.XCSIntegrationResultSucceeded !== integration.result) {
                            integration.success_streak = 0;
                        } else if (1 === integration.number) {
                            integration.success_streak = 1;
                        } else {
                            if (previousIntegration && previousIntegration.success_streak) {
                                // if we have a previous streak, add to the streak
                                integration.success_streak = previousIntegration.success_streak + 1;
                            } else {
                                // otherwise, reset the streak based on our current success
                                integration.success_streak = 1;
                            }
                        }

                        // Now that the integration has been finalized, calculate the Code Coverage delta
                        if (!integration.ccPercentage) {
                            integration.ccPercentage = 0;
                        }

                        if (previousIntegration) {
                            if (!previousIntegration.ccPercentage) {
                                previousIntegration.ccPercentage = 0;
                            }
                            integration.ccPercentageDelta = integration.ccPercentage - previousIntegration.ccPercentage;
                        } else {
                            integration.ccPercentageDelta = 0;
                        }

                        saveIntegrationWithChanges(integrationUUID, integration);
                    }
                });
            });

        } else {
            saveIntegrationWithChanges(integrationUUID, integration);
        }

    });

}

function setState(req, integrationUUID, changes, integrationClass, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - setState] set state';

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

    integrationClass.update_internal(req, integrationUUID, changes, function INSetState(err, updatedDocument) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, updatedDocument);
        }
    });

}

function finishBulkImport(req, res, logLevel, err) {
    xcsutil.profilerSummary(req);
    xcsutil.logLevelDec(req);
    xcsutil.logLevelCheck(req, logLevel);

    if (err) {
        return xcsutil.standardizedErrorResponse(res, err);
    } else {
        return xcsutil.standardizedResponse(res, 204);
    }
}

function finalizeTestResults(req, integrationUUID, testedDevices, testHierarchy, perfMetricNames, perfMetricKeyPaths, integrationClass, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - finalizeTestResults] finalize test results';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var changes = {};

    if (testedDevices) {
        delete testedDevices._id;
        delete testedDevices.rev;
        changes.testedDevices = testedDevices;
    }

    if (testHierarchy) {
        delete testHierarchy._id;
        delete testHierarchy.rev;
        changes.testHierarchy = testHierarchy;
    }

    if (perfMetricNames) {
        delete perfMetricNames._id;
        delete perfMetricNames.rev;
        changes.perfMetricNames = perfMetricNames;
    }

    if (perfMetricKeyPaths) {
        delete perfMetricKeyPaths._id;
        delete perfMetricKeyPaths.rev;
        changes.perfMetricKeyPaths = perfMetricKeyPaths;
    }

    setState(req, integrationUUID, changes, integrationClass, function INFinalizeTestResultsSetState(err) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, err);
    });
}

function addPendingIntegrationForBot(req, self, botUUID, shouldClean, cb) {
    bot_class.nextBotIntegrationNumber(req, botUUID, function INAddPendingIntegrationNextBotIntegrationNumber(err, oldBotSnapshot, nextIntegrationNumber) {
        if (err) {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            var body = (req && req.body) || {};

            body.bot = oldBotSnapshot;
            body.shouldClean = shouldClean;
            body.currentStep = k.XCSIntegrationStepTypePending;
            body.number = nextIntegrationNumber;
            body.queuedDate = new Date().toISOString();
            body[k.XCSUnitTestProperty] = oldBotSnapshot[k.XCSUnitTestProperty];
            body.success_streak = 0;

            // Remove unwanted properties
            delete body.testedDevices;

            dbCoreClass.createDocument(req, k.XCSDesignDocumentIntegration, body, function INAddPendingIntegrationCreateDocument(err, url, newIntegration) {
                if (err) {
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, err);
                } else {

                    konsole.log(req, '[Integration - addPendingIntegration] integration created: ' + newIntegration._id + ' (tinyID ' + newIntegration.tinyID + ')');

                    // Duplicate the credentials in the keychain
                    var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
                    keychain.findItem(req, k.XCSKeychainTemplate, botUUID, function INAddPendingIntegrationFindItem(err, blueprintBuf) {
                        if (err) {
                            konsole.error(req, '[Integration - addPendingIntegration] error: ' + JSON.stringify(err));
                            xcsutil.logLevelDec(req);
                            return xcsutil.safeCallback(cb, {
                                status: 500,
                                message: 'Internal Server Error (keychain): ' + JSON.stringify(err)
                            });
                        }

                        keychain.addItem(req, newIntegration._id, blueprintBuf, botUUID, null, function INAddPendingIntegrationAddItem(err) {
                            if (err) {
                                konsole.error(req, '[Integration - addPendingIntegration] error: ' + JSON.stringify(err));
                                xcsutil.logLevelDec(req);
                                return xcsutil.safeCallback(cb, {
                                    status: 500,
                                    message: 'Internal Server Error (keychain): ' + JSON.stringify(err)
                                });
                            }

                            te.broadcast(k.XCSIsListenerForIntegrationUpdates, k.XCSEmitNotificationNotificationIntegrationCreated, {
                                _id: newIntegration._id,
                                botId: botUUID
                            });

                            self.announcePendingIntegrations(req, function INAddPendingIntegrationAnnouncePendingIntegrations() {
                                xcsutil.logLevelDec(req);
                                return xcsutil.safeCallback(cb, null, url, newIntegration);
                            });
                        });
                    });

                }
            });
        }
    });
}