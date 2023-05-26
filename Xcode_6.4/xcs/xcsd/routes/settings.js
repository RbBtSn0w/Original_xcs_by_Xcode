'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    db_core = require('./db_core.js'),
    shared_doc = require('./shared_doc.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    redis = require('../classes/redisClass.js'),
    cluster = require('cluster');

var settings = {};

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

/**
 * Create and Read
 */

settings.findOrCreateSettingsDocument = function (req, cb) {

    xcsutil.logLevelInc(req);

    var settingsKey = getSettingsKey(req),
        defaults = settingsDefaults();

    var functionTitle = '[Settings - findOrCreateSettingsDocument] findOrCreateSettingsDocument: ' + settingsKey;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    shared_doc.findOrCreateDefaultSharedDocument(req, settingsKey, k.XCSDesignDocumentSettings, defaults, function (err, doc) {
        xcsutil.logLevelDec(req);
        return cb(err, doc);
    });

};


settings.findSettings = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - findSettings] ' + req.method + ' ' + req.url + '...',
        self = settings;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    self.findOrCreateSettingsDocument(req, function (err, doc) {

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

settings.list = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - list] ' + req.method + ' ' + req.url + '...',
        query = {
            key: k.XCSDesignDocumentSettings,
            include_docs: true
        };

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    shared_doc.list(req, k.XCSDesignDocumentSettings, k.XCSDesignDocumentViewAllSettings, query, function (err, docs) {
        // Not finding documents doesn't mean it's an error. Let's report true errors instead.

        if (err && err.status !== 404) {
            konsole.error(req, '[Settings - list] error: ' + err.message);
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

settings.update = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - update] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var settingsKey = getSettingsKey(req),
        defaults = settingsDefaults();

    shared_doc.update(req, settingsKey, k.XCSDesignDocumentSettings, defaults, function (err, updated_doc) {
        if (err) {
            konsole.error(req, '[Settings - update] error: ' + err.message);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

            var setProps = req.body[k.XCSSetProperties],
                changedServiceEnabled = setProps.hasOwnProperty('service_enabled');

            if (changedServiceEnabled && cluster.isWorker) {
                process.nextTick(function () {
                    process.send({
                        command: 'ManageWorkers',
                        enabled: updated_doc.service_enabled
                    });
                });
            }

            return xcsutil.standardizedResponse(res, 200, updated_doc);
        }
    });

};

/**
 * Remove
 */

settings.remove = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - remove] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    db_core.removeDocument(req, req.params.id, req.params.rev, function (err) {
        xcsutil.logLevelDec(req);
        xcsutil.profilerSummary(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            konsole.log(req, '[Settings - remove] error: ' + err.message);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var settingsKey = getSettingsKey(req);
            redis.del(req, settingsKey);
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

settings.removeAll = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Settings - removeAll] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
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

    db_core.removeAll(req, k.XCSDesignDocumentSettings, k.XCSDesignDocumentViewAllSettings, query, function (err) {
        xcsutil.logLevelDec(req);
        xcsutil.profilerSummary(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err && err.status !== 404) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            redis.del(req, k.XCSDesignDocumentSettings + '*');
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

module.exports = settings;