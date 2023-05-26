'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    redisClass = require('./redisClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js');

var async = require('async');

function XCSPlatformClass() {}

XCSPlatformClass.prototype.list = function (req, res) {

    xcsutil.logLevelInc(req);
    konsole.log(req, '[Platform - list]');

    this.listPlatforms(req, function PLATListPlatforms(err, docs) {
        xcsutil.logLevelDec(req);
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSPlatformClass.prototype.listPlatforms = function (req, cb) {

    xcsutil.logLevelInc(req);
    konsole.log(req, '[Platform - listPlatforms]');

    var doctype = k.XCSDesignDocumentPlatform;

    redisClass.getDynamicQuery(req, doctype, function PLATListPlatformsGetDynamic(err, docs) {
        if (err) {
            xcsutil.logLevelDec(req);
            cb(err);
        } else if (docs) {
            docs = JSON.parse(docs);
            konsole.log(req, '[Platform - listPlatforms] number of documents found in Redis: ' + docs.length);
            xcsutil.logLevelDec(req);
            cb(null, docs);
        } else {
            dbCoreClass.listAllDocuments(req, doctype, function PLATListPlatformsListAllDocs(err, docs) {
                if (err && err.status !== 404) {
                    xcsutil.logLevelDec(req);
                    cb(err);
                } else {
                    konsole.log(req, '[Platform - listPlatforms] number of documents found in CouchDB: ' + docs.length);
                    redisClass.setDynamicQuery(req, doctype, JSON.stringify(docs), function PLATListPlatformsSetDynamic() {
                        xcsutil.logLevelDec(req);
                        cb(null, docs);
                    });
                }
            });
        }
    });

};

XCSPlatformClass.prototype.save = function (req, res) {

    xcsutil.logLevelInc(req);
    konsole.log(req, '[Platform - save]');

    var platformToSave = req.body;

    this.savePlatform(req, platformToSave, function PLATSavePlatform(err, url, savedPlatform) {
        xcsutil.logLevelDec(req);
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            res.set(k.XCSResponseLocation, url);

            xcsutil.standardizedResponse(res, 201, savedPlatform);
        }
    });

};

XCSPlatformClass.prototype.savePlatform = function (req, platform, cb) {

    xcsutil.logLevelInc(req);
    konsole.log(req, '[Platform - savePlatform] identifier: ' + platform.identifier);

    var self = this;

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
                konsole.log(req, '[Platform - savePlatform] found existing platform "' + platform.identifier + '" (' + existingPlatform._id + ')');

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
                konsole.log(req, '[Platform - savePlatform] no existing platform "' + platform.identifier + '" found, creating new one');
                dbCoreClass.createDocument(req, k.XCSDesignDocumentPlatform, platform, cb);
            }
        }
    ], function PLATSavePlatformHandleResult(err, url, savedPlatform) {
        if (!err) {
            redisClass.delDynamicQuery(req, k.XCSDesignDocumentPlatform);
        }
        xcsutil.logLevelDec(req);
        cb(err, url, savedPlatform);
    });

};

XCSPlatformClass.prototype.findPlatformWithIdentifier = function (req, identifier, cb) {

    xcsutil.logLevelInc(req);
    konsole.log(req, '[Platform - findPlatformWithIdentifier] identifier: ' + identifier);

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

module.exports = new XCSPlatformClass();