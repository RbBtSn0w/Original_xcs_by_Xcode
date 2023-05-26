'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var async = require('async'),
    cluster = require('cluster');

var konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    version = require('../classes/versionClass.js'),
    settings = require('../classes/settingsClass.js'),
    aclClass = require('../classes/aclClass.js');

module.exports = function app_default_documents_init(app, cb) {

    if (cluster.isMaster || cluster.isDisabled) {
        async.series([

            // find and create the default settings document if needed

            function ADDFindOrCreateSettingsDocument(next) {

                    konsole.log(null, '[XCSNode - Create default document] find or create the default Settings document');

                    settings.findOrCreateSettingsDocument(null, function ADDFindOrCreateSettingsDocumentCallback(err, settingsDoc) {
                        if (err) {
                            konsole.error(null, '[XCSNode - Create default document] error: ' + JSON.stringify(err));
                        } else {
                            app.set('settingsDocument', settingsDoc);
                            konsole.log(null, '[XCSNode - Create default document] done.');
                        }
                        return next();
                    });
            },

            // find and create the default version document if needed

            function ADDFindOrCreateVersionDocument(next) {

                    konsole.log(null, '[XCSNode - Create default document] find or create the default Version document');

                    version.findOrCreateVersionDocument(null, function ADDFindOrCreateVersionDocumentCallback(err) {
                        if (err) {
                            konsole.error(null, '[XCSNode - Create default document] error: ' + JSON.stringify(err));
                        } else {
                            konsole.log(null, '[XCSNode - Create default document] done.');
                        }
                        next();
                    });
            },

            // find and create the default ACL document if needed

            function ADDFindOrCreateDefaultACLDocument(next) {

                    konsole.log(null, '[XCSNode - Create default document] find or create the default ACL document');

                    aclClass.findOrCreateDefaultACLDocument(null, false, function ADDFindOrCreateDefaultACLDocumentCallback(err) {
                        if (err) {
                            konsole.error(null, '[XCSNode - Create default document] error: ' + JSON.stringify(err));
                            next(err);
                        } else {
                            konsole.log(null, '[XCSNode - Create default document] load and cache the ACL document');

                            // attempt to expand the ACL immediately
                            setTimeout(function ADDAskODToExpandACLDocumentAsync() {
                                aclClass.askODToExpandACLDocument(null, function ADDAskODToExpandACLDocumentAsyncCallback(err) {
                                    if (err) {
                                        var message = 'unable to load and cache the ACL document. Reason: ' + JSON.stringify(err);
                                        konsole.warn(null, '[XCSNode - Create default document] warning: ' + message);
                                    } else {
                                        konsole.log(null, '[XCSNode - Create default document] ACL document loaded and expanded.');
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