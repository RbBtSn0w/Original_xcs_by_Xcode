'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    async = require('async'),
    nano = require('nano')('http://' + k.XCSCouchHost + ':' + k.XCSCouchPort),
    xcs_db = nano.db.use('xcs'),
    xcsutil = require('../util/xcsutil.js'),
    redis = require('./redis.js');

var db_core = {};

/**
 * Create
 */

db_core.createDocument = function (req, doc_type, body, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[db_core - createDocument] create document of type: ' + doc_type + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var temp_doc_type = doc_type + '_temp',
        error = {};

    if (!body) {
        xcsutil.logLevelDec(req);
        error.status = 400;
        error.message = 'Bad request';
        return cb(error);
    }

    // Set the document type
    body.doc_type = temp_doc_type;

    async.waterfall([

    function (callback) {
            xcs_db.insert(body, function (err, newPartialDocument) {
                if (err) {
                    nanoErrorHandler(req, err, '[db_core - createDocument]', callback);
                } else {
                    callback(null, newPartialDocument);
                }
            });
    },
    function (newPartialDocument, callback) {
            newPartialDocument = xcsutil.formalizeIDAndRev(newPartialDocument);

            konsole.log(req, '[db_core - createDocument] find the partial ' + doc_type + ' document just created: ' + newPartialDocument._id);

            db_core.findDocumentWithUUIDUsingOptionalCaching(req, newPartialDocument._id, temp_doc_type, false, function (err, doc) {
                if (err) {
                    callback(err);
                } else {
                    setandVerifyTinyID(req, doc, temp_doc_type, function (err, newUpdatedDoc) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, newUpdatedDoc);
                        }
                    });
                }
            });
    },
    function (newUpdatedDoc, callback) {
            // Set the doc_type to be a real document type that was requested
            newUpdatedDoc.doc_type = doc_type;

            konsole.log(req, '[db_core - createDocument] potential collision cleared: set the doc_type as requested originally: ' + doc_type);

            db_core.updateDocumentWithUUID(req, newUpdatedDoc._id, newUpdatedDoc, doc_type, function (err, latestUpdatedDoc) {
                if (err) {
                    return callback(err);
                } else {
                    if (req) {
                        return callback(null, {
                            Location: 'https://' + req.headers.host + '/' + doc_type + '/' + latestUpdatedDoc._id
                        }, latestUpdatedDoc);
                    } else {
                        return callback(null, {}, latestUpdatedDoc);
                    }

                }
            });
    }
], function (err, location, latestUpdatedDoc) {
        if (err) {
            konsole.error(req, '[db_core - createDocument] error: ' + err.status + ' - ' + err.message);
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            xcsutil.logLevelDec(req);
            return cb(null, location, latestUpdatedDoc);
        }
    });

};

/**
 * Read
 */

db_core.findDocumentWithUUIDUsingOptionalCaching = function (req, doc_UUID, doc_type, shouldCache, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[db_core - findDocumentWithUUIDUsingOptionalCaching] find ' + doc_type + ' document with UUID: ' + doc_UUID + '. Should cache?: ' + shouldCache;

    konsole.debug(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    if (shouldCache) {
        redis.get(req, doc_UUID, function (err, reply) {
            if (err || !reply) {
                konsole.log(req, '[db_core - findDocumentWithUUIDUsingOptionalCaching] Redis: no match found.');
                findDocumentWithUUIDInCouchDB();
            } else {
                konsole.log(req, '[db_core - findDocumentWithUUIDUsingOptionalCaching] Redis: document matched.');
                xcsutil.logLevelDec(req);
                return cb(null, JSON.parse(reply));
            }
        });
    } else {
        findDocumentWithUUIDInCouchDB();
    }

    function findDocumentWithUUIDInCouchDB() {
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

        konsole.log(req, '[db_core - findDocumentWithUUIDUsingOptionalCaching] find the document in CouchDB...');

        xcs_db.view(k.XCSDesignDocumentAll, k.XCSDesignDocumentViewAllUUIDs, query, function (err, reply) {
            if (err) {
                nanoErrorHandler(req, err, '[db_core - findDocumentWithUUIDUsingOptionalCaching]', cb);
            } else {
                if (0 === reply.rows.length) {
                    konsole.log(req, '[db_core - findDocumentWithUUIDUsingOptionalCaching] no document found with UUID: ' + doc_UUID);
                    xcsutil.logLevelDec(req);
                    error.status = 404;
                    error.message = 'Not found';
                    return cb(error);
                }

                var doc = reply.rows[0].doc;

                if (shouldCache) {
                    konsole.log(req, '[db_core - findDocumentWithUUIDUsingOptionalCaching] ' + doc_type + ' found: ' + doc_UUID);
                    redis.set(req, doc_UUID, JSON.stringify(doc), function (err) {
                        if (err) {
                            konsole.error(req, '[db_core - findDocumentWithUUIDUsingOptionalCaching] error: ' + JSON.stringify(err));
                        } else {
                            konsole.log(req, '[db_core - findDocumentWithUUIDUsingOptionalCaching] cache the ' + doc_type + ' to Redis: ' + doc_UUID);
                            konsole.debug(req, '[db_core - findDocumentWithUUIDUsingOptionalCaching] document cached to Redis: ' + JSON.stringify(doc, null, 4));
                        }
                        xcsutil.logLevelDec(req);
                        return cb(null, doc);
                    });
                } else {
                    konsole.log(req, '[db_core - findDocumentWithUUIDUsingOptionalCaching] document found. As requested, it won\'t be cached to Redis.');
                    xcsutil.logLevelDec(req);
                    return cb(null, doc);
                }
            }
        });
    }

};

db_core.findDocumentWithUUID = function (req, doc_UUID, doc_type, cb) {
    db_core.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

db_core.findDocumentsWithQuery = function (req, design_name, view_name, query, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[db_core - findDocumentsWithQuery] find documents using view: ' + design_name + '/' + view_name + '...';

    konsole.debug(req, '[db_core - findDocumentsWithQuery] query: ' + JSON.stringify(query, null, 4));

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var error = {},
        docs;

    konsole.log(req, '[db_core - findDocumentsWithQuery] using view: ' + design_name + '/' + view_name);
    xcs_db.view(design_name, view_name, query, function (err, body) {
        if (err) {
            nanoErrorHandler(req, err, '[db_core - findDocumentsWithQuery]', cb);
        } else {
            konsole.log(req, '[db_core - findDocumentsWithQuery] documents found: ' + body.rows.length);
            if (body.rows.length) {
                if (query.include_docs === true) {
                    docs = body.rows.map(function (row) {
                        // Save the record in Redis
                        var stringifiedObj = JSON.stringify(row.doc);
                        redis.set(req, row.id, stringifiedObj, function (err) {
                            if (err) {
                                konsole.error(req, '[db_core - findDocumentsWithQuery] redis.set error: ' + JSON.stringify(err));
                                konsole.error(req, '[db_core - findDocumentsWithQuery] value: ' + stringifiedObj);
                            }
                        });
                        return row.doc;
                    });
                } else if (query.group_level) {
                    docs = body.rows;
                } else {
                    docs = body.rows.map(function (row) {
                        return row.value;
                    });
                }
                konsole.log(req, '[db_core - findDocumentsWithQuery] done processing.');
                xcsutil.logLevelDec(req);
                return cb(null, docs);
            } else {
                error.status = 404;
                error.message = 'Not Found';
                xcsutil.logLevelDec(req);
                return cb(error, []);
            }
        }
    });

};

db_core.findOrCreateDefaultDocument = function (req, doc_type, body, cb) {

    xcsutil.logLevelInc(req);

    var self = db_core,
        redisClient = redis.client(),
        query = {
            include_docs: true
        },
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        functionTitle;

    if (unitTestUUID) {
        query.key = unitTestUUID;
        functionTitle = '[db_core - findOrCreateDefaultDocument] find ' + doc_type + ' document with key: ' + unitTestUUID;
    } else {
        query.key = doc_type;
        functionTitle = '[db_core - findOrCreateDefaultDocument] find the default ' + doc_type + ' document';
    }

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    redisClient.get(query.key, function (err, reply) {
        if (err || !reply) {
            findOrCreateDocumentInCouchDB(req, query, cb);
        } else {
            konsole.log(req, '[db_core - findOrCreateDefaultDocument] ' + doc_type + ' document found in Redis.');
            xcsutil.logLevelDec(req);
            return cb(null, JSON.parse(reply));
        }
    });

    function findOrCreateDocumentInCouchDB(req, query, cb) {
        var view_name;

        if (k.XCSDesignDocumentACL === doc_type) {
            view_name = k.XCSDesignDocumentViewAllACLs;
        } else if (k.XCSDesignDocumentVersion === doc_type) {
            view_name = k.XCSDesignDocumentViewAllVersions;
        } else if (k.XCSDesignDocumentSettings === doc_type) {
            view_name = k.XCSDesignDocumentViewAllSettings;
        } else {
            return cb({
                status: 400,
                message: '[db_core - findOrCreateDefaultDocument] Bad request: document type ' + doc_type + ' not allowed'
            });
        }

        db_core.findDocumentsWithQuery(req, doc_type, view_name, query, function (err, docs) {
            if (err && (404 !== err.status)) {
                konsole.error(req, '[db_core - findOrCreateDefaultDocument] error: ' + err.message);
                xcsutil.logLevelDec(req);
                return cb(err);
            } else {
                if (0 === docs.length) {
                    self.createDocument(req, doc_type, body, function (err, url, doc) {
                        if (err) {
                            konsole.error(req, '[db_core - findOrCreateDefaultDocument] error: ' + err.message);
                            xcsutil.logLevelDec(req);
                            return cb(err);
                        } else {
                            konsole.log(req, '[db_core - findOrCreateDefaultDocument] default ' + doc_type + ' document created in CouchDB.');
                            xcsutil.logLevelDec(req);
                            return cb(null, doc);
                        }
                    });
                } else {
                    konsole.log(req, '[db_core - findOrCreateDefaultDocument] ' + doc_type + ' document found in CouchDB.');
                    xcsutil.logLevelDec(req);
                    return cb(null, docs[0]);
                }
            }
        });
    }

};

/**
 * Update
 */

db_core.updateDocumentWithUUID = function (req, doc_UUID, change, doc_type, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[db_core - updateDocumentWithUUID] update ' + doc_type + ' document: ' + doc_UUID + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var error = {};

    xcs_db.atomic(k.XCSDesignDocumentPatch, k.XCSDesignDocumentViewInPlace, doc_UUID, change, function (err, updated_doc) {
        if (err) {
            nanoErrorHandler(req, err, '[db_core - updateDocumentWithUUID]', cb);
        } else {
            // !!! BUG: https://github.com/dscape/nano/issues/210

            konsole.log(req, '[db_core - updateDocumentWithUUID] ' + doc_type + ' document updated.');
            konsole.log(req, '[db_core - updateDocumentWithUUID] document removed from Redis: ' + doc_UUID);
            redis.del(req, doc_UUID);

            db_core.findDocumentWithUUID(req, updated_doc._id, updated_doc.doc_type, function (err, realDocument) {
                xcsutil.logLevelDec(req);
                if (err) {
                    return cb(err);
                } else {
                    if (realDocument) {
                        return cb(null, realDocument);
                    } else {
                        error.status = 404;
                        error.message = 'Not found.';
                        return cb(error);
                    }
                }
            });
        }
    });

};

db_core.bulkUpdateDocuments = function (req, docs, change, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[db_core - bulkUpdateDocuments] bulk update documents: ' + docs.length + ' documents' + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    if (change) {
        docs.forEach(function (doc) {
            Object.keys(change).forEach(function (key) {
                doc[key] = change[key];
            });
        });
    }

    var redisClient = redis.client();

    function reportError(err) {
        konsole.error(req, '[db_core - bulkUpdateDocuments] error: ' + JSON.stringify(err));
    }

    xcs_db.bulk({
        docs: docs
    }, function (err, response) {
        if (err) {
            nanoErrorHandler(req, err, '[db_core - bulkUpdateDocuments]', cb);
        } else {
            konsole.log(req, '[db_core - bulkUpdateDocuments] success.');

            if (redisClient) {
                for (var i = 0; i < docs.length; i++) {
                    var doc = docs[i];
                    redis.set(req, doc._id, JSON.stringify(doc), reportError);
                }
            }

            xcsutil.logLevelDec(req);

            return cb(null, response);
        }
    });
};

/**
 * Remove
 */

db_core.removeDocument = function (req, doc_UUID, doc_rev, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[db_core - removeDocument] remove document: ' + doc_UUID + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    function sendOKCallback() {
        redis.del(req, doc_UUID);
        xcsutil.logLevelDec(req);
        return cb(null);
    }

    function destroyDocument(doc_UUID, doc_rev, cb) {
        xcs_db.destroy(doc_UUID, doc_rev, function (err) {
            if (err) {
                console.dir(err);
                if (404 === err.status_code) {
                    sendOKCallback();
                } else if (409 === err.status_code) {
                    xcs_db.get(doc_UUID, function (err, existingDoc) {
                        if (err) {
                            nanoErrorHandler(req, err, '[db_core - removeDocument]', cb);
                        } else {
                            destroyDocument(doc_UUID, existingDoc._rev, cb);
                        }
                    });
                } else {
                    nanoErrorHandler(req, err, '[db_core - removeDocument]', cb);
                }
            } else {
                sendOKCallback();
            }
        });
    }

    destroyDocument(doc_UUID, doc_rev, cb);
};

db_core.removeAll = function (req, design_name, view_name, query, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[db_core - removeAll] remove all documents using: ' + design_name + ' / ' + view_name + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var self = db_core;

    self.findDocumentsWithQuery(req, design_name, view_name, query, function (err, docs) {
        if (err) {
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            if (0 === docs.length) {
                xcsutil.logLevelDec(req);
                return cb(null);
            } else {
                // Batch delete
                var docs_to_delete = [];
                docs.forEach(function (doc) {
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
                        redis.del(req, deleted_doc._id);
                    }
                });

                xcs_db.bulk({
                    docs: docs_to_delete
                }, function (err) {
                    if (err) {
                        nanoErrorHandler(req, err, '[db_core - removeAll]', cb);
                    } else {
                        xcsutil.logLevelDec(req);
                        cb();
                    }
                });
            }
        }
    });

};

db_core.removeUnitTestDocs = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[db_core removeUnitTestDocs] remove unit test docs...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        query = {
            include_docs: false
        },
        self = db_core;

    if (unitTestUUID) {
        query.key = unitTestUUID;
    } else {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Operation not available. XCSUnitTestHeader header missing'
        });

    }

    self.removeAll(req, k.XCSDesignDocumentUnitTest, k.XCSDesignDocumentViewAllUnitTests, query, function (err) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });
};

/**
 * Private section
 */

db_core.patchObjectWithObject = function (req, target, src) {

    var array = Array.isArray(src),
        dst = array && [] || {},
        self = db_core;

    if (array) {
        target = target || [];
        dst = dst.concat(target);
        src.forEach(function (e, i) {
            if (typeof target[i] === 'undefined') {
                dst[i] = e;
            } else if (typeof e === 'object') {
                dst[i] = self.patchObjectWithObject(req, target[i], e);
            } else {
                if (target.indexOf(e) === -1) {
                    dst.push(e);
                }
            }
        });
    } else {
        if (target && typeof target === 'object') {
            Object.keys(target).forEach(function (key) {
                dst[key] = target[key];
            });
            Object.keys(src).forEach(function (key) {
                if (typeof src[key] !== 'object' || !src[key]) {
                    dst[key] = src[key];
                } else {
                    if (!target[key]) {
                        dst[key] = src[key];
                    } else {
                        dst[key] = self.patchObjectWithObject(req, target[key], src[key]);
                    }
                }
            });
        } else {
            dst = src;
        }

    }

    return dst;
};

function setandVerifyTinyID(req, doc, doc_type, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[db_core - setandVerifyTinyID] set and verify the tinyID...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var tinyID,
        error;

    async.waterfall([

        function (callback) {
            xcsutil.makeUUID(function (err, UUID) {
                callback(err, UUID);
            });
        },
        function (UUID, callback) {
            tinyID = UUID.substring(0, 7);

            // Update the document with the tinyID and make sure there aren't any collisions
            doc.tinyID = tinyID;

            konsole.log(req, '[db_core - setandVerifyTinyID] updating document with tinyID: ' + doc.tinyID);

            db_core.updateDocumentWithUUID(req, doc._id, doc, doc_type, function (err, updatedDoc) {
                if (err) {
                    callback(err);
                } else {
                    if (err || (tinyID !== updatedDoc.tinyID)) {
                        error = {
                            status: 500,
                            message: 'The tinyID property didn\'t stick during the document duration.'
                        };
                        callback(error);
                    } else {
                        callback(null, updatedDoc);
                    }
                }
            });
        },
        function (updatedDoc, callback) {
            konsole.log(req, '[db_core - setandVerifyTinyID] verify that the tinyID is unique: ' + updatedDoc.tinyID);

            db_core.findDocumentsWithQuery(req, k.XCSDesignDocumentAll, k.XCSDesignDocumentViewAllUUIDs, {
                include_docs: true,
                startkey: [updatedDoc.tinyID],
                endkey: [updatedDoc.tinyID, {}]
            }, function (err, docs) {
                callback(err, docs);
            });
        }
    ], function (err, docs) {
        if (err) {
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            if (docs.length !== 1) {
                // Conflict detected. Try to generate a new tinyID and update the document once more.
                // Them detect against potential collisions.

                konsole.log(req, '[db_core - setandVerifyTinyID] tinyID collision detected: ' + tinyID + '. Generating a new one.');

                setandVerifyTinyID(req, doc, doc_type, cb);
            } else {

                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                return cb(null, docs[0]);
            }
        }
    });

}

function nanoErrorHandler(req, err, methodTitle, cb) {
    var error = {};

    if (err.status_code && err.status_code === 'ECONNREFUSED') {
        error.status = 503;
        error.message = err + 'Error: unable to connect. Is CouchDB running?';
    } else if (err.status_code && err.status_code === 409) {
        error.status = 409;
        error.message = 'Conflict';
    } else {
        error.status = 500;
        error.message = err.message;
    }

    konsole.log(req, methodTitle + ' error: ' + error.message);
    xcsutil.logLevelDec(req);
    return cb(error);
}

module.exports = db_core;