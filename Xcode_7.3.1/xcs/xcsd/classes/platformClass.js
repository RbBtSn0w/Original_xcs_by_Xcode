'use strict';

var k = require('../constants.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    redisClass = require('./redisClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    logger = require('../util/logger.js');

var async = require('async');

function XCSPlatformClass() {}

XCSPlatformClass.prototype.list = function (req, res) {
    this.listPlatforms(req, function PLATListPlatforms(err, docs) {
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSPlatformClass.prototype.listPlatforms = function (req, cb) {

    var log = logger.withRequest(req);
    log.info('Fetching all known platforms.');

    var doctype = k.XCSDesignDocumentPlatform;

    redisClass.getDynamicQuery(req, doctype, function PLATListPlatformsGetDynamic(err, docs) {
        if (err) {

            cb(err);
        } else if (docs) {
            docs = JSON.parse(docs);
            log.info('Found', docs.length, 'platforms in Redis.');

            cb(null, docs);
        } else {
            log.debug('Could not find platforms in Redis, falling back to CouchDB.');
            dbCoreClass.listAllDocuments(req, doctype, function PLATListPlatformsListAllDocs(err, docs) {
                if (err && err.status !== 404) {
                    cb(err);
                } else {
                    log.info('Found', docs.length, 'platforms in CouchDB.');
                    redisClass.setDynamicQuery(req, doctype, JSON.stringify(docs), function PLATListPlatformsSetDynamic() {
                        cb(null, docs);
                    });
                }
            });
        }
    });

};

XCSPlatformClass.prototype.save = function (req, res) {

    var platformToSave = req.body;

    this.savePlatform(req, platformToSave, function PLATSavePlatform(err, url, savedPlatform) {
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            res.set(k.XCSResponseLocation, url);
            xcsutil.standardizedResponse(res, 201, savedPlatform);
        }
    });

};

XCSPlatformClass.prototype.savePlatform = function (req, platform, cb) {

    var self = this,
        log = logger.withRequest(req);

    log.info('Saving platform with identifier', platform.identifier);

    async.waterfall([
        function PLATSavePlatformFind(cb) {
            self.findPlatformWithIdentifier(req, platform.identifier, function (err, existingPlatform) {
                if (err && err.status !== 404) {
                    cb(err);
                } else {
                    cb(null, existingPlatform);
                }
            });
        },
        function PLATSavePlatformCreateOrPatch(existingPlatform, cb) {
            if (existingPlatform) {
                log.debug('Found existing platform', platform.identifier, '(' + existingPlatform._id + ')');

                delete existingPlatform._rev;

                for (var key in platform) {
                    if (platform.hasOwnProperty(key)) {
                        existingPlatform[key] = platform[key];
                    }
                }

                dbCoreClass.updateDocumentWithUUID(req, existingPlatform._id, existingPlatform, false, k.XCSDesignDocumentPlatform, function (err, savedPlatform) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, 'https://' + req.headers.host + '/platforms/' + savedPlatform._id, savedPlatform);
                    }
                });
            } else {
                log.debug('No existing platform', platform.identifier, 'found, creating new one.');
                dbCoreClass.createDocument(req, k.XCSDesignDocumentPlatform, platform, cb);
            }
        }
    ], function PLATSavePlatformHandleResult(err, url, savedPlatform) {
        if (!err) {
            log.debug('Saved platform, deleting old platforms cache from Redis.');
            redisClass.delDynamicQuery(req, k.XCSDesignDocumentPlatform, function () {
                cb(err, url, savedPlatform);
            });
        } else {
            cb(err, url, savedPlatform);
        }
    });

};

XCSPlatformClass.prototype.findPlatformWithIdentifier = function (req, identifier, cb) {

    var log = logger.withRequest(req);

    log.info('Fetching platform', identifier);

    var query = {
            include_docs: true
        },
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader];

    if (unitTestUUID) {
        query.key = [unitTestUUID, identifier];
    } else {
        query.key = identifier;
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentPlatform, k.XCSDesignDocumentViewPlatformsByIdentifier, query, function (err, docs) {
        cb(err, docs && docs[0]);
    });
};

module.exports = xcsutil.bindAll(new XCSPlatformClass());