'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var async = require('async'),
    cluster = require('cluster'),
    k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    dbCoreClass = require('../classes/dbCoreClass.js'),
    integrationClass = require('../classes/integrationClass.js'),
    issueClass = require('../classes/issueClass.js');

module.exports = function app_cleanup_init(cb) {
    if (cluster.isMaster) {
        var functionTitle = '[XCSNode - cleanup]';

        async.waterfall([

            function ACIFindRunningIntegrations(cb) {
                var runningQuery = {
                    include_docs: true
                };

                konsole.log(null, functionTitle + ' searching for previously running integrations from the previous session.');

                dbCoreClass.findDocumentsWithQuery(null, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsRunning, runningQuery, function ACIFindRunningIntegrationsCallback(err, docs) {
                    if (err && err.status !== 404) {
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        return xcsutil.safeCallback(cb, null, docs);
                    }
                });
            },
            function ACICleanupIntegrations(docs, cb) {
                konsole.log(null, functionTitle + ' found ' + docs.length + ' previously running integrations that need to be cleaned up.');

                var issueToCreate = {
                    type: 'buildServiceError',
                    issueType: 'Build Service Error',
                    message: 'This integration was canceled because Xcode Server was shut down while it was running.'
                };

                async.each(docs, function ACICreateIssueForIntegration(doc, cb) {
                    konsole.log(null, functionTitle + 'creating an explanatory issue for integration ' + doc._id);
                    issueClass.createIssue(null, doc._id, issueToCreate, function ACICreateIssueCallback(err) {
                        if (err) {
                            return xcsutil.safeCallback(cb, err);
                        }

                        konsole.log(null, functionTitle + 'marking integration ' + doc._id + ' as canceled/completed.');
                        integrationClass.update_internal(null, doc._id, {
                            result: k.XCSIntegrationResultCanceled,
                            currentStep: k.XCSIntegrationStepTypeCompleted
                        }, cb);
                    });
                }, cb);
            }
        ], function ACIFinalizer(err) {
            if (err) {
                err.message = 'An error occurred while cleaning up previously running integrations: ' + JSON.stringify(err);
            }
            return xcsutil.safeCallback(cb, err);
        });
    } else {
        // Only clean up in the master process.
        return xcsutil.safeCallback(cb);
    }
};