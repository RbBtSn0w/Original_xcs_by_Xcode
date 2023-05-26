'use strict';

var async = require('async'),
    cluster = require('cluster');

var logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js'),
    version = require('../classes/versionClass.js'),
    settings = require('../classes/settingsClass.js'),
    aclClass = require('../classes/aclClass.js');

module.exports = function app_default_documents_init(app, cb) {

    if (cluster.isMaster || cluster.isDisabled) {
        async.series([

            // find and create the default settings document if needed

            function ADDFindOrCreateSettingsDocument(next) {

                    settings.findOrCreateSettingsDocument(null, function ADDFindOrCreateSettingsDocumentCallback(err, settingsDoc) {
                        if (err) {
                            logger.error('Could not find or create default settings document:', err);
                        } else {
                            app.set('settingsDocument', settingsDoc);
                            logger.debug('Successfully found or created settings document.');
                        }
                        return next();
                    });
            },

            // find and create the default version document if needed

            function ADDFindOrCreateVersionDocument(next) {

                    version.findOrCreateVersionDocument(null, function ADDFindOrCreateVersionDocumentCallback(err) {
                        if (err) {
                            logger.error('Could not find or create default versions document:', err);
                        } else {
                            logger.debug('Successfully found or created versions document.');
                        }
                        next();
                    });
            },

            // find and create the default ACL document if needed

            function ADDFindOrCreateDefaultACLDocument(next) {

                    aclClass.findOrCreateDefaultACLDocument(null, false, function ADDFindOrCreateDefaultACLDocumentCallback(err) {
                        if (err) {
                            logger.error('Could not find or create default ACL document:', err);
                            next(err);
                        } else {
                            logger.debug('Successfully found or created default ACL document. Now attempting to expand ACLs with OD.');

                            // attempt to expand the ACL immediately
                            setTimeout(function ADDAskODToExpandACLDocumentAsync() {
                                aclClass.askODToExpandACLDocument(null, function ADDAskODToExpandACLDocumentAsyncCallback(err) {
                                    if (err) {
                                        logger.warn('Could not expand ACLs:', err);
                                    } else {
                                        logger.debug('Successfully expanded ACLs with OD and saved them.');
                                    }
                                });
                            }, 0);

                            next();
                        }
                    });
            },

        ],
            function ADDFinalizer(err) {
                return xcsutil.safeCallback(cb, err);
            }
        );
    } else {
        return xcsutil.safeCallback(cb);
    }

};
