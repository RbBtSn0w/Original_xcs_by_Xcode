/*
    XCSSharedDocClass
    A class dedicated to manipulate 'singleton' documents: ACL, Settings and Version.
*/

'use strict';

var async = require('async');

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('./redisClass.js'),
    dbCoreClass = require('./dbCoreClass.js');

var findOrCreateDefaultSharedDocumentQueue;

/* XCSSharedDocClass object */

function XCSSharedDocClass() {}

XCSSharedDocClass.prototype.findOrCreateDefaultSharedDocument = function XCSSharedDocClassFindOrCreateDefaultSharedDocument(req, shared_doc_key, doc_type, body, loadFromCouchDB, cb) {

    xcsutil.requireCallback(cb);

    var log = logger.withRequest(req),
        self = this;

    log.debug('Finding or creating the', doc_type, 'document:', shared_doc_key, loadFromCouchDB ? 'bypassing Redis.' : 'by checking Redis first.');

    // Create a queue object with single concurrency (if needed)
    if (!findOrCreateDefaultSharedDocumentQueue) {
        log.debug('Creating shared document queue, as it does not already exist for this process.');
        findOrCreateDefaultSharedDocumentQueue = async.queue(function (task, callbackQueue) {
            var log = logger.withRequest(task.req);

            if (task.loadFromCouchDB) {
                log.debug('Looking up', task.doc_type, 'document without checking Redis.');
                xcsSharedDocClassRetrieveDocumentFromCouchDB(task.req, task.doc_type, task.body, true, task.shared_doc_key, task.self, callbackQueue);
            } else {
                log.debug('Checking Redis for cached version of', task.doc_type, 'document.');
                redisClass.get(task.req, task.shared_doc_key, function XCSSharedDocClassFindOrCreateDefaultSharedDocumentRedisGetSharedKey(err, reply) {
                    if (err || !reply) {
                        log.debug('Could not find', task.doc_type, 'document in Redis, falling back to CouchDB.');
                        xcsSharedDocClassRetrieveDocumentFromCouchDB(task.req, task.doc_type, task.body, true, task.shared_doc_key, task.self, callbackQueue);
                    } else {
                        log.debug('Found', task.doc_type, 'document in Redis.');
                        return callbackQueue(null, JSON.parse(reply));
                    }
                });
            }

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
            log.error('Error getting document', shared_doc_key, err);

            return xcsutil.safeCallback(cb, err);
        } else {

            return xcsutil.safeCallback(cb, null, sharedDocument);
        }
    });

};

XCSSharedDocClass.prototype.list = function list(req, doc_type, view_name, query, cb) {

    xcsutil.requireCallback(cb);


    var log = logger.withRequest(req),
        functionTitle = '[SharedDocClass - list] ' + req.method + ' ' + req.url;

    log.info('Listing documents of type:', doc_type);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    dbCoreClass.listAllDocuments(req, doc_type, function XCSSharedDocClassListDocuments(err, docs) {

        // !!! Not finding documents doesn't mean it's an error. Let's report true errors instead.


        if (err && err.status !== 404) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, docs);
        }

    });

};

XCSSharedDocClass.prototype.update = function update(req, shared_doc_key, doc_type, defaults, changes, cb) {

    xcsutil.requireCallback(cb);

    var functionTitle,
        log = logger.withRequest(req);

    log.debug('Updating the', doc_type, 'document:', shared_doc_key);

    if (req) {
        functionTitle = '[SharedDocClass - update] ' + req.method + ' ' + req.url;
    } else {
        functionTitle = '[SharedDocClass - update]';
    }

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!changes) {
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the changes have not been specified'
        });
    }

    var loadFromCouchDB = false,
        self = this;

    // Retrieve the shared document to be patched
    self.findOrCreateDefaultSharedDocument(req, shared_doc_key, doc_type, defaults, loadFromCouchDB, function XCSSharedDocClassUpdateFindDocument(err, doc) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        }

        // Replace the property with the new one
        for (var key in changes) {
            if (changes.hasOwnProperty(key)) {
                doc[key] = changes[key];
            }
        }

        log.debug('Updating', doc_type, 'document with contents:', JSON.stringify(doc, null, 4));

        dbCoreClass.updateDocumentWithUUID(req, doc._id, doc, false, doc_type, function XCSSharedDocClassUpdateDocument(err, updated_doc) {
            if (err) {
                log.error('Error updating', doc_type, 'document:', err);

                return xcsutil.safeCallback(cb, err);
            } else {

                // Remove the document cached by dbCoreClass, since we're not going to ever lookup by _id.
                // Instead, we'll be looking for the specially-crafted key (see below).

                redisClass.del(req, updated_doc._id);

                // Set the new shared document
                redisClass.set(req, shared_doc_key, JSON.stringify(updated_doc), function XCSSharedDocClassUpdateDocumentRedisCacheCallback(err) {
                    if (err) {
                        log.error('Error caching new', doc_type, 'document:', err);
                    }

                    return xcsutil.safeCallback(cb, null, updated_doc);
                });
            }
        });

    });

};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSSharedDocClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function xcsSharedDocClassRetrieveDocumentFromCouchDB(req, doc_type, body, loadFromCouchDB, shared_doc_key, xcsSharedDocClass, cb) {

    xcsutil.requireCallback(cb);

    var log = logger.withRequest(req),
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    if (unitTestUUID) {
        body[k.XCSUnitTestProperty] = unitTestUUID;
    }

    dbCoreClass.findOrCreateDefaultDocument(req, doc_type, body, loadFromCouchDB, function XCSSharedDocClassFindOrCreateDefaultSharedDocumentFindDocument(err, doc) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            // Remove the document cached by dbCoreClass, since we're not going to ever lookup by _id.
            // Instead, we'll be looking for the specially-crafted key (see below).

            redisClass.del(req, doc._id);
            log.debug('Removed', doc_type, 'shared document from Redis:', doc._id);

            if (unitTestUUID) {
                var redisClient = redisClass.client();
                redisClient.setex(shared_doc_key, k.XCSUnitTestTTLInSeconds, JSON.stringify(doc));
                log.debug('Unit test', doc_type, 'document cached to Redis under key', shared_doc_key);

                return xcsutil.safeCallback(cb, err, doc);
            } else {
                redisClass.set(req, shared_doc_key, JSON.stringify(doc), function XCSSharedDocClassFindOrCreateDefaultSharedDocumentRedisCacheCallback(err) {
                    if (err) {
                        log.warn('Could not cache shared document', shared_doc_key, err);
                    } else {
                        log.debug('Shared document', shared_doc_key, 'successfully cached to Redis.');
                    }

                    cb(null, doc);
                });
            }
        }
    });

}