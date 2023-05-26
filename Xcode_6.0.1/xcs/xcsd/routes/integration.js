'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var http = require('http'),
    k = require('../constants.js'),
    async = require('async'),
    security = require('../util/xcssecurity.js'),
    te = require('../util/turboevents.js'),
    db_core = require('./db_core.js'),
    bot_class = require('./bot.js'),
    konsole = require('../util/konsole.js'),
    integration_search = require('./integration_search.js'),
    file = require('./file.js'),
    util = require('util'),
    xcsutil = require('../util/xcsutil.js'),
    _ = require('underscore');

var integration = {
    integrationUpdateQueue: async.queue(update_internal_worker, 1)
};

/**
 * Create
 */

integration.announcePendingIntegrations = function (req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - announcePendingIntegrations] announce pending integration...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    integration_search.findPendingIntegrations(req, function (err, pendingIntegrations) {
        if (err) {
            konsole.error(req, '[Integration - announcePendingIntegrations] error: ' + err.message);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            return cb(err);
        }

        if (pendingIntegrations.length > 0) {
            konsole.log(req, '[XCSNode TurboSocket] announcing pending integrations: ' + pendingIntegrations.length);
            te.broadcast(k.XCSIsBuildService, k.XCSEmitNotificationPendingIntegrations, {
                count: pendingIntegrations.length
            });
        } else {
            konsole.log(req, '[XCSNode TurboSocket] there are no pending integrations');
        }

        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        return cb();
    });
};


integration.requestIntegration = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var self = integration,
        integrationID = req.params.id,
        identity = req.connection.getPeerCertificate();

    var functionTitle = '[Integration - requestIntegration] request integration: ' + integrationID + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    self.activateIntegration(req, integrationID, identity.fingerprint, function (err, integration) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (integration) {
            self.announcePendingIntegrations(req, function () {

                // We don't return an error because it happened during the broadcast. The integration has been
                // created, so it'll be announced some time in the future.

                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);

                return xcsutil.standardizedResponse(res, 204);
            });
        } else {
            // HTTP 410 Gone, seems to make sense as this means the integration already got assigned.
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, {
                status: 410,
                message: 'The integration is already assigned'
            });
        }
    });

};

integration.addPendingIntegration = function (req, botUUID, shouldClean, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - addPendingIntegration] add pending integration...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var self = integration;

    bot_class.nextBotIntegrationNumber(req, botUUID, function (err, oldBotSnapshot, nextIntegrationNumber) {
        if (err) {
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            var body = {},
                stringifiedBot = JSON.stringify(oldBotSnapshot);

            body.bot = JSON.parse(stringifiedBot);
            body.shouldClean = shouldClean;
            body.currentStep = k.XCSIntegrationStepTypePending;
            body.number = nextIntegrationNumber;
            body.queuedDate = new Date().toISOString();
            body[k.XCSUnitTestProperty] = oldBotSnapshot[k.XCSUnitTestProperty];
            body.success_streak = 0;

            db_core.createDocument(req, k.XCSDesignDocumentIntegration, body, function (err, url, newIntegration) {
                if (err) {
                    xcsutil.logLevelDec(req);
                    return cb(err);
                } else {

                    konsole.log(req, '[Integration - addPendingIntegration] integration created: ' + newIntegration._id + ' (tinyID ' + newIntegration.tinyID + ')');

                    // Duplicate the credentials in the keychain
                    var keychain = security.openKeychain(k.XCSRepositoryKeychainPath, k.XCSRepositoryKeychainSharedSecretPath);
                    keychain.findItem(req, k.XCSKeychainTemplate, botUUID, function (err, blueprintBuf) {
                        if (err) {
                            konsole.log(req, '[Integration - addPendingIntegration] error: ' + err.message);
                            xcsutil.logLevelDec(req);
                            return cb({
                                status: 500,
                                message: err
                            });
                        }

                        keychain.addItem(req, newIntegration._id, blueprintBuf, botUUID, null, function (err) {
                            if (err) {
                                konsole.error(req, '[Integration - addPendingIntegration] error: ' + err.message);
                                xcsutil.logLevelDec(req);
                                return cb({
                                    status: 500,
                                    message: err
                                });
                            }

                            te.broadcast(k.XCSIsListenerForIntegrationUpdates, k.XCSEmitNotificationNotificationIntegrationCreated, {
                                _id: newIntegration._id,
                                botId: botUUID
                            });

                            self.announcePendingIntegrations(req, function () {
                                xcsutil.logLevelDec(req);
                                return cb(null, url, newIntegration);
                            });
                        });
                    });

                }
            });
        }
    });

};

integration.create = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - create] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var self = integration,
        shouldClean = !!req.body.shouldClean;

    self.addPendingIntegration(req, req.params.id, shouldClean, function (err, url, body) {
        if (err) {
            konsole.error(req, '[Integration - create] error: ' + err.message);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            konsole.debug(req, '[Integration - create] integration created: ' + util.inspect(body));
            konsole.log(req, '[Integration - create] created integration number: ' + body.number);
            xcsutil.profilerSummary(req);
            res.writeHead(201, url);
            return xcsutil.standardizedResponseWrite(res, body);
        }
    });

};

integration.saveCommitHistory = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - saveCommitHistory] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        body = req.body;

    if (!body || !integrationUUID) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }

    integration_search.findIntegrationWithUUID(req, integrationUUID, function (err, integration) {

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

            db_core.createDocument(req, k.XCSDesignDocumentCommit, req.body, function (err, url, body) {
                if (err) {
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    // Find the document we have just created
                    integration_search.findCommitWithUUID(req, body._id, function (err, commit) {
                        xcsutil.profilerSummary(req);
                        xcsutil.logLevelDec(req);
                        xcsutil.logLevelCheck(req, logLevel);
                        if (err) {
                            return xcsutil.standardizedErrorResponse(res, err);
                        } else {
                            res.writeHead(201, url);
                            return xcsutil.standardizedResponseWrite(res, commit);
                        }
                    });
                }
            });
        }
    });

};

integration.saveIntegrationIssues = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - saveIntegrationIssues] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var body = req.body;

    if (!body) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }

    body.integration = req.params.id;

    db_core.createDocument(req, k.XCSDesignDocumentIssue, req.body, function (err, url, body) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            // Find the document we have just created
            integration_search.findIssueWithUUID(req, body._id, function (err, issue) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                if (err) {
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    res.writeHead(201, url);
                    return xcsutil.standardizedResponseWrite(res, issue);
                }
            });
        }
    });
};

/**
 * Update
 */

function injectEndedTimeIntoIntegration(integration) {

    // Segment the 'endedTime' date + components
    var now = new Date(),
        then = new Date(integration.startedTime);

    integration.endedTime = now;
    integration.endedTimeDate = xcsutil.dateComponentsFromDate(now);
    integration.duration = (now.getTime() - then.getTime()) / 1000;
}

integration.update_internal = function (req, integrationUUID, changes, cb) {
    integration.integrationUpdateQueue.push({
        req: req,
        integrationUUID: integrationUUID,
        changes: changes
    }, cb);
};

function update_internal_worker(task, cb) {

    var req = task.req,
        integrationUUID = task.integrationUUID,
        changes = task.changes;

    xcsutil.logLevelInc(req);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var functionTitle = '[Integration - update_internal_worker] update integration with UUID: ' + integrationUUID + '...';

    konsole.log(req, functionTitle);

    var error = {};

    if (!changes) {
        xcsutil.logLevelDec(req);
        error.status = 400;
        error.message = 'Bad request';
        return cb(error);
    }

    // Retrieve the integration to be patched
    integration_search.findIntegrationWithUUID(req, integrationUUID, function (err, integration) {
        if (err) {
            xcsutil.logLevelDec(req);
            return cb(err);
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
                integration[key] = db_core.patchObjectWithObject(req, integration[key], changes[key]);
            }
        }

        // Make sure the integration hasn't been completed
        if (!canUpdateAfterComplete && previousStep === k.XCSIntegrationStepTypeCompleted) {
            xcsutil.logLevelDec(req);
            error.status = 403;
            error.message = 'Unable to update the integration. Reason: the integration has been marked as \'complete\'.';
            return cb(error);
        }

        function saveIntegrationWithChanges(integrationUUID, changes) {
            db_core.updateDocumentWithUUID(req, integrationUUID, changes, k.XCSDesignDocumentIntegration, function (err, updatedIntegration) {
                if (err) {
                    xcsutil.logLevelDec(req);
                    return cb(err.status, err.message);
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
                    return cb(null, updatedIntegration);
                }
            });
        }

        if (k.XCSIntegrationStepTypePreparing === integration.currentStep) {
            // Set the started time if the integration has been assigned
            integration.startedTime = new Date();
            saveIntegrationWithChanges(integrationUUID, integration);
        } else if (k.XCSIntegrationStepTypeCompleted === integration.currentStep) {

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

            // If the current integration number is 1, there is no point in trying to retrieve the previous integration.
            if (1 === integration.number) {
                integration.success_streak = 1;
                saveIntegrationWithChanges(integrationUUID, integration);
            } else {

                // Find the previous integration
                var integration_number = integration.number - 1,
                    botUUID = integration.bot._id;

                // If we have completed the integration, fetch the previous integration to figure out what the current success streak is.
                integration_search.findIntegrationWithNumberForBotWithUUID(req, integration_number, botUUID, function (err, previousIntegration) {
                    if (err) {
                        xcsutil.logLevelDec(req);
                        return cb(err);
                    } else {
                        if (previousIntegration) {
                            // Check what was the previous integration result...
                            if (k.XCSIntegrationResultSucceeded === previousIntegration.result) {
                                if (previousIntegration.success_streak) {
                                    // Make sure there is a success_streak counter. Just increment it.
                                    integration.success_streak = previousIntegration.success_streak + 1;
                                } else {
                                    // The previous integration doesn't have a success_streak counter so we don't know what the success_streak is.
                                    // We'll just reset it to '1'.
                                    integration.success_streak = 1;
                                }
                            } else {
                                // The previous integration didn't succeed. Reset it to '1' since we have successfully completed the current integration.
                                integration.success_streak = 1;
                            }
                        } else {
                            if (k.XCSIntegrationResultSucceeded === previousIntegration.result) {
                                // There seems to be no previous integration for this bot. Start the success_streak counter by setting it to '1'.
                                integration.success_streak = 1;
                            } else {
                                // There seems to be no previous integration for this bot. Start the success_streak counter by setting it to '1'.
                                integration.success_streak = 0;
                            }
                        }

                        saveIntegrationWithChanges(integrationUUID, integration);
                    }
                });
            }


        } else {
            saveIntegrationWithChanges(integrationUUID, integration);
        }

    });

}

integration.update = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - update] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var self = integration;

    // Verify that the body has been specified
    var set_props = req.body[k.XCSSetProperties],
        unset_props = req.body[k.XCSUnsetProperties];

    if (!set_props && !unset_props) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }

    var integrationUUID = req.params.id;

    self.update_internal(req, integrationUUID, set_props, function (err, updatedDocument) {
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

integration.saveFilenamePath = function (req, integrationUUID, filepath, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - saveFilenamePath] save file name path...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var self = integration;

    var file_path = encodeURIComponent(filepath).replace(/%2F/g, '/');

    self.update_internal(req, integrationUUID, {
        files: [file_path]
    }, function (err) {
        xcsutil.logLevelDec(req);
        return cb(err);
    });

};

integration.bulk_import_tests = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - bulk_import_tests] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var options = {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        port: 10355,
        path: '/xcs/_bulk_docs'
    };

    if (!req.body) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Body is required'
        });
    }

    if (!req.body.docs) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Docs property is missing'
        });
    }

    // Save the integrationUUID (if present)
    var integrationUUID,
        docs = JSON.stringify({
            docs: req.body.docs
        }),
        testedDevices = req.body.testedDevices && req.body.testedDevices.testedDevices,
        testHierarchy = req.body.testHierarchy && req.body.testHierarchy.testHierarchy,
        perfMetricNames = req.body.perfMetricNames && req.body.perfMetricNames.perfMetricNames,
        perfMetricKeyPaths = req.body.perfMetricKeyPaths && req.body.perfMetricKeyPaths.perfMetricKeyPaths,
        payloadSize = req.headers[k.XCSPayloadSizeHeader];

    if (req.body.testedDevices) {
        integrationUUID = req.body.testedDevices[k.XCSDesignDocumentViewIntegrationSubDocUUID];
    }

    konsole.log(req, '[Integration - bulk_import_tests] number of documents to import: ' + req.body.docs.length);

    if (payloadSize) {
        konsole.log(req, '[Integration - bulk_import_tests] payload size: ' + payloadSize);
    }

    konsole.log(req, '[Integration - bulk_import_tests] sending request to CouchDB...');

    http.request(options, function (couchRes) {

        function done() {
            // We don't want to return a 201 (Created). A 204 will do just fine.
            var status = couchRes.statusCode;
            konsole.log(req, '[Integration - bulk_import_tests] done.');

            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

            if (status === 201) {
                return xcsutil.standardizedResponse(res, 204);
            } else {
                res.writeHead(status);
                return couchRes.pipe(res);
            }
        }

        if (integrationUUID) {

            konsole.log(req, '[Integration - bulk_import_tests] integrationUUID detected: finalizing test results...');

            // By leaving the properties in the integration until it's been completed, we can eliminate the J64 race condition.
            // Because the integration *will always* have the subdocument data embedded until the integration has been completed,
            // subdocument queries shoulw always succeed.

            finalizeTestResults(req, integrationUUID, testedDevices, testHierarchy, perfMetricNames, perfMetricKeyPaths, function (err) {
                if (err) {
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    done();
                }
            });

        } else {
            done();
        }

    }).end(docs);

};

function finalizeTestResults(req, integrationUUID, testedDevices, testHierarchy, perfMetricNames, perfMetricKeyPaths, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - finalizeTestResults] finalize test results';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
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

    setState(req, integrationUUID, changes, function (err) {
        xcsutil.logLevelDec(req);
        cb(err);
    });
}

function setState(req, integrationUUID, changes, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - setState] set state...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var error = {},
        self = integration;

    if (!integrationUUID) {
        xcsutil.logLevelDec(req);
        error.status = 400;
        error.message = 'Bad Request.';
        return cb(error);
    }

    self.update_internal(req, integrationUUID, changes, function (err, updatedDocument) {
        xcsutil.logLevelDec(req);
        if (err) {
            return cb(err);
        } else {
            return cb(null, updatedDocument);
        }
    });

}

integration.activateIntegration = function (req, integrationUUID, assignedClientFingerprint, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - activateIntegration] activate integration...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var newProps = {
        currentStep: k.XCSIntegrationStepTypePending
    };

    if (assignedClientFingerprint) {
        newProps[k.XCSBuildServiceFingerprint] = assignedClientFingerprint;
    }

    // TODO: we should consider moving this back onto the queue ('deactivating') if the build service doesn't start building in 60 seconds
    setState(req, integrationUUID, newProps, function (err) {
        if (err) {
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            // Find the document we have just created
            integration_search.findIntegrationWithUUID(req, integrationUUID, function (err, integration) {
                xcsutil.logLevelDec(req);
                if (err) {
                    return cb(err);
                } else {
                    return cb(null, integration);
                }
            });
        }
    });

};

/**
 * Cancel
 */

integration.cancel = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - cancel] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id;

    integration_search.findIntegrationWithUUID(req, integrationUUID, function (err, integration) {
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
                return xcsutil.standardizedErrorResponse(res, {
                    status: 400,
                    message: 'The integration cannot be canceled because it has been already completed'
                });
            } else if (k.XCSIntegrationStepTypePending === currentStep) {
                setState(req, integrationUUID, {
                    currentStep: k.XCSIntegrationStepTypeCompleted,
                    result: k.XCSIntegrationResultCanceled
                }, function (err) {
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

integration.addTags = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - addTags] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        newTags = req.body[k.XCSTags];

    if (!integrationUUID || !newTags) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }

    integration_search.findIntegrationWithUUID(req, integrationUUID, function (err, integration) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var set = {};

            if (integration.tags) {

                // Iterate through the existing tags and collect them
                for (var i = 0; i < integration.tags.length; i++) {
                    set [integration.tags[i]] = true;
                }

                // Iterate through the new tags and add them
                for (var j = 0; j < newTags.length; j++) {
                    set [newTags[j]] = true;
                }

                // Obtain the unique tags from the set
                integration.tags = Object.keys(set);

            } else {

                // There are no tags set: just pass the new ones along
                integration.tags = newTags;
            }

            // Update the integration with the new tag list
            db_core.updateDocumentWithUUID(req, integrationUUID, integration, k.XCSDesignDocumentIntegration, function (err, updatedIntegration) {
                if (err) {
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedResponse(res, 200, updatedIntegration);
                }
            });

        }
    });

};

integration.removeTags = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - removeTags] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        deletedTags = req.body[k.XCSTags];

    if (!integrationUUID || !deletedTags) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }

    // Helper method to find and remove the tag from the list
    function removeObject(array, object) {
        var index = array.indexOf(object);
        if (index !== -1) {
            array.splice(index, 1);
        }
    }

    integration_search.findIntegrationWithUUID(req, integrationUUID, function (err, integration) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {

            if (integration.tags) {

                var newTags = integration.tags;

                // Iterate through the existing tags and remove the specified ones
                for (var j = 0; j < deletedTags.length; j++) {
                    removeObject(newTags, deletedTags[j]);
                }

                // Set the revised tag list
                integration.tags = newTags;

                // Update the integration with the new tag list
                db_core.updateDocumentWithUUID(req, integrationUUID, integration, k.XCSDesignDocumentIntegration, function (err, updatedIntegration) {
                    if (err) {
                        xcsutil.profilerSummary(req);
                        xcsutil.logLevelDec(req);
                        xcsutil.logLevelCheck(req, logLevel);
                        return xcsutil.standardizedErrorResponse(res, err);
                    } else {
                        xcsutil.profilerSummary(req);
                        xcsutil.logLevelDec(req);
                        xcsutil.logLevelCheck(req, logLevel);
                        return xcsutil.standardizedResponse(res, 200, updatedIntegration);
                    }
                });

            } else {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedResponse(res, 200, integration);
            }

        }
    });

};

/**
 * Remove
 */

integration.remove = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - remove] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var self = integration,
        integrationUUID = req.params.id;

    integration_search.findIntegrationWithUUID(req, integrationUUID, function (err, integration) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            self.removeIntegration(req, integration, function (err) {

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
        return function (err, docs) {
            if (err && err.status !== 404) {
                return cb(err);
            } else {
                return cb(null, docs[0]);
            }
        };
    }

    async.parallel([

        function (cb) {
            integration_search.findIssuesForIntegration(req, integrationID, handler(cb));
        },
        function (cb) {
            integration_search.findCommitsForIntegration(req, integrationID, handler(cb));
        },
        function (cb) {
            integration_search.findTestsForIntegration(req, integrationID, null, cb);
        }
    ], function (err, results) {
        if (err) {
            cb(err);
        } else {
            var toDelete = _.flatten(_.compact(results)).map(function (doc) {
                return {
                    _id: doc._id,
                    _rev: doc._rev,
                    _deleted: true
                };
            });

            db_core.bulkUpdateDocuments(req, toDelete, null, cb);
        }
    });
}

integration.removeIntegration = function (req, theIntegration, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - removeIntegration] UUID: ' + theIntegration._id;

    konsole.log(req, functionTitle);

    var self = integration;

    db_core.removeDocument(req, theIntegration._id, theIntegration._rev, function (err) {
        if (err) {
            if (409 === err.status) {
                // Retrieve the integration to be patched
                integration_search.findIntegrationWithUUID(req, theIntegration._id, function (err, integration) {
                    if (err) {
                        // Perhaps the document doesn't exist any longer?
                        // In any event, there is little we can do about this now.
                        return cb(err);
                    } else {
                        // Reset the revision we've just obtained and try again
                        self.removeIntegration(integration, cb);
                    }
                });
            } else {
                xcsutil.logLevelDec(req);
                return cb(err);
            }
        } else {
            // emit a notification
            // emit a notification
            te.broadcast(k.XCSIsListenerForIntegrationCancels, k.XCSEmitNotificationNotificationIntegrationRemoved, {
                _id: theIntegration._id,
                botId: theIntegration.bot._id
            });

            xcsutil.logLevelDec(req);

            async.parallel([

                function (cb) {
                    file.deleteAssetsForIntegration(theIntegration, function (err) {
                        return cb(err && {
                            status: 500,
                            message: err
                        });
                    });
                },
                function (cb) {
                    removeAssociatedIntegrationDocuments(req, theIntegration._id, cb);
                }
            ], cb);
        }
    });
};

integration.removeAll = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Integration - removeAll] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        query = {
            include_docs: false
        };

    if (unitTestUUID) {
        query.startkey = unitTestUUID;
        query.endkey = unitTestUUID;
    }

    db_core.removeAll(req, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewAllIntegrations, query, function (err) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err && err.status !== 404) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

/* Module exports */
module.exports = integration;