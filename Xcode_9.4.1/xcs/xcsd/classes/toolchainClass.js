'use strict';

var k = require('../constants.js'),
    te = require('../util/turboevents.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    redisClass = require('./redisClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    logger = require('../util/logger.js');

var async = require('async');

function XCSToolchainClass() {}

XCSToolchainClass.prototype.list = function (req, res) {
    this.listToolchains(req, function TOOLCHAINSListToolchains(err, docs) {
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

XCSToolchainClass.prototype.listToolchains = function (req, cb) {

    var log = logger.withRequest(req);
    log.info('Fetching all known toolchains.');

    var doctype = k.XCSDesignDocumentToolchain;

    redisClass.getDynamicQuery(req, doctype, function TOOLCHAINSListToolchainsGetDynamic(err, docs) {
        if (err) {
            cb(err);
        } else if (docs) {
            docs = JSON.parse(docs);
            log.info('Found', docs.length, 'toolchains in Redis.');

            cb(null, docs);
        } else {
            log.debug('Could not find toolchains in Redis, falling back to CouchDB.');
            dbCoreClass.listAllDocuments(req, doctype, function TOOLCHAINSListToolchainsListAllDocs(err, docs) {
                if (err && err.status !== 404) {
                    cb(err);
                } else {
                    log.info('Found', docs.length, 'toolchains in CouchDB.');
                    redisClass.setDynamicQuery(req, doctype, JSON.stringify(docs), function TOOLCHAINSListToolchainsSetDynamic() {
                        cb(null, docs);
                    });
                }
            });
        }
    });

};

XCSToolchainClass.prototype.save = function (req, res) {
    var toolchainToSave = req.body;

    this.saveToolchain(req, toolchainToSave, function TOOLCHAINSSaveToolchain(err, url, savedToolchain) {

        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            res.set(k.XCSResponseLocation, url);

            xcsutil.standardizedResponse(res, 201, savedToolchain);
        }
    });

};

XCSToolchainClass.prototype.saveToolchain = function (req, toolchain, cb) {

    var self = this,
        log = logger.withRequest(req);

    log.info('Saving toolchain with identifier', toolchain.identifier);

    async.waterfall([
        function TOOLCHAINSSaveToolchainFind(cb) {
            self.findToolchainWithIdentifier(req, toolchain.identifier, function (err, existingToolchain) {
                if (err && err.status !== 404) {
                    cb(err);
                } else {
                    cb(null, existingToolchain);
                }
            });
        },
        function TOOLCHAINSSaveToolchainCreateOrPath(existingToolchain, cb) {
            if (existingToolchain) {
                log.debug('Found existing toolchain', toolchain.identifier, '(' + existingToolchain._id + ')');

                delete existingToolchain._rev;

                for (var key in toolchain) {
                    if (toolchain.hasOwnProperty(key)) {
                        existingToolchain[key] = toolchain[key];
                    }
                }

                dbCoreClass.updateDocumentWithUUID(req, existingToolchain._id, existingToolchain, false, k.XCSDesignDocumentToolchain, function (err, savedToolchain) {
                    if (err) {
                        cb(err);
                    } else {
                        cb(null, 'https://' + req.headers.host + '/toolchains/' + savedToolchain._id, savedToolchain);
                    }
                });
            } else {
                log.debug('No existing toolchain', toolchain.identifier, 'found, creating new one.');
                dbCoreClass.createDocument(req, k.XCSDesignDocumentToolchain, toolchain, cb);
            }
        }
    ], function TOOLCHAINSSaveToolchainHandleResult(err, url, savedToolchain) {
        if (!err) {
            log.debug('Saved toolchain, deleting old toolchain cache from Redis.');
            redisClass.delDynamicQuery(req, k.XCSDesignDocumentToolchain, function () {
                te.broadcast(k.XCSIsListenerForToolchainUpdates, k.XCSEmitNotificationToolchainCreated, savedToolchain);
                cb(err, url, savedToolchain);
            });
        } else {
            cb(err, url, savedToolchain);
        }
    });

};

XCSToolchainClass.prototype.findToolchainWithIdentifier = function (req, identifier, cb) {

    var log = logger.withRequest(req);

    log.info('Fetching toolchain', identifier);

    var query = {
            include_docs: true
        },
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader];

    if (unitTestUUID) {
        query.key = [unitTestUUID, identifier];
    } else {
        query.key = identifier;
    }

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentToolchain, k.XCSDesignDocumentViewToolchainsByIdentifier, query, function (err, docs) {
        cb(err, docs && docs[0]);
    });
};

XCSToolchainClass.prototype.remove = function (req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Toolchain - remove] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        toolchainID = req.params.id,
        toolchainRev = req.params.rev;

    log.info('Removing toolchain', toolchainID);

    function doRemove() {
        dbCoreClass.removeDocument(req, toolchainID, toolchainRev, function TOOLCHAINDoRemove(err) {

            if (err) {
                if (409 === err.status) {
                    self.findToolchainWithIdentifier(req, toolchainID, function TOOLCHAINRemoveFindToolchain(err, toolchain) {
                        if (err) {
                            xcsutil.profilerSummary(req);
                            return xcsutil.standardizedErrorResponse(res, err);
                        } else {
                            // Reset the revision we've just obtained and try again
                            toolchainRev = toolchain._rev;
                            log.info('Conflict while trying to remove toolchain', toolchainID + ', retrying.');
                            doRemove();
                        }
                    });
                } else {
                    xcsutil.profilerSummary(req);
                    return xcsutil.standardizedErrorResponse(res, err);
                }
            } else {
                redisClass.delDynamicQuery(req, k.XCSDesignDocumentToolchain, function () {
                    xcsutil.profilerSummary(req);

                    te.broadcast(k.XCSIsListenerForToolchainUpdates, k.XCSEmitNotificationToolchainRemoved, {
                        _id: req.params.id
                    });

                    return xcsutil.standardizedResponse(res, 204);
                });
            }
        });
    }

    doRemove();

};

module.exports = xcsutil.bindAll(new XCSToolchainClass());