/*
    XCSSharedDocClass
    A class dedicated to manipulate 'singleton' documents: ACL, Settings and Version.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var async = require('async');

var k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('./redisClass.js'),
    dbCoreClass = require('./dbCoreClass.js');

var findOrCreateDefaultSharedDocumentQueue;

/* XCSSharedDocClass object */

function XCSSharedDocClass() {}

XCSSharedDocClass.prototype.findOrCreateDefaultSharedDocument = function XCSSharedDocClassFindOrCreateDefaultSharedDocument(req, shared_doc_key, doc_type, body, loadFromCouchDB, cb) {

    xcsutil.requireCallback(cb);

    xcsutil.logLevelInc(req);

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        functionTitle,
        self = this;

    if (unitTestUUID) {
        functionTitle = '[SharedDocClass - findOrCreateDefaultSharedDocument] find or create the unit test ' + doc_type + ' shared document: ' + shared_doc_key + ' (loadFromCouchDB: ' + loadFromCouchDB + ')';
    } else {
        functionTitle = '[SharedDocClass - findOrCreateDefaultSharedDocument] find or create the ' + doc_type + ' shared document: ' + shared_doc_key + ' (loadFromCouchDB: ' + loadFromCouchDB + ')';
    }

    konsole.log(req, functionTitle);

    // Create a queue object with single concurrency (if needed)
    if (!findOrCreateDefaultSharedDocumentQueue) {
        findOrCreateDefaultSharedDocumentQueue = async.queue(function (task, callbackQueue) {

            // [Tito - DEBUG]
            // <rdar://problem/19376420> Can't add Xcode Server in Xcode preferences
            // Is the settings doc out-of-sync between Redis and CouchDB?

            self.printSettingsFromCouchAndRedis(task.req, function () {
                if (task.loadFromCouchDB) {
                    xcsSharedDocClassRetrieveDocumentFromCouchDB(task.req, task.doc_type, task.body, true, task.shared_doc_key, task.self, callbackQueue);
                } else {
                    redisClass.get(task.req, task.shared_doc_key, function XCSSharedDocClassFindOrCreateDefaultSharedDocumentRedisGetSharedKey(err, reply) {
                        if (err || !reply) {
                            xcsSharedDocClassRetrieveDocumentFromCouchDB(task.req, task.doc_type, task.body, true, task.shared_doc_key, task.self, callbackQueue);
                        } else {
                            if (unitTestUUID) {
                                konsole.log(task.req, '[SharedDocClass - findOrCreateDefaultSharedDocument] unit test ' + task.doc_type + ' document found in Redis: ' + task.shared_doc_key);
                            } else {
                                konsole.log(task.req, '[SharedDocClass - findOrCreateDefaultSharedDocument] default ' + task.doc_type + ' document found in Redis: ' + task.shared_doc_key);
                            }
                            return callbackQueue(null, JSON.parse(reply));
                        }
                    });
                }
            });

        }, 1);
    }

    findOrCreateDefaultSharedDocumentQueue.push({
        req: req,
        doc_type: doc_type,
        body: body,
        loadFromCouchDB: loadFromCouchDB,
        shared_doc_key: shared_doc_key,
        self: self
    }, function (err, sharedDocument) {
        if (err) {
            konsole.error(req, '[SharedDocClass - findOrCreateDefaultSharedDocument] error while obtaining default document "' + shared_doc_key + '". Reason: ' + JSON.stringify(err));
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            konsole.log(req, '[SharedDocClass - findOrCreateDefaultSharedDocument] default "' + shared_doc_key + '" obtained successfully.');
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, null, sharedDocument);
        }
    });

};

XCSSharedDocClass.prototype.list = function list(req, doc_type, view_name, query, cb) {

    xcsutil.requireCallback(cb);

    xcsutil.logLevelInc(req);

    var functionTitle = '[SharedDocClass - list] ' + req.method + ' ' + req.url;
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    dbCoreClass.listAllDocuments(req, doc_type, function XCSSharedDocClassListDocuments(err, docs) {

        // !!! Not finding documents doesn't mean it's an error. Let's report true errors instead.

        xcsutil.logLevelDec(req);
        if (err && err.status !== 404) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs);
        }

    });

};

XCSSharedDocClass.prototype.update = function update(req, shared_doc_key, doc_type, defaults, changes, cb) {

    xcsutil.requireCallback(cb);

    xcsutil.logLevelInc(req);

    var functionTitle;

    if (req) {
        functionTitle = '[SharedDocClass - update] ' + req.method + ' ' + req.url;
    } else {
        functionTitle = '[SharedDocClass - update]';
    }

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!changes) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the changes have not been specified'
        });
    }

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        loadFromCouchDB = false,
        self = this;

    // Retrieve the shared document to be patched
    self.findOrCreateDefaultSharedDocument(req, shared_doc_key, doc_type, defaults, loadFromCouchDB, function XCSSharedDocClassUpdateFindDocument(err, doc) {
        if (err) {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        }

        // Replace the property with the new one
        for (var key in changes) {
            if (changes.hasOwnProperty(key)) {
                doc[key] = changes[key];
            }
        }

        konsole.debug(req, '[SharedDocClass - update] patch with: ' + JSON.stringify(doc, null, 4));

        dbCoreClass.updateDocumentWithUUID(req, doc._id, doc, false, doc_type, function XCSSharedDocClassUpdateDocument(err, updated_doc) {
            if (err) {
                konsole.error(req, '[SharedDocClass - update] error: ' + JSON.stringify(err));
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, err);
            } else {

                // Remove the document cached by dbCoreClass, since we're not going to ever lookup by _id.
                // Instead, we'll be looking for the specially-crafted key (see below).

                redisClass.del(req, updated_doc._id);
                konsole.log(req, '[SharedDocClass - update] removed document from Redis: ' + updated_doc._id);

                // Set the new shared document
                redisClass.set(req, shared_doc_key, JSON.stringify(updated_doc), function XCSSharedDocClassUpdateDocumentRedisCacheCallback(err) {
                    if (err) {
                        konsole.error(req, '[SharedDocClass - update] error: ' + JSON.stringify(err));
                    } else {
                        if (unitTestUUID) {
                            konsole.log(req, '[SharedDocClass - update] unit test ' + doc_type + ' document cached to Redis: ' + shared_doc_key);
                        } else {
                            konsole.log(req, '[SharedDocClass - update] default ' + doc_type + ' document cached to Redis: ' + shared_doc_key);
                        }
                    }

                    // [Tito - DEBUG]
                    // <rdar://problem/19376420> Can't add Xcode Server in Xcode preferences
                    // Is the settings doc out-of-sync between Redis and CouchDB?

                    self.printSettingsFromCouchAndRedis(req, function () {
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb, null, updated_doc);
                    });
                });
            }
        });

    });

};

XCSSharedDocClass.prototype.printSettingsFromCouchAndRedis = function printSettingsFromCouchAndRedis(req, cb) {

    var couchDBDoc,
        redisDoc;

    // Retrieve from CouchDB
    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentSettings, k.XCSDesignDocumentViewAllSettings, {
        include_docs: true,
        key: k.XCSDesignDocumentSettings
    }, function DBCSetandVerifyTinyIDFindTempTinyIDCallback(err, docs) {
        if (err && err.status !== 404) {
            konsole.error(req, '[DEBUG - printSettingsFromCouchAndRedis - CouchDB] error: ' + JSON.stringify(err));
        } else {
            if (docs.length > 0) {
                couchDBDoc = docs[0];
            }
        }

        // Retrieve from Redis
        redisClass.get(req, k.XCSDesignDocumentSettings, function (err, reply) {
            if (err) {
                konsole.error(req, '[DEBUG - printSettingsFromCouchAndRedis - Redis] error: ' + JSON.stringify(err));
            } else {
                if (reply) {
                    redisDoc = JSON.parse(reply);
                }
            }

            if (couchDBDoc && redisDoc) {
                if (couchDBDoc[k.XCSServiceEnabledKey] !== redisDoc[k.XCSServiceEnabledKey]) {
                    konsole.error(req, '*****************************[ HIT BUG!: <rdar://problem/19376420> Can\'t add Xcode Server in Xcode preferences ]***************************************');
                    konsole.error(req, '[DEBUG - printSettingsFromCouchAndRedis] Settings doc is NOT in sync!!!');
                    konsole.error(req, '[DEBUG - printSettingsFromCouchAndRedis - CouchDB] settings: ' + JSON.stringify(couchDBDoc, null, 4));
                    konsole.error(req, '[DEBUG - printSettingsFromCouchAndRedis - Redis] settings: ' + JSON.stringify(redisDoc, null, 4));
                    konsole.error(req, '*****************************[ HIT BUG!: <rdar://problem/19376420> Can\'t add Xcode Server in Xcode preferences ]***************************************');
                }
            }

            return xcsutil.safeCallback(cb);
        });

    });

};

/* Module exports */

module.exports = new XCSSharedDocClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function xcsSharedDocClassRetrieveDocumentFromCouchDB(req, doc_type, body, loadFromCouchDB, shared_doc_key, xcsSharedDocClass, cb) {

    xcsutil.requireCallback(cb);

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    if (unitTestUUID) {
        body[k.XCSUnitTestProperty] = unitTestUUID;
    }

    dbCoreClass.findOrCreateDefaultDocument(req, doc_type, body, loadFromCouchDB, function XCSSharedDocClassFindOrCreateDefaultSharedDocumentFindDocument(err, doc, wasCreated) {
        if (err) {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            // Remove the document cached by dbCoreClass, since we're not going to ever lookup by _id.
            // Instead, we'll be looking for the specially-crafted key (see below).

            redisClass.del(req, doc._id);
            konsole.log(req, '[SharedDocClass - findOrCreateDefaultSharedDocument] removed ' + doc_type + ' document from Redis: ' + doc._id);

            if (unitTestUUID) {
                var redisClient = redisClass.client();
                redisClient.setex(shared_doc_key, k.XCSUnitTestTTLInSeconds, JSON.stringify(doc));
                konsole.log(req, '[SharedDocClass - findOrCreateDefaultSharedDocument] unit test ' + doc_type + ' document cached to Redis: ' + shared_doc_key);
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, err, doc, wasCreated);
            } else {
                redisClass.set(req, shared_doc_key, JSON.stringify(doc), function XCSSharedDocClassFindOrCreateDefaultSharedDocumentRedisCacheCallback(err) {
                    if (err) {
                        konsole.error(req, '[SharedDocClass - findOrCreateDefaultSharedDocument] error: ' + JSON.stringify(err));
                    } else {
                        konsole.log(req, '[SharedDocClass - findOrCreateDefaultSharedDocument] default document cached to Redis: ' + shared_doc_key);
                    }
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, null, doc, wasCreated);
                });
            }
        }
    });

}