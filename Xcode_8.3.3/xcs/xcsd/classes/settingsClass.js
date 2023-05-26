/*
    XCSSettingsClass
    A class dedicated to manipulate the Settings document.
*/

'use strict';

var k = require('../constants.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    sharedDocClass = require('./sharedDocClass.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('./redisClass.js');

/* XCSSettingsClass object */

function XCSSettingsClass() {}

XCSSettingsClass.prototype.findOrCreateSettingsDocument = function findOrCreateSettingsDocument(req, cb) {

    xcsutil.requireCallback(cb);



    var settingsKey = getSettingsKey(req),
        defaults = settingsDefaults(),
        loadFromCouchDB = false;

    var functionTitle = '[Settings - findOrCreateSettingsDocument] find or create settings document: \'' + settingsKey + '\'';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    sharedDocClass.findOrCreateDefaultSharedDocument(req, settingsKey, k.XCSDesignDocumentSettings, defaults, loadFromCouchDB, function SETFindOrCreateSettingsDocument(err, doc) {

        return xcsutil.safeCallback(cb, err, doc);
    });

};


XCSSettingsClass.prototype.findSettings = function findSettings(req, res) {



    var functionTitle = '[Settings - findSettings] ' + req.method + ' ' + req.url,
        self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.findOrCreateSettingsDocument(req, function SETFindSettings(err, doc) {


        xcsutil.profilerSummary(req);


        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, doc);
        }
    });

};

XCSSettingsClass.prototype.list = function list(req, res) {



    var log = logger.withRequest(req),
        functionTitle = '[Settings - list] ' + req.method + ' ' + req.url,
        query = {
            key: k.XCSDesignDocumentSettings,
            include_docs: true
        };

    log.info('Listing all settings documents.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    sharedDocClass.list(req, k.XCSDesignDocumentSettings, k.XCSDesignDocumentViewAllSettings, query, function SETList(err, docs) {
        // Not finding documents doesn't mean it's an error. Let's report true errors instead.

        if (err && err.status !== 404) {
            log.error('Error listing settings documents:', err);
            xcsutil.profilerSummary(req);


            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);


            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

/**
 * Update
 */

XCSSettingsClass.prototype.update = function update(req, res) {



    var functionTitle = '[Settings - update] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        body = xcsutil.patchBodyForClient(req);

    self.update_internal(req, body, function SETUpdateInternal(err, updated_doc) {
        if (err) {
            xcsutil.profilerSummary(req);


            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);


            return xcsutil.standardizedResponse(res, 200, updated_doc);
        }
    });
};

XCSSettingsClass.prototype.update_internal = function update(req, changes, cb) {



    var log = logger.withRequest(req),
        functionTitle = '[Settings - update_internal]';

    log.info('Updating xcsd settings.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var settingsKey = getSettingsKey(req),
        defaults = settingsDefaults();

    sharedDocClass.update(req, settingsKey, k.XCSDesignDocumentSettings, defaults, changes, function SETUpdate(err, updated_doc) {
        if (err) {
            log.error('Error updating settings:', err);
            xcsutil.profilerSummary(req);


            return xcsutil.safeCallback(cb, err);
        } else {
            xcsutil.profilerSummary(req);



            // [Tito - DEBUG]
            // <rdar://problem/19376420> Can't add Xcode Server in Xcode preferences
            // If we're disabling the service, is this intentional? Show the stack trace...

            // var changedServiceEnabled = updated_doc[k.XCSServiceEnabledKey];

            // if (false === changedServiceEnabled) {
            //     // console.trace('*** The service has been disabled (Potential bug hit: <rdar://problem/19376420> Can\'t add Xcode Server in Xcode preferences)');
            // }

            return xcsutil.safeCallback(cb, null, updated_doc);
        }
    });
};


/**
 * Remove
 */

XCSSettingsClass.prototype.remove = function remove(req, res) {



    var log = logger.withRequest(req),
        functionTitle = '[Settings - remove] ' + req.method + ' ' + req.url;

    log.info('Removing xcsd settings document:', req.params.id);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    dbCoreClass.removeDocument(req, req.params.id, req.params.rev, function SETRemove(err) {

        xcsutil.profilerSummary(req);

        if (err) {
            log.error('Error removing settings:', err);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var settingsKey = getSettingsKey(req);
            redisClass.del(req, settingsKey);
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

XCSSettingsClass.prototype.removeAll = function removeAll(req, res) {



    var log = logger.withRequest(req),
        functionTitle = '[Settings - removeAll] ' + req.method + ' ' + req.url;

    log.info('Removing all settings documents.');

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

        xcsutil.profilerSummary(req);

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
    var functionTitle = '[Settings - enableService] ' + req.method + ' ' + req.url,
        self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.setEnableServiceFlag(req, true, function (err) {
        if (err) {
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedResponse(res, 204);
        }
    });
};

XCSSettingsClass.prototype.disableService = function (req, res) {
    var functionTitle = '[Settings - disableService] ' + req.method + ' ' + req.url,
        self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.setEnableServiceFlag(req, false, function (err) {
        if (err) {
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedResponse(res, 204);
        }
    });
};

XCSSettingsClass.prototype.setEnableServiceFlag = function (req, flag, cb) {
    cb = xcsutil.callback(cb);

    var log = logger.withRequest(req),
        changes = {},
        self = this;

    changes[k.XCSServiceEnabledKey] = flag;

    log.info('Setting xcsd service to be', flag ? 'enabled.' : 'disabled.');

    self.findOrCreateSettingsDocument(req, (err, settings) => {
        if (err) {
            return cb(err);
        }

        const currentFlag = settings[k.XCSServiceEnabledKey];

        if (currentFlag !== flag) {
            self.update_internal(req, changes, function SETUpdateInternal(err, updated_doc) {
                if (err) {
                    return cb(err);
                } else {
                    // Override the service enabled state flag in Redis
                    redisClass.client().set(k.XCSRedisServiceEnabledOriginalState, (flag ? '1' : '0'));

                    if (process.send) {
                        process.nextTick(() => {
                            process.send({ command: 'ManageWorkers' });
                        });
                    }

                    return cb(null, updated_doc);
                }
            });
        } else {
            log.info('Service flag would not change, doing nothing.');
            cb(null, settings);
        }
    });



};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSSettingsClass());

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
