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
    xcsutil.standardizedResponse(res, 204);
};

XCSSettingsClass.prototype.disableService = function (req, res) {
    xcsutil.standardizedResponse(res, 204);    
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
