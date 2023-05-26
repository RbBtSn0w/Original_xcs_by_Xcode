'use strict';

var k = require('../constants.js'),
    _ = require('underscore'),
    Promise = require('bluebird'),
    logger = require('../util/logger.js');

var xcs_db = require('./xcsdb.js'),
    Errors = require('../util/error.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('./redisClass.js');

function XCSDBCoreClass() {}

/**
 * Creates a new CouchDB document with specified type and contents.
 *
 * This will also assign a unique tiny ID to the document.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {string} doc_type The intended type of the document.
 * @param {Object} body The contents of the document.
 * @param {function} cb A callback for when the document is created.
 * @returns {Promise} A promise containing a URL and the final created document.
 */
XCSDBCoreClass.prototype.createDocument = function createDocument(req, doc_type, body, cb) {
    const log = logger.withRequest(req);
    xcsutil.snitch(req, '[dbCoreClass - createDocument] create document of type: ' + doc_type);

    return Promise.try(() => {
        log.debug('Creating document of type', doc_type);

        if (!body) {
            throw new Errors.BadRequest('Could not create document because no body was provided.');
        }

        let temp_doc_type = doc_type + '_temp';
        body = _.clone(body);
        body.doc_type = temp_doc_type;

        return xcs_db()
            .then(db => db.insertAsync(body))
            .catch(err => wrapNanoError(req, err, err.message))
            .then(doc => xcsutil.formalizeIDAndRev(doc))
            .tap(doc => log.debug('Finding the partial', doc_type, 'document just created with ID:', doc._id))
            .then(doc => this.findDocumentWithUUIDUsingOptionalCaching(req, doc._id, temp_doc_type, false))
            .then(doc => setAndVerifyTinyID(req, doc, temp_doc_type, this))
            .then(doc => {
                doc.doc_type = doc_type;
                log.debug('Tiny ID', doc.tinyID, 'assigned to', doc._id, ', setting intended doc_type of', doc_type);
                return this.updateDocumentWithUUID(req, doc._id, doc, false, doc_type);
            })
            .then(doc => {
                if (req) {
                    return [`https://${req.headers.host}/${doc_type}/${doc._id}`, doc];
                } else {
                    return [null, doc];
                }
            })
            .catch(err => {
                log.error('Error while creating document:', err);
                throw err;
            });
    }).asCallback(cb, {
        spread: true
    });
};

/**
 * Lists all of the documents in the database of a given type.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {string} doc_type The type of document to list.
 * @param {?function} cb A callback for handling the error or list of documents.
 * @returns {Promise} A promise resolving to the documents that were found.
 */
XCSDBCoreClass.prototype.listAllDocuments = function listAllDocuments(req, doc_type, cb) {
    var log = logger.withRequest(req),
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        designDocName = k.XCSDesignDocumentAll,
        viewName = k.XCSDesignDocumentViewAllByType,
        query = {
            include_docs: true
        };

    log.debug('Listing all documents with doc_type', doc_type);

    if (unitTestUUID) {
        xcsutil.snitch(req, '[dbCoreClass - listAllDocuments] find unit test documents of type ' + doc_type + ' using view: ' + designDocName + '/' + viewName);
    } else {
        xcsutil.snitch(req, '[dbCoreClass - listAllDocuments] find documents of type ' + doc_type + ' using view: ' + designDocName + '/' + viewName);
    }

    return Promise.try(() => {
        if (!doc_type) {
            throw new Errors.BadRequest("Could not list all documents because no document type was provided.");
        }

        if (unitTestUUID) {
            query.startkey = [unitTestUUID, doc_type];
            query.endkey = [unitTestUUID, doc_type, {}];
        } else {
            query.startkey = [doc_type];
            query.endkey = [doc_type, {}];
        }

        return xcs_db()
            .then(db => db.viewAsync(designDocName, viewName, query))
            .catch(err => wrapNanoError(req, err, err.message))
            .then(body => {
                log.debug('Found', body.rows.length, 'documents with type', doc_type);

                if (body.rows.length === 0) {
                    throw new Errors.NotFound(`Could not find any "${doc_type}" documents.`);
                }

                return body.rows.map(row => row.doc);
            });
    }).asCallback(cb && ((err, docs) => cb(err, (err && err.status === 404) ? [] : docs)));
};

/**
 * Finds a document in CouchDB or Redis by either ID or tiny ID, potentially
 * caching the document in Redis once it is found.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {string} doc_UUID The ID or tiny ID of the document to load.
 * @param {?string} doc_type The type of document being loaded.
 * @param {boolean} shouldCache Flag indicating if the document should be cached to Redis once loaded.
 * @param {?function} cb A callback for handling the error or found document.
 * @returns {Promise} A promise resolving to the document that was found.
 */
XCSDBCoreClass.prototype.findDocumentWithUUIDUsingOptionalCaching = function findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, shouldCache, cb) {
    var log = logger.withRequest(req),
        findByTinyID = (k.XCSTinyIDLength === doc_UUID.length);

    if (findByTinyID) {
        xcsutil.snitch(req, '[dbCoreClass - findDocumentWithUUIDUsingOptionalCaching] find ' + doc_type + ' document with tinyID: ' + doc_UUID + '. Should cache?: ' + shouldCache);
    } else {
        xcsutil.snitch(req, '[dbCoreClass - findDocumentWithUUIDUsingOptionalCaching] find ' + doc_type + ' document with UUID: ' + doc_UUID + '. Should cache?: ' + shouldCache);
    }

    return Promise.try(() => {
        log.debug('Finding', doc_type, 'document with', findByTinyID ? 'tiny ID' : 'ID', doc_UUID, shouldCache ? 'and caching.' : 'and not caching.');

        if (shouldCache) {
            return redisClass.get(req, doc_UUID)
                .catch(err => {
                    log.error('Error trying to look up document in Redis:', err);
                    return null; // act like we just got nothing, look up in CouchDB
                })
                .then(reply => {
                    if (reply) {
                        log.debug('Found document', doc_UUID, 'in Redis cache.');
                        var doc = JSON.parse(reply);
                        if (doc.doc_type !== doc_type) {            
                            throw new Errors.NotFound(`Could not find document of type '${doc_type}' matching the given ID.`);        
                        }
                        return doc;
                    } else {
                        log.debug('Could not find document', doc_UUID, 'in Redis. Falling back to CouchDB.');
                        return findDocument(req, doc_UUID, doc_type, shouldCache, findByTinyID);
                    }
                });
        } else {
            return findDocument(req, doc_UUID, doc_type, shouldCache, findByTinyID);
        }
    }).asCallback(cb);
};

/**
 * Finds a document in the database, using the Redis cache if possible.
 *
 * This is a shortcut to {@link findDocumentWithUUIDUsingOptionalCaching} that
 * always uses Redis caching. It should generally be the default way to find a
 * particular document.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {string} doc_UUID The ID or tiny ID of the document to load.
 * @param {?string} doc_type The type of document being loaded.
 * @param {?function} cb A callback for handling the error or found document.
 * @returns {Promise} A promise resolving to the document that was found.
 */
XCSDBCoreClass.prototype.findDocumentWithUUID = function findDocumentWithUUID(req, doc_UUID, doc_type, cb) {
    return this.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

/**
 * Finds documents using a view from a CouchDB design document.
 *
 * Once documents are found, if the full document contents were loaded, each
 * document will also be cached to Redis.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {string} design_name The name of the design document containing the view.
 * @param {string} view_name The name of the view to query.
 * @param {Object} query A JSON object with parameters for the query.
 * @param {?function} cb A callback for handling the error or results of the query.
 * @returns {Promise} A promise resolving to the documents or results found.
 */
XCSDBCoreClass.prototype.findDocumentsWithQuery = function findDocumentsWithQuery(req, design_name, view_name, query, cb) {
    xcsutil.snitch(req, '[dbCoreClass - findDocumentsWithQuery] find documents using view: ' + design_name + '/' + view_name);

    const queryName = design_name + '/' + view_name,
        log = logger.withRequest(req);

    log.debug('Finding CouchDB documents using view', queryName, 'with query', JSON.stringify(query, null, 4));

    return xcs_db()
        .then(db => db.viewAsync(design_name, view_name, query))
        .catch(err => wrapNanoError(req, err, `${err.message}: ${design_name}/${view_name}`))
        .then(body => {
            if (body.rows.length === 0) {
                log.debug('No documents found from query on', queryName);
                throw new Errors.NotFound('Could not find any documents that match the request.');
            }

            log.debug('Found', body.rows.length, 'documents from query on', queryName);

            if (query.include_docs) {
                return cacheAndReturnViewDocuments(req, body);
            } else if (query.group_level) {
                return body.rows;
            } else {
                return body.rows.map(row => row.value || row.id);
            }
        })
        .asCallback(cb && ((err, docs) => cb(err, (err && err.status === 404) ? [] : docs)));
};

/**
 * Tries to find a singleton document of the given type, creating it if it does
 * not already exist.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {string} doc_type The type of document to find or create.
 * @param {Object} body The default contents of the document, in case it needs to be created.
 * @param {boolean} loadFromCouchDB A flag indicating whether to skip looking in Redis for the document.
 * @param {?function} cb A callback for handling the error or the document.
 * @returns {Promise} A promise resolving to the document that was either found or created.
 */
XCSDBCoreClass.prototype.findOrCreateDefaultDocument = function findOrCreateDefaultDocument(req, doc_type, body, loadFromCouchDB, cb) {
    var redisClient = redisClass.client(),
        log = logger.withRequest(req),
        query = {
            include_docs: true
        },
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        self = this;

    if (unitTestUUID) {
        query.key = unitTestUUID;
        log.debug('Finding', doc_type, 'document with key', unitTestUUID, loadFromCouchDB ? 'from CouchDB.' : 'from Redis.');
        xcsutil.snitch(req, '[dbCoreClass - findOrCreateDefaultDocument] find ' + doc_type + ' document with key: ' + unitTestUUID + ' (loadFromCouchDB: ' + loadFromCouchDB + ')');
    } else {
        query.key = doc_type;
        log.debug('Finding default', doc_type, 'document', loadFromCouchDB ? 'from CouchDB.' : 'from Redis.');
        xcsutil.snitch(req, '[dbCoreClass - findOrCreateDefaultDocument] find the default ' + doc_type + ' document (loadFromCouchDB: ' + loadFromCouchDB + ')');
    }

    return Promise.try(() => {
        if (loadFromCouchDB) {
            return findOrCreateDocumentInCouchDB(req, doc_type, query, body, self);
        } else {
            return redisClient.get(query.key)
                .catch(err => log.error('Error trying to load', query.key, 'document from Redis:', err))
                .then(reply => {
                    if (reply) {
                        log.debug(doc_type, 'document found in Redis.');
                        return JSON.parse(reply);
                    } else {
                        log.debug('Could not load document', query.key, 'from Redis. Falling back to CouchDB.');
                        return findOrCreateDocumentInCouchDB(req, doc_type, query, body, self);
                    }
                });
        }
    }).asCallback(cb);
};

/**
 * Updates an existing document in the database.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {string} doc_UUID The ID of the document to update.
 * @param {Object} changes The changes to apply to the document.
 * @param {boolean} needsPatching If true, merge the changes provided into the existing document. If false, overwrite the existing document entirely.
 * @param {string} doc_type The type of document being updated.
 * @param {?function} cb A callback for handling the error or final updated document.
 * @returns {Promise} A promise resolving to the final state of the document.
 */
XCSDBCoreClass.prototype.updateDocumentWithUUID = function updateDocumentWithUUID(req, doc_UUID, changes, needsPatching, doc_type, cb) {
    xcsutil.snitch(req, '[dbCoreClass - updateDocumentWithUUID] update ' + doc_type + ' document: ' + doc_UUID);
    return updateDocument(req, doc_UUID, doc_type, changes, needsPatching).asCallback(cb);
};

/**
 * Fetches and updates many documents in batches.
 *
 * This is useful for when many documents need to be updated at once without loading every document
 * into memory at the same time.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {string[]} keys The IDs of the documents to fetch and update.
 * @param {?integer} batchSize The number of documents to fetch and update at a time. Defaults to 50.
 * @param {function} updater A function to apply the changes to an individual document. Return null to skip the document.
 * @param {?function} cb A callback for handling the error, if any.
 * @returns {Promise} A promise resolving once all documents are updated.
 */
XCSDBCoreClass.prototype.batchUpdateDocuments = function batchUpdateDocuments(req, keys, batchSize, updater, cb) {
    const log = logger.withRequest(req);
    log.debug('Batch updating', keys.length, 'documents.');

    return Promise.try(() => {
        if (!keys || keys.length === 0) {
            return [];
        }

        batchSize = batchSize || 50;
        let keyGroups = xcsutil.groupsOf(keys, batchSize);

        return Promise.each(keyGroups, keys => {
            return xcs_db().then(db => db.fetchAsync({keys}))
                .catch(err => wrapNanoError(req, err, err.message))
                .then(response => _.compact(response.rows.map(row => updater(row.doc))))
                .then(batch => batch.length > 0 && this.bulkUpdateDocuments(req, batch));
        });
    }).asCallback(cb);
};

/**
 * Fetches a large number of documents in batched requests.
 *
 * This is useful when it's expected that the payload to fetch all of the documents in a single request
 * would be too large.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {string[]} keys The IDs of the documents to fetch.
 * @param {?integer} batchSize The number of documents to fetch in each request. Defaults to 50.
 * @param {?function} cb A callback for handling the error or fetched documents.
 * @returns {Promise} A promise resolving to the list of fetched documents.
 */
XCSDBCoreClass.prototype.bulkFindDocuments = function bulkFindDocuments(req, keys, batchSize, cb) {
    const log = logger.withRequest(req);
    log.debug('Bulk fetching', keys.length, 'documents.');

    return Promise.try(() => {
        if (!keys || keys.length === 0) {
            return [];
        }

        batchSize = batchSize || 50;

        let keyGroups = xcsutil.groupsOf(keys, batchSize);

        let fetches = keyGroups.map(keys => {
            return xcs_db().then(db => db.fetchAsync({keys}));
        });

        return Promise.all(fetches)
            .catch(err => wrapNanoError(req, err, err.message))
            .map(response => response.rows)
            .then(_.flatten)
            .then(response => {
                if (response.length === 0) {
                    log.warn('Could not find any of the bulk documents requested.');
                    throw new Errors.NotFound('The requested documents could not be found.');
                }

                log.debug('Successfully bulk fetched', response.length, 'documents.');
                return cacheAndReturnViewDocuments(req, {rows: response});
            });
    }).asCallback(cb);
};

/**
 * Update multiple documents with a common set of changes.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {Object[]} docs An array of documents to update.
 * @param {?Object} change An optional set of changes to apply to each document provided.
 * @param {?function} cb A callback for handling the error or response from CouchDB.
 * @returns {Promise} A promise resolving to the response from CouchDB.
 */
XCSDBCoreClass.prototype.bulkUpdateDocuments = function bulkUpdateDocuments(req, docs, change, cb) {
    xcsutil.snitch(req, '[dbCoreClass - bulkUpdateDocuments] bulk update documents: ' + docs.length + ' documents');
    const log = logger.withRequest(req);
    log.debug('Bulk updating', docs.length, 'documents.');

    if (change) {
        docs.forEach(doc => {
            Object.keys(change).forEach(key => {
                doc[key] = change[key];
            });
        });
    }

    return xcs_db()
        .then(db => db.bulkAsync({docs}))
        .catch(err => wrapNanoError(req, err, err.message))
        .then(response => {
            log.debug('Successfully bulk updated', docs.length, 'documents.');

            if (redisClass.client()) {
                return Promise.each(docs, doc => {
                    return redisClass.set(req, doc._id, JSON.stringify(doc))
                        .catch(err => log.warn('Error caching bulk documents to Redis:', err));
                }).thenReturn(response);
            } else {
                return response;
            }
        }).asCallback(cb);
};

/**
 * Removes a document from the database.
 *
 * If doc_rev is provided, the document will only be successfully removed if doc_rev
 * matches the current revision of the document.
 *
 * If doc_rev is omitted, the current version of the document will be loaded and its
 * revision used until deletion is successful.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {string} doc_UUID The ID of the document to remove.
 * @param {?string} doc_rev The expected current revision of the document to remove.
 * @param {?function} cb A callback for handling the potential error.
 * @return {Promise} A promise resolving once the document is removed.
 */
XCSDBCoreClass.prototype.removeDocument = function removeDocument(req, doc_UUID, doc_rev, cb) {
    const log = logger.withRequest(req);
    xcsutil.snitch(req, '[dbCoreClass - removeDocument] remove document: ' + doc_UUID + ' (rev ' + doc_rev + ')');

    log.debug('Removing document', doc_UUID, 'with rev', doc_rev);

    return destroyDocument(req, doc_UUID, doc_rev).asCallback(cb);
};

/**
 * Deletes all documents returned by a given query.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {string} design_name The name of the design document containing the view.
 * @param {string} view_name The name of the view to query.
 * @param {Object} query A JSON object with parameters for the query.
 * @param {?function} cb A callback for handling the potential error.
 * @returns {Promise} A promise resolving once the documents are removed.
 */
XCSDBCoreClass.prototype.removeAll = function removeAll(req, design_name, view_name, query, cb) {
    const log = logger.withRequest(req);
    xcsutil.snitch(req, '[dbCoreClass - removeAll] remove all documents using: ' + design_name + ' / ' + view_name);

    log.debug('Removing all documents in view:', design_name + '/' + view_name);

    return this.findDocumentsWithQuery(req, design_name, view_name, query)
        .then(docs => {
            if (docs.length === 0) {
                return null;
            }

            let docsToDelete = docs.filter(doc => !!doc).map(doc => {
                if (query.include_docs === true) {
                    return {
                        _id: doc._id,
                        _rev: doc._rev,
                        _deleted: true
                    };
                } else {
                    doc._deleted = true;
                    return doc;
                }
            });

            return xcs_db()
                .then(db => db.bulkAsync({docs: docsToDelete}))
                .catch(err => wrapNanoError(req, err, `${err.message}: ${design_name}/${view_name}`));
        })
        .asCallback(cb);
};

XCSDBCoreClass.prototype.removeUnitTestDocs = function removeUnitTestDocs(req, res, next) {
    xcsutil.snitch(req, '[dbCoreClass removeUnitTestDocs] remove unit test docs');
    const log = logger.withRequest(req);

    log.info('Removing all unit test documents.');

    let unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        query = {
            include_docs: false
        };

    if (unitTestUUID) {
        query.key = unitTestUUID;
    } else {
        next(new Errors.BadRequest("This endpoint must be called from a unit test which specifies an ID in the header."));
        return;
    }

    this.removeAll(req, k.XCSDesignDocumentUnitTest, k.XCSDesignDocumentViewAllUnitTests, query)
        .catch(err => 404 === err.status, () => null) // swallow 404s
        .then(() => xcsutil.standardizedResponse(res, 204))
        .catch(err => next(err))
        .finally(() => xcsutil.profilerSummary(req));
};

module.exports = xcsutil.bindAll(new XCSDBCoreClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function wrapNanoError(req, err, reason) {
    let error;

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

    return Promise.reject(error);
}

function setAndVerifyTinyID(req, doc, doc_type, exports) {
    xcsutil.snitch(req, '[dbCoreClass - setAndVerifyTinyID] set and verify the tinyID');

    const log = logger.withRequest(req);
    log.debug('Setting and verifying tiny ID on document:', doc._id);

    let tinyID;
    return xcsutil.makeUUID()
        .then(UUID => {
            tinyID = UUID.substr(0, k.XCSTinyIDLength);
            doc.tinyID = tinyID;

            log.debug('Updating document', doc._id, 'with tiny ID', doc.tinyID);

            return exports.updateDocumentWithUUID(req, doc._id, doc, false, doc_type);
        })
        .then(updatedDoc => {
            if (tinyID !== updatedDoc.tinyID) {
                log.error('Could not assign tiny ID to document for unknown reason.');
                throw new Errors.Internal('Could not create new document properly. Please try again.');
            }
            return updatedDoc;
        })
        .then(updatedDoc => {
            log.debug('Verifying that tiny ID', updatedDoc.tinyID, 'for document', updatedDoc._id, 'is unique.');
            return exports.findDocumentsWithQuery(req, k.XCSDesignDocumentAll, k.XCSDesignDocumentViewAllUUIDs, {
                include_docs: true,
                startkey: [updatedDoc.tinyID],
                endkey: [updatedDoc.tinyID, {}]
            });
        })
        .then(docs => {
            if (docs.length !== 1) {
                // Conflict detected. Try to generate a new tinyID and update the document once more.
                // Then detect against potential collisions.
                log.debug('Tiny ID', tinyID, 'is not unique. Trying again.');
                return setAndVerifyTinyID(req, doc, doc_type, exports);
            } else {
                xcsutil.profilerSummary(req);
                return docs[0];
            }
        });
}

function cacheDocumentIfRequired(req, doc_UUID, existingDocument, shouldCache) {
    const log = logger.withRequest(req);

    if (existingDocument) {
        log.debug('Fetched document', doc_UUID, 'with rev', existingDocument._rev);
    }

    if (shouldCache && existingDocument) {
        log.debug('Found', existingDocument.doc_type, 'document:', doc_UUID);
        return redisClass.cache(req, existingDocument._id, JSON.stringify(existingDocument))
            .catch(err => log.warn('Could not cache document', doc_UUID + ':', err))
            .thenReturn(existingDocument);
    } else {
        log.debug('Found document, but not caching.');
        return Promise.resolve(existingDocument);
    }
}

function findDocument(req, doc_UUID, doc_type, shouldCache, findByTinyID) {    
    var log = logger.withRequest(req);

    let foundDocument;    
    if (findByTinyID) {        
        log.debug('Finding', doc_type, 'document by tinyID', doc_UUID, 'in CouchDB.');        
        foundDocument = findDocumentWithTinyIDInCouchDB(req, doc_UUID, doc_type, shouldCache);    
    } else {        
        log.debug('Finding', doc_type, 'document by ID', doc_UUID, 'in CouchDB.');        
        foundDocument = findDocumentWithUUIDInCouchDB(req, doc_UUID, shouldCache);    
    }

    return foundDocument.then(doc => {        
        if (doc.doc_type !== doc_type) {            
            throw new Errors.NotFound(`Could not find document of type '${doc_type}' matching the given ID.`);        
        }

        return doc;    
    });
}

function findDocumentWithUUIDInCouchDB(req, doc_UUID, shouldCache) {
    return xcs_db()
        .then(db => db.getAsync(doc_UUID))
        .catch(err => wrapNanoError(req, err, `Error retrieving document '${doc_UUID}': ${err.message}`))
        .then(doc => cacheDocumentIfRequired(req, doc_UUID, doc, shouldCache));
}

function findDocumentWithTinyIDInCouchDB(req, doc_UUID, doc_type, shouldCache) {
    var log = logger.withRequest(req),
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

    return xcs_db()
        .then(db => db.viewAsync(k.XCSDesignDocumentAll, k.XCSDesignDocumentViewAllUUIDs, query))
        .catch(err => wrapNanoError(req, err, err.message))
        .then(reply => {
            if (0 === reply.rows.length) {
                log.error('No document found with tiny ID:', doc_UUID);
                throw new Errors.NotFound(`Could not find document with tiny ID ${doc_UUID}`);
            }

            return cacheDocumentIfRequired(req, doc_UUID, reply.rows[0].doc, shouldCache);
        });
}

function findOrCreateDocumentInCouchDB(req, doc_type, query, body, exports) {
    var log = logger.withRequest(req),
        view_name;

    if (k.XCSDesignDocumentACL === doc_type) {
        view_name = k.XCSDesignDocumentViewAllACLs;
    } else if (k.XCSDesignDocumentVersion === doc_type) {
        view_name = k.XCSDesignDocumentViewAllVersions;
    } else if (k.XCSDesignDocumentSettings === doc_type) {
        view_name = k.XCSDesignDocumentViewAllSettings;
    } else {
        return Promise.reject(new Errors.BadRequest(`"${doc_type}" is not a valid singleton document type.`));
    }

    return exports.findDocumentsWithQuery(req, doc_type, view_name, query)
        .catch(err => {
            if (err.status === 404) {
                return [];
            }

            log.error('Could not try to find the document:', err);
            throw err;
        })
        .then(docs => {
            if (0 === docs.length) {
                return exports.createDocument(req, doc_type, body).spread((url, doc) => doc);
            } else {
                log.debug('Default', doc_type, 'document found in CouchDB.');
                return docs[0];
            }
        });
}

function updateDocument(req, doc_UUID, doc_type, changes, needsPatching) {
    const log = logger.withRequest(req);
    log.debug('Updating', doc_type, 'document', doc_UUID, '(patching? ' + needsPatching + ')');

    return xcs_db()
        .then(db => db.getAsync(doc_UUID))
        .catch(err => wrapNanoError(req, err, err.message))
        .then(document => {
            if (needsPatching) {
                changes = xcsutil.patchDocumentWithObject(document, changes);
            } else {
                changes._rev = document._rev;
            }

            return xcs_db().then(db => db.insertAsync(changes, doc_UUID));
        })
        .then(response => {
            log.debug('Updated', doc_UUID, 'successfully (rev', response.rev, '), fetching to flush update and cache.');
            return xcs_db()
                .then(db => db.getAsync(doc_UUID, {stale: 'update_after'}))
                .catch(err => {
                    log.error('Error finding document after update:', err);
                    return wrapNanoError(req, err, err.message);
                })
                .then(existingDocument => {
                    log.debug('Fetched updated document', doc_UUID, 'from database, rev:', existingDocument._rev);
                    return redisClass.set(req, doc_UUID, JSON.stringify(existingDocument))
                        .catch(err => log.error('Error caching updated document to Redis:', err))
                        .thenReturn(existingDocument);
                });
        }, err => {
            if (409 === err.status) {
                log.debug('Got a conflict trying to update', doc_UUID + ', so retrying.');
                return updateDocument(req, doc_UUID, doc_type, changes, needsPatching);
            } else {
                log.error('Error updating document', doc_UUID + ':', err);
                return wrapNanoError(req, err, err.message);
            }
        });
}

function destroyDocument(req, doc_UUID, doc_rev) {
    let revWasSpecified = null !== doc_rev;

    function destroy() {
        return xcs_db()
            .then(db => db.destroyAsync(doc_UUID, doc_rev))
            .then(() => {
                return redisClass.del(req, doc_UUID);
            }, err => {
                if (err.statusCode === 404) {
                    redisClass.del(req, doc_UUID);
                    return wrapNanoError(req, err, err.message);
                } else if (err.statusCode === 409) {
                    if (revWasSpecified) {
                        return wrapNanoError(req, err, err.message);
                    } else {
                        return findDocUUIDAndTryRemoving();
                    }
                } else {
                    return wrapNanoError(req, err, err.message);
                }
            });
    }

    function findDocUUIDAndTryRemoving() {
        return findDocumentWithUUIDInCouchDB(req, doc_UUID, false)
            .then(doc => {
                doc_rev = doc._rev;
                return destroy();
            });
    }

    if (doc_rev) {
        return destroy();
    } else {
        return findDocUUIDAndTryRemoving();
    }
}

function cacheAndReturnViewDocuments(req, body) {
    const log = logger.withRequest(req);

    let rows = body.rows.filter(row => row.doc !== null);

    return Promise.each(rows, row => {
        return redisClass.cache(req, row.id, JSON.stringify(row.doc))
            .catch(err => log.warn('Failed to cache document', row.id, 'to Redis:', err));
    }).map(row => row.doc);
}
