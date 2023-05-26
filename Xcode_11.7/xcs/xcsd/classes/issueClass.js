'use strict';

var k = require('../constants.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js'),
    integrationSearchClass = require('./integrationSearchClass.js'),
    integrationIssueAuthorClass = require('./integrationIssueAuthorClass.js'),
    crypto = require('crypto'),
    async = require('async');

const xcsCore = require('../util/bridge/core.js');

/* XCSIssueClass object */

function XCSIssueClass() {}

XCSIssueClass.prototype.createIssue = function createIssue(req, integration, issue, cb) {
    var log = logger.withRequest(req),
        self = this;

    log.info('Creating new issue for integration', integration._id);

    async.waterfall([

        function ISCreateIssueInspectAuthorSuspects(callback) {
            integrationIssueAuthorClass.processIssuesSuspects(req, issue, function ISCreateIssueInspectAuthorSuspectCallback(err, processedIssue) {
                if (err) {
                    return xcsutil.safeCallback(callback, err);
                } else {
                    return xcsutil.safeCallback(callback, null, processedIssue);
                }
            });
        },
        function ISCreateIssueFindIssuesByHash(processedIssue, callback) {
            let hash = self.hashForIssue(issue);
            self.findIssuesByHash(req, integration.bot._id, hash, function ISISCreateIssueFindIssuesByHashCallback(err, issues) {
                if (err && (undefined === issues)) {
                    return xcsutil.safeCallback(callback, err);
                } else {
                    return xcsutil.safeCallback(callback, null, processedIssue, hash, issues || []);
                }
            });
        },
        function ISCreateIssueIterateSome(processedIssue, hash, issues, callback) {
            var myHashableString = hashableStringForIssue(processedIssue);

            let foundMatch = issues.some(function ISCreateIssueIterateSomeCallback(existingIssue) {
                if (hashableStringForIssue(existingIssue) === myHashableString) {
                    // If the issue has already been found in a previous integration
                    // We add a bew streak record to the issue
                    // then we go straight to the finalizer
                    addIntegrationToIssue(req, existingIssue, processedIssue, integration, callback);
                    return true;
                }
                return false;
            });

            if (!foundMatch) {
                _createIssue(req, processedIssue, integration, hash, callback);
            }
        }
    ], function ISCreateIssueFinalizer(err, result) {
        if (err && err.final) {
            err = null;
        }
        return xcsutil.safeCallback(cb, err, result);
    });
};

XCSIssueClass.prototype.create = function create(req, res) {
    var issue = req.body,

    integrationID = req.params.id,
        self = this;

    integrationSearchClass.findIntegrationWithUUID(req, integrationID, false, (err, integration) => {
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            self.createIssue(req, integration, issue, function ISCreateDocument(err, result) {
                if (err) {
                    xcsutil.standardizedErrorResponse(res, err);
                } else {
                    res.set(k.XCSResponseLocation, '/issues/' + result._id);
                    xcsutil.standardizedResponse(res, 201, result);
                }
            });
        }
    });
};

XCSIssueClass.prototype.bulkCreateIssues = function (req, res) {
    var log = logger.withRequest(req),
        issues = req.body.issues,
        integrationID = req.params.id,
        self = this;

    log.info('Creating', issues.length, 'integration issues.');

    integrationSearchClass.findIntegrationWithUUID(req, integrationID, false, (err, integration) => {
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            async.eachSeries(issues, function ISBulkCreateEachIssue(issue, cb) {
                self.createIssue(req, integration, issue, cb);
            }, function (err) {
                if (err) {
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    return xcsutil.standardizedResponse(res, 204);
                }
            });
        }
    });
};

XCSIssueClass.prototype.findIssuesByHash = function findIssuesByHash(req, botID, hash, cb) {
    var log = logger.withRequest(req),
        query = {
            include_docs: true
        },
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader];

    log.debug('Finding issues with hash', hash);

    if (unitTestUUID) {
        query.key = [unitTestUUID, k.XCSIssueHashVersion, botID, hash];
    } else {
        query.key = [k.XCSIssueHashVersion, botID, hash];
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIssue, k.XCSDesignDocumentViewBotIssuesByHash, query, function ISFindIssuesByHash(err, docs) {
        return xcsutil.safeCallback(cb, err, docs);
    });
};

XCSIssueClass.prototype.findIssuesForIntegration = function findIssuesForIntegration(req, integrationID, cb) {
    var log = logger.withRequest(req),
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = {};

    log.debug('Finding all issues for integration', integrationID);

    if (unitTestUUID) {
        query.key = [unitTestUUID, integrationID];
    } else {
        query.key = integrationID;
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIssue, k.XCSDesignDocumentViewBotIssuesByIntegration, query, function ISFindIssuesForIntegration(err, docs) {
        if (err && err.status === 404) {
            return xcsutil.safeCallback(cb, null, []);
        } else {
            return xcsutil.safeCallback(cb, err, docs);
        }
    });
};

XCSIssueClass.prototype.formattedIssuesForIntegration = function formattedIssuesForIntegration(req, integrationID, estimateResolved, cb) {
    cb = xcsutil.callback(cb);

    var log = logger.withRequest(req);

    log.info('Loading formatted issues for integration', integrationID);

    this.findIssuesForIntegrationWithEstimateResolved(req, integrationID, estimateResolved, (err, issues) => {
        if (err) {
            cb(err);
        } else {
            cb(null, formatIntegrationIssues(req, issues));
        }
    });
};

XCSIssueClass.prototype.findIssuesForIntegrationWithEstimateResolved = function findIssuesForIntegrationWithEstimateResolved(req, integrationID, estimateResolved, cb) {
    var log = logger.withRequest(req),
        self = this;

    log.debug('Loading issues for integration', integrationID);

    async.parallel({
        issues: function (cb) {
            self.findIssuesForIntegration(req, integrationID, cb);
        },
        resolvedIssues: function (cb) {
            if (estimateResolved) {
                return estimateResolvedIssues(req, integrationID, self, cb);
            } else {
                return xcsutil.safeCallback(cb, null, []);
            }
        }
    }, function ISFormattedIssuesForIntegrationFinalizer(err, results) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var docs = results.issues.concat(results.resolvedIssues);
            return xcsutil.safeCallback(cb, null, docs);
        }
    });
};

XCSIssueClass.prototype.issuesForIntegration = function issuesForIntegration(req, res) {
    var log = logger.withRequest(req),
        integrationID = req.params.id,
        self = this;

    findOldIssuesForIntegration(req, integrationID, function ISIssuesForIntegrationFindOldIssuesCallback(err, oldIssues) {
        if (!err) {
            xcsutil.standardizedResponse(res, 200, oldIssues[0]);
        } else {
            log.debug('No old-style integration issues found for integration', integrationID + ', trying new format.');
            self.formattedIssuesForIntegration(req, integrationID, false, function ISIssuesForIntegrationFormattedIssuesForIntegrationCallback(err, issues) {
                if (err) {
                    xcsutil.standardizedErrorResponse(res, err);
                } else {
                    xcsutil.standardizedResponse(res, 200, issues);
                }
            });
        }
    });
};

XCSIssueClass.prototype.finalizeIntegrationIssues = function finalizeIntegrationIssues(req, integration, cb) {
    var log = logger.withRequest(req),
        self = this;

    log.info('Finalizing issues for integration', integration._id);

    resolvedIssueIDsForIntegration(req, integration, self, (err, resolvedIssueIDs) => {
        if (err) {
            return cb(err);
        }

        log.info('Marking', resolvedIssueIDs.length, 'issues as resolved.');

        dbCoreClass.batchUpdateDocuments(req, resolvedIssueIDs, null, (issue) => {
            // resolvedIssueIDsForIntegration can't filter this, so we have to do it here
            if (!shouldIssueBeResolvedForResult(issue, integration.result)) {
                return null;
            }

            let streak = issue.streaks[issue.streaks.length - 1];
            streak.open = false;
            streak.closedByIntegration = {
                _id: integration._id,
                number: integration.number
            };

            return issue;
        }, cb);
    });
};

XCSIssueClass.prototype.silence = function silence(req, res) {
    var issueID = req.params.issueID,
        integrationID = req.params.id,
        mode = req.body.mode;

    silenceIssue(req, issueID, integrationID, mode, function ISSilenceIssueCallback(err) {
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.standardizedResponse(res, 204);
        }
    });
};

XCSIssueClass.prototype.unsilence = function unsilence(req, res) {
    var issueID = req.params.issueID,
        integrationID = req.params.id;

    unsilenceIssue(req, issueID, integrationID, function ISUnsilenceCallback(err) {
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.standardizedResponse(res, 204);
        }
    });
};

XCSIssueClass.prototype.addAssociation = function addAssociation(req, res) {
    var issueID = req.params.issueID,
        integrationID = req.params.id,
        association = req.body,
        type = association.type;

    delete association.type;

    addAssociationToIssue(req, issueID, integrationID, type, association, function ISAddAssociationToIssueCallback(err) {
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            res.set(k.XCSResponseLocation, '/integrations/' + integrationID + '/issues/' + issueID);
            xcsutil.standardizedResponse(res, 201, association);
        }
    });
};

XCSIssueClass.prototype.removeAssociation = function removeAssociation(req, res) {
    var issueID = req.params.issueID,
        integrationID = req.params.id,
        type = req.body.type;

    removeAssociationFromIssue(req, issueID, integrationID, type, function ISRemoveAssociationCallback(err) {
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.standardizedResponse(res, 204);
        }
    });
};

XCSIssueClass.prototype.hashForIssue = function hashForIssue(issue) {
    var hash = crypto.createHash('sha1');
    return hash.update(hashableStringForIssue(issue), 'utf8').digest('hex');
};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSIssueClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function sanitizedMessage(message) {
    // only grab the first line
    let locationOfNewline = message.indexOf('\n');
    if (locationOfNewline > -1) {
        message = message.substring(0, locationOfNewline);
    }

    message = message.replace(/please attach the log file at .*$/g, '');
    message = message.replace(/0x[0-9A-Fa-f]+/g, '');
    message = message.replace(/[0-9]+%/g, '');
    message = message.replace(/Crash: (.*) \(\d+\): .*$/, 'Crash: $1: ');
    return message;
}

function hashableStringForIssue(issue) {
    return issue.type + '\n' + (issue.issueType || '') + '\n' +
        (issue.target || '') + '\n' + (issue.testCase || '') + '\n' +
        (issue.documentFilePath || '') + '\n' + sanitizedMessage(issue.message);
}

function createStreakRecord(req, issue, integration) {
    var streakRecord = {
        integration: {
            _id: integration._id,
            number: integration.number
        },
        message: issue.message
    };

    streakRecord.commits = issue.commits;
    delete issue.commits;
    streakRecord.issueAuthors = issue.issueAuthors;
    delete issue.issueAuthors;

    if (issue.documentLocationData) {
        streakRecord.documentLocationData = issue.documentLocationData;
    }
    delete issue.documentLocationData;

    if (issue.lineNumber) {
        streakRecord.lineNumber = issue.lineNumber;
    }
    delete issue.lineNumber;

    if (issue.cause) {
        streakRecord.cause = issue.cause;
        delete issue.cause;
    }

    return streakRecord;
}

function addStreakRecordToIssue(req, issue, streakRecord) {
    var addedToExisting = shouldTrackStreaksForIssue(req, issue) && issue.streaks.some(streak => {
        if (streak.open) {
            // if the streak is already open, then we don't need to add commits to the record
            streakRecord.commits = [];
            streakRecord.issueAuthors = [];
            if (streakRecord.cause) {
                delete streakRecord.cause;
            }

            streak.records.push(streakRecord);
            return true;
        }
        return false;
    });

    if (!addedToExisting) {
        issue.streaks.push({
            open: true,
            records: [streakRecord]
        });
    }
}

function shouldTrackStreaksForIssue(req, issue) {
    if (issue.message === 'This integration was canceled.') {
        return false;
    }

    return true;
}

function _createIssue(req, issue, integration, hash, cb) {
    var log = logger.withRequest(req),
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader];

    log.debug('Creating new bot issues document with hash', hash);

    if (unitTestUUID) {
        issue[k.XCSUnitTestProperty] = unitTestUUID;
    }

    issue.botID = integration.bot._id;
    issue.hash = hash;
    issue.hashVersion = k.XCSIssueHashVersion;

    var streakRecord = createStreakRecord(req, issue, integration);
    issue.streaks = [{
        open: true,
        records: [streakRecord]
    }];

    dbCoreClass.createDocument(req, 'bot_issue', issue, function ISCreateIssue(err, url, doc) {
        return xcsutil.safeCallback(cb, err, doc);
    });
}

function addIntegrationToIssue(req, savedIssue, issue, integration, cb) {
    var log = logger.withRequest(req);

    log.debug('Adding integration', integration._id, 'to existing bot issue:', savedIssue._id);

    var streakRecord = createStreakRecord(req, issue, integration);
    addStreakRecordToIssue(req, savedIssue, streakRecord);

    var changes = {
        streaks: savedIssue.streaks
    };

    dbCoreClass.updateDocumentWithUUID(req, savedIssue._id, changes, true, 'bot_issue', function ISAddIntegrationToIssueUpdateCallback(err, doc) {
        return xcsutil.safeCallback(cb, err, doc);
    });
}

function estimateResolvedIssues(req, integrationID, issueClass, cb) {
    cb = xcsutil.callback(cb);

    integrationSearchClass.findIntegrationWithUUID(req, integrationID, false, (err, integration) => {
        if (err) {
            return cb(err);
        }

        resolvedIssuesForIntegration(req, integration, issueClass, (err, issues) => {
            if (err) {
                return cb(err);
            }

            return cb(null, issues.map(issue => {
                var streak = issue.streaks[issue.streaks.length - 1],
                    firstRecord = streak.records[0],
                    lastRecord = streak.records[streak.records.length - 1];

                return {
                    _id: issue._id,
                    _rev: issue._rev,
                    message: lastRecord.message,
                    reason: lastRecord.reason,
                    type: issue.type,
                    fixItType: issue.fixItType,
                    issueType: issue.issueType,
                    commits: firstRecord.commits,
                    target: issue.target,
                    testCase: issue.testCase,
                    documentFilePath: issue.documentFilePath,
                    integrationID: integrationID,
                    age: integration.number - streak.records[0].integration.number,
                    status: 2,
                    silenced: issue.silenced || streak.silenced || lastRecord.silenced,
                    associations: streak.associations,
                    issueAuthors: firstRecord.issueAuthors,
                    lineNumber: issue.lineNumber
                };
            }));
        });
    });
}

function openIssueIDsForBotID(req, botID, cb) {
    var log = logger.withRequest(req),
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = {};

    log.debug('Fetching open issues for bot', botID);

    if (unitTestUUID) {
        query.key = [unitTestUUID, botID];
    } else {
        query.key = botID;
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIssue, k.XCSDesignDocumentViewOpenBotIssuesByBot, query, function ISOpenIssuesForBotIDCallback(err, docs) {
        if (err && err.status === 404) {
            return xcsutil.safeCallback(cb, null, []);
        } else {
            return xcsutil.safeCallback(cb, err, docs);
        }
    });
}

function emptyIssueDocument() {
    var issues = {
        buildServiceErrors: [],
        buildServiceWarnings: [],
        triggerErrors: []
    };

    ['errors', 'warnings', 'testFailures', 'analyzerWarnings'].forEach(function ISEmptyIssueDocumentIterate(type) {
        issues[type] = {
            unresolvedIssues: [],
            freshIssues: [],
            resolvedIssues: [],
            silencedIssues: []
        };
    });

    return issues;
}

function bucketNameForIssue(issue) {
    if (issue.silenced) {
        return 'silencedIssues';
    } else if (issue.status === 0) {
        return 'freshIssues';
    } else if (issue.status === 1) {
        return 'unresolvedIssues';
    } else {
        return 'resolvedIssues';
    }
}

function formatIntegrationIssues(req, docs) {
    var issues = emptyIssueDocument();

    docs.forEach(function ISFormatIntegrationIssuesIterate(doc) {
        var pluralType = doc.type + 's',
            issueDiff = issues[pluralType],
            bucket;

        if (doc.type.indexOf('buildService') === 0 || doc.type.indexOf('trigger') === 0) {
            if (doc.status === 2) {
                // don't include resolved build service issues
                return;
            }

            bucket = issueDiff;
        } else {
            bucket = issueDiff[bucketNameForIssue(doc)];
        }

        bucket.push(doc);
    });

    return issues;
}

function findOldIssuesForIntegration(req, integrationID, cb) {
    var log = logger.withRequest(req),
        query = {
            include_docs: true,
            key: integrationID
        };

    log.info('Fetching old-style integration issues for integration', integrationID);

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentIssue, k.XCSDesignDocumentViewIssuesByIntegrationID, query, function ISFindOldIssuesForIntegration(err, docs) {
        return xcsutil.safeCallback(cb, err, docs);
    });
}

function shouldResultFinalizeIssues(result) {
    return result === k.XCSIntegrationResultSucceeded ||
        result === k.XCSIntegrationResultBuildErrors ||
        result === k.XCSIntegrationResultTestFailures ||
        result === k.XCSIntegrationResultWarnings ||
        result === k.XCSIntegrationResultAnalyzerWarnings;
}

function shouldIssueBeResolvedForResult(issue, result) {
    if (result === k.XCSIntegrationResultBuildErrors) {
        return issue.type === 'error';
    }
    return true;
}

function resolvedIssueIDsForIntegration(req, integration, self, cb) {
    cb = xcsutil.callback(cb);
    var log = logger.withRequest(req);

    log.debug('Determining resolved issues for integration', integration._id);

    if (!shouldResultFinalizeIssues(integration.result)) {
        return cb(null, []);
    }

    var integrationID = integration._id,
        botID = integration.bot._id;

    async.parallel({
        integrationIssues: cb => {
            self.findIssuesForIntegration(req, integrationID, cb);
        },
        openIssueIDs: cb => {
            openIssueIDsForBotID(req, botID, cb);
        }
    }, (err, results) => {
        if (err) {
            return cb(err);
        } else {
            let seenIssueIDs = results.integrationIssues.map(issue => issue._id);
            let resolvedIssueIDs = results.openIssueIDs.filter(id => seenIssueIDs.indexOf(id) === -1);

            return cb(null, resolvedIssueIDs);
        }
    });
}

function resolvedIssuesForIntegration(req, integration, issueClass, cb) {
    cb = xcsutil.callback(cb);
    const log = logger.withRequest(req);

    resolvedIssueIDsForIntegration(req, integration, issueClass, (err, resolvedIssueIDs) => {
        if (err) {
            return cb(err);
        }

        log.debug('Fetching documents for', resolvedIssueIDs, 'resolved issues');

        return dbCoreClass.bulkFindDocuments(req, resolvedIssueIDs, null, (err, issues) => {
            if (err) {
                return cb(err);
            }
            return cb(null, issues.filter(issue => shouldIssueBeResolvedForResult(issue, integration.result)));
        });
    });
}

function silenceIssueForever(issue, cb) {
    issue.silenced = true;
    return xcsutil.safeCallback(cb, null, issue);
}

function silenceIssueByFindingRecord(issue, integrationID, silencer, cb) {
    var found = issue.streaks.some(function ISSilenceIssueByFindingRecordSomeCallback(streak) {
        var found = streak.records.some(function ISSilenceIssueByFindingRecordStreakSomeCallback(record) {
            if (record.integration._id === integrationID) {
                silencer(streak, record);
                return true;
            }
            return false;
        });

        return found;
    });

    if (!found) {
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'could not find an occurrence of this issue for this integration.'
        });
    } else {
        return xcsutil.safeCallback(cb, null, issue);
    }
}

function silenceIssueForStreak(issue, integrationID, cb) {
    silenceIssueByFindingRecord(issue, integrationID, function ISSilenceIssueForStreakCallbacl(streak) {
        streak.silenced = true;
    }, cb);
}

function silenceIssueForIntegration(issue, integrationID, cb) {
    silenceIssueByFindingRecord(issue, integrationID, function ISSilenceIssueForIntegrationCallback(streak, record) {
        record.silenced = true;
    }, cb);
}

function silenceIssue(req, issueID, integrationID, mode, cb) {
    var log = logger.withRequest(req);
    log.info('Silencing issue', issueID, 'in integration', integrationID, 'using mode', mode);

    async.waterfall([

        function ISSilenceIssueFindIssue(cb) {
            dbCoreClass.findDocumentWithUUID(req, issueID, 'bot_issue', cb);
        },
        function ISSilenceIssueSilenceIssue(issue, cb) {
            if (mode === 1) {
                log.debug('Silencing issue for just this integration.');
                silenceIssueForIntegration(issue, integrationID, cb);
            } else if (mode === 2) {
                log.debug('Silencing issue for this integration\'s streak.');
                silenceIssueForStreak(issue, integrationID, cb);
            } else {
                log.debug('Silencing all occurrences of this issue.');
                silenceIssueForever(issue, cb);
            }
        },
        function ISSilenceIssueUpdateIssue(issue, cb) {
            delete issue._id;
            delete issue._rev;

            dbCoreClass.updateDocumentWithUUID(req, issueID, issue, false, issue.doc_type, cb);
        }
    ], function ISSilenceIssueFinalizer(err) {
        return xcsutil.safeCallback(cb, err);
    });
}

function unsilenceIssue(req, issueID, integrationID, cb) {
    var log = logger.withRequest(req);

    log.info('Unsilencing issue', issueID, 'in integration', integrationID);

    async.waterfall([
        function ISUnsilenceIssueFindIssue(cb) {
            dbCoreClass.findDocumentWithUUID(req, issueID, 'bot_issue', cb);
        },
        function ISUnsilenceIssueIterateSome(issue, cb) {
            issue.silenced = false;

            issue.streaks.some(function ISUnsilenceIssueSome(streak) {
                var found = streak.records.some(function ISUnsilenceIssueStreakSome(record) {
                    if (record.integration._id === integrationID) {
                        record.silenced = false;
                        return true;
                    }
                    return false;
                });

                if (found) {
                    streak.silenced = false;
                    return true;
                }
                return false;
            });

            return xcsutil.safeCallback(cb, null, issue);
        },
        function ISUnsilenceIssueUpdateIssue(issue, cb) {
            delete issue._id;
            delete issue._rev;

            dbCoreClass.updateDocumentWithUUID(req, issueID, issue, false, issue.doc_type, cb);
        }
    ], function ISUnsilenceIssueFinalizer(err) {
        return xcsutil.safeCallback(cb, err);
    });
}

function addAssociationToIssue(req, issueID, integrationID, type, association, cb) {
    var log = logger.withRequest(req);

    log.info('Adding', type, 'association to issue', issueID, 'in integration', integrationID);

    async.waterfall([
        function ISAddAssociationToIssueFindIssue(cb) {
            dbCoreClass.findDocumentWithUUID(req, issueID, 'bot_issue', cb);
        },
        function (issue, cb) {
            if (type === 'assignee') {
                attachFullNameToAssociation(req, association, (err) => {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, issue);
                    }
                });
            } else {
                cb(null, issue);
            }
        },
        function ISAddAssociationToIssueIterateSome(issue, cb) {
            var found = issue.streaks.some(function ISAddAssociationToIssueIterateSomeCallback(streak) {
                var found = streak.records.some(function ISAddAssociationToIssueIterateStreakSomeCallback(record) {
                    return record.integration._id === integrationID;
                });

                if (found) {
                    if (!streak.associations) {
                        streak.associations = {};
                    }
                    streak.associations[type] = association;
                    return true;
                }
                return false;
            });

            if (found) {
                return xcsutil.safeCallback(cb, null, issue);
            } else {
                return xcsutil.safeCallback(cb, {
                    status: 400,
                    message: 'Could not add association to issue because this issue does not appear in this integration'
                });
            }
        },
        function ISAddAssociationToIssueUpdateIssue(issue, cb) {
            dbCoreClass.updateDocumentWithUUID(req, issueID, {
                streaks: issue.streaks
            }, true, issue.doc_type, cb);
        }
    ], function ISAddAssociationToIssueFinalizer(err) {
        return xcsutil.safeCallback(cb, err);
    });
}

function attachFullNameToAssociation(req, association, cb) {
    const log = logger.withRequest(req);

    log.debug('Adding an assignee association, looking up full name for user', association.username);

    xcsCore.fullNameForUsername(association.username, (err, fullName) => {
        if (err) {
            cb(err);
        } else {
            if (fullName) {
                log.debug('Found full name for user:', fullName);
                association.fullName = fullName;
            } else {
                log.debug('Could not find full name for user.');
            }

            cb();
        }
    });
}

function removeAssociationFromIssue(req, issueID, integrationID, type, cb) {
    var log = logger.withRequest(req);

    log.info('Removing', type, 'association from issue', issueID, 'in integration', integrationID);

    async.waterfall([
        function ISRemoveAssociationFromIssueFindIssue(cb) {
            dbCoreClass.findDocumentWithUUID(req, issueID, 'bot_issue', cb);
        },
        function ISRemoveAssociationFromIssueIterateSome(issue, cb) {
            var found = issue.streaks.some(function ISRemoveAssociationFromIssueIterateSomeCallback(streak) {
                var found = streak.records.some(function ISRemoveAssociationFromIssueIterateStreakSomeCallback(record) {
                    return record.integration._id === integrationID;
                });

                if (found) {
                    if (streak.associations && streak.associations[type]) {
                        delete streak.associations[type];
                    }
                    return true;
                }
                return false;
            });

            if (found) {
                return xcsutil.safeCallback(cb, null, issue);
            } else {
                return xcsutil.safeCallback(cb, {
                    status: 400,
                    message: 'Could not remove association from issue because this issue does not appear in this integration'
                });
            }
        },
        function ISRemoveAssociationFromIssueUpdateIssue(issue, cb) {
            dbCoreClass.updateDocumentWithUUID(req, issueID, issue, false, issue.doc_type, cb);
        }
    ], function ISRemoveAssociationFromIssueFinalizer(err) {
        return xcsutil.safeCallback(cb, err);
    });
}
