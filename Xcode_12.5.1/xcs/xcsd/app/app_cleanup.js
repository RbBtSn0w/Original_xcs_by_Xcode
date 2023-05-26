'use strict';

var async = require('async'),
    cluster = require('cluster'),
    k = require('../constants.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js'),
    dbCoreClass = require('../classes/dbCoreClass.js'),
    integrationClass = require('../classes/integrationClass.js'),
    integrationSearchClass = require('../classes/integrationSearchClass.js'),
    issueClass = require('../classes/issueClass.js');

module.exports = function app_cleanup_init(cb) {
    if (cluster.isMaster) {
        async.waterfall([

            function ACIFindRunningIntegrations(cb) {
                var runningQuery = {
                    include_docs: true
                };

                logger.debug('Searching for integrations that were previously running and need to be canceled.');

                dbCoreClass.findDocumentsWithQuery(null, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsRunning, runningQuery, function ACIFindRunningIntegrationsCallback(err, docs) {
                    if (err && err.status !== 404) {
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        return xcsutil.safeCallback(cb, null, docs);
                    }
                });
            },
            function ACICleanupIntegrations(docs, cb) {
                if (docs.length > 0) {
                    logger.info('Cleanup found', docs.length, 'previously running integrations that need to be cleaned up.');

                    var issueToCreate = {
                        type: 'buildServiceError',
                        issueType: 'Build Service Error',
                        message: 'This integration was canceled because Xcode Server was shut down while it was running.'
                    };

                    async.eachSeries(docs, function ACICreateIssueForIntegration(doc, cb) {
                        logger.debug('Creating an issue explaining that integration', doc._id, 'has been cleaned.');

                        integrationSearchClass.findIntegrationWithUUID(null, doc._id, false, (err, integration) => {
                            if (err) {
                                xcsutil.safeCallback(cb, err);
                            } else {
                                issueClass.createIssue(null, integration, issueToCreate, function ACICreateIssueCallback(err) {
                                    if (err) {
                                        return xcsutil.safeCallback(cb, err);
                                    }

                                    logger.debug('Marking integration', doc._id, 'as canceled.');
                                    integrationClass.update_internal(null, doc._id, {
                                        result: k.XCSIntegrationResultCanceled,
                                        currentStep: k.XCSIntegrationStepTypeCompleted
                                    }, cb);
                                });
                            }
                        });
                    }, cb);
                } else {
                    cb();
                }
            }
        ], function ACIFinalizer(err) {
            if (err) {
                err.message = 'An error occurred while cleaning up previously running integrations: ' + JSON.stringify(err);
                logger.error(err.message);
            }
            return xcsutil.safeCallback(cb, err);
        });
    } else {
        // Only clean up in the master process.
        return xcsutil.safeCallback(cb);
    }
};