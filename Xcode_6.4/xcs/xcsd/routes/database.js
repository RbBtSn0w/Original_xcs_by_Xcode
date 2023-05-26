'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    async = require('async'),
    request = require('request'),
    db_core = require('./db_core.js'),
    os = require('os'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

var database = {};

database.health_internal = function (req, cb) {

    xcsutil.logLevelInc(req);

    var databaseURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchDatabase,
        functionTitle = '[Health - status] obtaining couchdb health info...',
        healthObj = {};

    konsole.log(req, functionTitle);

    async.waterfall([

        function (callback) {
            request(databaseURL, function (err, response, body) {
                if (err || (200 !== response.statusCode)) {
                    if (err) {
                        konsole.error(req, err);
                        return callback({
                            status: 500,
                            message: err
                        });
                    } else {
                        konsole.error(req, 'Requested database not found');
                        return callback({
                            status: 404,
                            message: 'Requested database not found'
                        });
                    }
                } else {
                    // Merge the response
                    body = JSON.parse(body);
                    for (var key in body) {
                        if (body.hasOwnProperty(key)) {
                            healthObj[key] = db_core.patchObjectWithObject(req, healthObj[key], body[key]);
                        }
                    }
                    return callback(null, healthObj);
                }
            });
        },
        function (healthObj, callback) {
            var statsURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchStats;
            request(statsURL, function (err, response, body) {
                if (err || (200 !== response.statusCode)) {
                    if (err) {
                        konsole.error(req, err);
                        return callback({
                            status: 500,
                            message: err
                        });
                    } else {
                        konsole.error(req, 'Requested database not found');
                        return callback({
                            status: 404,
                            message: 'Requested database not found'
                        });
                    }
                } else {
                    // Merge the response
                    body = JSON.parse(body);
                    for (var key in body) {
                        if (body.hasOwnProperty(key)) {
                            healthObj[key] = db_core.patchObjectWithObject(req, healthObj[key], body[key]);
                        }
                    }
                    return callback(null, healthObj);
                }
            });
        }

    ], function (err, healthObj) {
        xcsutil.logLevelDec(req);
        return cb(err, healthObj);
    });
};

database.health = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req),
        functionTitle = '[Database - health] checking database health...';

    konsole.log(req, functionTitle);

    database.health_internal(req, function (err, health) {
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

database.isCompactionActive_internal = function (req, cb) {

    var compactionIsActiveURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/_active_tasks/';

    couchdbRequestWithURL(req, compactionIsActiveURL, 'GET', 200, function (err, body) {
        if (err) {
            konsole.error(req, err.message);
            return cb(err);
        } else {
            return cb(null, body.length > 0);
        }
    });

};

database.isCompactionActive = function (req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - isCompactionActive] checking whether compaction is active...';

    konsole.log(req, functionTitle);

    database.isCompactionActive_internal(req, function (err, isBeingCompacted) {
        if (err) {
            konsole.error(req, err.message);
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            konsole.log(req, '[Database - isCompactionActive] is it being compacted?: ' + isBeingCompacted);
            xcsutil.logLevelDec(req);
            return xcsutil.standardizedResponse(res, 200, isBeingCompacted);
        }
    });

};

database.fragmentationIndex = function (req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - fragmentationIndex] checking database fragmentation index...';

    konsole.log(req, functionTitle);

    var databaseURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchDatabase;

    couchdbRequestWithURL(req, databaseURL, 'GET', 200, function (err, body) {
        if (err) {
            konsole.error(req, err.message);
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

function couchdbRequestWithURL(req, url, method, expectedStatusCode, cb) {
    var options = {
        uri: url,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    request(options, function (err, response, body) {
        if (err || (expectedStatusCode !== response.statusCode)) {
            if (err) {
                return cb({
                    status: 500,
                    message: err
                });
            } else {
                return cb({
                    status: 404,
                    message: 'Requested database not found'
                });
            }
        } else {
            body = JSON.parse(body);
            return cb(null, body);
        }
    });
}

/**
 * Compacting section
 */

function compactViews(req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - compactViews] Compacting views...';

    konsole.log(req, functionTitle);

    var databaseURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchDatabase + '/_all_docs?startkey=\"_design/\"&endkey=\"_design0\"&include_docs=true';

    function bailOutIfError(err) {
        if (err) {
            xcsutil.logLevelDec(req);
            return cb(err);
        }
    }

    couchdbRequestWithURL(req, databaseURL, 'GET', 200, function (err, results) {
        if (err) {
            konsole.error(req, err.message);
            return cb(err);
        } else {
            for (var row in results.rows) {
                if (results.rows.hasOwnProperty(row)) {
                    var id = results.rows[row].id,
                        view = id.substring(id.indexOf('/') + 1, id.length);

                    konsole.log(req, '    Compacting view ' + view);

                    // Issue a view compact request
                    var compactViewURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchDatabase + '/_compact/' + view;
                    couchdbRequestWithURL(req, compactViewURL, 'POST', 202, bailOutIfError);
                }
            }
            xcsutil.logLevelDec(req);
            return cb();
        }
    });

}

function cleanOldIndexes(req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - cleanOldIndexes] Cleaning old indexes...';

    konsole.log(req, functionTitle);

    var viewCleanupURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchDatabase + '/_view_cleanup';

    couchdbRequestWithURL(req, viewCleanupURL, 'POST', 202, function (err) {
        if (err) {
            konsole.error(req, err.message);
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            xcsutil.logLevelDec(req);
            return cb();
        }
    });

}

function compactDatabase(req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - compactDatabase] Compacting the database...';

    konsole.log(req, functionTitle);

    var viewCleanupURL = 'http://' + k.XCSCouchHost + ':' + k.XCSCouchPort + '/' + k.XCSCouchDatabase + '/_compact';

    couchdbRequestWithURL(req, viewCleanupURL, 'POST', 202, function (err) {
        if (err) {
            konsole.error(req, err.message);
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            xcsutil.logLevelDec(req);
            return cb();
        }
    });

}

database.compact = function (req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Database - compact] executing database maintenance...';

    konsole.log(req, functionTitle);

    async.waterfall([

        function (callback) {
            database.isCompactionActive_internal(req, function (err, isBeingCompacted) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, isBeingCompacted);
                }
            });
        },
        function (isBeingCompacted, callback) {
            if (true === isBeingCompacted) {
                return callback({
                    status: 202,
                    message: 'Database already being compacted'
                });
            } else {
                compactViews(req, function (err) {
                    return callback(err);
                });
            }
        },
        function (callback) {
            cleanOldIndexes(req, function (err) {
                return callback(err);
            });
        },
        function (callback) {
            compactDatabase(req, function (err) {
                return callback(err);
            });
        }

    ], function (err) {
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
module.exports = database;