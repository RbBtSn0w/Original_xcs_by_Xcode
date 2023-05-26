/*
    XCSDBCoreClass
    A class dedicated to interact with CouchDB and redisClass.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    async = require('async'),
    nano = require('nano')('http://' + k.XCSCouchHost + ':' + k.XCSCouchPort),
    xcs_db = nano.db.use(k.XCSCouchDatabase),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('./redisClass.js');

/* XCSDBCoreClass object */

function XCSDBCoreClass() {}

XCSDBCoreClass.prototype.createDocument = function XCSDBCoreClassCreateDocument(req, doc_type, body, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[dbCoreClass - createDocument] create document of type: ' + doc_type;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var temp_doc_type = doc_type + '_temp',
        self = this;

    if (!body) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the body is empty'
        });
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

            konsole.log(req, '[dbCoreClass - createDocument] find the partial ' + doc_type + ' document just created: ' + newPartialDocument._id);

            self.findDocumentWithUUIDUsingOptionalCaching(req, newPartialDocument._id, temp_doc_type, false, function DBCCreateDocumentFindPartialDocumentCallback(err, doc) {
                if (err) {
                    callback(err);
                } else {
                    xcsDBCoreClassSetandVerifyTinyID(req, doc, temp_doc_type, self, function DBCCreateDocumentFindPartialDocumentCallback(err, newUpdatedDoc) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, newUpdatedDoc);
                        }
                    });
                }
            });
    },
    function DBCCreateDocumentUpdateDocumentTinyID(newUpdatedDoc, callback) {
            // Set the doc_type to be a real document type that was requested
            newUpdatedDoc.doc_type = doc_type;

            konsole.log(req, '[dbCoreClass - createDocument] potential collision cleared: set the doc_type as requested originally: ' + doc_type);

            self.updateDocumentWithUUID(req, newUpdatedDoc._id, newUpdatedDoc, false, doc_type, function DBCCreateDocumentUpdateDocumentTinyIDCallback(err, latestUpdatedDoc) {
                if (err) {
                    err.message = '[dbCoreClass - createDocument] error while calling updateDocumentWithUUID: ' + err.message;
                    konsole.error(req, JSON.stringify(err));
                    return xcsutil.safeCallback(callback, err);
                } else {
                    if (req) {
                        return xcsutil.safeCallback(callback, null, 'https://' + req.headers.host + '/' + doc_type + '/' + latestUpdatedDoc._id, latestUpdatedDoc);
                    } else {
                        return xcsutil.safeCallback(callback, null, null, latestUpdatedDoc);
                    }

                }
            });
    }
], function DBCCreateDocumentFinalizer(err, url, latestUpdatedDoc) {
        if (err) {
            konsole.error(req, '[dbCoreClass - createDocument] error: ' + JSON.stringify(err));
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, null, url, latestUpdatedDoc);
        }
    });

};

XCSDBCoreClass.prototype.listAllDocuments = function XCSDBCoreClassListAllDocuments(req, doc_type, cb) {

    xcsutil.logLevelInc(req);

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        designDocName = k.XCSDesignDocumentAll,
        viewName = k.XCSDesignDocumentViewAllByType,
        functionTitle,
        query = {
            include_docs: true
        };

    if (unitTestUUID) {
        functionTitle = '[dbCoreClass - listAllDocuments] find unit test documents of type ' + doc_type + ' using view: ' + designDocName + '/' + viewName;
    } else {
        functionTitle = '[dbCoreClass - listAllDocuments] find documents of type ' + doc_type + ' using view: ' + designDocName + '/' + viewName;
    }

    xcsutil.requireCallback(cb);

    if (!doc_type) {
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the property "doc_type" has not been specified'
        });
    }

    if (unitTestUUID) {
        query.startkey = [unitTestUUID, doc_type];
        query.endkey = [unitTestUUID, doc_type, {}];
    } else {
        query.startkey = [doc_type];
        query.endkey = [doc_type, {}];
    }

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    xcs_db.view(designDocName, viewName, query, function DBCListAllDocumentsCallback(err, body) {
        if (err) {
            return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
        } else {
            konsole.log(req, '[dbCoreClass - listAllDocuments] number of documents found: ' + body.rows.length);
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
                konsole.log(req, '[dbCoreClass - listAllDocuments] done processing.');
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, null, docs);
            } else {
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, {
                    status: 404,
                    message: 'Not Found'
                }, []);
            }
        }
    });

};

XCSDBCoreClass.prototype.findDocumentWithUUIDUsingOptionalCaching = function XCSDBCoreClassFindDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, shouldCache, cb) {

    xcsutil.logLevelInc(req);

    var findByTinyID = (k.XCSTinyIDLength === doc_UUID.length);

    var functionTitle;
    if (findByTinyID) {
        functionTitle = '[dbCoreClass - findDocumentWithUUIDUsingOptionalCaching] find ' + doc_type + ' document with tinyID: ' + doc_UUID + '. Should cache?: ' + shouldCache;
    } else {
        functionTitle = '[dbCoreClass - findDocumentWithUUIDUsingOptionalCaching] find ' + doc_type + ' document with UUID: ' + doc_UUID + '. Should cache?: ' + shouldCache;
    }

    konsole.debug(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (shouldCache) {
        redisClass.get(req, doc_UUID, function DBCFindDocumentWithUUIDUsingOptionalCachingRedisGet(err, reply) {
            if (err || !reply) {
                konsole.warn(req, '[dbCoreClass - findDocumentWithUUIDUsingOptionalCaching] Redis: no match found.');
                xcsDBCoreClassFindDocument(req, doc_UUID, doc_type, shouldCache, findByTinyID, cb);
            } else {
                konsole.log(req, '[dbCoreClass - findDocumentWithUUIDUsingOptionalCaching] Redis: document matched.');
                xcsutil.logLevelDec(req);
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

    xcsutil.logLevelInc(req);

    var functionTitle = '[dbCoreClass - findDocumentsWithQuery] find documents using view: ' + design_name + '/' + view_name;

    konsole.debug(req, '[dbCoreClass - findDocumentsWithQuery] query: ' + JSON.stringify(query, null, 4));

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var error = {},
        docs;

    konsole.log(req, '[dbCoreClass - findDocumentsWithQuery] using view: ' + design_name + '/' + view_name);
    xcs_db.view(design_name, view_name, query, function DBCFindDocumentsWithQueryFindDocument(err, body) {
        if (err) {
            var reason = err.message + ': ' + design_name + '/' + view_name;
            return xcsDBCoreClassNanoErrorHandler(req, err, reason, cb);
        } else {
            if (body.rows.length) {
                konsole.log(req, '[dbCoreClass - findDocumentsWithQuery] documents found: ' + body.rows.length);
                if (query.include_docs === true) {
                    docs = body.rows.map(function DBCFindDocumentsWithQueryIterateResults(row) {
                        // Save the record in Redis
                        var stringifiedObj = JSON.stringify(row.doc);
                        redisClass.set(req, row.id, stringifiedObj, function DBCFindDocumentsWithQueryRedisCache(err) {
                            if (err) {
                                konsole.error(req, '[dbCoreClass - findDocumentsWithQuery] redisClass.set error: ' + JSON.stringify(err));
                                konsole.error(req, '[dbCoreClass - findDocumentsWithQuery] value: ' + stringifiedObj);
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
                konsole.log(req, '[dbCoreClass - findDocumentsWithQuery] done processing.');
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, null, docs);
            } else {
                konsole.log(req, '[dbCoreClass - findDocumentsWithQuery] no documents found');
                error.status = 404;
                error.message = 'Not Found';
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, error, []);
            }
        }
    });

};

XCSDBCoreClass.prototype.findOrCreateDefaultDocument = function XCSDBCoreClassFindOrCreateDefaultDocument(req, doc_type, body, loadFromCouchDB, cb) {

    xcsutil.logLevelInc(req);

    var redisClient = redisClass.client(),
        query = {
            include_docs: true
        },
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        functionTitle,
        self = this;

    if (unitTestUUID) {
        query.key = unitTestUUID;
        functionTitle = '[dbCoreClass - findOrCreateDefaultDocument] find ' + doc_type + ' document with key: ' + unitTestUUID + ' (loadFromCouchDB: ' + loadFromCouchDB + ')';
    } else {
        query.key = doc_type;
        functionTitle = '[dbCoreClass - findOrCreateDefaultDocument] find the default ' + doc_type + ' document (loadFromCouchDB: ' + loadFromCouchDB + ')';
    }

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (loadFromCouchDB) {
        xcsDBCoreClassindOrCreateDocumentInCouchDB(req, doc_type, query, body, self, cb);
    } else {
        redisClient.get(query.key, function DBCFindOrCreateDefaultDocumentRedisGet(err, reply) {
            if (err || !reply) {
                xcsDBCoreClassindOrCreateDocumentInCouchDB(req, doc_type, query, body, self, cb);
            } else {
                konsole.log(req, '[dbCoreClass - findOrCreateDefaultDocument] ' + doc_type + ' document found in redisClass.');
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, null, JSON.parse(reply));
            }
        });
    }

};

XCSDBCoreClass.prototype.updateDocumentWithUUID = function XCSDBCoreClassUpdateDocumentWithUUID(req, doc_UUID, changes, needsPatching, doc_type, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[dbCoreClass - updateDocumentWithUUID] update ' + doc_type + ' document: ' + doc_UUID;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    xcsDBCoreClassUpdateDocument(req, doc_UUID, doc_type, changes, needsPatching, cb);

};

XCSDBCoreClass.prototype.bulkUpdateDocuments = function XCSDBCoreClassBulkUpdateDocuments(req, docs, change, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[dbCoreClass - bulkUpdateDocuments] bulk update documents: ' + docs.length + ' documents';

    konsole.log(req, functionTitle);

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
        konsole.error(req, '[dbCoreClass - bulkUpdateDocuments] error: ' + JSON.stringify(err));
    }

    xcs_db.bulk({
        docs: docs
    }, function DBCBulkUpdateDocumentsBulk(err, response) {
        if (err) {
            return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
        } else {
            konsole.log(req, '[dbCoreClass - bulkUpdateDocuments] success.');

            if (redisClient) {
                for (var i = 0; i < docs.length; i++) {
                    var doc = docs[i];
                    redisClass.set(req, doc._id, JSON.stringify(doc), xcsDBCoreClassLogError);
                }
            }

            xcsutil.logLevelDec(req);

            return xcsutil.safeCallback(cb, null, response);
        }
    });
};

XCSDBCoreClass.prototype.removeDocument = function XCSDBCoreClassRemoveDocument(req, doc_UUID, doc_rev, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[dbCoreClass - removeDocument] remove document: ' + doc_UUID + ' (rev ' + doc_rev + ')';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    xcsDBCoreClassDestroyDocument(req, doc_UUID, doc_rev, cb);
};

XCSDBCoreClass.prototype.removeAll = function XCSDBCoreClassRemoveAll(req, design_name, view_name, query, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[dbCoreClass - removeAll] remove all documents using: ' + design_name + ' / ' + view_name,
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.findDocumentsWithQuery(req, design_name, view_name, query, function DBCRemoveAllFindDocument(err, docs) {
        if (err) {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            if (0 === docs.length) {
                xcsutil.logLevelDec(req);
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
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb);
                    }
                });
            }
        }
    });

};

XCSDBCoreClass.prototype.removeUnitTestDocs = function XCSDBCoreClassRemoveUnitTestDocs(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[dbCoreClass removeUnitTestDocs] remove unit test docs',
        self = this;

    konsole.log(req, functionTitle);

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
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err && (404 === err.status)) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });
};

/* Module exports */

module.exports = new XCSDBCoreClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function xcsDBCoreClassNanoErrorHandler(req, err, reason, cb) {
    var error = {};

    if (err.statusCode && err.statusCode === 'ECONNREFUSED') {
        error.status = 503;
        error.message = 'Service Unavailable (CouchDB): unable to connect';
    } else if (err.statusCode && err.statusCode === 409) {
        error.status = 409;
        error.message = 'Conflict';
    } else if (err.statusCode && err.statusCode === 404 && err.message === 'missing_named_view') {
        error.status = 500;
        error.message = 'Internal Server Error (CouchDB): ' + reason.toString();
    } else if (err.statusCode && err.statusCode === 404) {
        error.status = 404;
        error.message = 'Not found: ' + reason.toString();
    } else {
        error.status = 500;
        error.message = 'Internal Server Error (CouchDB): ' + err.message;
    }

    xcsutil.logLevelDec(req);
    return xcsutil.safeCallback(cb, error);
}

function xcsDBCoreClassSetandVerifyTinyID(req, doc, doc_type, xcsDBCoreClass, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[dbCoreClass - xcsDBCoreClassSetandVerifyTinyID] set and verify the tinyID';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var tinyID,
        error,
        self = xcsDBCoreClass;

    async.waterfall([

        function DBCSetandVerifyTinyIDMakeUUID(callback) {
            xcsutil.makeUUID(function DBCSetandVerifyTinyIDMakeUUIDCallback(err, UUID) {
                callback(err, UUID);
            });
        },
        function DBCSetandVerifyTinyIDUpdateDocumentTempTinyID(UUID, callback) {
            tinyID = UUID.substring(0, k.XCSTinyIDLength);

            // Update the document with the tinyID and make sure there aren't any collisions
            doc.tinyID = tinyID;

            konsole.log(req, '[dbCoreClass - xcsDBCoreClassSetandVerifyTinyID] updating document with tinyID: ' + doc.tinyID);

            self.updateDocumentWithUUID(req, doc._id, doc, false, doc_type, function DBCSetandVerifyTinyIDUpdateDocumentTinyID(err, updatedDoc) {
                if (err) {
                    callback(err);
                } else {
                    if (err || (tinyID !== updatedDoc.tinyID)) {
                        error = {
                            status: 500,
                            message: 'Internal Server Error (xcsd): the tinyID property didn\'t stick during the document creation'
                        };
                        callback(error);
                    } else {
                        callback(null, updatedDoc);
                    }
                }
            });
        },
        function DBCSetandVerifyTinyIDFindTempTinyID(updatedDoc, callback) {
            konsole.log(req, '[dbCoreClass - xcsDBCoreClassSetandVerifyTinyID] verify that the tinyID is unique: ' + updatedDoc.tinyID);

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
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            if (docs.length !== 1) {
                // Conflict detected. Try to generate a new tinyID and update the document once more.
                // Them detect against potential collisions.

                konsole.log(req, '[dbCoreClass - xcsDBCoreClassSetandVerifyTinyID] tinyID collision detected: ' + tinyID + '. Generating a new one.');

                xcsDBCoreClassSetandVerifyTinyID(req, doc, doc_type, self, cb);
            } else {

                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, null, docs[0]);
            }
        }
    });

}

function xcsDBCoreClassCacheDocumentIfRequired(req, doc_UUID, existingDocument, shouldCache, cb) {
    if (shouldCache && existingDocument) {
        konsole.log(req, '[dbCoreClass - xcsDBCoreClassCacheDocumentIfRequired] ' + existingDocument.doc_type + ' found: ' + doc_UUID);
        redisClass.set(req, existingDocument._id, JSON.stringify(existingDocument), function DBCFindDocumentWithUUIDUsingOptionalCachingRedisCache(err) {
            if (err) {
                konsole.error(req, '[dbCoreClass - xcsDBCoreClassCacheDocumentIfRequired] error: ' + JSON.stringify(err));
            } else {
                konsole.log(req, '[dbCoreClass - xcsDBCoreClassCacheDocumentIfRequired] cache the ' + existingDocument.doc_type + ' to Redis: ' + existingDocument._id);
                konsole.debug(req, '[dbCoreClass - xcsDBCoreClassCacheDocumentIfRequired] document cached to Redis: ' + JSON.stringify(existingDocument, null, 4));
            }
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, null, existingDocument);
        });
    } else {
        konsole.log(req, '[dbCoreClass - xcsDBCoreClassCacheDocumentIfRequired] document found. As requested, it won\'t be cached to redisClass.');
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, null, existingDocument);
    }
}

function xcsDBCoreClassFindDocument(req, doc_UUID, doc_type, shouldCache, findByTinyID, cb) {
    if (findByTinyID) {
        konsole.log(req, '[dbCoreClass - xcsDBCoreClassFindDocument] find by tinyID in CouchDB');
        xcsDBCoreClassFindDocumentWithTinyIDInCouchDB(req, doc_UUID, doc_type, shouldCache, cb);
    } else {
        konsole.log(req, '[dbCoreClass - xcsDBCoreClassFindDocument] find by UUID in CouchDB');
        xcsDBCoreClassFindDocumentWithUUIDInCouchDB(req, doc_UUID, shouldCache, cb);
    }
}

function xcsDBCoreClassFindDocumentWithUUIDInCouchDB(req, doc_UUID, shouldCache, cb) {
    xcs_db.get(doc_UUID, function xcsDBCFindDocumentWithUUIDInCouchDBCallback(err, existingDocument) {
        if (err) {
            var reason = 'error retrieving document \'' + doc_UUID + '\': ' + err.message;
            return xcsDBCoreClassNanoErrorHandler(req, err, reason, cb);
        } else {
            xcsDBCoreClassCacheDocumentIfRequired(req, doc_UUID, existingDocument, shouldCache, cb);
        }
    });
}

function xcsDBCoreClassFindDocumentWithTinyIDInCouchDB(req, doc_UUID, doc_type, shouldCache, cb) {
    var error = {},
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
                konsole.log(req, '[dbCoreClass - xcsDBCoreClassFindDocumentWithTinyIDInCouchDB] no document found with tinyID: ' + doc_UUID);
                xcsutil.logLevelDec(req);
                error.status = 404;
                error.message = 'Not found';
                return xcsutil.safeCallback(cb, error);
            }

            var existingDocument = reply.rows[0].doc;

            xcsDBCoreClassCacheDocumentIfRequired(req, doc_UUID, existingDocument, shouldCache, cb);
        }
    });
}

function xcsDBCoreClassindOrCreateDocumentInCouchDB(req, doc_type, query, body, xcsDBCoreClass, cb) {
    var view_name;

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
            konsole.error(req, '[dbCoreClass - xcsDBCoreClassindOrCreateDocumentInCouchDB] error: ' + JSON.stringify(err));
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            if (0 === docs.length) {
                xcsDBCoreClass.createDocument(req, doc_type, body, function DBCFindOrCreateDefaultDocumentCreateDocument(err, url, doc) {
                    if (err) {
                        konsole.error(req, '[dbCoreClass - xcsDBCoreClassindOrCreateDocumentInCouchDB] error: ' + JSON.stringify(err));
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        konsole.log(req, '[dbCoreClass - xcsDBCoreClassindOrCreateDocumentInCouchDB] default ' + doc_type + ' document created in CouchDB.');
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb, null, doc, true);
                    }
                });
            } else {
                konsole.log(req, '[dbCoreClass - xcsDBCoreClassindOrCreateDocumentInCouchDB] ' + doc_type + ' document found in CouchDB.');
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, null, docs[0]);
            }
        }
    });
}

function xcsDBCoreClassUpdateDocument(req, doc_UUID, doc_type, changes, needsPatching, cb) {
    xcs_db.get(doc_UUID, function DBCUpdateDocumentWithUUIDFindDocument(err, document) {
        if (err) {
            konsole.error(req, '[dbCoreClass - xcsDBCoreClassUpdateDocument] error finding the document: ' + JSON.stringify(err));
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
                        xcsDBCoreClassUpdateDocument(req, doc_UUID, doc_type, changes, needsPatching, cb);
                    } else {
                        konsole.error(req, '[dbCoreClass - xcsDBCoreClassUpdateDocument] error updating the document: ' + JSON.stringify(err));
                        return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
                    }
                } else {
                    // !!! Issue: https://github.com/dscape/nano/issues/210
                    xcs_db.get(doc_UUID, {
                        stale: 'update_after'
                    }, function DBCUpdateDocumentWithUUIDFindDocumentUpdateAfter(err, existingDocument) {
                        if (err) {
                            konsole.error(req, '[dbCoreClass - xcsDBCoreClassUpdateDocument] error finding the document after update: ' + JSON.stringify(err));
                            return xcsDBCoreClassNanoErrorHandler(req, err, err.message, cb);
                        } else {
                            konsole.log(req, '[dbCoreClass - xcsDBCoreClassUpdateDocument] ' + doc_type + ' found: ' + doc_UUID);
                            redisClass.set(req, doc_UUID, JSON.stringify(existingDocument), function DBCUpdateDocumentWithUUIDRedisCache(err) {
                                if (err) {
                                    konsole.error(req, '[dbCoreClass - xcsDBCoreClassUpdateDocument] error: ' + JSON.stringify(err));
                                } else {
                                    konsole.log(req, '[dbCoreClass - xcsDBCoreClassUpdateDocument] cache the ' + doc_type + ' to Redis: ' + doc_UUID);
                                    konsole.debug(req, '[dbCoreClass - xcsDBCoreClassUpdateDocument] document cached to Redis: ' + JSON.stringify(existingDocument, null, 4));
                                }
                                xcsutil.logLevelDec(req);
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
                xcsutil.logLevelDec(req);
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