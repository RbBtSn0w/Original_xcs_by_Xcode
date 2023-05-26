'use strict';

const cluster = require('cluster');

const k = require('../constants.js');
const logger = require('../util/logger.js');
const xcsutil = require('../util/xcsutil.js');
const redis = require('../classes/redisClass.js');
const settings = require('../classes/settingsClass.js');
const workers = require('../classes/worker.js');
const Promise = require('bluebird');

const createControlIntegrations = require('./app_control_integrations.js');
const cleanupBuilders = require('./app_builders.js');

let restoreInitPhaseInterval;

module.exports = function initPhase(app) {

    // Setup a timer running every 5 seconds where check if there are any maintenance
    // tasks running. If so, continue checking until the list is empty. At that point,
    // clear the init phase and resume as expected.

    if (cluster.isMaster && !restoreInitPhaseInterval) {
        restoreInitPhaseInterval = setInterval(function () {
            xcsutil.maintenanceTasks_internal(function (err, tasks) {
                if (err) {
                    logger.error('Could not load current maintenance tasks:', err);
                } else {
                    if (0 === tasks.length) {
                        logger.debug('There are no current maintenance tasks, attempting to continue with startup.');
                        settings.findOrCreateSettingsDocument(null, function (err, doc) {
                            if (err) {
                                logger.error('Could not load the settings for xcsd:', err);
                                process.exit(1);
                            } else {
                                var isServiceEnabled = doc[k.XCSServiceEnabledKey];

                                logger.info('The xcsd service is', (isServiceEnabled ? 'enabled.' : 'disabled.'));

                                redis.client().set(k.XCSRedisServiceEnabledOriginalState, (isServiceEnabled ? '1' : '0'));
                                redis.client().del(k.XCSRedisMaintenanceTasksPhase);
                                redis.client().set(k.XCSRedisServiceInitPhase, '0');
                                redis.client().del(k.XCSRedisMaintenanceTasksResults);

                                redis.client().get(k.XCSRedisMaintenanceTasksPhase, function (err, reply) {
                                    logger.debug('Current maintenance tasks phase:', reply);

                                    clearInterval(restoreInitPhaseInterval);

                                    // Now that xcsd is ready, kick-off an ACL expansion
                                    require('../classes/aclClass.js').askODToExpandACLDocument(null, function () {
                                        if (err && (531 !== err.status)) {
                                            var message = 'Unable to load and cache the ACL document: ' + err.message;
                                            logger.warn(message);
                                        } else {
                                            logger.debug('Successfully performed initial reload of ACLs.');
                                        }
                                    });

                                    require('./app_default_documents.js')(app);
                                    require('./app_cleanup.js')();
                                    require('./app_OTA_install.js')();

                                    require('../classes/backgroundQueue.js').enqueue('bg', 'cleanKeychain', () => {
                                        createControlIntegrations()
                                            .catch(err => {                                                
                                                logger.error('Error while creating a control integration:', err);                                                
                                            })
                                            .then(cleanupBuilders)
                                            .catch(err => {                                                
                                                logger.error('Error while cleaning up builders:', err);                                                
                                            })
                                            .then(() => {
                                                workers.killAllWorkers();
                                            });
                                    });
                                });
                            }
                        });
                    } else {
                        var results = JSON.stringify(tasks);
                        redis.client().set(k.XCSRedisMaintenanceTasksResults, results);
                    }
                }
            });
        }, 5 * 1000);
    }

    return Promise.resolve();
};