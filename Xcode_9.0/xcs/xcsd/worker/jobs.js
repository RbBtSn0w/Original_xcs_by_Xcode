'use strict';

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    acl = require('../classes/aclClass.js'),
    bot = require('../classes/botClass.js'),
    codeCoverage = require('../classes/codeCoverageClass.js'),
    file = require('../classes/fileClass.js'),
    integration = require('../classes/integrationClass.js'),
    createIntegration = require('../classes/integration/create.js'),
    notification = require('../classes/notificationClass.js');

var canService = require('./plugins/canService.js'),
    cacheCoverageNeeded = require('./plugins/cacheCoverageNeeded.js');

// PLUGIN EXPLANATION:
//
// queueLock: Discard the job if the same job is already running

module.exports = {
    'expandACL': {
        plugins: [canService, 'queueLock'],
        perform: acl.expandACLDocument.bind(acl, null)
    },
    'scm': {
        plugins: [canService, 'queueLock'],
        perform: bot.checkBotsForUpdates
    },
    'periodic': {
        plugins: [canService],
        pluginOptions: {
            canService: {
                type: 'perform'
            }
        },
        perform: bot.schedulePeriodicBotRuns.bind(bot, null)
    },
    'emailReportPeriodic': {
        plugins: [canService],
        pluginOptions: {
            canService: {
                type: 'perform'
            }
        },
        perform: notification.scheduleBotReports.bind(bot, null)
    },
    'integrate': {
        plugins: ['queueLock'],
        perform: function (botID, botName, cb) {
            createIntegration.addPendingIntegration(null, botID, null, err => {
                if (err) {
                    if (err.status === 409) {
                        logger.debug('Did not add pending integration for bot', botName, 'because it already has a pending integration. #Periodic');
                        cb();
                    } else {
                        logger.error('Could not add pending integration for bot', botName + ':', err, '#Periodic');
                        cb(err);
                    }
                } else {
                    logger.debug('Added pending integration for bot', botName, '#Periodic');
                    cb();
                }
            });
        }
    },
    'prune': {
        plugins: [canService, 'queueLock'],
        perform: function (cb) {
            var minNumberOfIntegrationsToKeep = k.XCSMinNumberOfIntegrationsSafeFromPruning,
                force = false;
            file.prune_internal(minNumberOfIntegrationsToKeep, force, (err, result) => {
                if (err && (404 !== err.status)) {
                    logger.error('Error occurred while #Pruning assets:', err);
                    cb(err);
                } else if (result) {
                    logger.info('#Pruning assets completed successfully. Disk space was freed.');
                    cb();
                } else {
                    logger.debug('Disk space was checked, but no asset #Pruning was needed.');
                    cb();
                }
            });
        }
    },
    'email': {
        perform: notification.integrationEmail
    },
    'newIssuesEmails': {
        perform: notification.newIssuesEmails
    },
    'reportEmail': {
        perform: notification.reportEmail
    },
    'sendBotReport': {
        perform: notification.sendBotReport_internal
    },
    'cacheCoverage': {
        plugins: [cacheCoverageNeeded, 'queueLock'],
        perform: codeCoverage.cacheCodeCoverageData
    },
    'cleanDeletedBot': {
        plugins: ['queueLock'],
        perform: bot.cleanDeletedBot
    },
    'cleanDeletedIntegration': {
        perform: integration.cleanDeletedIntegration
    },
    'cleanKeychain': {
        plugins: [canService, 'queueLock'],
        perform: integration.cleanOldKeychainItems
    }
};