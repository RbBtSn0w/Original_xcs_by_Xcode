'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    db_core = require('./db_core.js'),
    konsole = require('../util/konsole.js'),
    shared_doc = require('./shared_doc.js'),
    xcsutil = require('../util/xcsutil.js'),
    redis = require('../classes/redisClass.js');

var version = {};

function getVersionKey(req) {
    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);
    var versionKey = k.XCSDesignDocumentVersion;
    if (unitTestUUID) {
        versionKey = k.XCSDesignDocumentVersion + ':' + unitTestUUID;
    }
    return versionKey;
}

function versionDefaults() {
    var defaultContents = {};
    return defaultContents;
}

/**
 * Create and Read
 */

version.findOrCreateVersionDocument = function (req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Version - findOrCreateVersionDocument] findOrCreateVersionDocument...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var versionKey = getVersionKey(req),
        defaults = versionDefaults();

    shared_doc.findOrCreateDefaultSharedDocument(req, versionKey, k.XCSDesignDocumentVersion, defaults, function (err, doc) {
        xcsutil.logLevelDec(req);
        if (err) {
            return cb(err);
        } else {
            return cb(null, doc);
        }
    });

};

version.findVersion = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Version - findVersion] ' + req.method + ' ' + req.url + '...',
        self = version;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    self.findOrCreateVersionDocument(req, function (err, doc) {

        xcsutil.logLevelDec(req);
        xcsutil.profilerSummary(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, doc);
        }
    });

};

version.list = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Version - list] ' + req.method + ' ' + req.url + '...',
        query = {
            key: k.XCSDesignDocumentVersion,
            include_docs: true
        };

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    shared_doc.list(req, k.XCSDesignDocumentVersion, k.XCSDesignDocumentViewAllVersions, query, function (err, docs) {
        // Not finding documents doesn't mean it's an error. Let's report true errors instead.
        if (err && err.status !== 404) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

/**
 * Update
 */

version.update = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Version - update] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var versionKey = getVersionKey(req),
        defaults = versionDefaults();

    shared_doc.update(req, versionKey, k.XCSDesignDocumentVersion, defaults, function (err, updated_doc) {
        if (err) {
            konsole.error(req, '[Version - update] error: ' + err.message);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedResponse(res, 200, updated_doc);
        }
    });

};

/**
 * Remove
 */

version.remove = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Version - remove] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    db_core.removeDocument(req, req.params.id, req.params.rev, function (err) {
        xcsutil.logLevelDec(req);
        xcsutil.profilerSummary(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            konsole.error(req, '[Version - remove] error: ' + err.message);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var versionKey = getVersionKey(req);
            redis.del(req, versionKey);
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

version.removeAll = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Version - removeAll] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        query = {
            include_docs: false
        };

    if (unitTestUUID) {
        query.startkey = [unitTestUUID];
        query.endkey = [unitTestUUID, {}];
    }

    db_core.removeAll(req, k.XCSDesignDocumentVersion, k.XCSDesignDocumentViewAllVersions, query, function (err) {
        xcsutil.logLevelDec(req);
        xcsutil.profilerSummary(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err && err.status !== 404) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            redis.del(req, k.XCSDesignDocumentVersion + '*');
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

/**
 * [PRIVATE] Create: for unit tests only
 */

version.createVersionDocument = function (req, versionKey, body, cb) {

    xcsutil.logLevelInc(req);

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        timerName;

    if (unitTestUUID) {
        timerName = '[Version - createVersionDocument] create version document: ' + unitTestUUID;
    } else {
        timerName = '[Version - createVersionDocument] create default version document';
    }

    console.time(timerName);
    konsole.log(req, timerName);

    if (req && req.snitch) {
        req.snitch.next(timerName);
    }

    if (!body) {
        var error = {};
        error.status = 400;
        error.message = 'Bad Request';
        return cb(error);
    }

    db_core.createDocument(req, k.XCSDesignDocumentVersion, body, function (err, url, version) {
        if (err) {
            konsole.error(req, '[Version - createVersionDocument] create document failed: ' + err.message);
            console.timeEnd(timerName);
            return cb(err);
        } else {
            // Remove the document cached by db_core, since we're not going to ever lookup by _id.
            // Instead, we'll be looking for the specially-crafted key (see below).
            redis.del(req, version._id);
            konsole.log(req, '[Version - createVersionDocument] removed document from Redis: ' + version._id);

            if (unitTestUUID) {
                var redisClient = redis.client();
                redisClient.setex(versionKey, k.XCSUnitTestTTLInSeconds, JSON.stringify(version), function (err) {
                    if (err) {
                        konsole.error(req, '[Version - createVersionDocument] error: ' + JSON.stringify(err));
                    } else {
                        konsole.log(req, '[Version - createVersionDocument] unit test version document cached to Redis: ' + versionKey);
                    }
                    xcsutil.logLevelDec(req);
                    return cb(null, url, version);
                });
            } else {
                redis.set(req, versionKey, JSON.stringify(version), function (err) {
                    if (err) {
                        konsole.error(req, '[Version - createVersionDocument] error: ' + JSON.stringify(err));
                    } else {
                        konsole.log(req, '[Version - createVersionDocument] default version document cached to Redis: ' + versionKey);
                    }
                    xcsutil.logLevelDec(req);
                    return cb(null, url, version);
                });
            }
        }
    });

};

version.create = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var timerName = '[Version - create] ' + req.method + ' ' + req.url;
    console.time(timerName);
    konsole.log(req, timerName);

    if (req && req.snitch) {
        req.snitch.title = timerName;
        req.snitch.next(timerName);
    }

    var versionKey = getVersionKey(req),
        body = req.body,
        self = version;

    self.createVersionDocument(req, versionKey, body, function (err, url, version) {
        console.timeEnd(timerName);
        if (err) {
            konsole.error(req, '[Version - create] error: ' + err.message);
            xcsutil.logLevelDec(req);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            res.writeHead(201, url);
            xcsutil.logLevelDec(req);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedResponseWrite(res, version);
        }
    });

};

module.exports = version;