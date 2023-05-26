'use strict';

var k = require('../constants.js'),
    xcsutil = require('../util/xcsutil.js');

/* XCSIntegrationSearchClass object */

function XCSIntegrationIssueAuthorClass() {}

XCSIntegrationIssueAuthorClass.prototype.processIssuesSuspects = function processIssuesSuspects(req, issue, cb) {
    if (!issue) {
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the issue has not been specified'
        });
    }

    // Organize strategies in high and low confidence arrays
    var highConfidenceStrategies = [];
    var lowConfidenceStrategies = [];

    // Check which kind of suspects we have received
    if (issue.issueAuthorSuspects !== undefined && issue.issueAuthorSuspects !== null && issue.issueAuthorSuspects.length) {
        for (var i = 0; i < issue.issueAuthorSuspects.length; i++) {
            var issueAuthorSuspect = issue.issueAuthorSuspects[i];

            if (issueAuthorSuspect.issueSuspectStrategy.confidence === k.XCSIssueIdentificationStrategyHighConfidence) {
                highConfidenceStrategies.push(issueAuthorSuspect);
            } else if (issueAuthorSuspect.issueSuspectStrategy.confidence === k.XCSIssueIdentificationStrategyLowConfidence) {
                lowConfidenceStrategies.push(issueAuthorSuspect);
            }
        }
    }

    // High confidence strategies have the priority
    if (highConfidenceStrategies.length > 0) {
        highConfidenceStrategies.sort(this.sortIssueAuthorSuspectByReliability);
        this.processHighConfidenceStrategies(highConfidenceStrategies, issue);
        this.finalize(issue, cb);
    } else if (lowConfidenceStrategies.length > 0) {
        lowConfidenceStrategies.sort(this.sortIssueAuthorSuspectByReliability);
        this.processLowConfidenceStrategies(lowConfidenceStrategies, issue);
        this.finalize(issue, cb);
    } else {
        this.finalize(issue, cb);
    }
};

XCSIntegrationIssueAuthorClass.prototype.finalize = function finalize(issue, cb, error) {
    if (issue) {
        delete issue.issueAuthorSuspects;

        if (!issue.commits) {
            issue.commits = [];
        }
        if (!issue.issueAuthors) {
            issue.issueAuthors = [];
        }
    }

    if (error) {
        return xcsutil.safeCallback(cb, error);
    } else {
        return xcsutil.safeCallback(cb, null, issue);
    }

};

XCSIntegrationIssueAuthorClass.prototype.processHighConfidenceStrategies = function processHighConfidenceStrategies(highConfidenceStrategies, issue) {
    if (issue !== undefined && issue !== null) {

        var validSuspects = [];

        for (var i = 0; i < highConfidenceStrategies.length; i++) {
            var issueAuthorSuspect = highConfidenceStrategies[i];

            if (issueAuthorSuspect && issueAuthorSuspect.issueSuspectStrategy) {
                if (validSuspects.length === 0) {
                    validSuspects.push(issueAuthorSuspect);
                } else {
                    var sampleIssueAuthor = validSuspects[0];
                    var sampleStrategy = sampleIssueAuthor.issueSuspectStrategy;

                    if (issueAuthorSuspect.issueSuspectStrategy.reliability > sampleStrategy.reliability) {
                        validSuspects = [];
                        validSuspects.push(issueAuthorSuspect);
                    } else if (issueAuthorSuspect.issueSuspectStrategy.reliability === sampleStrategy.reliability) {
                        validSuspects.push(issueAuthorSuspect);
                    }
                }
            }
        }

        for (var j = 0; j < validSuspects.length; j++) {
            this.saveIssueCommitsToIssue(issue, validSuspects[j]);
        }
    }
};

XCSIntegrationIssueAuthorClass.prototype.processLowConfidenceStrategies = function processLowConfidenceStrategies(lowConfidenceStrategies, issue) {
    if (issue !== undefined && issue !== null) {
        var validSuspects = [];

        for (var i = 0; i < lowConfidenceStrategies.length; i++) {
            var issueAuthorSuspect = lowConfidenceStrategies[i];

            if (issueAuthorSuspect && issueAuthorSuspect.issueSuspectStrategy) {
                if (validSuspects.length === 0) {
                    validSuspects.push(issueAuthorSuspect);
                } else {
                    var sampleIssueAuthor = validSuspects[0];
                    var sampleStrategy = sampleIssueAuthor.issueSuspectStrategy;

                    if (issueAuthorSuspect.issueSuspectStrategy.reliability > sampleStrategy.reliability) {
                        validSuspects = [];
                        validSuspects.push(issueAuthorSuspect);
                    } else if (issueAuthorSuspect.issueSuspectStrategy.reliability === sampleStrategy.reliability) {
                        validSuspects.push(issueAuthorSuspect);
                    }
                }

                // Silence: Don't make functions within a loop 
                /*jshint -W083*/

                // Remove suspects with commits older than 3 months
                validSuspects = validSuspects.filter(validSuspect => {
                    if (validSuspect && validSuspect.suspects) {
                        validSuspect.suspects = validSuspect.suspects.filter(suspect => {
                            if (suspect && suspect.commits) {
                                suspect.commits = suspect.commits.filter(commit => {
                                    if (commit && commit.XCSCommitTimestamp) {
                                        let commitTimestamp = new Date(commit.XCSCommitTimestamp);
                                        let oneMonthsAgo = new Date();
                                        oneMonthsAgo.setMonth(oneMonthsAgo.getMonth() - 1);

                                        if (commitTimestamp.getTime() > oneMonthsAgo.getTime()) {
                                            return true;
                                        } else {
                                            return false;
                                        }
                                    } else {
                                        return false;
                                    }
                                });
                                return (suspect.commits.length > 0);
                            } else {
                                return false;
                            }
                        });
                        return (validSuspect.suspects.length > 0);
                    } else {
                        return false;
                    }
                });
            }
        }

        for (var j = 0; j < validSuspects.length; j++) {
            this.saveIssueCommitsToIssue(issue, validSuspects[j]);
        }
    }
};

XCSIntegrationIssueAuthorClass.prototype.saveIssueCommitsToIssue = function saveIssueCommitsToIssue(issue, issueAuthorSuspect) {
    if (issue && issueAuthorSuspect) {
        if (!issue.commits) {
            issue.commits = [];
        }
        if (!issue.issueAuthors) {
            issue.issueAuthors = [];
        }

        for (var i = 0; i < issueAuthorSuspect.suspects.length; i++) {
            var suspect = issueAuthorSuspect.suspects[i];

            if (suspect.commits && suspect.commits.length === 0) {
                continue;
            }

            for (var j = 0; j < suspect.commits.length; j++) {
                var commit = suspect.commits[j];
                issue.commits.push(commit);
                var identificationStrategy = {
                    XCSIssueSuspectstrategy: issueAuthorSuspect.issueSuspectStrategy,
                    XCSBlueprintRepositoryID: commit.XCSBlueprintRepositoryID,
                    XCSCommitHash: commit.XCSCommitHash
                };
                issue.issueAuthors.push(identificationStrategy);
            }
        }
    }
};

XCSIntegrationIssueAuthorClass.prototype.cleanDuplicateCommitsInIssue = function cleanDuplicateCommitsInIssue(issue) {
    if (issue) {
        var commits = issue.commits;
        var commitsDict = {};
        var finalCommits = [];

        for (var i = 0; i < commits.length; i++) {
            var commit = commits[i];
            if (commitsDict[commit.XCSBlueprintRepositoryID + commit.XCSCommitHash] === undefined) {
                commitsDict[commit.XCSBlueprintRepositoryID + commit.XCSCommitHash] = commit;
            }
        }

        for (var commitHash in commitsDict) {
            if (commitsDict[commitHash] !== undefined) {
                finalCommits.push(commitsDict[commitHash]);
            }
        }
        issue.commits = finalCommits;
    }
};

XCSIntegrationIssueAuthorClass.prototype.sortIssueAuthorSuspectByReliability = function sortIssueAuthorSuspectByReliability(a, b) {
    return a.issueSuspectStrategy.reliability - b.issueSuspectStrategy.reliability;
};

XCSIntegrationIssueAuthorClass.prototype.getBestTimeComponentFromIntegration = function getBestTimeComponentFromIntegration(integration) {
    if (integration.endedTime) {
        return new Date(integration.endedTime);
    } else if (integration.startedTime) {
        return new Date(integration.startedTime);
    }
};

module.exports = xcsutil.bindAll(new XCSIntegrationIssueAuthorClass());