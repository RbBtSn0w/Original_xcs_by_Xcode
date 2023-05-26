'use strict';

var logger = require('../util/logger.js'),
    acl = require('../classes/aclClass.js'),
    bot = require('../classes/botClass.js'),
    codeCoverage = require('../classes/codeCoverageClass.js'),
    file = require('../classes/fileClass.js'),
    integration = require('../classes/integrationClass.js'),
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
            canService: { type: 'perform' }
        },
        perform: bot.schedulePeriodicBotRuns.bind(bot, null)
    },
    'integrate': {
        plugins: ['queueLock'],
        perform: function (botID, botName, cb) {
            integration.addPendingIntegration(null, botID, false, err => {
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
        perform: function(cb) {
            file.prune_internal((err, result) => {
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
        perform: notification.sendEmail
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
    }
};
