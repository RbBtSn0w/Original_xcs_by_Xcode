/*
    XCSNotificationClass
    A class dedicated to interact with CouchDB and Redis.
*/

'use strict';

var integrationSearchClass = require('./integrationSearchClass.js'),
    botClass = require('./botClass.js'),
    issueClass = require('./issueClass.js'),
    settings = require('./settingsClass.js'),
    version = require('./versionClass.js'),
    platform = require('./platformClass.js'),
    os = require('os'),
    _ = require('underscore'),
    async = require('async'),
    nodemailer = require('nodemailer'),
    sendmailTransport = require('nodemailer-sendmail-transport'),
    templates = require('../templates/notifications.js'),
    newIssueTemplate = require('../templates/newIssueNotifications.js'),
    reportTemplate = require('../templates/reportNotifications.js'),
    k = require('../constants.js'),
    xcsutil = require('../util/xcsutil.js'),
    logger = require('../util/logger.js'),
    scheduler = require('../util/scheduler.js'),
    notification_helper = require('../templates/notification_helper.js'),
    issueTypes = ['freshIssues', 'resolvedIssues'];

/* XCSNotificationClass object */

function XCSNotificationClass() {}

XCSNotificationClass.prototype.sendNotifications = function sendNotifications(req, res) {
    let log = logger.withRequest(req),
        functionTitle = '[Bot - Notification] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    log.info('Creating Bot New Issue Email using query', req.query, 'and parameters:', req.params);

    let integrationId = (req && req.params && req.params.id) || null;
    let trigger = (req && req.body && req.body.trigger) || null;

    if (!integrationId || !trigger) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'filter(s) not supported'
        });
    }

    if (trigger.phase === k.XCSTriggerPhaseAfterIntegration && trigger.emailConfiguration && trigger.emailConfiguration.type !== undefined) {
        if (trigger.emailConfiguration.type === k.XCSTriggerNewIssueFoundEmail) {
            this.sendNewIssueEmail(req, integrationId, trigger, function (err, results) {
                xcsutil.profilerSummary(req);
                if (err) {
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    return xcsutil.standardizedResponse(res, 200, results);
                }
            });
        } else if (trigger.emailConfiguration.type === k.XCSTriggerIntegrationReport) {
            this.sendIntegrationReport_internal(req, integrationId, trigger, function (err, results) {
                xcsutil.profilerSummary(req);
                if (err) {
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    return xcsutil.standardizedResponse(res, 200, results);
                }
            });
        } else {
            return xcsutil.standardizedErrorResponse(res, {
                status: 400,
                message: 'no trigger found'
            });
        }
    } else {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'no trigger found'
        });
    }
};

XCSNotificationClass.prototype.sendNewIssueEmail = function sendNewIssueEmail_internal(req, integrationId, trigger, cb, opts) {
    async.parallel({
        integration: cb => {
            integrationSearchClass.findIntegrationWithUUID(req, integrationId, false, cb);
        },
        commits: cb => {
            integrationSearchClass.findCommitsForIntegration(req, integrationId, (err, commits) => {
                // 404's for commits are acceptable and shouldn't mess things up
                if (err && err.status !== 404) {
                    return xcsutil.safeCallback(cb, err, commits);
                } else {
                    return xcsutil.safeCallback(cb, null, commits);
                }
            });
        },
        issues: cb => {
            issueClass.formattedIssuesForIntegration(req, integrationId, true, cb);
        },
        platforms: cb => {
            platform.listPlatforms(req, cb);
        },
        settings: cb => {
            settings.findOrCreateSettingsDocument(null, (err, settings) => {
                return xcsutil.safeCallback(cb, null, settings);
            });
        },
        versions: cb => {
            version.findOrCreateVersionDocument(null, (err, versions) => {
                return xcsutil.safeCallback(cb, null, versions);
            });
        },
        appleInternal: cb => {
            xcsutil.checkForAppleInternalDirectory((err) => {
                if (err) {
                    return cb(null, false);
                } else {
                    return cb(null, true);
                }
            });
        }
    }, (err, results) => {
        if (err) {
            return cb({
                status: 500,
                message: 'Internal Server Error (xcsd): ' + JSON.stringify(err)
            });
        } else {
            results.commits = results.commits && results.commits[0];
            results.trigger = trigger;
            results.bot = results.integration.bot;

            if (req && req.res && req.res._headers && req.res._headers[k.XCSServerAPIVersionHeader]) {
                results.versions.XCSApi = req.res._headers[k.XCSServerAPIVersionHeader];
            }

            this.prepareResultForNewIssueNotification(results);

            // Check for testing options
            if (opts !== undefined && opts !== null && opts.returnResults !== undefined && opts.returnResults !== null && opts.returnResults) {
                return cb(null, results);
            } else {
                if (results !== undefined && results !== null && Object.keys(results).length > 0 && Object.keys(results.issuesByAuthor).length > 0) {
                    // Prepare background jobs
                    require('./backgroundQueue.js').enqueue('bg', 'newIssuesEmails', [results]);
                    return cb(null, {
                        enqueued: true
                    });
                } else {
                    return cb(null, {
                        status: 200,
                        message: 'No new issues email enqueued'
                    });
                }
            }
        }
    });
};


XCSNotificationClass.prototype.sendBotReport = function sendBotReportEndpoint(req, res) {
    let log = logger.withRequest(req),
        functionTitle = '[Bot - Report] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    log.info('Creating Bot Report using query', req.query, 'and parameters:', req.params);

    let schedule = (req && req.body && req.body.schedule) || null;
    let botID = (req && req.params && req.params.id) || null;
    let recipients = (req && req.body && req.body.recipients) || null;
    let date = (req && req.body && req.body.date) || null;
    let rawContent = (req && req.body && req.body.rawContent) || null;

    if (!schedule || !botID || !recipients) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'filter(s) not supported'
        });
    }

    let opts = {};
    if (rawContent) {
        opts.returnResults = true;
    }

    this.sendBotReport_internal(req, botID, null, function (err, results) {
        xcsutil.profilerSummary(req);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, results);
        }
    }, schedule, recipients, date, opts);
};

XCSNotificationClass.prototype.sendBotReport_internal = function sendBotReport_internal(req, botID, trigger, cb, schedule, recipients, reqDate, opts) {

    let date = new Date();
    let sinceDate = new Date();

    if (trigger && trigger.emailConfiguration) {
        if (trigger.emailConfiguration.type === k.XCSTriggerDailyReport) {
            sinceDate = new Date(date.toISOString());
            sinceDate.setDate(sinceDate.getDate() - 1);
        } else if (trigger.emailConfiguration.type === k.XCSTriggerWeeklyReport) {
            sinceDate = new Date(date.toISOString());
            sinceDate.setDate(sinceDate.getDate() - 7);
        }
    } else if (schedule && recipients) {
        if (reqDate !== undefined && reqDate !== null) {
            date = new Date(reqDate);
            if (isNaN(date)) {
                date = new Date();
            }
        }

        if (schedule === "daily") {
            sinceDate = new Date(date.toISOString());
            sinceDate.setDate(sinceDate.getDate() - 1);
        } else if (schedule === "weekly") {
            sinceDate = new Date(date.toISOString());
            sinceDate.setDate(sinceDate.getDate() - 7);
        }
    }

    let options = {
        include_issues: true,
        include_commits: true
    };

    botClass.findBotWithUUID(null, botID, (err) => {
        if (err) {
            return cb({
                status: 404,
                message: 'Bot not found'
            });
        } else {
            async.parallel({
                bot: cb => {
                    botClass.findBotWithUUID(null, botID, (err, bot) => {
                        return xcsutil.safeCallback(cb, null, bot);
                    });
                },
                integrations: cb => {
                    integrationSearchClass.findIntegrationsForBotWithinDateRangeUsingOptions(null, botID, date.toISOString(), sinceDate.toISOString(), options, (err, integrations) => {
                        return xcsutil.safeCallback(cb, null, integrations);
                    });
                },
                platforms: cb => {
                    platform.listPlatforms(null, cb);
                },
                settings: cb => {
                    settings.findOrCreateSettingsDocument(null, (err, settings) => {
                        return xcsutil.safeCallback(cb, null, settings);
                    });
                },
                versions: cb => {
                    version.findOrCreateVersionDocument(null, (err, versions) => {
                        return xcsutil.safeCallback(cb, null, versions);
                    });
                },
                appleInternal: cb => {
                    xcsutil.checkForAppleInternalDirectory((err) => {
                        if (err) {
                            return cb(null, false);
                        } else {
                            return cb(null, true);
                        }
                    });
                }
            }, (err, results) => {
                if (err) {
                    return cb({
                        status: 400,
                        message: ''
                    });
                } else {
                    if (trigger) {
                        results.trigger = trigger;
                    }
                    results.sinceDate = sinceDate.toISOString();
                    results.toDate = date.toISOString();

                    if (trigger && trigger.emailConfiguration) {
                        if (trigger.emailConfiguration.type === k.XCSTriggerDailyReport) {
                            results.schedule = "daily";
                        } else if (trigger.emailConfiguration.type === k.XCSTriggerWeeklyReport) {
                            results.schedule = "weekly";
                        } else if (trigger.emailConfiguration.type === k.XCSTriggerNewIssueFoundEmail) {
                            results.schedule = "integration";
                        }
                    } else if (schedule !== undefined) {
                        results.schedule = schedule;
                    }

                    if (recipients !== undefined && recipients !== null) {
                        results.recipients = recipients;
                    }

                    this.prepareResultForReportNotification(results);

                    if (req && req.res && req.res._headers && req.res._headers[k.XCSServerAPIVersionHeader]) {
                        results.versions.XCSApi = req.res._headers[k.XCSServerAPIVersionHeader];
                    }

                    // Check for testing options
                    if (opts !== undefined && opts !== null && opts.returnResults !== undefined && opts.returnResults !== null && opts.returnResults) {
                        return cb(null, results);
                    } else {
                        if (results.recipients && results.recipients.length > 0 && results.integrationsCount > 0) {
                            require('./backgroundQueue.js').enqueue('bg', 'reportEmail', [results]);
                            return cb(null, {
                                enqueued: true
                            });
                        } else {
                            return cb(null, {
                                status: 200,
                                message: 'No Report email enqueued'
                            });
                        }
                    }
                }
            });
        }
    });
};



XCSNotificationClass.prototype.sendIntegrationReport = function sendIntegrationReport(req, res) {
    let log = logger.withRequest(req),
        functionTitle = '[Integration - Report] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    log.info('Creating Integration Report using query', req.query, 'and parameters:', req.params);

    let integrationID = req.params.id;
    let recipients = (req && req.body && req.body.recipients) || null;
    let rawContent = (req && req.body && req.body.rawContent) || null;

    if (!integrationID || !recipients) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'filter(s) not supported'
        });
    }

    let opts = {};
    if (rawContent) {
        opts.returnResults = true;
    }

    this.sendIntegrationReport_internal(req, integrationID, null, function (err, results) {
        xcsutil.profilerSummary(req);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, results);
        }
    }, recipients, opts);
};

XCSNotificationClass.prototype.sendIntegrationReport_internal = function sendIntegrationReport_internal(req, integrationID, trigger, cb, recipients, opts) {
    async.parallel({
        integration: cb => {
            integrationSearchClass.findIntegrationWithUUID(req, integrationID, false, (err, integrations) => {
                return xcsutil.safeCallback(cb, null, integrations);
            });
        },
        commits: cb => {
            integrationSearchClass.findCommitsForIntegration(req, integrationID, (err, commits) => {
                // 404's for commits are acceptable and shouldn't mess things up
                if (err && err.status !== 404) {
                    return xcsutil.safeCallback(cb, err, commits);
                } else {
                    return xcsutil.safeCallback(cb, null, commits);
                }
            });
        },
        issues: cb => {
            issueClass.findIssuesForIntegrationWithEstimateResolved(req, integrationID, true, cb);
        },
        platforms: cb => {
            platform.listPlatforms(null, cb);
        },
        settings: cb => {
            settings.findOrCreateSettingsDocument(req, (err, settings) => {
                return xcsutil.safeCallback(cb, null, settings);
            });
        },
        versions: cb => {
            version.findOrCreateVersionDocument(req, (err, versions) => {
                return xcsutil.safeCallback(cb, null, versions);
            });
        },
        appleInternal: cb => {
            xcsutil.checkForAppleInternalDirectory((err) => {
                if (err) {
                    return cb(null, false);
                } else {
                    return cb(null, true);
                }
            });
        }
    }, (err, results) => {
        if (err) {
            logger.error('Failed to send report email', err);
            return cb(err);
        } else {
            results.schedule = "integration";
            let integration = results.integration;

            if (!results.integration) {
                return cb({
                    status: 400,
                    message: 'integration not found'
                });
            }

            integration.commits = results.commits;
            integration.issues = results.issues;
            results.integrations = [integration];
            results.bot = integration.bot;
            results.isAllClear = isAllClear(results);
            delete results.integration;
            delete results.commits;
            delete results.issues;

            if (trigger) {
                results.trigger = trigger;
            }

            if (recipients !== undefined && recipients !== null) {
                results.recipients = recipients;
            }

            if (req && req.res && req.res._headers && req.res._headers[k.XCSServerAPIVersionHeader]) {
                results.versions.XCSApi = req.res._headers[k.XCSServerAPIVersionHeader];
            }

            this.prepareResultForReportNotification(results);

            if (opts !== undefined && opts !== null && opts.returnResults !== undefined && opts.returnResults !== null && opts.returnResults) {
                return cb(null, results);
            } else {
                if (results.recipients && results.recipients.length > 0) {
                    require('./backgroundQueue.js').enqueue('bg', 'reportEmail', [results]);
                    return cb(null, {
                        enqueued: true
                    });
                } else {
                    return cb(null, {
                        status: 200,
                        message: 'No Integration Report email enqueued'
                    });
                }
            }
        }
    });
};


// Actually sends the emails

XCSNotificationClass.prototype.integrationEmail = function (info, cb) {
    let subject = templates.subject(info);
    let text = templates.text(info);
    let html = templates.html(info);
    let from = "";
    let ccAddresses = [];
    let replyToAddress = "";

    this.sendEmail(from, ccAddresses, replyToAddress, subject, text, html, info, cb);
};

XCSNotificationClass.prototype.newIssuesEmails = function (info, callback, opts) {
    let emails = [];

    if (Object.keys(info.issuesByAuthor).length > 0) {
        async.each(info.issuesByAuthor, (issueAutor, cb) => {
            if (issueAutor !== undefined && issueAutor !== null) {
                let recipient = (issueAutor && issueAutor.contributor && issueAutor.contributor.XCSContributorEmails && issueAutor.contributor.XCSContributorEmails.length && issueAutor.contributor.XCSContributorEmails[0]);
                let data = {
                    issueAuthor: issueAutor,
                    integration: info.integration,
                    hostname: xcsutil.machineHostname(),
                    platforms: info.platforms,
                    platformsString: info.platformsString,
                    settings: info.settings,
                    versions: info.versions,
                    trigger: info.trigger,
                    commitsByHash: info.commitsByHash,
                    title: this.getNewIssueEmailSubject(issueAutor, info.integration)
                };

                if (info.appleInternal) {
                    data.appleInternal = info.appleInternal;
                }

                let from = "";
                let fromAddress = "";
                if (data.trigger && data.trigger.emailConfiguration && data.trigger.emailConfiguration.fromAddress) {
                    fromAddress = data.trigger.emailConfiguration.fromAddress;
                } else {
                    fromAddress = 'noreply@' + os.hostname();
                }

                if (data.integration && data.integration.bot && data.integration.bot.name) {
                    from = getEmailAddressWithName(data.integration.bot.name, fromAddress);
                }

                // CC
                let ccAddresses = [];
                if (data.trigger && data.trigger.emailConfiguration && info.trigger.emailConfiguration.ccAddresses) {
                    ccAddresses = data.trigger.emailConfiguration.ccAddresses;
                }

                // Reply-to
                let replyToAddress = "";
                if (data.trigger && data.trigger.emailConfiguration && info.trigger.emailConfiguration.replyToAddress) {
                    replyToAddress = data.trigger.emailConfiguration.replyToAddress;
                }

                let subject = this.getNewIssueEmailSubject(issueAutor, info.integration);
                let text = this.getNewIssueEmailText(data);
                let html = newIssueTemplate.html(data);

                emails.push(this.sendEmail(from, ccAddresses, replyToAddress, recipient, subject, text, html, data, cb, opts));
            }
        }, callback);
    }

    return emails;
};

XCSNotificationClass.prototype.reportEmail = function reportEmail(info, callback, opts) {
    let emails = [];

    if (info && info.recipients) {
        let data = {
            schedule: info.schedule,
            integrationResults: info.integrationResults,
            testsDelta: info.testsDelta,
            testsFailureDelta: info.testsFailureDelta,
            maximumNumberOfTests: info.maximumNumberOfTests,
            perfTestsRegressionDelta: info.perfTestsRegressionDelta,
            commitsCount: info.commitsCount,
            codeCoveragePercentageDelta: info.codeCoveragePercentageDelta,
            commitsByRepositoryArray: info.commitsByRepositoryArray,
            issuesDict: info.issuesDict,
            newOpenIssues: info.newOpenIssues,
            newResolvedIssues: info.newResolvedIssues,
            oldOpenIssues: info.oldOpenIssues,
            oldResolvedIssues: info.oldResolvedIssues,
            sinceDate: info.sinceDate,
            successStreak: info.successStreak,
            trigger: info.trigger,
            settings: info.settings,
            platforms: info.platforms,
            platformsString: info.platformsString,
            versions: info.versions,
            recipients: info.recipients,
            toDate: info.toDate,
            title: this.getReportEmailSubject(info),
            hostname: info.hostname,
            commitsByHash: info.commitsByHash,
            integration: info.integration,
            integrationsCount: info.integrationsCount,
            committersCount: info.committersCount,
            issuesCount: info.issuesCount,
            listOfCommitters: info.listOfCommitters,
            listOfIssuesSummary: info.listOfIssuesSummary,
            lastIntegration: info.lastIntegration,
            configurationChanges: info.configurationChanges,
            isAllClear: info.isAllClear
        };

        if (info.bot) {
            data.bot = info.bot;
        }
        if (info.appleInternal) {
            data.appleInternal = info.appleInternal;
        }

        let subject = data.title;
        let text = this.getReportEmailText(data);
        let html = reportTemplate.html(data);

        // From
        let fromAddress = "";
        if (data.trigger && data.trigger.emailConfiguration && info.trigger.emailConfiguration.fromAddress) {
            fromAddress = data.trigger.emailConfiguration.fromAddress;
        } else {
            fromAddress = 'noreply@' + os.hostname();
        }
        let from = getEmailAddressWithName(data.bot.name, fromAddress);

        // CC
        let ccAddresses = [];
        if (data.trigger && data.trigger.emailConfiguration && info.trigger.emailConfiguration.ccAddresses) {
            ccAddresses = data.trigger.emailConfiguration.ccAddresses;
        }

        // Reply-to
        let replyToAddress = "";
        if (data.trigger && data.trigger.emailConfiguration && info.trigger.emailConfiguration.replyToAddress) {
            replyToAddress = data.trigger.emailConfiguration.replyToAddress;
        }

        async.each(data.recipients, (recipient, cb) => {
            emails.push(this.sendEmail(from, ccAddresses, replyToAddress, recipient, subject, text, html, data, cb, opts));
        }, callback);
    }
    
    return emails;
};

XCSNotificationClass.prototype.sendEmail = function sendEmail(from, ccAddresses, replyToAddress, recipient, subject, text, html, info, cb, opts) {
    let transport;
    let settings = (info && info.settings);

    if ('smtp' === settings.mail_transport.toLowerCase()) {
        transport = nodemailer.createTransport(settings.mail_transport_options);
    } else {
        transport = nodemailer.createTransport(sendmailTransport(settings.mail_transport_options));
    }

    let replyToOptions = settings.mail_reply_to_options || {};
    let fromOptions = settings.mail_from_options || {};
    let replyToName = "";
    let fullFrom = "";
    let fullCC = "";
    let fullReplyTo = "";
    let hasReplyTo = false;

    // From
    if (from !== undefined && from !== "") {
        fullFrom = from;
    } else {
        let fromName = fromOptions.name || 'Xcode Server';
        let fromAddress = fromOptions.address || 'noreply@' + os.hostname();
        fullFrom = getEmailAddressWithName(fromName, fromAddress);
        logger.debug('Email From set to', fullFrom);
    }

    // CC
    if (ccAddresses !== undefined && ccAddresses.length > 0) {
        fullCC = notification_helper.commaSeperatedArrayToString(ccAddresses);
        logger.debug('Email CC set to', fullCC);
    }

    // Reply-to
    if (replyToAddress !== undefined && replyToAddress !== "") {
        fullReplyTo = replyToAddress;
        hasReplyTo = true;
        logger.debug('Email Reply-to set to', fullReplyTo);
    } else {
        replyToName = replyToOptions.name || '';
        replyToAddress = replyToOptions.address || '';

        if (replyToName !== '' && replyToAddress === '') {
            hasReplyTo = true;
            replyToAddress = 'noreply@' + os.hostname();
        } else if (replyToName === '' && replyToAddress !== '') {
            hasReplyTo = true;
            if (replyToName === '') {
                replyToName = 'Xcode Server';
            }
        }

        if (hasReplyTo) {
            fullReplyTo = getEmailAddressWithName(replyToName, replyToAddress);
            logger.debug('Email Reply-to set to', fullReplyTo);
        }
    }

    logger.info('Sending new issue notification email to', recipient);

    let messageParams = {
        from: fullFrom,
        to: recipient,
        subject: subject,
        text: text,
        html: html
    };

    if (fullCC !== '') {
        messageParams.cc = fullCC;
    }

    if (hasReplyTo) {
        messageParams.replyTo = fullReplyTo;
    }

    if (opts === undefined) {
        transport.sendMail(messageParams, cb);
    } else {
        cb();
        if (opts.returnHtml) {
            // The callback will not be called
            return messageParams;
        }
    }
};

XCSNotificationClass.prototype.prepareResultForNewIssueNotification = function prepareResultForNewIssueNotification(results) {
    if (results !== undefined && results !== null && results.issues && results.issues.errors && results.issues.testFailures && results.issues.warnings && results.issues.analyzerWarnings) {
        let issues = results.issues;
        let integration = results.integration;
        let trigger = results.trigger;
        let revisionBlueprint = integration.revisionBlueprint;
        let types = ['error', 'testFailure', 'warning', 'analyzerWarning'];
        let allFreshIssues = _.flatten(types.map(function (type) {
            return issues[type + 's'].freshIssues;
        }));
        let allResolvedIssues = _.flatten(types.map(function (type) {
            return issues[type + 's'].resolvedIssues;
        }));
        let commitsByHash = {};
        let issuesByAuthor = {};

        // We organise the issue commits in a dictionary where they can easily be found
        this.createCommitsByHashDict(allFreshIssues, integration, commitsByHash);

        // For all the fresh issues
        for (let i = 0; i < allFreshIssues.length; i++) {
            let issue = allFreshIssues[i];
            let issueAuthors = issue.issueAuthors;

            // if this issue has been found during an upgrade integration
            // we do not blame the committers
            if (issue.cause) {
                continue;
            }
            if (issueAuthors) {
                organizeIssuesByAuthors(issuesByAuthor, issueAuthors, commitsByHash, issue, revisionBlueprint, "freshIssues");
            }
        }
        
        if (trigger && trigger.emailConfiguration.includeResolvedIssues) {
            this.createCommitsByHashDict(allResolvedIssues, integration, commitsByHash);

            // For all the resolved issues
            for (let i = 0; i < allResolvedIssues.length; i++) {
                let issue = allResolvedIssues[i];
                let issueAuthors = issue.issueAuthors;
                if (issueAuthors) {
                    organizeIssuesByAuthors(issuesByAuthor, issueAuthors, commitsByHash, issue, revisionBlueprint, "resolvedIssues");
                }
            }
        }

        // Filter out excluded repositories and excluded domain names
        let emailConfiguration = results.trigger && results.trigger.emailConfiguration;
        // First, we exclude recipients with non allowed domain names
        if (emailConfiguration.allowedDomainNames.length > 0) {
            for (let issueAuthorHash1 in issuesByAuthor) {
                if (issueAuthorHash1 && issuesByAuthor[issueAuthorHash1] !== undefined) {
                    let issueAuthor1 = issuesByAuthor[issueAuthorHash1];
                    let contributor1 = issueAuthor1.contributor;
                    let contributorEmail1 = contributor1.XCSContributorEmails && contributor1.XCSContributorEmails.length && contributor1.XCSContributorEmails[0];

                    if (!isEmailAddressAllowed(contributorEmail1, emailConfiguration.allowedDomainNames)) {
                        delete issuesByAuthor[issueAuthorHash1];
                    }
                }
            }
        }
        // Then we exclude issues which have been introduced on excluded repositories
        for (let issueAuthorHash2 in issuesByAuthor) {
            if (issueAuthorHash2 && issuesByAuthor[issueAuthorHash2] !== undefined) {
                let issueAuthor2 = issuesByAuthor[issueAuthorHash2];
                let noIssues = true;

                for (let z = 0; z < issueTypes.length; z++) {
                    let issuesType = issueTypes[z];
                    if (issueAuthor2[issuesType] !== null && issueAuthor2[issuesType] !== undefined) {
                        let issues2 = issueAuthor2[issuesType].issues;

                        for (let issuesId2 in issues2) {
                            if (issuesId2 && issues2[issuesId2] !== undefined) {
                                let shouldDeleteIssue = false;
                                let issue2 = issues2[issuesId2].issue;
                                let authorStrategies2 = issues2[issuesId2].authorStrategy;

                                // Exclude issue if found in exluded repository
                                for (let i2 = 0; i2 < authorStrategies2.length; i2++) {
                                    let authorStrategy2 = authorStrategies2[i2];
                                    let commit2 = authorStrategy2.commit;

                                    if (!isBlueprintIdAllowed(commit2.XCSBlueprintRepositoryID, emailConfiguration.scmOptions)) {
                                        shouldDeleteIssue = true;
                                        break;
                                    }
                                }

                                // Exclude issues which are not matching the trigger conditions
                                if (!shouldDeleteIssue) {
                                    shouldDeleteIssue = !this.isIssueAllowedByTriggerConditions(issue2, results.trigger);
                                }

                                if (shouldDeleteIssue) {
                                    delete issues2[issuesId2];
                                }
                            }
                        }

                        if (Object.keys(issues2).length > 0) {
                            noIssues = false;
                        }
                    }
                }
                if (noIssues) {
                    delete issuesByAuthor[issueAuthorHash2];
                }
            }
        }

        // For each of the people who have introduced issues
        for (let mappedIssueAuthorHash in issuesByAuthor) {
            if (issuesByAuthor[mappedIssueAuthorHash] !== undefined) {
                let mappedIssueAuthor = issuesByAuthor[mappedIssueAuthorHash];

                for (let z = 0; z < issueTypes.length; z++) {
                    let issuesType = issueTypes[z];
                    if (mappedIssueAuthor[issuesType] !== null && mappedIssueAuthor[issuesType] !== undefined) {
                        let mappedIssues = mappedIssueAuthor[issuesType].issues;
                        let highConfidenceIssues = [];
                        let lowConfidenceIssues = [];
                        let commitsByRepositoryBranch = {};
                        let commitsByRepositoryArray = [];
                        let commitsCountDict = {};

                        for (let mappedIssueId in mappedIssues) {
                            if (mappedIssues[mappedIssueId] !== undefined) {
                                let mappedIssueContainer = mappedIssues[mappedIssueId];
                                let highStrategyFound = false;
                                let lowStrategyFound = false;

                                mappedIssueContainer.authorStrategy.sort(this.sortAuthorStrategies);

                                for (let p = 0; p < mappedIssueContainer.authorStrategy.length; p++) {
                                    let authorStrategy = mappedIssueContainer.authorStrategy[p];

                                    // Create arrays of issue Ids for with high / low confidence strategies
                                    if (highStrategyFound) {
                                        break;
                                    }

                                    if (authorStrategy.confidence === k.XCSIssueIdentificationStrategyHighConfidence) {
                                        highConfidenceIssues.push(mappedIssueId);
                                        highStrategyFound = true;
                                    } else if (authorStrategy.confidence === k.XCSIssueIdentificationStrategyLowConfidence) {
                                        if (!lowStrategyFound) {
                                            lowConfidenceIssues.push(mappedIssueId);
                                            lowStrategyFound = true;
                                        }
                                    }

                                    // Create list of commits per repository, per branch
                                    if (commitsByRepositoryBranch[authorStrategy.repositoryURL + authorStrategy.branchName] === undefined) {
                                        commitsByRepositoryBranch[authorStrategy.repositoryURL + authorStrategy.branchName] = {
                                            repository: authorStrategy.repositoryURL,
                                            branch: authorStrategy.branchName,
                                            commits: {}
                                        };
                                    }

                                    if (commitsByRepositoryBranch[authorStrategy.repositoryURL + authorStrategy.branchName].commits[authorStrategy.commit.XCSCommitHash] === undefined) {
                                        commitsByRepositoryBranch[authorStrategy.repositoryURL + authorStrategy.branchName].commits[authorStrategy.commit.XCSCommitHash] = {
                                            commit: authorStrategy.commit,
                                            issueTypes: {
                                                warning: {},
                                                analyzerWarning: {},
                                                error: {},
                                                testFailure: {}
                                            }
                                        };
                                    }
                                    commitsByRepositoryBranch[authorStrategy.repositoryURL + authorStrategy.branchName].commits[authorStrategy.commit.XCSCommitHash].issueTypes[mappedIssueContainer.issue.type][mappedIssueContainer.issue._id] = true;
                                    if (authorStrategy.commit) {
                                        commitsCountDict[authorStrategy.commit.XCSCommitHash] = true;
                                    }
                                }
                            }
                        }

                        mappedIssueAuthor[issuesType].issueIdsWithHighStrategy = highConfidenceIssues;
                        mappedIssueAuthor[issuesType].issueIdsWithLowStrategy = lowConfidenceIssues;
                        mappedIssueAuthor[issuesType].issuesCount = highConfidenceIssues.length + lowConfidenceIssues.length;
                        mappedIssueAuthor[issuesType].commitsCount = Object.keys(commitsCountDict).length;

                        // Organize commits into array
                        commitsByRepositoryArray = this.createCommitsArrayWithIssuesReferences(commitsByRepositoryBranch);
                        mappedIssueAuthor[issuesType].numberOfIssuesByCommit = commitsByRepositoryArray;
                    }
                }
            }
        }

        results.issuesByAuthor = issuesByAuthor;
        results.commitsByHash = commitsByHash;
        results.hostname = xcsutil.machineHostname();

        if (results.platforms) {
            results.platformsString = getPlatformString(results.platforms);
        }

        // remove objects we don't need anymore
        delete results.commits;
        delete results.issues;
    } else if (results !== undefined && results !== null) {
        results.issuesByAuthor = {};
    }

    if (results && results.appleInternal !== undefined) {
        if (!results.appleInternal) {
            delete results.appleInternal;
        }
    }
};

function organizeIssuesByAuthors(issuesByAuthor, issueAuthors, commitsByHash, issue, revisionBlueprint, issuesType) {
    // For all the issueAuthors
    for (let j = 0; j < issueAuthors.length; j++) {
        let issueAuthor = issueAuthors[j];

        // We grab the full commit data from the issue commits array
        let hydratedCommit = (commitsByHash[issueAuthor.XCSCommitHash] || null);

        if (hydratedCommit !== undefined && hydratedCommit !== null) {
            // Find author information from the commit data
            let authorHash = getContributorHash(hydratedCommit);

            // Create a issueAuthor record, ready to receive all the issues
            // introduced by this author
            if (issuesByAuthor[authorHash] === undefined) {
                issuesByAuthor[authorHash] = {
                    contributor: hydratedCommit.XCSCommitContributor,
                };
            }
            if (issuesByAuthor[authorHash][issuesType] === undefined){
                issuesByAuthor[authorHash][issuesType] = {};
                issuesByAuthor[authorHash][issuesType].issues = {};
            }

            if (issuesByAuthor[authorHash][issuesType].issues[issue._id] === undefined) {
                issuesByAuthor[authorHash][issuesType].issues[issue._id] = {
                    issue: issue,
                    authorStrategy: []
                };
            }

            issueAuthor.XCSIssueSuspectstrategy.commit = hydratedCommit;
            issueAuthor.XCSIssueSuspectstrategy.projectName = "";
            issueAuthor.XCSIssueSuspectstrategy.repositoryURL = "";
            issueAuthor.XCSIssueSuspectstrategy.branchName = "";

            // From the Blueprint in the Integration
            if (revisionBlueprint !== undefined && revisionBlueprint !== null) {
                // Capture the project name
                issueAuthor.XCSIssueSuspectstrategy.projectName = revisionBlueprint.DVTSourceControlWorkspaceBlueprintRelativePathToProjectKey;

                // Capture the repository URL
                for (let w = 0; w < revisionBlueprint.DVTSourceControlWorkspaceBlueprintRemoteRepositoriesKey.length; w++) {
                    let remoteRepository = revisionBlueprint.DVTSourceControlWorkspaceBlueprintRemoteRepositoriesKey[w];
                    if (remoteRepository.DVTSourceControlWorkspaceBlueprintRemoteRepositoryIdentifierKey === issueAuthor.XCSBlueprintRepositoryID) {
                        issueAuthor.XCSIssueSuspectstrategy.repositoryURL = remoteRepository.DVTSourceControlWorkspaceBlueprintRemoteRepositoryURLKey;
                        break;
                    }
                }

                // Capture the repository branch name
                for (let repositoryId in revisionBlueprint.DVTSourceControlWorkspaceBlueprintLocationsKey) {
                    if (repositoryId === issueAuthor.XCSBlueprintRepositoryID) {
                        issueAuthor.XCSIssueSuspectstrategy.branchName = revisionBlueprint.DVTSourceControlWorkspaceBlueprintLocationsKey[repositoryId].DVTSourceControlBranchIdentifierKey;
                        break;
                    }
                }
            }

            issuesByAuthor[authorHash][issuesType].issues[issue._id].authorStrategy.push(issueAuthor.XCSIssueSuspectstrategy);
        }
    }
}

XCSNotificationClass.prototype.prepareResultForReportNotification = function prepareResultForReportNotification(results) {
    let issuesDict = {};
    let oldOpenIssues = [];
    let newOpenIssues = [];
    let oldResolvedIssues = [];
    let newResolvedIssues = [];
    let integrationResults = {
        succeeded: 0,
        failed: 0
    };
    let testsDelta = 0;
    let testsFailureDelta = 0;
    let perfTestsRegressionDelta = 0;
    let codeCoveragePercentageDelta = 0;
    let maximumNumberOfTests = {
        count: 0,
        integrationNumber: 0
    };
    let commitsCount = 0;
    let successStreak = {
        streakCount: 0,
        integrationNumber: 0
    };
    let lowestIntegrationNumber = 0;
    let commitsByRepositoryBranch = {};
    let commitsByRepositoryArray = [];
    let commitsByHash = {};
    let integrationsCount = 0;
    let lastIntegration = null;
    let integrationCommitsShas = [];

    if (results !== undefined && results !== null && results.integrations) {
        let integrations = results.integrations;
        //let recipients = [];
        let sendEmailToCommitters = false;

        integrationsCount = integrations.length;

        // Star creation of list of recipients
        if (results.recipients === undefined && results.trigger && results.trigger.emailConfiguration) {
            let emailConfiguration = results.trigger.emailConfiguration;
            results.recipients = emailConfiguration.additionalRecipients;
        } else if (results.recipients === undefined) {
            results.recipients = [];
        }

        if (results.trigger && results.trigger.emailConfiguration) {
            sendEmailToCommitters = results.trigger.emailConfiguration.emailCommitters;
        }

        results.configurationChanges = this.coalescedConfigurationChanges(integrations);

        // For each integrations
        for (let i = 0; i < integrations.length; i++) {
            let integration = integrations[i];
            let issues = (integration && integration.issues);
            let commits = (integration && integration.commits);

            // Capture oldest integration number
            if (lowestIntegrationNumber === 0 || (lowestIntegrationNumber > integration.number)) {
                lowestIntegrationNumber = integration.number;
            }

            // If we have issues
            if (issues) {
                // Create dictionary of issues, and make sure we save the most recent version
                for (let j = 0; j < issues.length; j++) {
                    let issue = issues[j];
                    this.updateIssueDictToTheMostRecent(issuesDict, issue, integration);
                }
            }

            // We organise the issue commits in a dictionary where they can easily be found
            // Only commits from issues, which are not representative of the commits included in the integration
            this.createCommitsByHashDict(issues, integration, commitsByHash);

            if (commits) {
                for (let m = 0; m < commits.length; m++) {
                    let commit = commits[m];
                    let innerCommits = commit.commits;

                    for (let repoID in innerCommits) {
                        if (innerCommits[repoID] !== undefined) {
                            let commitsArray = innerCommits[repoID];

                            for (let p = 0; p < commitsArray.length; p++) {
                                let xcsCommit = commitsArray[p];
                                commitsCount += 1;

                                // Also add integration commits to dictionary
                                // These are actual integration commits
                                commitsByHash[xcsCommit.XCSCommitHash] = xcsCommit;
                                integrationCommitsShas.push(xcsCommit.XCSCommitHash);

                                // Save and filter committers recipients
                                if (sendEmailToCommitters) {
                                    if (isBlueprintIdAllowed(xcsCommit.XCSBlueprintRepositoryID, results.trigger.emailConfiguration.scmOptions)) {
                                        let email = getContributorEmail(xcsCommit);
                                        if (email !== "" && results.recipients.indexOf(email) === -1) {
                                            results.recipients.push(email);
                                        }
                                    }
                                }

                                // Capture commit repository info
                                this.processCommitRepository(xcsCommit, integration);

                                // Create list of commits per repository, per branch
                                if (commitsByRepositoryBranch[xcsCommit.repository + xcsCommit.branch] === undefined) {
                                    commitsByRepositoryBranch[xcsCommit.repository + xcsCommit.branch] = {
                                        repository: xcsCommit.repository,
                                        branch: xcsCommit.branch,
                                        commits: {}
                                    };
                                }

                                if (commitsByRepositoryBranch[xcsCommit.repository + xcsCommit.branch].commits[xcsCommit.XCSCommitHash] === undefined) {
                                    commitsByRepositoryBranch[xcsCommit.repository + xcsCommit.branch].commits[xcsCommit.XCSCommitHash] = {
                                        commit: xcsCommit,
                                        issueTypes: {
                                            warning: {},
                                            analyzerWarning: {},
                                            error: {},
                                            testFailure: {}
                                        }
                                    };
                                }
                            }
                        }
                    }
                }
            }

            // Save integrations global status
            if (integration.result === k.XCSIntegrationResultSucceeded) {
                integrationResults.succeeded += 1;
            } else {
                integrationResults.failed += 1;
            }

            // Save longest success streak
            if (integration.success_streak > successStreak.streakCount) {
                successStreak.streakCount = integration.success_streak;
                successStreak.integrationNumber = integration.number;
            }

            // Save test counts
            if (integration.buildResultSummary && integration.buildResultSummary.testsChange) {
                testsDelta += integration.buildResultSummary.testsChange;
            }

            // Save passing / failing tests delta count
            if (integration.buildResultSummary && integration.buildResultSummary.testFailureChange) {
                testsFailureDelta += integration.buildResultSummary.testFailureChange;
            }

            // Save performance tests regressions delta count
            if (integration.buildResultSummary && integration.buildResultSummary.regressedPerfTestCount) {
                perfTestsRegressionDelta += integration.buildResultSummary.regressedPerfTestCount;
            }

            // Save Code Coverage percentage Delta
            if (integration.buildResultSummary && integration.buildResultSummary.codeCoveragePercentageDelta) {
                codeCoveragePercentageDelta += integration.buildResultSummary.codeCoveragePercentageDelta;
            }

            // Save maximum number of tests
            if (integration.buildResultSummary && integration.buildResultSummary.testsCount > maximumNumberOfTests.count) {
                maximumNumberOfTests.count = integration.buildResultSummary.testsCount;
                maximumNumberOfTests.integrationNumber = integration.number;
            }

            if (integration && integration.buildResultSummary) {
                if (lastIntegration === null && results.schedule && results.schedule !== "integration") {
                    lastIntegration = integration;
                } else if (lastIntegration && lastIntegration.number < integration.number) {
                    lastIntegration = integration;
                }
            }
        }

        // Saving issues in categories
        // Saving issues related to commits
        for (let issueId in issuesDict) {
            if (issueId && issuesDict[issueId] !== undefined) {
                let issuesArray = issuesDict[issueId];

                for (let c = 0; c < issuesArray.length; c++) {
                    let issueDict = issuesArray[c];
                    let issue1 = issueDict.issue;
                    let integration1 = issueDict.integration;

                    // Save issues in expected categories
                    if (issue1.status === k.XCSIntegrationIssueStatusNew) {
                        newOpenIssues.push({
                            issueId: issueId,
                            index: c
                        });
                    } else if (issue1.status === k.XCSIntegrationIssueStatusUnresolved) {
                        if (issue1.age >= integrations.length) {
                            oldOpenIssues.push({
                                issueId: issueId,
                                index: c
                            });
                        } else {
                            newOpenIssues.push({
                                issueId: issueId,
                                index: c
                            });
                        }
                    } else if (issue1.status === k.XCSIntegrationIssueStatusResolved) {
                        if ((integration1.number - issue1.age) < lowestIntegrationNumber) {
                            oldResolvedIssues.push({
                                issueId: issueId,
                                index: c
                            });
                        } else {
                            newResolvedIssues.push({
                                issueId: issueId,
                                index: c
                            });
                        }
                    }

                    if (issue1.issueAuthors && issue1.issueAuthors.length > 0) {
                        for (let h = 0; h < issue1.issueAuthors.length; h++) {
                            let issueAuthor = issue1.issueAuthors[h];
                            this.processIssueAuthorRepository(issueAuthor, integration1);

                            if (commitsByRepositoryBranch[issueAuthor.repository + issueAuthor.branch] && commitsByRepositoryBranch[issueAuthor.repository + issueAuthor.branch].commits[issueAuthor.XCSCommitHash] && !issue1.cause) {
                                if (commitsByRepositoryBranch[issueAuthor.repository + issueAuthor.branch].commits[issueAuthor.XCSCommitHash].issueTypes[issue1.type] === undefined) {
                                    commitsByRepositoryBranch[issueAuthor.repository + issueAuthor.branch].commits[issueAuthor.XCSCommitHash].issueTypes[issue1.type] = {};
                                }
                                commitsByRepositoryBranch[issueAuthor.repository + issueAuthor.branch].commits[issueAuthor.XCSCommitHash].issueTypes[issue1.type][issue1._id] = true;
                            }
                        }
                    }
                }
            }
        }

        commitsByRepositoryArray = this.createCommitsArrayWithIssuesReferences(commitsByRepositoryBranch);
        this.removeIntegrationsFromIssueDict(issuesDict);

        // Order issues by type
        newOpenIssues = orderIssuesByType(newOpenIssues, issuesDict);
        oldOpenIssues = orderIssuesByType(oldOpenIssues, issuesDict);
        newResolvedIssues = orderIssuesByType(newResolvedIssues, issuesDict);
        oldResolvedIssues = orderIssuesByType(oldResolvedIssues, issuesDict);

        results.newOpenIssues = newOpenIssues;
        results.oldOpenIssues = oldOpenIssues;
        results.newResolvedIssues = newResolvedIssues;
        results.oldResolvedIssues = oldResolvedIssues;
        results.successStreak = successStreak;
        results.testsDelta = testsDelta;
        results.testsFailureDelta = testsFailureDelta;
        results.perfTestsRegressionDelta = perfTestsRegressionDelta;
        results.codeCoveragePercentageDelta = codeCoveragePercentageDelta;
        results.maximumNumberOfTests = maximumNumberOfTests;
        results.integrationResults = integrationResults;
        results.commitsByRepositoryArray = commitsByRepositoryArray;
        results.issuesDict = issuesDict;
        results.commitsCount = commitsCount;
        results.commitsByHash = commitsByHash;
        results.integrationsCount = integrationsCount;
        results.committersCount = this.numberOfCommitters(commitsByHash, integrationCommitsShas);
        results.listOfCommitters = this.listOfCommitters(commitsByHash, integrationCommitsShas);
        results.issuesCount = newOpenIssues.length + oldOpenIssues.length + newResolvedIssues.length + oldResolvedIssues.length;
        results.lastIntegration = lastIntegration;
        if (results.lastIntegration) {
            delete results.lastIntegration.commits;
            delete results.lastIntegration.issues;
        }

        if (results.platforms) {
            results.platformsString = getPlatformString(results.platforms);
        }

        if (results.schedule === "integration" && results.integrations.length > 0) {
            results.integration = results.integrations[0];
            delete results.integration.commits;
            delete results.integration.issues;
            results.listOfIssuesSummary = this.listOfIssuesSummary(results.integrations[0]);
        }

        // remove objects not needed anymore
        delete results.integrations;

        // Filter recipients by allowed domain names
        if (results.trigger && results.trigger.emailConfiguration) {
            let newListOfRecipients = [];
            for (let r = 0; r < results.recipients.length; r++) {
                let recipient = results.recipients[r];
                if (isEmailAddressAllowed(recipient, results.trigger.emailConfiguration.allowedDomainNames)) {
                    newListOfRecipients.push(recipient);
                }
            }
            results.recipients = newListOfRecipients;

            if (results.trigger.emailConfiguration.ccAddresses) {
                let newListOfCCRecipients = [];
                for (let t = 0; t < results.trigger.emailConfiguration.ccAddresses.length; t++) {
                    let ccRecipient = results.trigger.emailConfiguration.ccAddresses[t];
                    if (isEmailAddressAllowed(ccRecipient, results.trigger.emailConfiguration.allowedDomainNames)) {
                        newListOfCCRecipients.push(ccRecipient);
                    }
                }
                results.trigger.emailConfiguration.ccAddresses = newListOfCCRecipients;
            }
        }

        // Hostname
        results.hostname = xcsutil.machineHostname();
    }

    if (results && results.appleInternal !== undefined) {
        if (!results.appleInternal) {
            delete results.appleInternal;
        }
    }
};

// Helpers

XCSNotificationClass.prototype.getNewIssueEmailSubject = function getNewIssueEmailSubject(issueAuthor, integration) {
    if (issueAuthor !== undefined && issueAuthor !== null) {
        let emailSubject = "";
        let hasFreshIssues = false;
        let hasResolvedIssues = false;
        
        if (issueAuthor.freshIssues !== null && issueAuthor.freshIssues !== undefined) {
            if (issueAuthor.freshIssues.issueIdsWithHighStrategy.length > 0) {
                hasFreshIssues = true;
            }
            if (issueAuthor.freshIssues.issueIdsWithLowStrategy.length > 0) {
                hasFreshIssues = true;
            }
        }
        if (issueAuthor.resolvedIssues !== null && issueAuthor.resolvedIssues !== undefined) {
            if (issueAuthor.resolvedIssues.issueIdsWithHighStrategy.length > 0) {
                hasResolvedIssues = true;
            }
            if (issueAuthor.resolvedIssues.issueIdsWithLowStrategy.length > 0) {
                hasResolvedIssues = true;
            }
        }

        if (hasFreshIssues) {
            let freshIssues = issueAuthor.freshIssues;
            if (freshIssues.issueIdsWithHighStrategy.length > 0) {
                emailSubject += "You introduced " + notification_helper.pluralize(freshIssues.issueIdsWithHighStrategy.length, "issue");
            }

            if (freshIssues.issueIdsWithHighStrategy.length > 0 && freshIssues.issueIdsWithLowStrategy.length > 0) {
                emailSubject += " and ";
            }

            if (freshIssues.issueIdsWithLowStrategy.length > 0) {
                if (emailSubject === "") {
                    emailSubject += "You ";
                }

                emailSubject += "might be able to help solve " + notification_helper.pluralize(freshIssues.issueIdsWithLowStrategy.length, "issue");
            }
        }
        else if (hasResolvedIssues) {
            let totalResolvedIssuesCount = issueAuthor.resolvedIssues.issueIdsWithHighStrategy.length + issueAuthor.resolvedIssues.issueIdsWithLowStrategy.length;
            emailSubject += notification_helper.pluralize(totalResolvedIssuesCount, "issue")+(totalResolvedIssuesCount===1?" has":" have")+" been resolved";
        }
        emailSubject += " on " + integration.bot.name;
        return emailSubject;
    }
};

XCSNotificationClass.prototype.getReportEmailSubject = function getReportEmailSubject(info) {
    if (info) {
        let subject = "";
        let bot = info.bot;

        if (info.schedule === "daily" || info.schedule === "weekly") {
            if (info.schedule === "daily") {
                subject += "Daily";
            } else if (info.schedule === "weekly") {
                subject += "Weekly";
            }
            subject += " Report for " + bot.name;
        } else if (info.schedule === "integration") {
            let integration = info.integration;
            bot = integration.bot;
            
            if (info.isAllClear) {
                subject += "All issues have been resolved on "+ bot.name;
            }
            else {
                if (integration) {
                    subject += "Integration #" + integration.number;
                }
                subject += " of " + bot.name + " ";
                subject += notification_helper.integrationResultString(integration);
            }
        }
        return subject;
    } else {
        return "";
    }
};

XCSNotificationClass.prototype.getNewIssueEmailText = function getNewIssueEmailText(data) {
    return "This is an integration for the " + data.integration.bot.name + " bot.";
};

XCSNotificationClass.prototype.getReportEmailText = function getReportEmailText(info) {
    if (info) {
        let emailText = "";
        if (info.integrations && info.integrations.length) {
            let integration = info.integrations[0];
            let botName = integration.bot.name;
            emailText += "This is a " + info.reportType + " report for " + botName + " Bot.";
        }
        return emailText;
    } else {
        return "";
    }
};

XCSNotificationClass.prototype.sortAuthorStrategies = function sortAuthorStrategies(a, b) {
    if (a.confidence === k.XCSIssueIdentificationStrategyHighConfidence && a.confidence === k.XCSIssueIdentificationStrategyLowConfidence) {
        return 1;
    } else if (a.confidence === k.XCSIssueIdentificationStrategyLowConfidence && a.confidence === k.XCSIssueIdentificationStrategyHighConfidence) {
        return -1;
    } else if (a.confidence === b.confidence) {
        if (a.reliability > b.reliability) {
            return 1;
        } else if (a.reliability < b.reliability) {
            return -1;
        } else if (a.reliability === b.reliability) {
            return 0;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
};

XCSNotificationClass.prototype.sortByContributor = function sortByContributor(a, b) {
    let contributor_a = a.contributor;
    let contributor_b = b.contributor;

    if (contributor_a.XCSContributorName === contributor_b.XCSContributorName) {
        return 0;
    } else if (contributor_a.XCSContributorName > contributor_b.XCSContributorName) {
        return 1;
    } else if (contributor_a.XCSContributorName < contributor_b.XCSContributorName) {
        return -1;
    } else {
        return 0;
    }
};

XCSNotificationClass.prototype.processCommitRepository = function processCommitRepository(commit, integration) {
    if (commit !== undefined && commit !== null && integration !== undefined && integration !== null) {
        let blueprintLocationsKey = (integration.revisionBlueprint && integration.revisionBlueprint.DVTSourceControlWorkspaceBlueprintLocationsKey) || {};
        let remoteRepositoriesKey = (integration.revisionBlueprint && integration.revisionBlueprint.DVTSourceControlWorkspaceBlueprintRemoteRepositoriesKey) || {};

        let repository = this.getRepositoryURLKeyFromIdentifierKey(commit.XCSBlueprintRepositoryID, remoteRepositoriesKey);
        let branch = this.getBranchIdentifierKeyFromLocationsKey(commit.XCSBlueprintRepositoryID, blueprintLocationsKey);
        commit.repository = (repository || "");
        commit.branch = (branch || "");
    }
};

XCSNotificationClass.prototype.processIssueAuthorRepository = function processCommitRepository(issueAuthor, integration) {
    if (issueAuthor !== undefined && issueAuthor !== null && integration !== undefined && integration !== null) {
        let blueprintLocationsKey = (integration.revisionBlueprint && integration.revisionBlueprint.DVTSourceControlWorkspaceBlueprintLocationsKey) || {};
        let remoteRepositoriesKey = (integration.revisionBlueprint && integration.revisionBlueprint.DVTSourceControlWorkspaceBlueprintRemoteRepositoriesKey) || {};

        let repository = this.getRepositoryURLKeyFromIdentifierKey(issueAuthor.XCSBlueprintRepositoryID, remoteRepositoriesKey);
        let branch = this.getBranchIdentifierKeyFromLocationsKey(issueAuthor.XCSBlueprintRepositoryID, blueprintLocationsKey);
        issueAuthor.repository = (repository || "");
        issueAuthor.branch = (branch || "");
    }
};

XCSNotificationClass.prototype.getRepositoryURLKeyFromIdentifierKey = function getRepositoryURLKeyFromIdentifierKey(inIndentifierKey, inRemoteRepositoriesKey) {
    if (inIndentifierKey !== undefined && inIndentifierKey !== null && inRemoteRepositoriesKey !== undefined && inRemoteRepositoriesKey !== null) {
        for (let i = 0; i < inRemoteRepositoriesKey.length; i++) {
            let remoteRepo = inRemoteRepositoriesKey[i];
            if (remoteRepo && remoteRepo.DVTSourceControlWorkspaceBlueprintRemoteRepositoryIdentifierKey === inIndentifierKey) {
                return remoteRepo.DVTSourceControlWorkspaceBlueprintRemoteRepositoryURLKey;
            }
        }
        return "";
    } else {
        return "";
    }
};

XCSNotificationClass.prototype.getBranchIdentifierKeyFromLocationsKey = function getBranchIdentifierKeyFromLocationsKey(inIndentifierKey, inLocationsKey) {
    if (inIndentifierKey !== undefined && inIndentifierKey !== null && inLocationsKey !== undefined && inLocationsKey !== null) {
        if (inLocationsKey[inIndentifierKey] !== undefined && inLocationsKey[inIndentifierKey] !== null) {
            return inLocationsKey[inIndentifierKey].DVTSourceControlBranchIdentifierKey;
        } else {
            return "";
        }
    } else {
        return "";
    }
};

XCSNotificationClass.prototype.createCommitsArrayWithIssuesReferences = function createCommitsArrayWithIssuesReferences(commitsByRepositoryBranch) {
    let commitsByRepositoryArray = [];
    for (let repoUrlBranchName in commitsByRepositoryBranch) {
        if (repoUrlBranchName && commitsByRepositoryBranch[repoUrlBranchName] !== undefined) {
            let commitByRepositoryBranch = commitsByRepositoryBranch[repoUrlBranchName];
            let commitsArray = [];

            for (let commitHash in commitByRepositoryBranch.commits) {
                if (commitHash && commitByRepositoryBranch.commits[commitHash] !== undefined) {
                    let issueTypes = commitByRepositoryBranch.commits[commitHash].issueTypes;
                    issueTypes.warning = Object.keys(issueTypes.warning).length;
                    issueTypes.analyzerWarning = Object.keys(issueTypes.analyzerWarning).length;
                    issueTypes.error = Object.keys(issueTypes.error).length;
                    issueTypes.testFailure = Object.keys(issueTypes.testFailure).length;

                    let data = {
                        commitHash: commitHash,
                        issueTypes: issueTypes
                    };
                    commitsArray.push(data);
                }
            }

            let data1 = {
                repository: commitByRepositoryBranch.repository,
                branch: commitByRepositoryBranch.branch,
                commits: commitsArray
            };
            commitsByRepositoryArray.push(data1);
        }
    }
    return commitsByRepositoryArray;
};

XCSNotificationClass.prototype.updateIssueDictToTheMostRecent = function updateIssueDictToTheMostRecent(issuesDict, currentIssue, integration) {
    if (issuesDict && currentIssue) {
        let issueID = currentIssue._id;
        if (issuesDict[issueID] === undefined) {
            issuesDict[issueID] = [];
            issuesDict[issueID].push({
                issue: currentIssue,
                integration: integration
            });
        } else {
            let savedIssuesArray = issuesDict[issueID];
            if (savedIssuesArray && savedIssuesArray.length > 0) {
                let savedIssue = savedIssuesArray[0];
                if (savedIssue.issue.age < currentIssue.age) {
                    issuesDict[issueID] = [];
                    issuesDict[issueID].push({
                        issue: currentIssue,
                        integration: integration
                    });
                } else if (savedIssue.issue.age === currentIssue.age) {
                    issuesDict[issueID].push({
                        issue: currentIssue,
                        integration: integration
                    });
                }
            }
        }
    }
};

XCSNotificationClass.prototype.removeIntegrationsFromIssueDict = function removeIntegrationsFromIssueDict(issuesDict) {
    if (issuesDict) {
        for (let issueId in issuesDict) {
            if (issuesDict[issueId]) {
                let issuesArray = issuesDict[issueId];

                for (let i = 0; i < issuesArray.length; i++) {
                    let issueDict = issuesArray[i];
                    let issue = issueDict.issue;
                    delete issue.commits;
                    issuesArray[i] = issue;
                }
            }
        }
    }
};

XCSNotificationClass.prototype.scheduleBotReports = function scheduleBotReports(req, cb) {
    let log = logger.withRequest(req);

    log.debug('Rebuilding #EmailReportPeriodic bot schedule.');

    // cancel all pending bot schedule tasks
    scheduler.cancelTasksMatchingFilter(task => task.botReportScheduled);

    // find any bots on the system
    botClass.listAllBots(req, (err, bots) => {
        if (err) {
            log.error('Error retrieving bots to schedule:', err, '#EmailReportPeriodic');
            cb(err);
        } else {
            log.debug('Found', bots.length, 'bots. #EmailReportPeriodic');

            bots.forEach(bot => {
                let queue = require('./backgroundQueue.js');

                // Skip bots generated via unit tests
                if (undefined === bot[k.XCSUnitTestHeader]) {
                    if (bot && bot.configuration && bot.configuration.triggers) {
                        log.debug('Bot', bot.name, 'has #EmailReportPeriodic schedule.');

                        bot.configuration.triggers.forEach(trigger => {
                            let emailConfiguration = null;
                            if (trigger && trigger.type && trigger.type !== 2) {
                                return;
                            }

                            emailConfiguration = trigger.emailConfiguration;
                            let task = null;
                            let minuteString = ((emailConfiguration.minutesAfterHour < 10) ? '0' : '') + emailConfiguration.minutesAfterHour;

                            // daily
                            if (emailConfiguration.type === k.XCSTriggerDailyReport) {
                                log.debug('Scheduling bot report', bot.name, 'daily at', emailConfiguration.hour + ':' + minuteString, '#EmailReportPeriodic');
                                task = scheduler.scheduleDailyAtTime(emailConfiguration.hour, emailConfiguration.minutesAfterHour, () => {
                                    log.debug('Enqueuing reports job for bot', bot._id);
                                    queue.enqueue('bg', 'sendBotReport', [null, bot._id, trigger, botReportTaskCallback]);
                                });
                            }
                            // weekly
                            else if (emailConfiguration.type === k.XCSTriggerWeeklyReport) {
                                let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                let day = (emailConfiguration.weeklyScheduleDay % 7); // wrap around Sunday
                                log.debug('Scheduling bot report', bot.name, 'weekly on', days[day], 'at', emailConfiguration.hour + ':' + minuteString, '#EmailReportPeriodic');
                                task = scheduler.scheduleWeeklyAtTime(day, emailConfiguration.hour, emailConfiguration.minutesAfterHour, () => {
                                    log.debug('Enqueuing reports job for bot', bot._id);
                                    queue.enqueue('bg', 'sendBotReport', [null, bot._id, trigger, botReportTaskCallback]);
                                });
                            }

                            // annotate the task so we can find it later
                            if (task) {
                                task.botScheduled = true;
                            }
                        });
                    }
                }
            });

            cb();
        }
    });
};

function botReportTaskCallback(err) {
    if (err) {
        logger.error('Failed to enqueue bot report job', err);
    }
}

XCSNotificationClass.prototype.createCommitsByHashDict = function createCommitsByHashDict(issues, integration, commitsByHash) {
    if (issues && integration && commitsByHash) {
        for (let t = 0; t < issues.length; t++) {
            let issue = issues[t];
            
            if (issue.commits) {
                for (let h = 0; h < issue.commits.length; h++) {
                    // We process the commit to capture the repo URL and the name of the branch
                    let commit = issue.commits[h];
                    this.processCommitRepository(commit, integration);
                    commitsByHash[commit.XCSCommitHash] = commit;
                }
            }
        }
    }
};

XCSNotificationClass.prototype.coalescedConfigurationChanges = function coalescedConfigurationChanges(integrations) {
    if (!integrations || integrations.length === 0) {
        return null;
    }

    let changes = integrations[0].controlledChanges;

    for (let i = 1; i < integrations.length; i++) {
        let integration = integrations[i];

        changes = botClass.combineControlledChanges(changes, integration.controlledChanges);
    }

    return changes;
};

XCSNotificationClass.prototype.numberOfCommitters = function numberOfCommitters(commitsByHash, integrationCommitsShas) {
    let committersCount = 0;
    let committersDict = {};

    if (commitsByHash && integrationCommitsShas) {
        for (let i = 0; i < integrationCommitsShas.length; i++) {
            let commit = commitsByHash[integrationCommitsShas[i]];
            if (commit) {
                let contributorEmail = getContributorEmail(commit);
                committersDict[contributorEmail] = true;
            }
        }
        committersCount = Object.keys(committersDict).length;
    }
    return committersCount;
};

XCSNotificationClass.prototype.listOfCommitters = function listOfCommitters(commitsByHash, integrationCommitsShas) {
    let committersArray = [];
    let committersDict = {};

    if (commitsByHash && integrationCommitsShas) {
        for (let i = 0; i < integrationCommitsShas.length; i++) {
            let commit = commitsByHash[integrationCommitsShas[i]];
            if (commit) {
                let contributorEmail = getContributorEmail(commit);
                let contributor = getContributor(commit);
                if (committersDict[contributorEmail] === undefined) {
                    committersDict[contributorEmail] = contributor;
                }
            }
        }

        for (let contributorEmail1 in committersDict) {
            if (committersDict[contributorEmail1]) {
                committersArray.push({
                    name: committersDict[contributorEmail1].XCSContributorDisplayName || committersDict[contributorEmail1].XCSContributorName,
                    email: committersDict[contributorEmail1].XCSContributorEmails.length && committersDict[contributorEmail1].XCSContributorEmails[0]
                });
            }
        }
    }
    return committersArray;
};

XCSNotificationClass.prototype.listOfIssuesSummary = function listOfIssuesSummary(integration) {
    let summaryArray = [];
    if (integration && integration.buildResultSummary) {
        let buildResultSummary = integration.buildResultSummary;

        if (buildResultSummary.errorCount > 0) {
            let errorString = notification_helper.pluralize(buildResultSummary.errorCount, "Error");
            if (buildResultSummary.errorChange !== 0) {
                errorString += " (" + (buildResultSummary.errorChange > 0 ? "+" : "") + buildResultSummary.errorChange + ")";
            }
            summaryArray.push(errorString);
        }
        if (buildResultSummary.warningCount > 0) {
            let warningString = notification_helper.pluralize(buildResultSummary.warningCount, "Warning");
            if (buildResultSummary.warningChange !== 0) {
                warningString += " (" + (buildResultSummary.warningChange > 0 ? "+" : "") + buildResultSummary.warningChange + ")";
            }
            summaryArray.push(warningString);
        }
        if (buildResultSummary.analyzerWarningCount > 0) {
            let analysisString = notification_helper.pluralize(buildResultSummary.analyzerWarningCount, "Analysis Issue");
            if (buildResultSummary.analyzerWarningChange !== 0) {
                analysisString += " (" + (buildResultSummary.analyzerWarningChange > 0 ? "+" : "") + buildResultSummary.analyzerWarningChange + ")";
            }
            summaryArray.push(analysisString);
        }
        if (buildResultSummary.testsCount > 0 && buildResultSummary.testFailureCount === 0) {
            let passingTestString = notification_helper.pluralize(buildResultSummary.testsCount, "Passing Test");
            if (buildResultSummary.testsChange !== 0) {
                passingTestString += " (" + (buildResultSummary.testsChange > 0 ? "+" : "") + buildResultSummary.testsChange + ")";
            }
            summaryArray.push(passingTestString);
        } else if (buildResultSummary.testsCount > 0 && buildResultSummary.testFailureCount > 0 && buildResultSummary.testsCount === buildResultSummary.testFailureCount) {
            let testFailureString = notification_helper.pluralize(buildResultSummary.testFailureCount, "Test Assertion");
            if (buildResultSummary.testFailureChange !== 0) {
                testFailureString += " (" + (buildResultSummary.testFailureChange > 0 ? "+" : "") + buildResultSummary.testFailureChange + ")";
            }
            summaryArray.push(testFailureString);
        } else if (buildResultSummary.testsCount > 0 && buildResultSummary.testFailureCount > 0) {
            let testString = notification_helper.pluralize(buildResultSummary.testsCount, "Test");
            if (buildResultSummary.testsChange !== 0) {
                testString += " (" + (buildResultSummary.testsChange > 0 ? "+" : "") + buildResultSummary.testsChange + ")";
            }
            summaryArray.push(testString);

            let testPassingString = notification_helper.pluralize(buildResultSummary.testsCount - buildResultSummary.testFailureCount, "Passing Test");
            summaryArray.push(testPassingString);

            let testFailureString2 = notification_helper.pluralize(buildResultSummary.testFailureCount, "Test Assertion");
            if (buildResultSummary.testFailureChange !== 0) {
                testFailureString2 += " (" + (buildResultSummary.testFailureChange > 0 ? "+" : "") + buildResultSummary.testFailureChange + ")";
            }
            summaryArray.push(testFailureString2);

            if (buildResultSummary.improvedPerfTestCount > 0) {
                summaryArray.push(notification_helper.pluralize(buildResultSummary.improvedPerfTestCount, "improved Performance Test"));
            }
            if (buildResultSummary.regressedPerfTestCount > 0) {
                summaryArray.push(notification_helper.pluralize(buildResultSummary.regressedPerfTestCount, "regressed Performance Test"));
            }
        }
        if (buildResultSummary.codeCoveragePercentage > 0) {
            let codeCoverageString = buildResultSummary.codeCoveragePercentage + "% Coverage";
            if (buildResultSummary.codeCoveragePercentageDelta !== 0) {
                codeCoverageString += " (" + (buildResultSummary.codeCoveragePercentageDelta > 0 ? "+" : "") + buildResultSummary.codeCoveragePercentageDelta + ")";
            }
            summaryArray.push(codeCoverageString);
        }
    }
    return summaryArray;
};

function getContributorHash(commit) {
    if (commit) {
        let contributor = commit.XCSCommitContributor;
        let hash = contributor.XCSContributorName.replace(/ /g, '').toLowerCase();
        for (let i = 0; i < contributor.XCSContributorEmails.length; i++) {
            hash += contributor.XCSContributorEmails[i].replace(/ /g, '').toLowerCase();
        }
        return hash;
    }
    return;
}

function getContributorEmail(commit) {
    if (commit) {
        let email = "";
        let emails = commit.XCSCommitContributor && commit.XCSCommitContributor.XCSContributorEmails;
        if (emails !== null && emails.length > 0) {
            email = emails[0];
        }
        return email;
    }
    return;
}

function getContributor(commit) {
    if (commit) {
        let contributor = commit.XCSCommitContributor;
        return contributor;
    }
    return;
}

function getPlatformString(platforms) {
    let plateformString = "";
    let plateformStringArray = [];

    if (platforms) {
        plateformString += "SDKS: ";
        for (let i = 0; i < platforms.length; i++) {
            plateformStringArray.push(platforms[i].displayName + " " + platforms[i].buildNumber);
        }
        plateformString += notification_helper.commaSeperatedArrayToString(plateformStringArray);
    }
    return plateformString;
}

function getEmailAddressWithName(emailName, emailAddress) {
    return '"' + emailName + '" <' + emailAddress + '>';
}

function isEmailAddressAllowed(email, allowedDomainNames) {
    let isAllowed = false;
    if (email && allowedDomainNames) {
        for (let i = 0; i < allowedDomainNames.length; i++) {
            let domainName = allowedDomainNames[i];
            if (email.indexOf(domainName) !== -1) {
                isAllowed = true;
                break;
            }
        }

        if (!isAllowed && allowedDomainNames.length === 0) {
            isAllowed = true;
        }
    } else {
        isAllowed = true;
    }

    return isAllowed;
}

function isBlueprintIdAllowed(blueprintId, scmOptions) {
    let isAllowed = false;
    if (blueprintId && scmOptions) {
        if (scmOptions[blueprintId] !== undefined) {
            isAllowed = scmOptions[blueprintId];
        }
    }
    return isAllowed;
}

function isAllClear(result) {
    if (result && result.issues && result.issues.length > 0) {
        let allIssueResolved = true;
        for (let i = 0; i < result.issues.length; i++) {
            let issue = result.issues[i];
            if (!isIssueResolved(issue)) {
                allIssueResolved = false;
            }
        }
        if (result.integration && result.integration.result === k.XCSIntegrationResultSucceeded) {
            return allIssueResolved;
        }
    }
    return false;
}

function isIssueResolved(issue) {
    return (issue.status === k.XCSIntegrationIssueStatusResolved);
}

XCSNotificationClass.prototype.isIssueAllowedByTriggerConditions = function isIssueAllowedByTriggerConditions(issue, trigger) {
    let isAllowed = false;
    if (issue && trigger && trigger.conditions) {
        let conditions = trigger.conditions;
        if (conditions.onWarnings && issue.type === "warning") {
            isAllowed = true;
        }
        if (conditions.onAnalyzerWarnings && issue.type === "analyzerWarning") {
            isAllowed = true;
        }
        if (conditions.onBuildErrors && issue.type === "error") {
            isAllowed = true;
        }
        if (conditions.onFailingTests && issue.type === "testFailure") {
            isAllowed = true;
        }
        if (conditions.onAllIssuesResolved && isIssueResolved(issue)) {
            isAllowed = true;
        }
    }
    return isAllowed;
};

function orderIssuesByType(issues, issuesDict) {
    let finalArray = [];
    if (issues && issuesDict) {
        let issuesTypeDict = {};
        let types = ['buildServiceError', 'error', 'testFailure', 'triggerError', 'warning', 'analyzerWarning', 'buildServiceWarning', 'unknown'];

        for (let i = 0; i < issues.length; i++) {
            let issueDict = issues[i];
            let issueId = issueDict.issueId;
            let index = issueDict.index;

            let issuesArray = issuesDict[issueId];
            if (issuesArray && issuesArray.length && issuesArray[index] !== undefined) {
                let issue = issuesArray[index];

                if (issue !== undefined) {
                    if (issuesTypeDict[issue.type] === undefined) {
                        issuesTypeDict[issue.type] = [];
                    }
                    issuesTypeDict[issue.type].push(issueDict);
                }
            }
        }

        for (let j = 0; j < types.length; j++) {
            let issueType = types[j];
            if (issuesTypeDict[issueType] !== undefined) {
                finalArray = finalArray.concat(issuesTypeDict[issueType]);
            }
        }
    }
    return finalArray;
}

/* Module exports */

module.exports = xcsutil.bindAll(new XCSNotificationClass());
