'use strict';

var async = require('async'),
    _ = require('underscore'),
    url = require('url'),
    config = require('config');

var k = require('../constants.js'),
    Errors = require('../util/error.js'),
    security = require('../util/xcssecurity.js'),
    te = require('../util/turboevents.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    bot_class = require('./botClass.js'),
    agentClass = require('./agentClass.js'),
    logger = require('../util/logger.js'),
    integrationSearchClass = require('./integrationSearchClass.js'),
    issueClass = require('./issueClass.js'),
    fileClass = require('./fileClass.js'),
    redisClass = require('./redisClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    bridge = require('../util/xcsbridge.js'),
    settingsClass = require('./settingsClass.js');

var repositoryKeychain = security.openKeychain(config.get('keychain.repositories'));

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

    var log = logger.withRequest(req),
        functionTitle = '[Integration - announcePendingIntegrations] announce pending integration';

    log.debug('Checking if there are pending integrations to announce.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    integrationSearchClass.findPendingIntegrations(req, function INAnnouncePendingIntegrations(err, pendingIntegrations) {
        if (err) {
            log.error('Could not load pending integrations:', err);
            xcsutil.profilerSummary(req);

            return xcsutil.safeCallback(cb, err);
        }

        async.filter(pendingIntegrations, function (integration, filterCallback) {
            filterCallback(undefined === integration[k.XCSUnitTestProperty]);
        }, function (filteredResults) {
            if (filteredResults.length > 0) {

                // Only advertise pending integrations when the service is enabled
                settingsClass.findOrCreateSettingsDocument(req, function (err, settings) {
                    if (err) {
                        log.error('Could not determine if xcsd is enabled:', err);
                        xcsutil.profilerSummary(req);

                        return xcsutil.safeCallback(cb, err);
                    } else {
                        if (true === settings.service_enabled) {
                            log.info('Broadcasting announcement of', filteredResults.length, 'pending integrations.');
                            te.broadcast(k.XCSIsBuildService, k.XCSEmitNotificationPendingIntegrations, {
                                count: filteredResults.length
                            });
                        } else {
                            log.debug('xcsd is disabled, not announcing', filteredResults.length, 'pending integrations.');
                        }

                    }
                });

            } else {
                log.debug('There are no pending integrations to announce.');
            }

            xcsutil.profilerSummary(req);

            return xcsutil.safeCallback(cb);
        });

    });
};

XCSIntegrationClass.prototype.requestIntegration = function requestIntegration(req, res) {

    var self = this,
        integrationID = req.params.id,
        identity = req.connection.getPeerCertificate();

    var functionTitle = '[Integration - requestIntegration] request integration: ' + integrationID;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.activateIntegration(req, integrationID, identity.fingerprint, function INRequestIntegrationActivateIntegration(err, integration) {
        xcsutil.profilerSummary(req);


        if (integration) {
            self.announcePendingIntegrations(req, function INRequestIntegrationAnnouncePendingIntegrations() {

                // We don't return an error because it happened during the broadcast. The integration has been
                // created, so it'll be announced some time in the future.

                xcsutil.profilerSummary(req);



                return xcsutil.standardizedResponse(res, 204);
            });
        } else {
            xcsutil.profilerSummary(req);


            return xcsutil.standardizedErrorResponse(res, err);
        }
    });

};

XCSIntegrationClass.prototype.addPendingIntegration = function addPendingIntegration(req, botUUID, shouldClean, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration - addPendingIntegration] add pending integration for bot: ' + botUUID;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    log.info('Attempting to add pending integration for bot', botUUID);

    var self = this;

    // Create a queue object with single concurrency (if needed)
    if (!addPendingIntegrationQueue) {
        addPendingIntegrationQueue = async.queue(function (task, callbackQueue) {
            var log = logger.withRequest(task.req);
            integrationSearchClass.findPendingIntegrations(task.req, function (err, integrations) {
                if (err) {
                    log.error('Could not find existing pending integrations:', err);
                    return callbackQueue(err);
                } else {
                    log.debug('There are', integrations.length, 'existing pending integrations.');

                    if (integrations.length > 0) {
                        async.each(integrations, function (integration, callbackAsyncEach) {

                            if (task.botUUID === integration.bot._id) {
                                return callbackAsyncEach(new Errors.Conflict('Could not add pending integration because the bot already has an integration pending.'));
                            } else {
                                return callbackAsyncEach();
                            }

                        }, function (err) {

                            if (err) {
                                return callbackQueue(err);
                            } else {
                                log.debug('There are no pending integrations for bot', task.botUUID + ', we will add one.');
                                addPendingIntegrationForBot(task.req, task.self, task.botUUID, task.shouldClean, callbackQueue);
                            }

                        });
                    } else {
                        log.debug('There are no pending integrations, adding one for bot', task.botUUID);
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
            log.error('Could not add pending integration for bot', botUUID + ':', err);

            return xcsutil.safeCallback(cb, err);
        } else {
            log.info('New pending integration', newIntegration._id, 'added successfully.');

            return xcsutil.safeCallback(cb, null, url, newIntegration);
        }
    });

};

XCSIntegrationClass.prototype.create = function create(req, res) {

    var functionTitle = '[Integration - create] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        shouldClean = !!req.body.shouldClean;

    self.addPendingIntegration(req, req.params.id, shouldClean, function INAddPendingIntegration(err, url, body) {
        if (err) {
            xcsutil.profilerSummary(req);


            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);

            res.set(k.XCSResponseLocation, url);

            return xcsutil.standardizedResponse(res, 201, body);
        }
    });

};

XCSIntegrationClass.prototype.list = function list(req, res) {

    var functionTitle = '[Integration - list] ' + req.method + ' ' + req.url;

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

        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, integrations);
        }
    });

};
XCSIntegrationClass.prototype.saveCommitHistory = function saveCommitHistory(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration - saveCommitHistory] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        body = req.body;

    log.info('Saving commit history for integration', integrationUUID);

    if (!body) {
        xcsutil.profilerSummary(req);


        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body has not been specified'
        });
    }

    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function INSaveCommitHistoryFindIntegration(err, integration) {

        xcsutil.profilerSummary(req);
        if (err) {
            xcsutil.profilerSummary(req);


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


                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    // Find the document we have just created
                    integrationSearchClass.findCommitWithUUID(req, body._id, function INSaveCommitHistoryFindCommit(err, commit) {
                        xcsutil.profilerSummary(req);


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

    var functionTitle = '[Integration - update] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this;

    var body = xcsutil.patchBodyForClient(req);

    if (!body) {
        xcsutil.profilerSummary(req);


        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body is empty'
        });
    }

    var integrationUUID = req.params.id;

    self.update_internal(req, integrationUUID, body, function INUpdate(err, updatedDocument) {
        xcsutil.profilerSummary(req);

        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            // TODO: determine if the integration just completed, and if so, clean the keychain
            return xcsutil.standardizedResponse(res, 200, updatedDocument);
        }
    });

};

XCSIntegrationClass.prototype.bulk_import_tests = function bulk_import_tests(req, res) {

    var self = this;

    var log = logger.withRequest(req),
        functionTitle = '[Integration - bulk_import_tests] ' + req.method + ' ' + req.url;

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

    log.info('Bulk importing', docs.length, 'test documents.');

    if (payloadSize) {
        log.debug('Bulk import payload size:', payloadSize);
    }

    xcsutil.bulk_import(req, function (err) {

        if (err) {
            log.error('Error bulk importing test results:', err);
        } else {
            log.debug('Bulk test import succeeded.');
        }

        if (integrationUUID) {

            log.debug('Integration ID', integrationUUID, 'provided, finalizing test results for this integration.');

            // By leaving the properties in the integration until it's been completed, we can eliminate the J64 race condition.
            // Because the integration *will always* have the subdocument data embedded until the integration has been completed,
            // subdocument queries shoulw always succeed.

            finalizeTestResults(req, integrationUUID, testedDevices, testHierarchy, perfMetricNames, perfMetricKeyPaths, self, function INBulkImportTestsRequestFinalizeResults(err) {
                if (err) {
                    return finishBulkImport(req, res, err);
                } else {
                    return finishBulkImport(req, res);
                }
            });

        } else {
            return finishBulkImport(req, res);
        }

    });

};

XCSIntegrationClass.prototype.bulk_import_integrations = function bulk_import_integrations(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration - bulk_import_integrations] ' + req.method + ' ' + req.url;

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

    log.info('Bulk importing', docs.length, 'integration documents.');

    if (payloadSize) {
        log.debug('Bulk import payload size:', payloadSize);
    }

    xcsutil.bulk_import(req, function (err) {
        if (err) {
            log.error('Error bulk importing integrations:', err);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            log.debug('Successfully imported bulk integrations.');
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

XCSIntegrationClass.prototype.activateIntegration = function activateIntegration(req, integrationUUID, assignedClientFingerprint, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration - activateIntegration] activate integration',
        self = this;

    log.info('Attempting to activate integration', integrationUUID, 'for build service', assignedClientFingerprint);

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

        return xcsutil.safeCallback(cb, err, integration);
    });
};

/**
 * Cancel
 */

XCSIntegrationClass.prototype.cancel = function cancel(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration - cancel] ' + req.method + ' ' + req.url,
        self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id;

    log.info('Canceling integration', integrationUUID);

    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function INCancelFindIntegration(err, integration) {
        if (err) {
            xcsutil.profilerSummary(req);


            return xcsutil.standardizedErrorResponse(res, err);
        } else {

            var currentStep = integration.currentStep;

            // check what the current step is and only cancel if the proper state
            // is not XCSIntegrationStepTypeUnknown, XCSIntegrationStepTypePending
            // or XCSIntegrationStepTypeCompleted.

            if (k.XCSIntegrationStepTypeCompleted === currentStep) {
                xcsutil.profilerSummary(req);



                // If it's already canceled, they're probably just mashing the cancel button.
                // Avoid popping up errors for this case.
                if (k.XCSIntegrationResultCanceled === integration.result) {
                    log.debug('Integration is already canceled, doing nothing.');
                    return xcsutil.standardizedResponse(res, 204);
                } else {
                    return xcsutil.standardizedErrorResponse(res, {
                        status: 400,
                        message: 'the integration cannot be canceled because it has been completed already'
                    });
                }
            } else if (k.XCSIntegrationStepTypePending === currentStep) {
                log.debug('Integration', integrationUUID, 'is pending, so marking it as completed without notifying builders.');
                setState(req, integrationUUID, {
                    currentStep: k.XCSIntegrationStepTypeCompleted,
                    result: k.XCSIntegrationResultCanceled,
                    startedTime: new Date(),
                    endedTime: new Date()
                }, self, function INCancelSetState(err) {
                    xcsutil.profilerSummary(req);

                    if (err) {
                        return xcsutil.standardizedErrorResponse(res, err);
                    } else {
                        return xcsutil.standardizedResponse(res, 204);
                    }
                });
            } else {
                log.info('Notifying build services that they should cancel integration', integrationUUID);

                // emit a notification
                te.broadcast(k.XCSIsBuildService, k.XCSEmitNotificationNotificationCancelIntegration, {
                    _id: integrationUUID,
                    botId: integration.bot._id
                });

                xcsutil.profilerSummary(req);

                return xcsutil.standardizedResponse(res, 204);
            }

        }
    });

};

/**
 * Tags
 */

XCSIntegrationClass.prototype.addTags = function addTags(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Integration - addTags] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        newTags = req.body[k.XCSTags];

    log.info('Adding tags', newTags, 'to integration', integrationUUID);

    if (!newTags) {
        var error = {
            status: 400,
            message: 'the tags have not been specified'
        };

        xcsutil.profilerSummary(req);

        return xcsutil.standardizedErrorResponse(res, error);
    }

    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function INAddTagsFindIntegration(err, integration) {
        if (err) {
            log.error('Could not load integration:', err);
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var existingTags = (integration.tags || []);

            integration.tags = _.uniq(_.union(existingTags, newTags));

            dbCoreClass.updateDocumentWithUUID(req, integrationUUID, integration, false, k.XCSDesignDocumentIntegration, function INAddTagsUpdateIntegration(err, updatedIntegration) {
                if (err) {
                    log.error('Could not update integration with new tags:', err);
                    xcsutil.profilerSummary(req);


                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    log.debug('Successfully added tags to integration', updatedIntegration._id);
                    xcsutil.profilerSummary(req);
                    return xcsutil.standardizedResponse(res, 200, updatedIntegration);
                }
            });

        }
    });

};

XCSIntegrationClass.prototype.removeTags = function removeTags(req, res) {
    var log = logger.withRequest(req),
        integrationUUID = req.params.id,
        deletedTags = req.body[k.XCSTags],
        queryStringIsMalformed = false,
        error = {};

    log.info('Removing tags', deletedTags, 'from integration', integrationUUID);

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

        log.error('Could not remove tags:', error);
        return xcsutil.standardizedErrorResponse(res, error);
    }

    if (0 === deletedTags.length) {
        error = {
            status: 400,
            message: 'the tags have not been specified'
        };

        log.error('Could not remove tags:', error);

        xcsutil.profilerSummary(req);

        return xcsutil.standardizedErrorResponse(res, error);
    }

    var functionTitle = '[Integration - removeTags] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function INRemoveTagsFindIntegration(err, integration) {
        if (err) {
            log.error('Could not load integration:', err);
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {

            var existingTags = (integration.tags || []);

            integration.tags = _.uniq(_.difference(existingTags, deletedTags));

            log.debug('New integration tags set:', integration.tags);

            // Update the integration with the new tag list
            dbCoreClass.updateDocumentWithUUID(req, integrationUUID, integration, false, k.XCSDesignDocumentIntegration, function INRemoveTagsUpdateDocument(err, updatedIntegration) {
                if (err) {
                    log.error('Error updating document with new tags:', err);
                    xcsutil.profilerSummary(req);
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    log.debug('Successfully updated integration', updatedIntegration._id, 'with new tags.');
                    xcsutil.profilerSummary(req);
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
    var functionTitle = '[Integration - remove] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id;

    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, (err, integration) => {
        if (err) {
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            this.removeIntegration(req, integration, true, err => {
                xcsutil.profilerSummary(req);
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

XCSIntegrationClass.prototype.removeIntegration = function removeIntegration(req, theIntegration, inBackground, cb) {
    var log = logger.withRequest(req);

    log.info('Removing integration', theIntegration._id);

    dbCoreClass.removeDocument(req, theIntegration._id, theIntegration._rev, err => {
        if (err) {
            if (409 === err.status) {
                // Retrieve the integration to be patched
                integrationSearchClass.findIntegrationWithUUID(req, theIntegration._id, false, (err, integration) => {
                    if (err) {
                        // Perhaps the document doesn't exist any longer?
                        // In any event, there is little we can do about this now.
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        // Reset the revision we've just obtained and try again
                        this.removeIntegration(req, integration, inBackground, cb);
                    }
                });
            } else {
                return xcsutil.safeCallback(cb, err);
            }
        } else {
            // emit a notification
            te.broadcast(k.XCSIsListenerForIntegrationCancels, k.XCSEmitNotificationNotificationIntegrationRemoved, {
                _id: theIntegration._id,
                botId: theIntegration.bot._id
            });

            if (inBackground) {
                require('./backgroundQueue.js').enqueue('bg', 'cleanDeletedIntegration', [theIntegration], () => {
                    xcsutil.safeCallback(cb);
                });
            } else {
                this.cleanDeletedIntegration(theIntegration, err => {
                    xcsutil.safeCallback(cb, err);
                });
            }
        }
    });
};

XCSIntegrationClass.prototype.cleanDeletedIntegration = function cleanDeletedIntegration(theIntegration, cb) {
    logger.debug('Cleaning deleted integration', theIntegration._id);

    async.parallel([
        cb => {
            fileClass.deleteAssetsForIntegration(theIntegration, err => {
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
        cb => {
            removeAssociatedIntegrationDocuments(null, theIntegration._id, cb);
        }
    ], cb);
};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSIntegrationClass());

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
        log = logger.withRequest(req),
        integrationUUID = task.integrationUUID,
        changes = task.changes;

    var functionTitle = '[Integration - update_internal_worker] update integration with UUID: ' + integrationUUID;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    log.info('Updating integration', integrationUUID);

    var error = {};

    if (!changes) {

        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the property "changes" has not been specified in the task'
        });
    }

    // Retrieve the integration to be patched
    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function INUpdateInternalWorkerFindIntegration(err, integration) {
        if (err) {
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

            error.status = 400;
            error.message = 'Forbidden: unable to update the integration. Reason: the integration has been marked as \'complete\'.';
            return xcsutil.safeCallback(cb, error);
        }

        function saveIntegrationWithChanges(integrationUUID, changes) {
            log.info('Validating integration', integrationUUID, 'before saving.');
            bridge.core.validate('XCSIntegration', changes, function INUpdateInternalWorkerValidateIntegration(err, validationErrors) {
                if (err) {
                    // If err, something went really wrong here, probably a programming error
                    return xcsutil.safeCallback(cb, {
                        status: 500,
                        message: 'Internal Server Error (xcsbridge): ' + JSON.stringify(err)
                    });
                } else {
                    if (validationErrors && validationErrors.length > 0) {
                        log.error('Error validating bot:', validationErrors);
                        // If (validationErrors && validationErrors.length > 0), the body content failed validation
                        return xcsutil.safeCallback(cb, {
                            status: 400,
                            message: JSON.stringify(validationErrors[0]),
                            reasons: validationErrors
                        });
                    } else {
                        log.info('Saving integration', integrationUUID);

                        // All clear: patch the integration
                        dbCoreClass.updateDocumentWithUUID(req, integrationUUID, changes, false, k.XCSDesignDocumentIntegration, function INUpdateInternalWorkerUpdateIntegration(err, updatedIntegration) {
                            if (err) {
                                return xcsutil.safeCallback(cb, err);
                            } else {
                                if (emitStatus) {
                                    log.info('Notifying listeners of integration', integrationUUID, 'changes.');
                                    te.broadcast(k.XCSIsListenerForIntegrationUpdates, k.XCSEmitNotificationNotificationStatus, {
                                        _id: integrationUUID,
                                        botId: updatedIntegration.bot._id,
                                        currentStep: updatedIntegration.currentStep,
                                        result: updatedIntegration.result
                                    });
                                }
                                return xcsutil.safeCallback(cb, null, updatedIntegration);
                            }
                        });

                    }
                }
            });
        }

        if (k.XCSIntegrationStepTypePreparing === integration.currentStep) {
            log.info('Integration', integrationUUID, 'is now preparing, setting the start time as now.');
            // Set the started time if the integration has been assigned
            integration.startedTime = new Date();
            saveIntegrationWithChanges(integrationUUID, integration);
        } else if (k.XCSIntegrationStepTypeCompleted === integration.currentStep) {
            log.info('Integration', integrationUUID, 'is now completed, finalizing issues and setting stats.');
            issueClass.finalizeIntegrationIssues(req, integration, function INUpdateInternalWorkerFinalizeIntegrationIssues(err) {
                if (err) {

                    return xcsutil.safeCallback(cb, err);
                }

                log.debug('Finalized issues for integration', integrationUUID);

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

    var functionTitle = '[Integration - setState] set state';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!integrationUUID) {

        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the integration ID has not been specified'
        });
    }

    integrationClass.update_internal(req, integrationUUID, changes, function INSetState(err, updatedDocument) {

        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, updatedDocument);
        }
    });

}

function finishBulkImport(req, res, err) {
    xcsutil.profilerSummary(req);
    if (err) {
        return xcsutil.standardizedErrorResponse(res, err);
    } else {
        return xcsutil.standardizedResponse(res, 204);
    }
}

function finalizeTestResults(req, integrationUUID, testedDevices, testHierarchy, perfMetricNames, perfMetricKeyPaths, integrationClass, cb) {
    var log = logger.withRequest(req),
        functionTitle = '[Integration - finalizeTestResults] finalize test results';

    log.info('Finalizing integration test results.');

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

        return xcsutil.safeCallback(cb, err);
    });
}

function addPendingIntegrationForBot(req, self, botUUID, shouldClean, cb) {
    var log = logger.withRequest(req);

    bot_class.nextBotIntegrationNumber(req, botUUID, function INAddPendingIntegrationNextBotIntegrationNumber(err, oldBotSnapshot, nextIntegrationNumber) {
        if (err) {

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

            log.info('Creating new integration:', body.bot.name, '#' + body.number);

            dbCoreClass.createDocument(req, k.XCSDesignDocumentIntegration, body, function INAddPendingIntegrationCreateDocument(err, url, newIntegration) {
                if (err) {
                    return xcsutil.safeCallback(cb, err);
                } else {
                    log.debug('New integration', newIntegration._id, 'created with tiny ID', newIntegration.tinyID);

                    bot_class.findBlueprintForBot(req, oldBotSnapshot, function INAddPendingIntegrationFindItem(err, blueprintBuf) {
                        if (err) {
                            log.error('Could not load bot blueprint for new integration:', err);

                            return xcsutil.safeCallback(cb, {
                                status: 500,
                                message: 'Internal Server Error (keychain): ' + JSON.stringify(err)
                            });
                        }

                        log.debug('Successfully loaded bot blueprint, storing another copy for this integration.');

                        // Duplicate the credentials in the keychain
                        repositoryKeychain.addItem(req, newIntegration._id, blueprintBuf, botUUID, null, function INAddPendingIntegrationAddItem(err) {
                            if (err) {
                                log.error('Could not save bot blueprint for integration:', err);

                                return xcsutil.safeCallback(cb, {
                                    status: 500,
                                    message: 'Internal Server Error (keychain): ' + JSON.stringify(err)
                                });
                            }

                            log.debug('Successfully stored integration blueprint, broadcasting new integration to listeners.');
                            te.broadcast(k.XCSIsListenerForIntegrationUpdates, k.XCSEmitNotificationNotificationIntegrationCreated, {
                                _id: newIntegration._id,
                                botId: botUUID
                            });

                            log.debug('Announcing new pending integration to build services.');
                            self.announcePendingIntegrations(req, function INAddPendingIntegrationAnnouncePendingIntegrations() {
                                return xcsutil.safeCallback(cb, null, url, newIntegration);
                            });
                        });
                    });

                }
            });
        }
    });
}