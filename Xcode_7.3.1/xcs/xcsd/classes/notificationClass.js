/*
    XCSNotificationClass
    A class dedicated to interact with CouchDB and Redis.
*/

'use strict';

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
    logger = require('../util/logger.js');

/* XCSNotificationClass object */

function XCSNotificationClass() {}

XCSNotificationClass.prototype.sendNotifications = function sendNotifications(req, res) {
    async.parallel({
        integration: cb => {
            integrationSearchClass.findIntegrationWithUUID(req, req.params.id, false, cb);
        },
        commits: cb => {
            integrationSearchClass.findCommitsForIntegration(req, req.params.id, (err, commits) => {
                // 404's for commits are acceptable and shouldn't mess things up
                if (err && err.status !== 404) {
                    return xcsutil.safeCallback(cb, err, commits);
                } else {
                    return xcsutil.safeCallback(cb, null, commits);
                }
            });
        },
        issues: cb => {
            issueClass.formattedIssuesForIntegration(req, req.params.id, true, cb);
        },
        platforms: cb => {
            platform.listPlatforms(req, cb);
        }
    }, (err, results) => {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            results.commits = results.commits && results.commits[0];
            results.trigger = req.body.trigger;
            results.recipients = req.body.recipients;
            results.allClear = req.body.allClear;

            require('./backgroundQueue.js').enqueue('bg', 'email', [results], err => {
                if (err) {
                    return xcsutil.standardizedErrorResponse(res, {
                        status: 500,
                        message: 'Error trying to send email notification: ' + err.message
                    });
                } else {
                    return xcsutil.standardizedResponse(res, 200, { enqueued: true });
                }
            });
        }
    });
};

XCSNotificationClass.prototype.sendEmail = function (info, cb) {
    settings.findOrCreateSettingsDocument(null, (err, settings) => {
        version.findOrCreateVersionDocument(null, (err, versions) => {

            var transport;

            if ('smtp' === settings.mail_transport.toLowerCase()) {
                transport = nodemailer.createTransport(settings.mail_transport_options);
            } else {
                transport = nodemailer.createTransport(sendmailTransport(settings.mail_transport_options));
            }

            info = JSON.parse(JSON.stringify(info));

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

            logger.info('Sending notification email to', allRecipients);
            logger.debug('Email reply-to set to', fullReplyTo);

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

            var messageParams = {
                from: fullFrom,
                to: allRecipients,
                subject: templates.subject(info),
                text: templates.text(info),
                html: templates.html(info)
            };

            if (hasReplyTo) {
                messageParams.replyTo = fullReplyTo;
            }

            transport.sendMail(messageParams, cb);
        });
    });
};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSNotificationClass());
