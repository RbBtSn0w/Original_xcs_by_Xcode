/*
    XCSDBCoreClass
    A class dedicated to interact with CouchDB and redisClass.
*/

'use strict';

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    async = require('async');

var xcs_db = require('./xcsdb.js'),
    Errors = require('../util/error.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('./redisClass.js');

/* XCSDBCoreClass object */

function XCSDBCoreClass() {}

XCSDBCoreClass.prototype.createDocument = function XCSDBCoreClassCreateDocument(req, doc_type, body, cb) {
    cb = xcsutil.callback(cb);

    var log = logger.withRequest(req),
        functionTitle = '[dbCoreClass - createDocument] create document of type: ' + doc_type;

    log.debug('Creating document of type', doc_type);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var temp_doc_type = doc_type + '_temp',
        self = this;

    if (!body) {
        return cb(new Errors.BadRequest('Could not create document because no body was provided.'));
    }

    // Set the document type
    body.doc_type = temp_doc_type;

    async.waterfall([

    function DBCCreateDocumentAddDocument(callback) {
            xcs_db.insert(body, function DBCCreateDocumentAddDocumentCallback(err, newPartialDocument) {
                if (err) {
                    return xcsDBCoreClassNanoErrorHandler(req, err, err.message, callback);
                } else {
                    callback(null, newPartialDocument);
                }
            });
    },
    function DBCCreateDocumentFindPartialDocument(newPartialDocument, callback) {
            newPartialDocument = xcsutil.formalizeIDAndRev(newPartialDocument);

            log.debug('Finding the partial', doc_type, 'document just created with ID:', newPartialDocument._id);

            self.findDocumentWithUUIDUsingOptionalCaching(req, newPartialDocument._id, temp_doc_type, false, callback);
    },
    function (doc, callback) {
            xcsDBCoreClassSetandVerifyTinyID(req, doc, temp_doc_type, self, callback);
    },
    function DBCCreateDocumentUpdateDocumentTinyID(newUpdatedDoc, callback) {
            // Set the doc_type to be a real document type that was requested
            newUpdatedDoc.doc_type = doc_type;

            log.debug('Tiny ID assigned to', newUpdatedDoc._id + ', setting intended doc_type of', doc_type);

            self.updateDocumentWithUUID(req, newUpdatedDoc._id, newUpdatedDoc, false, doc_type, function DBCCreateDocumentUpdateDocumentTinyIDCallback(err, latestUpdatedDoc) {
                if (err) {
                    log.error('Error trying to update document with correct doc_type:', err);
                    return callback(new Errors.Internal("Could not create new document. Please try again."));
                } else {
                    if (req) {
                        return callback(null, 'https://' + req.headers.host + '/' + doc_type + '/' + latestUpdatedDoc._id, latestUpdatedDoc);
                    } else {
                        return callback(null, null, latestUpdatedDoc);
                    }

                }
            });
    }
], function DBCCreateDocumentFinalizer(err, url, latestUpdatedDoc) {
        if (err) {
            log.error('Error while creating document:', err);
            return cb(err);
        } else {
            return cb(null, url, latestUpdatedDoc);
        }
    });

};

XCSDBCoreClass.prototype.listAllDocuments = function XCSDBCoreClassListAllDocuments(req, doc_type, cb) {
    var log = logger.withRequest(req),
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        designDocName = k.XCSDesignDocumentAll,
        viewName = k.XCSDesignDocumentViewAllByType,
        functionTitle,
        query = {
            include_docs: true
        };

    log.debug('Listing all documents with doc_type', doc_type);

    if (unitTestUUID) {
        functionTitle = '[dbCoreClass - listAllDocuments] find unit test documents of type ' + doc_type + ' using view: ' + designDocName + '/' + viewName;
    } else {
        functionTitle = '[dbCoreClass - listAllDocuments] find documents of type ' + doc_type + ' using view: ' + designDocName + '/' + viewName;
    }

    xcsutil.requireCallback(cb);

    if (!doc_type) {
        return cb(new Errors.BadRequest("Could not list all documents because no document type was provided."));
    }

    if (unitTestUUID) {
        query.startkey = [unitTestUUID, doc_type];
        query.endkey = [unitTestUUID, doc_type, {}];
    } else {
        query.startkey = [doc_type];
        query.endkey = [doc_type, {}];
    }

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    xcs_db.view(designDocName, viewName, query, function DBCListAllDocumentsCallback(err, body) {
        if (err) {
            return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
        } else {
            log.debug('Found', body.rows.length, 'documents with type', doc_type);
            if (body.rows.length) {
                var docs;
                if (query.include_docs === true) {
                    docs = body.rows.map(function DBCListAllDocumentsIterateResults(row) {
                        return row.doc;
                    });
                } else if (query.group_level) {
                    docs = body.rows;
                } else {
                    docs = body.rows.map(function DBCListAllDocumentsIteratePartialResults(row) {
                        return row.value;
                    });
                }

                return cb(null, docs);
            } else {
                return cb(new Errors.NotFound('Could not find any "' + doc_type + '" documents.'), []);
            }
        }
    });

};

XCSDBCoreClass.prototype.findDocumentWithUUIDUsingOptionalCaching = function XCSDBCoreClassFindDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, shouldCache, cb) {
    var log = logger.withRequest(req),
        findByTinyID = (k.XCSTinyIDLength === doc_UUID.length);

    var functionTitle;
    if (findByTinyID) {
        functionTitle = '[dbCoreClass - findDocumentWithUUIDUsingOptionalCaching] find ' + doc_type + ' document with tinyID: ' + doc_UUID + '. Should cache?: ' + shouldCache;
    } else {
        functionTitle = '[dbCoreClass - findDocumentWithUUIDUsingOptionalCaching] find ' + doc_type + ' document with UUID: ' + doc_UUID + '. Should cache?: ' + shouldCache;
    }

    log.debug('Finding', doc_type, 'document with', findByTinyID ? 'tiny ID' : 'ID', doc_UUID, shouldCache ? 'and caching.' : 'and not caching.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (shouldCache) {
        redisClass.get(req, doc_UUID, function DBCFindDocumentWithUUIDUsingOptionalCachingRedisGet(err, reply) {
            if (err || !reply) {
                log.debug('Could not find document', doc_UUID, 'in Redis. Falling back to CouchDB.');
                xcsDBCoreClassFindDocument(req, doc_UUID, doc_type, shouldCache, findByTinyID, cb);
            } else {
                log.debug('Found document', doc_UUID, 'in Redis cache.');

                var data = JSON.parse(reply);
                return xcsutil.safeCallback(cb, null, data);
            }
        });
    } else {
        xcsDBCoreClassFindDocument(req, doc_UUID, doc_type, shouldCache, findByTinyID, cb);
    }

};

XCSDBCoreClass.prototype.findDocumentWithUUID = function XCSDBCoreClassFindDocumentWithUUID(req, doc_UUID, doc_type, cb) {
    var self = this;
    self.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

XCSDBCoreClass.prototype.findDocumentsWithQuery = function XCSDBCoreClassFindDocumentsWithQuery(req, design_name, view_name, query, cb) {
    cb = xcsutil.callback(cb);
    var functionTitle = '[dbCoreClass - findDocumentsWithQuery] find documents using view: ' + design_name + '/' + view_name;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var queryName = design_name + '/' + view_name,
        docs,
        log = logger.withRequest(req);

    log.debug('Finding CouchDB documents using view', queryName, 'with query', JSON.stringify(query, null, 4));

    xcs_db.view(design_name, view_name, query, function DBCFindDocumentsWithQueryFindDocument(err, body) {
        if (err) {
            var reason = err.message + ': ' + design_name + '/' + view_name;
            return xcsDBCoreClassNanoErrorHandler(req, err, reason, cb);
        } else {
            if (body.rows.length) {
                log.debug('Found', body.rows.length, 'documents from query on', queryName);
                if (query.include_docs === true) {
                    docs = body.rows.map(function DBCFindDocumentsWithQueryIterateResults(row) {
                        // Save the record in Redis
                        var stringifiedObj = JSON.stringify(row.doc);
                        redisClass.set(req, row.id, stringifiedObj, function DBCFindDocumentsWithQueryRedisCache(err) {
                            if (err) {
                                log.warn('Failed to cache document', row.id, 'to Redis:', err);
                            }
                        });
                        return row.doc;
                    });
                } else if (query.group_level) {
                    docs = body.rows;
                } else {
                    docs = body.rows.map(function DBCFindDocumentsWithQueryIteratePartialResults(row) {
                        return row.value;
                    });
                }
                log.debug('Done processing CouchDB query on', queryName);

                return cb(null, docs);
            } else {
                log.debug('No documents found from query on', queryName);
                return cb(new Errors.NotFound('Could not find any documents that match the request.'), []);
            }
        }
    });

};

XCSDBCoreClass.prototype.findOrCreateDefaultDocument = function XCSDBCoreClassFindOrCreateDefaultDocument(req, doc_type, body, loadFromCouchDB, cb) {
    var redisClient = redisClass.client(),
        log = logger.withRequest(req),
        query = {
            include_docs: true
        },
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        functionTitle,
        self = this;

    if (unitTestUUID) {
        query.key = unitTestUUID;
        log.debug('Finding', doc_type, 'document with key', unitTestUUID, loadFromCouchDB ? 'from CouchDB.' : 'from Redis.');
        functionTitle = '[dbCoreClass - findOrCreateDefaultDocument] find ' + doc_type + ' document with key: ' + unitTestUUID + ' (loadFromCouchDB: ' + loadFromCouchDB + ')';
    } else {
        query.key = doc_type;
        log.debug('Finding default', doc_type, 'document', loadFromCouchDB ? 'from CouchDB.' : 'from Redis.');
        functionTitle = '[dbCoreClass - findOrCreateDefaultDocument] find the default ' + doc_type + ' document (loadFromCouchDB: ' + loadFromCouchDB + ')';
    }

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (loadFromCouchDB) {
        xcsDBCoreClassFindOrCreateDocumentInCouchDB(req, doc_type, query, body, self, cb);
    } else {
        redisClient.get(query.key, function DBCFindOrCreateDefaultDocumentRedisGet(err, reply) {
            if (err || !reply) {
                log.debug('Could not load document', query.key, 'from Redis. Falling back to CouchDB.');
                xcsDBCoreClassFindOrCreateDocumentInCouchDB(req, doc_type, query, body, self, cb);
            } else {
                log.debug(doc_type, 'document found in Redis.');

                return xcsutil.safeCallback(cb, null, JSON.parse(reply));
            }
        });
    }

};

XCSDBCoreClass.prototype.updateDocumentWithUUID = function XCSDBCoreClassUpdateDocumentWithUUID(req, doc_UUID, changes, needsPatching, doc_type, cb) {

    var functionTitle = '[dbCoreClass - updateDocumentWithUUID] update ' + doc_type + ' document: ' + doc_UUID;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    xcsDBCoreClassUpdateDocument(req, doc_UUID, doc_type, changes, needsPatching, cb);

};

XCSDBCoreClass.prototype.bulkUpdateDocuments = function XCSDBCoreClassBulkUpdateDocuments(req, docs, change, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[dbCoreClass - bulkUpdateDocuments] bulk update documents: ' + docs.length + ' documents';

    log.debug('Bulk updating', docs.length, 'documents.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (change) {
        docs.forEach(function DBCBulkUpdateDocumentsIterate(doc) {
            Object.keys(change).forEach(function DBCBulkUpdateDocumentsIterateCallback(key) {
                doc[key] = change[key];
            });
        });
    }

    var redisClient = redisClass.client();

    function xcsDBCoreClassLogError(err) {
        if (err) {
            log.warn('Error caching bulk documents to Redis:', err);
        }
    }

    xcs_db.bulk({
        docs: docs
    }, function DBCBulkUpdateDocumentsBulk(err, response) {
        if (err) {
            return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
        } else {
            log.debug('Successfully bulk updated', docs.length, 'documents.');

            if (redisClient) {
                for (var i = 0; i < docs.length; i++) {
                    var doc = docs[i];
                    redisClass.set(req, doc._id, JSON.stringify(doc), xcsDBCoreClassLogError);
                }
            }



            return xcsutil.safeCallback(cb, null, response);
        }
    });
};

XCSDBCoreClass.prototype.removeDocument = function XCSDBCoreClassRemoveDocument(req, doc_UUID, doc_rev, cb) {



    var log = logger.withRequest(req),
        functionTitle = '[dbCoreClass - removeDocument] remove document: ' + doc_UUID + ' (rev ' + doc_rev + ')';

    log.debug('Removing document', doc_UUID, 'with rev', doc_rev);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    xcsDBCoreClassDestroyDocument(req, doc_UUID, doc_rev, cb);
};

XCSDBCoreClass.prototype.removeAll = function XCSDBCoreClassRemoveAll(req, design_name, view_name, query, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[dbCoreClass - removeAll] remove all documents using: ' + design_name + ' / ' + view_name,
        self = this;

    log.debug('Removing all documents in view:', design_name + '/' + view_name);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.findDocumentsWithQuery(req, design_name, view_name, query, function DBCRemoveAllFindDocument(err, docs) {
        if (err) {

            return xcsutil.safeCallback(cb, err);
        } else {
            if (0 === docs.length) {

                return xcsutil.safeCallback(cb, null);
            } else {
                // Batch delete
                var docs_to_delete = [];
                docs.forEach(function DBCRemoveAllIterate(doc) {
                    if (doc) {
                        var deleted_doc = {};
                        if (query.include_docs === true) {
                            deleted_doc._id = doc._id;
                            deleted_doc._rev = doc._rev;
                            deleted_doc._deleted = true;
                        } else {
                            deleted_doc = doc;
                            deleted_doc._deleted = true;
                        }
                        docs_to_delete.push(deleted_doc);
                        redisClass.del(req, deleted_doc._id);
                    }
                });

                xcs_db.bulk({
                    docs: docs_to_delete
                }, function DBCRemoveAllBulkDelete(err) {
                    if (err) {
                        var reason = err.message + ': ' + design_name + '/' + view_name;
                        return xcsDBCoreClassNanoErrorHandler(req, err, reason, cb);
                    } else {

                        return xcsutil.safeCallback(cb);
                    }
                });
            }
        }
    });

};

XCSDBCoreClass.prototype.removeUnitTestDocs = function XCSDBCoreClassRemoveUnitTestDocs(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[dbCoreClass removeUnitTestDocs] remove unit test docs',
        self = this;

    log.info('Removing all unit test documents.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        query = {
            include_docs: false
        };

    if (unitTestUUID) {
        query.key = unitTestUUID;
    } else {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the property "UnitTestUUID" has not been specified'
        });

    }

    self.removeAll(req, k.XCSDesignDocumentUnitTest, k.XCSDesignDocumentViewAllUnitTests, query, function DBCRemoveUnitTestDocs(err) {
        xcsutil.profilerSummary(req);


        if (err && (404 === err.status)) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });
};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSDBCoreClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function xcsDBCoreClassNanoErrorHandler(req, err, reason, cb) {
    var error = {};

    if (err.statusCode && err.statusCode === 'ECONNREFUSED') {
        error = new Errors.CouchDBUnavailable();
    } else if (err.statusCode && err.statusCode === 409) {
        error = new Errors.Conflict('The document could not be updated because it conflicted with existing data.');
    } else if (err.statusCode && err.statusCode === 404 && err.message === 'missing_named_view') {
        error = new Errors.Internal("Could not perform request because the database is not set up correctly. " +
            "Please try setting up your server again by running 'sudo xcrun xcscontrol --initialize' from Terminal.");
    } else if (err.statusCode && err.statusCode === 404) {
        error = new Errors.NotFound(reason.toString());
    } else {
        error = new Errors.Internal('Could not perform request because the database produced an error: ' + err.message);
    }

    return xcsutil.safeCallback(cb, error);
}

function xcsDBCoreClassSetandVerifyTinyID(req, doc, doc_type, xcsDBCoreClass, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[dbCoreClass - xcsDBCoreClassSetandVerifyTinyID] set and verify the tinyID';

    log.debug('Setting and verifying tiny ID on document:', doc._id);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var tinyID,
        self = xcsDBCoreClass;

    async.waterfall([
        xcsutil.makeUUID,
        function DBCSetandVerifyTinyIDUpdateDocumentTempTinyID(UUID, callback) {
            tinyID = UUID.substring(0, k.XCSTinyIDLength);

            // Update the document with the tinyID and make sure there aren't any collisions
            doc.tinyID = tinyID;

            log.debug('Updating document', doc._id, 'with tiny ID', doc.tinyID);

            self.updateDocumentWithUUID(req, doc._id, doc, false, doc_type, function DBCSetandVerifyTinyIDUpdateDocumentTinyID(err, updatedDoc) {
                if (err) {
                    callback(err);
                } else {
                    if (err || (tinyID !== updatedDoc.tinyID)) {
                        log.error('Could not assign tiny ID to document. Error:', err);
                        callback(new Errors.Internal('Could not create new document properly. Please try again.'));
                    } else {
                        callback(null, updatedDoc);
                    }
                }
            });
        },
        function DBCSetandVerifyTinyIDFindTempTinyID(updatedDoc, callback) {
            log.debug('Verifying that tiny ID', updatedDoc.tinyID, 'for document', updatedDoc._id, 'is unique.');

            self.findDocumentsWithQuery(req, k.XCSDesignDocumentAll, k.XCSDesignDocumentViewAllUUIDs, {
                include_docs: true,
                startkey: [updatedDoc.tinyID],
                endkey: [updatedDoc.tinyID, {}]
            }, function DBCSetandVerifyTinyIDFindTempTinyIDCallback(err, docs) {
                callback(err, docs);
            });
        }
    ], function DBCSetandVerifyTinyIDFinalizer(err, docs) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            if (docs.length !== 1) {
                log.debug('Tiny ID', tinyID, 'is not unique. Trying again.');
                // Conflict detected. Try to generate a new tinyID and update the document once more.
                // Them detect against potential collisions.

                xcsDBCoreClassSetandVerifyTinyID(req, doc, doc_type, self, cb);
            } else {
                xcsutil.profilerSummary(req);
                return xcsutil.safeCallback(cb, null, docs[0]);
            }
        }
    });
}

function xcsDBCoreClassCacheDocumentIfRequired(req, doc_UUID, existingDocument, shouldCache, cb) {
    var log = logger.withRequest(req);

    if (shouldCache && existingDocument) {
        log.debug('Found', existingDocument.doc_type, 'document:', doc_UUID);
        redisClass.set(req, existingDocument._id, JSON.stringify(existingDocument), function DBCFindDocumentWithUUIDUsingOptionalCachingRedisCache(err) {
            if (err) {
                log.warn('Could not cache document', doc_UUID + ':', err);
            }

            return xcsutil.safeCallback(cb, null, existingDocument);
        });
    } else {
        log.debug('Found document, but not caching.');

        return xcsutil.safeCallback(cb, null, existingDocument);
    }
}

function xcsDBCoreClassFindDocument(req, doc_UUID, doc_type, shouldCache, findByTinyID, cb) {
    var log = logger.withRequest(req);

    if (findByTinyID) {
        log.debug('Finding', doc_type, 'document by tinyID', doc_UUID, 'in CouchDB.');
        xcsDBCoreClassFindDocumentWithTinyIDInCouchDB(req, doc_UUID, doc_type, shouldCache, cb);
    } else {
        log.debug('Finding', doc_type, 'document by ID', doc_UUID, 'in CouchDB.');
        xcsDBCoreClassFindDocumentWithUUIDInCouchDB(req, doc_UUID, shouldCache, cb);
    }
}

function xcsDBCoreClassFindDocumentWithUUIDInCouchDB(req, doc_UUID, shouldCache, cb) {
    xcs_db.get(doc_UUID, function xcsDBCFindDocumentWithUUIDInCouchDBCallback(err, existingDocument) {
        if (err) {
            var reason = 'Error retrieving document \'' + doc_UUID + '\': ' + err.message;
            return xcsDBCoreClassNanoErrorHandler(req, err, reason, cb);
        } else {
            xcsDBCoreClassCacheDocumentIfRequired(req, doc_UUID, existingDocument, shouldCache, cb);
        }
    });
}

function xcsDBCoreClassFindDocumentWithTinyIDInCouchDB(req, doc_UUID, doc_type, shouldCache, cb) {
    var log = logger.withRequest(req),
        error = {},
        query = {
            include_docs: true,
            limit: 1
        };

    if (doc_type) {
        query.startkey = [doc_UUID, doc_type];
        query.endkey = [doc_UUID, doc_type, {}];
    } else {
        query.startkey = [doc_UUID];
        query.endkey = [doc_UUID, {}];
    }

    xcs_db.view(k.XCSDesignDocumentAll, k.XCSDesignDocumentViewAllUUIDs, query, function DBCFindDocumentWithTinyIDInCouchDBFindDocument(err, reply) {
        if (err) {
            return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
        } else {
            if (0 === reply.rows.length) {
                log.error('No document found with tiny ID:', doc_UUID);

                error.status = 404;
                error.message = 'Not found';
                return xcsutil.safeCallback(cb, error);
            }

            var existingDocument = reply.rows[0].doc;

            xcsDBCoreClassCacheDocumentIfRequired(req, doc_UUID, existingDocument, shouldCache, cb);
        }
    });
}

function xcsDBCoreClassFindOrCreateDocumentInCouchDB(req, doc_type, query, body, xcsDBCoreClass, cb) {
    var log = logger.withRequest(req),
        view_name;

    if (k.XCSDesignDocumentACL === doc_type) {
        view_name = k.XCSDesignDocumentViewAllACLs;
    } else if (k.XCSDesignDocumentVersion === doc_type) {
        view_name = k.XCSDesignDocumentViewAllVersions;
    } else if (k.XCSDesignDocumentSettings === doc_type) {
        view_name = k.XCSDesignDocumentViewAllSettings;
    } else {
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the document type "' + doc_type + '" is not allowed'
        });
    }

    xcsDBCoreClass.findDocumentsWithQuery(req, doc_type, view_name, query, function DBCFindOrCreateDefaultDocumentFindDocument(err, docs) {
        if (err && (404 !== err.status)) {
            log.error('Could not try to find document:', err);

            return xcsutil.safeCallback(cb, err);
        } else {
            if (0 === docs.length) {
                xcsDBCoreClass.createDocument(req, doc_type, body, function DBCFindOrCreateDefaultDocumentCreateDocument(err, url, doc) {
                    if (err) {

                        return xcsutil.safeCallback(cb, err);
                    } else {
                        log.debug('Default', doc_type, 'document created in CouchDB.');

                        return xcsutil.safeCallback(cb, null, doc, true);
                    }
                });
            } else {
                log.debug('Default', doc_type, 'document found in CouchDB.');

                return xcsutil.safeCallback(cb, null, docs[0]);
            }
        }
    });
}

function xcsDBCoreClassUpdateDocument(req, doc_UUID, doc_type, changes, needsPatching, cb) {
    var log = logger.withRequest(req);
    log.debug('Updating', doc_type, 'document', doc_UUID, '(patching? ' + needsPatching + ')');

    xcs_db.get(doc_UUID, function DBCUpdateDocumentWithUUIDFindDocument(err, document) {
        if (err) {
            log.error('Error finding document to update:', err);
            return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
        } else {

            if (needsPatching) {
                // Patch the object with the changes
                changes = xcsutil.patchDocumentWithObject(document, changes);
            } else {
                // Inject the revision before we update the document
                changes._rev = document._rev;
            }

            xcs_db.insert(changes, doc_UUID, function DBCUpdateDocumentWithUUIDAddDocument(err) {
                if (err) {
                    if (409 === err.status) {
                        log.debug('Got a conflict trying to update', doc_UUID + ', so retrying.');
                        xcsDBCoreClassUpdateDocument(req, doc_UUID, doc_type, changes, needsPatching, cb);
                    } else {
                        log.error('Error updating document', doc_UUID + ':', err);
                        return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
                    }
                } else {
                    log.debug('Updated', doc_UUID, 'successfully, fetching to flush update and cache.');
                    // !!! Issue: https://github.com/dscape/nano/issues/210
                    xcs_db.get(doc_UUID, {
                        stale: 'update_after'
                    }, function DBCUpdateDocumentWithUUIDFindDocumentUpdateAfter(err, existingDocument) {
                        if (err) {
                            log.error('Error finding document after update:', err);
                            return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
                        } else {
                            redisClass.set(req, doc_UUID, JSON.stringify(existingDocument), function DBCUpdateDocumentWithUUIDRedisCache(err) {
                                if (err) {
                                    log.error('Error caching updated document to Redis:', err);
                                } else {
                                    log.debug('Successfully cached', doc_type, 'document with ID', doc_UUID, 'to Redis.');
                                }
                                return xcsutil.safeCallback(cb, null, existingDocument);
                            });
                        }
                    });
                }
            });
        }

    });
}

function xcsDBCoreClassDestroyDocument(req, doc_UUID, doc_rev, cb) {

    var revWasSpecified = (null !== doc_rev);

    function destroy() {
        xcs_db.destroy(doc_UUID, doc_rev, function DBCDestroyDocumentCallback(err) {
            if (err) {
                if (404 === err.statusCode) {
                    redisClass.del(req, doc_UUID);
                    return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
                } else if (409 === err.statusCode) {
                    if (revWasSpecified) {
                        return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
                    } else {
                        findDocUUIDAndTryRemoving();
                    }
                } else {
                    return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
                }
            } else {
                redisClass.del(req, doc_UUID);

                return xcsutil.safeCallback(cb, null);
            }
        });
    }

    function findDocUUIDAndTryRemoving() {
        xcsDBCoreClassFindDocumentWithUUIDInCouchDB(req, doc_UUID, false, function (err, doc) {
            if (err) {
                return xcsutil.safeCallback(cb, err);
            } else {
                doc_rev = doc._rev;
                destroy();
            }
        });
    }

    if (doc_rev) {
        destroy();
    } else {
        findDocUUIDAndTryRemoving();
    }
}