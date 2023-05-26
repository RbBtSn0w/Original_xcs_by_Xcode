'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var integration_search = require('./integration_search.js'),
    settings = require('./settings.js'),
    os = require('os'),
    async = require('async'),
    nodemailer = require('nodemailer'),
    templates = require('./templates/notifications.js'),
    xcsutil = require('../util/xcsutil.js');

function sendEmail(req, info, cb) {
    settings.findOrCreateSettingsDocument(req, function (err, settings) {
        var transport = nodemailer.createTransport(settings.mail_transport, settings.mail_transport_options);

        transport.sendMail({
            from: 'Xcode Server <noreply@' + os.hostname() + '>',
            to: info.recipients.join(', '),
            subject: templates.subject(info),
            text: templates.text(info),
            html: templates.html(info)
        }, cb);
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

function sendNotifications(req, res) {
    async.parallel({
        integration: function (cb) {
            integration_search.findIntegrationWithUUID(req, req.params.id, cb);
        },
        commits: function (cb) {
            integration_search.findCommitsForIntegration(req, req.params.id, function (err, commits) {
                // 404's for commits are acceptable and shouldn't mess things up
                if (err && err.status !== 404) {
                    cb(err, commits);
                } else {
                    cb(null, commits);
                }
            });
        }
    }, function (err, results) {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            results.commits = results.commits && results.commits[0];
            results.issues = req.body.issues;
            results.trigger = req.body.trigger;
            results.recipients = req.body.recipients;
            sendEmail(req, results, function (err, response) {
                if (err) {
                    return xcsutil.standardizedErrorResponse(res, {
                        status: 500,
                        message: 'Error trying to send email notification: ' + transformEmailErrorMessage(err.message)
                    });
                } else {
                    return xcsutil.standardizedResponse(res, 200, response);
                }
            });
        }
    });
}

exports.sendNotifications = sendNotifications;