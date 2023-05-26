/*
    XCSVersionClass
    A class dedicated to manipulate the Version document.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('./redisClass.js'),
    sharedDocClass = require('./sharedDocClass.js'),
    dbCoreClass = require('./dbCoreClass.js');

/* XCSVersionClass object */

function XCSVersionClass() {}

XCSVersionClass.prototype.findDocumentWithUUID = function XCSDBCoreClassFindDocumentWithUUID(req, doc_UUID, doc_type, cb) {
    var self = this;
    self.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

XCSVersionClass.prototype.findOrCreateVersionDocument = function findOrCreateVersionDocument(req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Version - findOrCreateVersionDocument] findOrCreateVersionDocument';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var versionKey = getVersionKey(req),
        defaults = versionDefaults(),
        loadFromCouchDB = false;

    sharedDocClass.findOrCreateDefaultSharedDocument(req, versionKey, k.XCSDesignDocumentVersion, defaults, loadFromCouchDB, function VERFindOrCreateVersionDocumentCallback(err, doc) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, doc);
        }
    });

};

XCSVersionClass.prototype.findVersion = function findVersion(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Version - findVersion] ' + req.method + ' ' + req.url,
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.findOrCreateVersionDocument(req, function VERFindVersionCallback(err, doc) {

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

/**
 * Update
 */

XCSVersionClass.prototype.update = function update(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Version - update] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var versionKey = getVersionKey(req),
        defaults = versionDefaults(),
        body = xcsutil.patchBodyForClient(req);

    sharedDocClass.update(req, versionKey, k.XCSDesignDocumentVersion, defaults, body, function VERUpdateCallback(err, updated_doc) {
        if (err) {
            konsole.error(req, '[Version - update] error: ' + JSON.stringify(err));
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

XCSVersionClass.prototype.createVersionDocument = function createVersionDocument(req, versionKey, body, cb) {

    xcsutil.logLevelInc(req);

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        timerName;

    if (unitTestUUID) {
        timerName = '[Version - createVersionDocument] create version document: ' + unitTestUUID;
    } else {
        timerName = '[Version - createVersionDocument] create default version document';
    }

    console.time(timerName);
    konsole.log(req, timerName);

    if (req && req.snitch) {
        req.snitch.next(timerName);
    }

    if (!body) {
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the body is empty'
        });
    }

    dbCoreClass.createDocument(req, k.XCSDesignDocumentVersion, body, function VERCreateVersionDocumentCallback(err, url, version) {
        if (err) {
            konsole.error(req, '[Version - createVersionDocument] create document failed: ' + JSON.stringify(err));
            console.timeEnd(timerName);
            return xcsutil.safeCallback(cb, err);
        } else {
            // Remove the document cached by dbCoreClass, since we're not going to ever lookup by _id.
            // Instead, we'll be looking for the specially-crafted key (see below).
            redisClass.del(req, version._id);
            konsole.log(req, '[Version - createVersionDocument] removed document from Redis: ' + version._id);

            if (unitTestUUID) {
                var redisClient = redisClass.client();
                redisClient.setex(versionKey, k.XCSUnitTestTTLInSeconds, JSON.stringify(version), function VERCreateRedisSetEx(err) {
                    if (err) {
                        konsole.error(req, '[Version - createVersionDocument] error: ' + JSON.stringify(err));
                    } else {
                        konsole.log(req, '[Version - createVersionDocument] unit test version document cached to Redis: ' + versionKey);
                    }
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, null, url, version);
                });
            } else {
                redisClass.set(req, versionKey, JSON.stringify(version), function VERCreateRedisSet(err) {
                    if (err) {
                        konsole.error(req, '[Version - createVersionDocument] error: ' + JSON.stringify(err));
                    } else {
                        konsole.log(req, '[Version - createVersionDocument] default version document cached to Redis: ' + versionKey);
                    }
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, null, url, version);
                });
            }
        }
    });

};

XCSVersionClass.prototype.create = function create(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var timerName = '[Version - create] ' + req.method + ' ' + req.url;
    console.time(timerName);
    konsole.log(req, timerName);

    if (req && req.snitch) {
        req.snitch.next(timerName);
    }

    var versionKey = getVersionKey(req),
        body = req.body,
        self = this;

    self.createVersionDocument(req, versionKey, body, function VERCreateCallback(err, url, version) {
        console.timeEnd(timerName);
        if (err) {
            konsole.error(req, '[Version - create] error: ' + JSON.stringify(err));
            xcsutil.logLevelDec(req);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.logLevelDec(req);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelCheck(req, logLevel);

            res.set(k.XCSResponseLocation, url);

            return xcsutil.standardizedResponse(res, 201, version);
        }
    });

};

/* Module exports */

module.exports = new XCSVersionClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function getVersionKey(req) {
    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);
    var versionKey = k.XCSDesignDocumentVersion;
    if (unitTestUUID) {
        versionKey = k.XCSDesignDocumentVersion + ':' + unitTestUUID;
    }
    return versionKey;
}

function versionDefaults() {
    var defaultContents = {};
    return defaultContents;
}