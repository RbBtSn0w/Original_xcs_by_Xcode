'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    db_core = require('./db_core.js'),
    konsole = require('../util/konsole.js'),
    util = require('util'),
    xcsutil = require('../util/xcsutil.js'),
    redis = require('../classes/redisClass.js');

var shared_doc = {};

shared_doc.findOrCreateDefaultSharedDocument = function (req, shared_doc_key, doc_type, body, cb) {

    xcsutil.logLevelInc(req);

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        functionTitle;

    if (unitTestUUID) {
        functionTitle = '[SharedDoc - findOrCreateDefaultSharedDocument] find or create the unit test ' + doc_type + ' shared document: ' + shared_doc_key;
    } else {
        functionTitle = '[SharedDoc - findOrCreateDefaultSharedDocument] find or create the ' + doc_type + ' shared document: ' + shared_doc_key;
    }

    konsole.log(req, functionTitle);

    redis.get(req, shared_doc_key, function (err, reply) {
        if (err || !reply) {
            if (unitTestUUID) {
                body[k.XCSUnitTestProperty] = unitTestUUID;
            }

            db_core.findOrCreateDefaultDocument(req, doc_type, body, function (err, doc) {
                if (err) {
                    xcsutil.logLevelDec(req);
                    return cb(err);
                } else {
                    // Remove the document cached by db_core, since we're not going to ever lookup by _id.
                    // Instead, we'll be looking for the specially-crafted key (see below).

                    redis.del(req, doc._id);
                    konsole.log(req, '[SharedDoc - findOrCreateDefaultSharedDocument] removed document from Redis: ' + doc._id);

                    if (unitTestUUID) {
                        var redisClient = redis.client();
                        redisClient.setex(shared_doc_key, k.XCSUnitTestTTLInSeconds, JSON.stringify(doc));
                        konsole.log(req, '[SharedDoc - findOrCreateDefaultSharedDocument] unit test ' + doc_type + ' document cached to Redis: ' + shared_doc_key);
                        xcsutil.logLevelDec(req);
                        return cb(err, doc);
                    } else {
                        redis.set(req, shared_doc_key, JSON.stringify(doc), function (err) {
                            if (err) {
                                konsole.error(req, '[SharedDoc - findOrCreateDefaultSharedDocument] error: ' + JSON.stringify(err));
                            } else {
                                konsole.log(req, '[SharedDoc - findOrCreateDefaultSharedDocument - findOrCreateDefaultDocument] default ' + doc_type + ' document cached to Redis: ' + shared_doc_key);
                            }
                            xcsutil.logLevelDec(req);
                            return cb(null, doc);
                        });
                    }
                }
            });
        } else {
            if (unitTestUUID) {
                konsole.log(req, '[SharedDoc - findOrCreateDefaultSharedDocument] unit test ' + doc_type + ' document found in Redis: ' + shared_doc_key);
            } else {
                konsole.log(req, '[SharedDoc - findOrCreateDefaultSharedDocument] default ' + doc_type + ' document found in Redis: ' + shared_doc_key);
            }
            xcsutil.logLevelDec(req);
            return cb(null, JSON.parse(reply));
        }
    });

};

shared_doc.list = function (req, doc_type, view_name, query, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[SharedDoc - list] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    db_core.findDocumentsWithQuery(req, doc_type, view_name, query, function (err, docs) {
        // Not finding documents doesn't mean it's an error. Let's report true errors instead.
        xcsutil.logLevelDec(req);
        if (err && err.status !== 404) {
            return cb(err);
        } else {
            return cb(null, docs);
        }

    });

};

/**
 * Update
 */

shared_doc.update = function (req, shared_doc_key, doc_type, defaults, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[SharedDoc - update] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    // Verify that the body has been specified
    var set_props = req.body[k.XCSSetProperties];

    if (!set_props) {
        xcsutil.logLevelDec(req);
        return cb({
            status: 400,
            message: 'Bad Request'
        });
    }

    var self = shared_doc,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    // Retrieve the shared document to be patched
    self.findOrCreateDefaultSharedDocument(req, shared_doc_key, doc_type, defaults, function (err, doc) {
        if (err) {
            xcsutil.logLevelDec(req);
            return cb(err);
        }

        // Replace the property with the new one
        for (var key in set_props) {
            if (set_props.hasOwnProperty(key)) {
                doc[key] = set_props[key];
            }
        }

        konsole.debug(req, '[SharedDoc - update] patch with: ' + util.inspect(doc));

        db_core.updateDocumentWithUUID(req, doc._id, doc, doc_type, function (err, updated_doc) {
            if (err) {
                konsole.error(req, '[SharedDoc - update] error: ' + err.message);
                xcsutil.logLevelDec(req);
                return cb(err);
            } else {

                // Remove the document cached by db_core, since we're not going to ever lookup by _id.
                // Instead, we'll be looking for the specially-crafted key (see below).

                redis.del(req, updated_doc._id);
                konsole.log(req, '[SharedDoc - update] removed document from Redis: ' + updated_doc._id);

                // Set the new shared document
                redis.set(req, shared_doc_key, JSON.stringify(updated_doc), function (err) {
                    if (err) {
                        konsole.error(req, '[SharedDoc - update] error: ' + JSON.stringify(err));
                    } else {
                        if (unitTestUUID) {
                            konsole.log(req, '[SharedDoc - update] unit test ' + doc_type + ' document cached to Redis: ' + shared_doc_key);
                        } else {
                            konsole.log(req, '[SharedDoc - update] default ' + doc_type + ' document cached to Redis: ' + shared_doc_key);
                        }
                    }
                    xcsutil.logLevelDec(req);
                    return cb(null, updated_doc);
                });
            }
        });

    });

};

module.exports = shared_doc;