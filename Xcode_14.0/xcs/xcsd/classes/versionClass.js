/*
    XCSVersionClass
    A class dedicated to manipulate the Version document.
*/

'use strict';

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js'),
    sharedDocClass = require('./sharedDocClass.js');

/* XCSVersionClass object */

function XCSVersionClass() {}

XCSVersionClass.prototype.findOrCreateVersionDocument = function findOrCreateVersionDocument(req, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Version - findOrCreateVersionDocument] findOrCreateVersionDocument';

    log.info('Finding or creating version document.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var versionKey = getVersionKey(req),
        defaults = versionDefaults(),
        loadFromCouchDB = false;

    sharedDocClass.findOrCreateDefaultSharedDocument(req, versionKey, k.XCSDesignDocumentVersion, defaults, loadFromCouchDB, function VERFindOrCreateVersionDocumentCallback(err, doc) {

        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, doc);
        }
    });

};

XCSVersionClass.prototype.findVersion = function findVersion(req, res) {

    var functionTitle = '[Version - findVersion] ' + req.method + ' ' + req.url,
        self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.findOrCreateVersionDocument(req, function VERFindVersionCallback(err, doc) {


        xcsutil.profilerSummary(req);


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



    var log = logger.withRequest(req),
        functionTitle = '[Version - update] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var versionKey = getVersionKey(req),
        defaults = versionDefaults(),
        body = xcsutil.patchBodyForClient(req);

    sharedDocClass.update(req, versionKey, k.XCSDesignDocumentVersion, defaults, body, function VERUpdateCallback(err, updated_doc) {
        if (err) {
            log.error('Could not update version information:', err);
            xcsutil.profilerSummary(req);


            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);


            return xcsutil.standardizedResponse(res, 200, updated_doc);
        }
    });

};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSVersionClass());

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
