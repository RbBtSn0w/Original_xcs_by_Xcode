/*
    XCSNotificationClass
    A class dedicated to interact with CouchDB and Redis.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var integrationSearchClass = require('./integrationSearchClass.js'),
    issueClass = require('./issueClass.js'),
    settings = require('./settingsClass.js'),
    version = require('./versionClass.js'),
    platform = require('./platformClass.js'),
    os = require('os'),
    async = require('async'),
    nodemailer = require('nodemailer'),
    sendmailTransport = require('nodemailer-sendmail-transport'),
    templates = require('../templates/notifications.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js');

/* XCSNotificationClass object */

function XCSNotificationClass() {}

XCSNotificationClass.prototype.sendNotifications = function sendNotifications(req, res) {
    async.parallel({
        integration: function (cb) {
            integrationSearchClass.findIntegrationWithUUID(req, req.params.id, false, cb);
        },
        commits: function (cb) {
            integrationSearchClass.findCommitsForIntegration(req, req.params.id, function NOTSendNotificationsCommits(err, commits) {
                // 404's for commits are acceptable and shouldn't mess things up
                if (err && err.status !== 404) {
                    return xcsutil.safeCallback(cb, err, commits);
                } else {
                    return xcsutil.safeCallback(cb, null, commits);
                }
            });
        },
        issues: function (cb) {
            issueClass.formattedIssuesForIntegration(req, req.params.id, true, cb);
        },
        platforms: function (cb) {
            platform.listPlatforms(req, cb);
        }
    }, function NOTSendNotificationsFinalizer(err, results) {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            results.commits = results.commits && results.commits[0];
            results.trigger = req.body.trigger;
            results.recipients = req.body.recipients;
            results.allClear = req.body.allClear;
            sendEmail(req, results, function NOTSendNotificationsSendEmail(err, response) {
                if (err) {
                    return xcsutil.standardizedErrorResponse(res, {
                        status: 500,
                        message: 'Internal Server Error (sendmail): error trying to send email notification: ' + transformEmailErrorMessage(err.message)
                    });
                } else {
                    return xcsutil.standardizedResponse(res, 200, response);
                }
            });
        }
    });
};

/* Module exports */

module.exports = new XCSNotificationClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function sendEmail(req, info, cb) {
    settings.findOrCreateSettingsDocument(req, function NOTSendEmailFindSettingsDocument(err, settings) {
        version.findOrCreateVersionDocument(req, function NOTSendEmailFindVersionDocument(err, versions) {

            var transport;

            if ('smtp' === settings.mail_transport.toLowerCase()) {
                transport = nodemailer.createTransport(settings.mail_transport_options);
            } else {
                transport = nodemailer.createTransport(sendmailTransport(settings.mail_transport_options));
            }

            if (versions) {
                info.versions = versions;
            }

            var replyToOptions = settings.mail_reply_to_options || {};
            var fromOptions = settings.mail_from_options || {};
            var replyToName = replyToOptions.name || '';
            var replyToAddress = replyToOptions.address || '';
            var fromName = fromOptions.name || 'Xcode Server';
            var fromAddress = fromOptions.address || 'noreply@' + os.hostname();
            var fullFrom = fromName + ' <' + fromAddress + '>';
            var fullReplyTo = replyToName + ' <' + replyToAddress + '>';
            var allRecipients = info.recipients.join(', ');

            konsole.log(req, '[Nofications - sendEmail] reply: ' + fullReplyTo);
            konsole.log(req, '[Notifications - sendEmail] Sending email to ' + allRecipients);

            var hasReplyTo = false;
            if (replyToName !== '') {
                hasReplyTo = true;
                replyToAddress = 'noreply@' + os.hostname();
            }
            if (replyToAddress !== '') {
                hasReplyTo = true;
                if (replyToName === '') {
                    replyToName = 'Xcode Server';
                }
            }

            if (hasReplyTo) {
                transport.sendMail({
                    from: fullFrom,
                    replyTo: fullReplyTo,
                    to: allRecipients,
                    subject: templates.subject(info),
                    text: templates.text(info),
                    html: templates.html(info)
                }, cb);
            } else {
                transport.sendMail({
                    from: fullFrom,
                    to: allRecipients,
                    subject: templates.subject(info),
                    text: templates.text(info),
                    html: templates.html(info)
                }, cb);
            }
        });
    });
}

function transformEmailErrorMessage(message) {
    var result = /Sendmail exited with (\d+)/.exec(message);
    if (result) {
        var exitCode = parseInt(result[1], 10);
        switch (exitCode) {
        case 78:
            return 'Sendmail has a configuration error. Please contact your system administrator.';
        case 75:
            return 'Sendmail had a temporary error and will try to deliver the message later.';
        }
        return 'Sendmail experienced an unknown error (' + exitCode + '). Please contact your system administrator';
    }

    return message;
}