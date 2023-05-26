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


module.exports = function initPhase(app) {
    if (cluster.isMaster) {
        // Now that xcsd is ready, kick-off an ACL expansion
        require('../classes/aclClass.js').askODToExpandACLDocument(null, function (err) {
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
                });
        });
    }

    return Promise.resolve();
};