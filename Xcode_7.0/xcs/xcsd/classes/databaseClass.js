/*
    XCSDatabaseClass
    A class dedicated to interact with CouchDB.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    async = require('async'),
    request = require('request'),
    nano = require('nano')('http://' + k.XCSCouchHost + ':' + k.XCSCouchPort),
    xcs_db = nano.db.use(k.XCSCouchDatabase);

var konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

/* XCSDatabaseClass object */

function XCSDatabaseClass() {}

XCSDatabaseClass.prototype.health_internal = function health_internal(req, cb) {

    xcsutil.logLevelInc(req);

    var databaseURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchDatabase,
        functionTitle = '[Health - status] obtaining couchdb health info',
        healthObj = {};

    konsole.log(req, functionTitle);

    async.waterfall([

        function DBHealthInternalGetDatabase(callback) {
            request(databaseURL, function DBHealthInternalGetDatabaseRequest(err, response, body) {
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
            var statsURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchStats;
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
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, err, healthObj);
    });
};

XCSDatabaseClass.prototype.health = function health(req, res) {

    var logLevel = xcsutil.logLevelInc(req),
        functionTitle = '[Database - health] checking database health',
        self = this;

    konsole.log(req, functionTitle);

    self.health_internal(req, function DBHealthCallback(err, health) {
        xcsutil.logLevelDec(req);
        xcsutil.profilerSummary(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, health);
        }
    });
};

XCSDatabaseClass.prototype.activeCouchDBTasks_internal = function activeCouchDBTasks_internal(req, cb) {

    var compactionIsActiveURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/_active_tasks/';

    couchdbRequestWithURL_internal(compactionIsActiveURL, 'GET', 200, function DBActiveCouchDBTasksInternalSendRequest(err, activeTasks) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, activeTasks);
        }
    });

};

XCSDatabaseClass.prototype.activeCouchDBTasks = function activeCouchDBTasks(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - activeCouchDBTasks] obtaining the active tasks in CouchDB',
        self = this;

    konsole.log(req, functionTitle);

    self.activeCouchDBTasks_internal(req, function DBActiveCouchDBTasksCallback(err, activeTasks) {
        if (err) {
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            konsole.log(req, '[Database - activeCouchDBTasks] active CouchDB tasks: ' + JSON.stringify(activeCouchDBTasks, null, 4));
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedResponse(res, 200, activeTasks);
        }
    });

};

XCSDatabaseClass.prototype.isCompactionActive = function isCompactionActive(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - isCompactionActive] checking whether compaction is active',
        self = this;

    konsole.log(req, functionTitle);

    self.activeCouchDBTasks_internal(req, function DBIsCompactionActiveCallback(err, activeTasks) {
        if (err) {
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var isBeingCompacted = (activeTasks.length > 0);
            konsole.log(req, '[Database - isCompactionActive] is the database being compacted?: ' + isBeingCompacted);
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedResponse(res, 200, isBeingCompacted);
        }
    });

};

XCSDatabaseClass.prototype.fragmentationIndex = function fragmentationIndex(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - fragmentationIndex] checking database fragmentation index';

    konsole.log(req, functionTitle);

    var databaseURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchDatabase;

    couchdbRequestWithURL_internal(databaseURL, 'GET', 200, function DBFragmentationIndexCallback(err, body) {
        if (err) {
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var fragIndex = ((body.disk_size - body.data_size) / (body.disk_size * 100));
            konsole.log(req, '[Database - fragmentationIndex] fragmentation index: ' + fragIndex);
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedResponse(res, 200, fragIndex);
        }
    });

};

XCSDatabaseClass.prototype.couchdbRequestWithURL = function couchdbRequestWithURL(url, method, expectedStatusCode, cb) {
    couchdbRequestWithURL_internal(url, method, expectedStatusCode, cb);
};

XCSDatabaseClass.prototype.allDesignDocuments = function fragmentationIndex(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - allDesignDocuments] obtaining the design documents';

    konsole.log(req, functionTitle);

    allDesignDocuments(req, function DBAllDesignDocumentsCallback(err, designDocs) {
        if (err) {
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedResponse(res, 200, designDocs);
        }
    });

};

XCSDatabaseClass.prototype.reindexDatabase_internal = function reindexDatabase_internal(req, cb) {

    var redis = require('./redisClass.js').client();

    redis.get(k.XCSRedisMaintenanceTasksPhase, function AUTHRedisGetAuthTokenPrefix(err, reply) {
        if ('1' === reply) {
            return xcsutil.safeCallback(cb);
        } else {
            xcsutil.logLevelInc(req);

            var functionTitle = '[Database - reindexDatabase_internal] reindex database';

            konsole.debug(req, functionTitle);

            allDesignDocuments(req, function DBReindexDatabaseInternalAllDesignDocuments(err, results) {
                if (err) {
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, err);
                } else {

                    async.each(results, function DBReindexDatabaseInternalAllDesignDocumentsApply(object, callback) {

                        var design = Object.keys(object)[0],
                            view = object[design];

                        if (!design || !view) {
                            return callback();
                        }

                        konsole.log(req, '    Asking to reindex using: ' + design + '/' + view);

                        // Issue a view reindexation request
                        var query = {
                            include_docs: false,
                            limit: 1
                        };

                        xcs_db.view(design, view, query);

                        return callback();

                    }, function DBReindexFinalizer() {
                        konsole.log(req, '[Database - reindexDatabase_internal] done');
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb);
                    });

                }
            });
        }
    });

};

XCSDatabaseClass.prototype.reindexDatabase = function reindexDatabase(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - reindexDatabase] reindex database';

    konsole.debug(req, functionTitle);

    var self = this;

    self.reindexDatabase_internal(req, function DBReindexDatabaseCallback(err) {
        xcsutil.logLevelDec(req);
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

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - compact] executing database maintenance',
        self = this;

    konsole.log(req, functionTitle);

    async.waterfall([

        function DBCompactGetActiveTasks(callback) {
            self.activeCouchDBTasks_internal(req, function DBCompactGetActiveTasksCallback(err, activeTasks) {
                if (err) {
                    err.message = '[Database - compact] error while calling activeCouchDBTasks_internal: ' + err.message;
                    konsole.error(req, JSON.stringify(err));
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
                        err.message = '[Database - compact] error while calling compactViews: ' + err.message;
                        konsole.error(req, JSON.stringify(err));
                    }
                    return xcsutil.safeCallback(callback, err);
                });
            }
        },
        function DBCompactCleanOldIndexes(callback) {
            cleanOldIndexes(req, self, function DBCompactCleanOldIndexesCallback(err) {
                if (err) {
                    err.message = '[Database - compact] error while calling cleanOldIndexes: ' + err.message;
                    konsole.error(req, JSON.stringify(err));
                }
                return xcsutil.safeCallback(callback, err);
            });
        },
        function DBCompactDatabase(callback) {
            compactDatabase(req, self, function DBCompactDatabaseCallback(err) {
                if (err) {
                    err.message = '[Database - compact] error while calling compactDatabase: ' + err.message;
                    konsole.error(req, JSON.stringify(err));
                }
                return xcsutil.safeCallback(callback, err);
            });
        }

    ], function DBCompactFinalizer(err) {
        xcsutil.logLevelDec(req);
        if (err && (202 !== err.status)) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var isCompactionActiveURL = 'https://' + req.host + ':' + k.XCSHTTPSPort + '/' + k.XCSAPIBasePath + '/is_compaction_active';
            return xcsutil.standardizedResponse(res, 202, isCompactionActiveURL);
        }
    });

};

/* Module exports */

module.exports = new XCSDatabaseClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function compactViews(req, databaseClass, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - compactViews] Compacting views';

    konsole.log(req, functionTitle);

    function bailOutIfError(err) {
        if (err) {
            xcsutil.logLevelDec(req);
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

                    konsole.log(req, '    Compacting view ' + view);

                    // Issue a view compact request
                    var compactViewURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchDatabase + '/_compact/' + view;
                    couchdbRequestWithURL_internal(compactViewURL, 'POST', 202, bailOutIfError);
                }
            }
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb);
        }
    });

}

function cleanOldIndexes(req, databaseClass, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - cleanOldIndexes] Cleaning old indexes';

    konsole.log(req, functionTitle);

    var viewCleanupURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchDatabase + '/_view_cleanup';

    couchdbRequestWithURL_internal(viewCleanupURL, 'POST', 202, function DBCleanOldIndexesSendRequest(err) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb);
        }
    });

}

function compactDatabase(req, databaseClass, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - compactDatabase] Compacting the database';

    konsole.log(req, functionTitle);

    var viewCleanupURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchDatabase + '/_compact';

    couchdbRequestWithURL_internal(viewCleanupURL, 'POST', 202, function DBCompactDatabaseSendRequest(err) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb);
        }
    });

}

function allDesignDocuments(req, cb) {

    xcsutil.logLevelInc(req);

    var databaseURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchDatabase + '/_all_docs?startkey=\"_design/\"&endkey=\"_design0\"&include_docs=true';

    couchdbRequestWithURL_internal(databaseURL, 'GET', 200, function DBAllDesignDocumentsInternalCallback(err, designDocs) {
        if (err) {
            xcsutil.logLevelDec(req);
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
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, null, results);
        }
    });

}

function couchdbRequestWithURL_internal(url, method, expectedStatusCode, cb) {
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