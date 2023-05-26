/*
    XCSDatabaseClass
    A class dedicated to interact with CouchDB.
*/

'use strict';

var k = require('../constants.js'),
    async = require('async'),
    request = require('request'),
	config = require('config');

var xcs_db = require('./xcsdb.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js');

var couchBaseURL = xcs_db.config.url,
    couchDatabaseURL = couchBaseURL + '/' + xcs_db.config.db;

/* XCSDatabaseClass object */

function XCSDatabaseClass() {}

XCSDatabaseClass.prototype.health_internal = function health_internal(req, cb) {
    var log = logger.withRequest(req),
        healthObj = {};

    log.info('Determining database health.');

    async.waterfall([

        function DBHealthInternalGetDatabase(callback) {
            request(couchDatabaseURL, function DBHealthInternalGetDatabaseRequest(err, response, body) {
                if (err || (200 !== response.statusCode)) {
                    if (err) {
                        return xcsutil.safeCallback(callback, {
                            status: 500,
                            message: 'Internal Server Error (CouchDB): ' + JSON.stringify(err)
                        });
                    } else {
                        return xcsutil.safeCallback(callback, {
                            status: 404,
                            message: 'Not found: requested database not found'
                        });
                    }
                } else {
                    // Merge the response
                    body = JSON.parse(body);
                    for (var key in body) {
                        if (body.hasOwnProperty(key)) {
                            healthObj[key] = xcsutil.patchDocumentWithObject(healthObj[key], body[key]);
                        }
                    }
                    return xcsutil.safeCallback(callback, null, healthObj);
                }
            });
        },
        function DBHealthInternalGetCouchStats(healthObj, callback) {
            var statsURL = couchBaseURL + '/' + k.XCSCouchStats;
            request(statsURL, function DBHealthInternalGetCouchStatsRequest(err, response, body) {
                if (err || (200 !== response.statusCode)) {
                    if (err) {
                        return xcsutil.safeCallback(callback, {
                            status: 500,
                            message: 'Internal Server Error (CouchDB): ' + JSON.stringify(err)
                        });
                    } else {
                        return xcsutil.safeCallback(callback, {
                            status: 404,
                            message: 'Not found: requested database not found'
                        });
                    }
                } else {
                    // Merge the response
                    body = JSON.parse(body);
                    for (var key in body) {
                        if (body.hasOwnProperty(key)) {
                            healthObj[key] = xcsutil.patchDocumentWithObject(healthObj[key], body[key]);
                        }
                    }
                    return xcsutil.safeCallback(callback, null, healthObj);
                }
            });
        }

    ], function DBHealthInternalFinalizer(err, healthObj) {

        return xcsutil.safeCallback(cb, err, healthObj);
    });
};

XCSDatabaseClass.prototype.health = function health(req, res) {

    var self = this;

    self.health_internal(req, function DBHealthCallback(err, health) {
        xcsutil.profilerSummary(req);

        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, health);
        }
    });
};

XCSDatabaseClass.prototype.activeCouchDBTasks_internal = function activeCouchDBTasks_internal(req, cb) {

    var compactionIsActiveURL = couchBaseURL + '/_active_tasks/';

    couchdbRequestWithURL_internal(compactionIsActiveURL, 'GET', 200, cb);

};

XCSDatabaseClass.prototype.activeCouchDBTasks = function activeCouchDBTasks(req, res) {
    var log = logger.withRequest(req);
    this.activeCouchDBTasks_internal(req, function DBActiveCouchDBTasksCallback(err, activeTasks) {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            log.debug('Active CouchDB tasks:', JSON.stringify(activeCouchDBTasks, null, 4));
            return xcsutil.standardizedResponse(res, 200, activeTasks);
        }
    });
};

XCSDatabaseClass.prototype.isCompactionActive = function isCompactionActive(req, res) {



    var log = logger.withRequest(req);

    log.info('Checking if database compaction is active.');

    this.activeCouchDBTasks_internal(req, function DBIsCompactionActiveCallback(err, activeTasks) {
        if (err) {

            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var isBeingCompacted = (activeTasks.length > 0);
            if (isBeingCompacted) {
                log.info('The database is currently being compacted.');
            } else {
                log.debug('The database is not being compacted.');
            }

            return xcsutil.standardizedResponse(res, 200, isBeingCompacted);
        }
    });

};

XCSDatabaseClass.prototype.fragmentationIndex = function fragmentationIndex(req, res) {

    couchdbRequestWithURL_internal(couchDatabaseURL, 'GET', 200, function DBFragmentationIndexCallback(err, body) {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var fragIndex = ((body.disk_size - body.data_size) / (body.disk_size * 100));
            return xcsutil.standardizedResponse(res, 200, fragIndex);
        }
    });

};

XCSDatabaseClass.prototype.couchdbRequestWithURL = function couchdbRequestWithURL(url, method, expectedStatusCode, cb) {
    couchdbRequestWithURL_internal(url, method, expectedStatusCode, cb);
};

XCSDatabaseClass.prototype.allDesignDocuments = function (req, res) {

    var log = logger.withRequest(req);
    log.info('Fetching all design documents.');

    allDesignDocuments(req, function DBAllDesignDocumentsCallback(err, designDocs) {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, designDocs);
        }
    });

};

XCSDatabaseClass.prototype.reindexDatabase_internal = function reindexDatabase_internal(req, cb) {

    var log = logger.withRequest(req);
    var redis = require('./redisClass.js').client();

    redis.get(k.XCSRedisMaintenanceTasksPhase, function AUTHRedisGetAuthTokenPrefix(err, reply) {
        if ('1' === reply) {
            return xcsutil.safeCallback(cb);
        } else {


            log.info('Asking CouchDB to reindex all design documents.');

            allDesignDocuments(req, function DBReindexDatabaseInternalAllDesignDocuments(err, results) {
                if (err) {

                    return xcsutil.safeCallback(cb, err);
                } else {

                    async.each(results, function DBReindexDatabaseInternalAllDesignDocumentsApply(object, callback) {

                        var design = Object.keys(object)[0],
                            view = object[design];

                        if (!design || !view) {
                            return callback();
                        }

                        log.debug('Asking CouchDB to reindex using view', design + '/' + view);

                        // Issue a view reindexation request
                        var query = {
                            include_docs: false,
                            limit: 1
                        };

                        xcs_db.view(design, view, query);

                        return callback();

                    }, function DBReindexFinalizer() {
                        log.info('Done asking CouchDB to reindex design documents.');

                        return xcsutil.safeCallback(cb);
                    });

                }
            });
        }
    });

};

XCSDatabaseClass.prototype.reindexDatabase = function reindexDatabase(req, res) {



    var log = logger.withRequest(req);

    log.info('Reindexing CouchDB database.');

    var self = this;

    self.reindexDatabase_internal(req, function DBReindexDatabaseCallback(err) {

        if (err) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: 'Internal Server Error (CouchDB): ' + JSON.stringify(err)
            });
        } else {
            return xcsutil.standardizedResponse(res, 202);
        }
    });

};

XCSDatabaseClass.prototype.compact = function compact(req, res) {



    var log = logger.withRequest(req),
        self = this;

    log.info('Compacting CouchDB.');

    async.waterfall([

        function DBCompactGetActiveTasks(callback) {
            self.activeCouchDBTasks_internal(req, function DBCompactGetActiveTasksCallback(err, activeTasks) {
                if (err) {
                    err.message = 'Could not determine active CouchDB tasks: ' + err.message;
                    return xcsutil.safeCallback(callback, err);
                } else {
                    return xcsutil.safeCallback(callback, null, activeTasks.length > 0);
                }
            });
        },
        function DBCompactViews(isBeingCompacted, callback) {
            if (true === isBeingCompacted) {
                return xcsutil.safeCallback(callback, {
                    status: 202,
                    message: 'Database already being compacted'
                });
            } else {
                compactViews(req, self, function DBCompactViewsCallback(err) {
                    if (err) {
                        err.message = 'Could not compact CouchDB views: ' + err.message;
                    }
                    return xcsutil.safeCallback(callback, err);
                });
            }
        },
        function DBCompactCleanOldIndexes(callback) {
            cleanOldIndexes(req, self, function DBCompactCleanOldIndexesCallback(err) {
                if (err) {
                    err.message = 'Could not clean old CouchDB indices: ' + err.message;
                }
                return xcsutil.safeCallback(callback, err);
            });
        },
        function DBCompactDatabase(callback) {
            compactDatabase(req, self, function DBCompactDatabaseCallback(err) {
                if (err) {
                    err.message = 'Could not compact database: ' + err.message;
                }
                return xcsutil.safeCallback(callback, err);
            });
        }

    ], function DBCompactFinalizer(err) {

        if (err && (202 !== err.status)) {
            log.error(err);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var isCompactionActiveURL = 'https://' + req.host + ':' + config.get('app.httpsPort') + '/' + k.XCSAPIBasePath + '/is_compaction_active';
            return xcsutil.standardizedResponse(res, 202, isCompactionActiveURL);
        }
    });

};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSDatabaseClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function compactViews(req, databaseClass, cb) {



    var log = logger.withRequest(req);

    log.info('Compacting CouchDB views.');

    function bailOutIfError(err) {
        if (err) {

            return xcsutil.safeCallback(cb, err);
        }
    }

    allDesignDocuments(req, function DBCompactViewsAllDesignDocuments(err, designDocs) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var results = designDocs.results;
            for (var object in results) {
                if (results.hasOwnProperty(object)) {
                    var design = Object.keys(object)[0],
                        view = object[design];

                    log.debug('Compacting view', view);

                    // Issue a view compact request
                    var compactViewURL = couchDatabaseURL + '/_compact/' + view;
                    couchdbRequestWithURL_internal(compactViewURL, 'POST', 202, bailOutIfError);
                }
            }

            return xcsutil.safeCallback(cb);
        }
    });

}

function cleanOldIndexes(req, databaseClass, cb) {



    var log = logger.withRequest(req);
    log.info('Cleaning old CouchDB indices.');

    var viewCleanupURL = couchDatabaseURL + '/_view_cleanup';

    couchdbRequestWithURL_internal(viewCleanupURL, 'POST', 202, function DBCleanOldIndexesSendRequest(err) {

        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb);
        }
    });

}

function compactDatabase(req, databaseClass, cb) {



    var log = logger.withRequest(req);
    log.info('Compacting CouchDB database.');

    var viewCleanupURL = couchDatabaseURL + '/_compact';

    couchdbRequestWithURL_internal(viewCleanupURL, 'POST', 202, function DBCompactDatabaseSendRequest(err) {

        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb);
        }
    });

}

function allDesignDocuments(req, cb) {



    var log = logger.withRequest(req),
        databaseURL = couchDatabaseURL + '/_all_docs?startkey=\"_design/\"&endkey=\"_design0\"&include_docs=true';

    log.debug('Fetching all CouchDB design documents.');

    couchdbRequestWithURL_internal(databaseURL, 'GET', 200, function DBAllDesignDocumentsInternalCallback(err, designDocs) {
        if (err) {

            return xcsutil.safeCallback(cb, err);
        } else {
            var results = [],
                design_docs = {};

            for (var row in designDocs.rows) {
                if (designDocs.rows.hasOwnProperty(row)) {

                    var object = designDocs.rows[row],
                        designDoc = object.id;

                    // If this is the first time we have found this design doc, add the first view
                    if (undefined === design_docs[designDoc]) {

                        var views = object.doc.views,
                            chosenView = null;

                        // Traverse the object to find a non map-reduce function
                        for (var key in views) {
                            if (views.hasOwnProperty(key)) {

                                var currentView = views[key];

                                if (null === chosenView) {
                                    chosenView = key;
                                }

                                // Does the function have a reduce function?
                                if (undefined === currentView.reduce) {
                                    chosenView = key;
                                    break;
                                }
                            }
                        }

                        // Save for quick lookup
                        design_docs[designDoc] = chosenView;

                        // Save the result, removing the '_design/' prefix from the design document
                        var obj = {};
                        obj[designDoc.replace('_design/', '')] = chosenView;
                        results.push(obj);

                        // Clean up
                        chosenView = null;

                    }
                }
            }

            return xcsutil.safeCallback(cb, null, results);
        }
    });

}

function couchdbRequestWithURL_internal(url, method, expectedStatusCode, cb) {
    logger.debug('Performing CouchDB request:', method, url, 'and expecting a', expectedStatusCode);

    var options = {
        uri: url,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    request(options, function DBCouchdbRequestWithURLRequest(err, response, body) {
        if (err || (expectedStatusCode !== response.statusCode)) {
            if (err) {
                return xcsutil.safeCallback(cb, {
                    status: 500,
                    message: 'Internal Server Error (CouchDB): ' + JSON.stringify(err)
                });
            } else {
                return xcsutil.safeCallback(cb, {
                    status: 404,
                    message: 'Not found: requested database not found'
                });
            }
        } else {
            body = JSON.parse(body);
            return xcsutil.safeCallback(cb, null, body);
        }
    });
}
