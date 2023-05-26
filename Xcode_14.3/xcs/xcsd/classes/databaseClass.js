/*
    XCSDatabaseClass
    A class dedicated to interact with CouchDB.
*/

'use strict';

var k = require('../constants.js'),
    async = require('async'),
    config = require('config');

var Errors = require('../util/error.js'),
    xcs_db = require('./xcsdb.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js');

function XCSDatabaseClass() {}

XCSDatabaseClass.prototype.health_internal = function health_internal(req, cb) {
    var log = logger.withRequest(req),
        healthObj = {};

    log.info('Determining database health.');

    function patchHealthInfo(body) {
        for (var key in body) {
            if (body.hasOwnProperty(key)) {
                healthObj[key] = xcsutil.patchDocumentWithObject(healthObj[key], body[key]);
            }
        }
    }

    return xcs_db.nano()
        .then(nano => nano.db.getAsync(xcs_db.config.db))
        .then(patchHealthInfo)
        .then(() => xcs_db.nano())
        .then(nano => nano.requestAsync({path: k.XCSCouchStats}))
        .then(patchHealthInfo)
        .then(() => healthObj)
        .asCallback(cb);
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
    return xcs_db.nano()
        .then(nano => nano.requestAsync({ path: '_active_tasks' }))
        .asCallback(cb);
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

XCSDatabaseClass.prototype.fragmentationIndex = function fragmentationIndex(req, res, next) {
    xcs_db.nano()
        .then(nano => nano.db.getAsync(xcs_db.config.db))
        .then(body => {
            var fragIndex = ((body.disk_size - body.data_size) / (body.disk_size * 100));
            return xcsutil.standardizedResponse(res, 200, fragIndex);
        }, next);
};

XCSDatabaseClass.prototype.allDesignDocuments = function (req, res, next) {
    var log = logger.withRequest(req);
    log.info('Fetching all design documents.');

    allDesignDocuments(req)
        .then(docs => { xcsutil.standardizedResponse(res, 200, docs); }, next);
};

XCSDatabaseClass.prototype.reindexDatabase_internal = function reindexDatabase_internal(req, cb) {

    var log = logger.withRequest(req);
    var redis = require('./redisClass.js').client();

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

                xcs_db().then(db => db.view(design, view, query));

                return callback();

            }, function DBReindexFinalizer() {
                log.info('Done asking CouchDB to reindex design documents.');

                return xcsutil.safeCallback(cb);
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
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

XCSDatabaseClass.prototype.compact = function compact(req, res, next) {
    var log = logger.withRequest(req);

    log.info('Compacting CouchDB.');

    return this.activeCouchDBTasks_internal(req)
        .then(tasks => {
            if (tasks.length > 0) {
                throw new Errors.HTTPError(202, 'Database is already being compacted');
            } else {
                return compactViews(req);
            }
        })
        .then(() => cleanOldIndexes(req))
        .then(() => compactDatabase(req))
        .catch(err => {
            // let the 202 already compacted go through
            if (err.status !== 202) {
                throw err;
            }
            return null;
        })
        .then(() => {
            var isCompactionActiveURL = 'https://' + req.hostname + ':' + config.get('app.httpsPort') + k.XCSAPIBasePath + '/is_compaction_active';
            xcsutil.standardizedResponse(res, 202, isCompactionActiveURL);
        }, next);
};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSDatabaseClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function compactViews(req, databaseClass, cb) {
    var log = logger.withRequest(req);
    log.info('Compacting CouchDB views.');

    return allDesignDocuments(req)
        .map(object => {
            const design = Object.keys(object)[0];

            log.debug('Compacting view', design);

            return xcs_db.nano()
                .then(nano => nano.requestAsync({
                    method: 'POST',
                    db: xcs_db.config.db,
                    path: `_compact/${design}`
                }));
        })
        .all()
        .asCallback(cb);
}

function cleanOldIndexes(req, databaseClass, cb) {
    var log = logger.withRequest(req);
    log.info('Cleaning old CouchDB indices.');

    return xcs_db.nano()
        .then(nano => nano.requestAsync({
            method: 'POST',
            db: xcs_db.config.db,
            path: '_view_cleanup'
        }))
        .asCallback(cb);
}

function compactDatabase(req, databaseClass, cb) {
    var log = logger.withRequest(req);
    log.info('Compacting CouchDB database.');

    return xcs_db.nano()
        .then(nano => nano.requestAsync({
            method: 'POST',
            db: xcs_db.config.db,
            path: '_compact'
        }))
        .asCallback(cb);
}

function allDesignDocuments(req, cb) {
    var log = logger.withRequest(req);

    log.debug('Fetching all CouchDB design documents.');

    return xcs_db()
        .then(db => db.listAsync({
            startkey: '_design',
            endkey: '_design0',
            include_docs: true
        }))
        .then(designDocs => {
            let results = [],
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
            return results;
        })
        .asCallback(cb);
}
