/*
    XCSSettingsClass
    A class dedicated to manipulate the Settings document.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var cluster = require('cluster'),
    express = require('express');

var k = require('../constants.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    sharedDocClass = require('./sharedDocClass.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('./redisClass.js'),
    workerManagementClass = require('../app/app_worker_management.js'),
    app = express();

/* XCSSettingsClass object */

function XCSSettingsClass() {}
XCSSettingsClass.prototype.findDocumentWithUUID = function XCSDBCoreClassFindDocumentWithUUID(req, doc_UUID, doc_type, cb) {
    var self = this;
    self.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

XCSSettingsClass.prototype.findOrCreateSettingsDocument = function findOrCreateSettingsDocument(req, cb) {

    xcsutil.requireCallback(cb);

    xcsutil.logLevelInc(req);

    var settingsKey = getSettingsKey(req),
        defaults = settingsDefaults(),
        loadFromCouchDB = false;

    var functionTitle = '[Settings - findOrCreateSettingsDocument] find or create settings document: \'' + settingsKey + '\'';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    sharedDocClass.findOrCreateDefaultSharedDocument(req, settingsKey, k.XCSDesignDocumentSettings, defaults, loadFromCouchDB, function SETFindOrCreateSettingsDocument(err, doc) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, err, doc);
    });

};


XCSSettingsClass.prototype.findSettings = function findSettings(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - findSettings] ' + req.method + ' ' + req.url,
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.findOrCreateSettingsDocument(req, function SETFindSettings(err, doc) {

        xcsutil.logLevelDec(req);
        xcsutil.profilerSummary(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, doc);
        }
    });

};

XCSSettingsClass.prototype.list = function list(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - list] ' + req.method + ' ' + req.url,
        query = {
            key: k.XCSDesignDocumentSettings,
            include_docs: true
        };

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    sharedDocClass.list(req, k.XCSDesignDocumentSettings, k.XCSDesignDocumentViewAllSettings, query, function SETList(err, docs) {
        // Not finding documents doesn't mean it's an error. Let's report true errors instead.

        if (err && err.status !== 404) {
            konsole.error(req, '[Settings - list] error: ' + JSON.stringify(err));
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

/**
 * Update
 */

XCSSettingsClass.prototype.update = function update(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - update] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        body = xcsutil.patchBodyForClient(req);

    self.update_internal(req, body, function SETUpdateInternal(err, updated_doc) {
        if (err) {
            konsole.error(req, '[Settings - update] error: ' + JSON.stringify(err));
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedResponse(res, 200, updated_doc);
        }
    });
};

XCSSettingsClass.prototype.update_internal = function update(req, changes, cb) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - update_internal]';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var settingsKey = getSettingsKey(req),
        defaults = settingsDefaults();

    sharedDocClass.update(req, settingsKey, k.XCSDesignDocumentSettings, defaults, changes, function SETUpdate(err, updated_doc) {
        if (err) {
            konsole.error(req, '[Settings - update_internal] error: ' + JSON.stringify(err));
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.safeCallback(cb, err);
        } else {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

            // [Tito - DEBUG]
            // <rdar://problem/19376420> Can't add Xcode Server in Xcode preferences
            // If we're disabling the service, is this intentional? Show the stack trace...

            var changedServiceEnabled = updated_doc[k.XCSServiceEnabledKey];

            if (false === changedServiceEnabled) {
                console.trace('*** The service has been disabled (Potential bug hit: <rdar://problem/19376420> Can\'t add Xcode Server in Xcode preferences)');
            }

            return xcsutil.safeCallback(cb, null, updated_doc);
        }
    });
};


/**
 * Remove
 */

XCSSettingsClass.prototype.remove = function remove(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - remove] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    dbCoreClass.removeDocument(req, req.params.id, req.params.rev, function SETRemove(err) {
        xcsutil.logLevelDec(req);
        xcsutil.profilerSummary(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            konsole.log(req, '[Settings - remove] error: ' + JSON.stringify(err));
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var settingsKey = getSettingsKey(req);
            redisClass.del(req, settingsKey);
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

XCSSettingsClass.prototype.removeAll = function removeAll(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - removeAll] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        query = {
            include_docs: false
        };

    if (unitTestUUID) {
        query.startkey = [unitTestUUID];
        query.endkey = [unitTestUUID, {}];
    }

    dbCoreClass.removeAll(req, k.XCSDesignDocumentSettings, k.XCSDesignDocumentViewAllSettings, query, function SETRemoveAll(err) {
        xcsutil.logLevelDec(req);
        xcsutil.profilerSummary(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err && err.status !== 404) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            redisClass.deleteWithPattern(req, k.XCSDesignDocumentSettings + '*', function (err) {
                if (err) {
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    return xcsutil.standardizedResponse(res, 204);
                }
            });
        }
    });

};

XCSSettingsClass.prototype.enableService = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - enableService] ' + req.method + ' ' + req.url,
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.setEnableServiceFlag(req, true, function (err) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

XCSSettingsClass.prototype.disableService = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - disableService] ' + req.method + ' ' + req.url,
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.setEnableServiceFlag(req, false, function (err) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

XCSSettingsClass.prototype.setEnableServiceFlag = function (req, flag, cb) {

    var changes = {},
        self = this;

    changes[k.XCSServiceEnabledKey] = flag;

    self.update_internal(req, changes, function SETUpdateInternal(err, updated_doc) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {

            // Override the service enabled state flag in Redis
            redisClass.client().set(k.XCSRedisServiceEnabledOriginalState, (flag ? '1' : '0'));

            // [Tito - DEBUG]
            // <rdar://problem/19376420> Can't add Xcode Server in Xcode preferences
            // Is the settings doc out-of-sync between Redis and CouchDB?

            sharedDocClass.printSettingsFromCouchAndRedis(req, function () {
                if (cluster.isMaster) {
                    if (flag) {
                        workerManagementClass.startAllWorkers(app, flag);
                    } else {
                        workerManagementClass.setKillAllWorkersTimeout(function AWMStartWorkerSetKillAllWorkersTimeout() {
                            workerManagementClass.startWorker(app);
                        });
                    }
                } else {
                    process.nextTick(function SETUpdateNextTick() {
                        process.send({
                            command: 'ManageWorkers',
                            enabled: flag
                        });
                    });
                }

                require('./integrationClass.js').announcePendingIntegrations(req);

                return xcsutil.safeCallback(cb, null, updated_doc);
            });
        }
    });

};

/* Module exports */

module.exports = new XCSSettingsClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function getSettingsKey(req) {
    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);
    var settingsKey = k.XCSDesignDocumentSettings;
    if (unitTestUUID) {
        settingsKey = k.XCSDesignDocumentSettings + ':' + unitTestUUID;
    }
    return settingsKey;
}

function settingsDefaults() {
    return k.XCSSettingsDefaultContent;
}