'use strict';

var k = require('../constants.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js'),
    integrationSearchClass = require('./integrationSearchClass.js'),
    crypto = require('crypto'),
    async = require('async');

/* XCSIssueClass object */

function XCSIssueClass() {}

XCSIssueClass.prototype.createIssue = function createIssue(req, integrationID, issue, cb) {



    var log = logger.withRequest(req),
        self = this;

    log.info('Creating new issue for integration', integrationID);

    async.waterfall([

        function ISCreateIssueFindIntegration(cb) {
            integrationSearchClass.findIntegrationWithUUID(req, integrationID, false, cb);
        },
        function ISCreateIssueHashForIssue(integration, cb) {
            hashForIssue(req, issue, function ISCreateIssueHashForIssueCallback(err, hash) {
                if (err) {
                    return xcsutil.safeCallback(cb, err);
                } else {
                    return xcsutil.safeCallback(cb, null, integration, hash);
                }
            });
        },
        function ISCreateIssueFindIssuesByHash(integration, hash, cb) {
            self.findIssuesByHash(req, integration.bot._id, hash, function ISISCreateIssueFindIssuesByHashCallback(err, issues) {
                if (err && (undefined === issues)) {
                    return xcsutil.safeCallback(cb, err);
                } else {
                    return xcsutil.safeCallback(cb, null, integration, hash, issues || []);
                }
            });
        },
        function ISCreateIssueIterateSome(integration, hash, issues, cb) {
            var myHashableString = hashableStringForIssue(issue),
                foundMatch = issues.some(function ISCreateIssueIterateSomeCallback(existingIssue) {
                    if (hashableStringForIssue(existingIssue) === myHashableString) {
                        addIntegrationToIssue(req, existingIssue, issue, integration, cb);
                        return true;
                    }
                    return false;
                });

            if (!foundMatch) {
                _createIssue(req, issue, integration, hash, cb);
            }
        }
    ], function ISCreateIssueFinalizer(err, result) {

        return xcsutil.safeCallback(cb, err, result);
    });
};

XCSIssueClass.prototype.create = function create(req, res) {



    var issue = req.body,
        integrationID = req.params.id,
        self = this;

    self.createIssue(req, integrationID, issue, function ISCreateDocument(err, result) {
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            res.set(k.XCSResponseLocation, '/issues/' + result._id);

            xcsutil.standardizedResponse(res, 201, result);
        }

    });
};

XCSIssueClass.prototype.bulkCreateIssues = function (req, res) {
    var log = logger.withRequest(req),
        issues = req.body.issues,
        integrationID = req.params.id,
        self = this;

    log.info('Creating', issues.length, 'integration issues.');

    async.eachSeries(issues, function ISBulkCreateEachIssue(issue, cb) {
        self.createIssue(req, integrationID, issue, cb);
    }, function (err) {
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.standardizedResponse(res, 204);
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
    var log = logger.withRequest(req),
        self = this;

    log.info('Loading formatted issues for integration', integrationID);

    async.parallel({
        issues: function (cb) {
            self.findIssuesForIntegration(req, integrationID, cb);
        },
        resolvedIssues: function (cb) {
            if (estimateResolved) {
                integrationSearchClass.findIntegrationWithUUID(req, integrationID, false, function ISResolvedIssuesCallback(err, integration) {
                    if (err) {
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        resolvedIssuesForIntegration(req, integration, self, function ISResolvedIssuesForIntegrationCallback(err, issues) {
                            if (err) {
                                return xcsutil.safeCallback(cb, err);
                            } else {
                                return xcsutil.safeCallback(cb, null, issues.map(function ISResolvedIssuesForIntegrationMapCallback(issue) {
                                    var streak = issue.streaks[issue.streaks.length - 1],
                                        lastRecord = streak.records[streak.records.length - 1];

                                    return {
                                        _id: issue._id,
                                        _rev: issue._rev,
                                        message: lastRecord.message,
                                        type: issue.type,
                                        fixItType: issue.fixItType,
                                        issueType: issue.issueType,
                                        commits: [], // TODO
                                        target: issue.target,
                                        testCase: issue.testCase,
                                        documentFilePath: issue.documentFilePath,
                                        integrationID: integrationID,
                                        age: integration.number - streak.records[0].integration.number,
                                        status: 2,
                                        silenced: issue.silenced || streak.silenced || lastRecord.silenced,
                                        associations: streak.associations
                                    };
                                }));
                            }
                        });
                    }
                });
            } else {
                return xcsutil.safeCallback(cb, null, []);
            }
        }
    }, function ISFormattedIssuesForIntegrationFinalizer(err, results) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var docs = results.issues.concat(results.resolvedIssues);
            return xcsutil.safeCallback(cb, null, formatIntegrationIssues(req, docs));
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

    resolvedIssuesForIntegration(req, integration, self, function ISFinalizeIntegrationIssuesResolvedIssuesForIntegration(err, resolvedIssues) {
        log.info('Marking', resolvedIssues.length, 'issues as resolved.');
        async.each(resolvedIssues, function ISFinalizeIntegrationIssuesResolvedIssuesForIntegrationIterate(issue, cb) {
            var streak = issue.streaks[issue.streaks.length - 1];
            streak.open = false;
            streak.closedByIntegration = {
                _id: integration._id,
                number: integration.number
            };

            var change = {
                streaks: issue.streaks
            };

            log.debug('Resolving issue', issue._id);
            dbCoreClass.updateDocumentWithUUID(req, issue._id, change, true, issue.doc_type, function ISFinalizeIntegrationIssuesUpdateIssue(err) {
                return xcsutil.safeCallback(cb, err);
            });
        }, function ISFinalizeIntegrationIssuesFinalizer(err) {
            return xcsutil.safeCallback(cb, err);
        });
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

/* Module exports */

module.exports = xcsutil.bindAll(new XCSIssueClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function sanitizedMessage(message) {
    message = message.replace(/please attach the log file at .*$/g, '');
    message = message.replace(/0x[0-9A-Fa-f]+/g, '');
    message = message.replace(/[0-9]+%/g, '');
    return message;
}

function hashableStringForIssue(issue) {
    return issue.type + '\n' + (issue.issueType || '') + '\n' +
        (issue.target || '') + '\n' + (issue.testCase || '') + '\n' +
        (issue.documentFilePath || '') + '\n' + sanitizedMessage(issue.message);
}

function hashForIssue(req, issue, cb) {
    var hash = crypto.createHash('sha1');

    var digested = hash.update(hashableStringForIssue(issue), 'utf8').digest('hex');
    return xcsutil.safeCallback(cb, null, digested);
}

function createStreakRecord(req, issue, integration) {
    var streakRecord = {
        integration: {
            _id: integration._id,
            number: integration.number
        },
        message: issue.message
    };

    if (issue.commits) {
        streakRecord.commits = issue.commits;
        delete issue.commits;
    }

    if (issue.documentLocationData) {
        streakRecord.documentLocationData = issue.documentLocationData;
    }
    delete issue.documentLocationData;

    if (issue.lineNumber) {
        streakRecord.lineNumber = issue.lineNumber;
    }
    delete issue.lineNumber;

    return streakRecord;
}

function addStreakRecordToIssue(req, issue, streakRecord) {
    var addedToExisting = issue.streaks.some(function ISAddStreakRecordToIssueCallback(streak) {
        if (streak.open) {
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

function openIssuesForBotID(req, botID, cb) {
    var log = logger.withRequest(req),
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
        query = {
            include_docs: true
        };

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

function resolvedIssuesForIntegration(req, integration, issueClass, cb) {
    var log = logger.withRequest(req);

    log.debug('Determining resolved issues for integration', integration._id);

    if (!shouldResultFinalizeIssues(integration.result)) {
        return xcsutil.safeCallback(cb, null, []);
    }

    var integrationID = integration._id,
        botID = integration.bot._id;

    async.parallel({
        integrationIssues: function (cb) {
            issueClass.findIssuesForIntegration(req, integrationID, cb);
        },
        openIssues: function (cb) {
            openIssuesForBotID(req, botID, cb);
        }
    }, function ISResolvedIssuesForIntegrationFinalizer(err, results) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var seenIssueIDs = results.integrationIssues.map(function ISResolvedIssuesForIntegrationFinalizerMap(issue) {
                return issue._id;
            });

            return xcsutil.safeCallback(cb, null, results.openIssues.filter(function ISResolvedIssuesForIntegrationFinalizerFilter(issue) {
                // only return issues that weren't seen in this integration
                return seenIssueIDs.indexOf(issue._id) === -1 && shouldIssueBeResolvedForResult(issue, integration.result);
            }));
        }
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
