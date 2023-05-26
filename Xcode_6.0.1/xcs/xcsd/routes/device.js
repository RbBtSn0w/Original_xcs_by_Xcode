'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    te = require('../util/turboevents.js'),
    db_core = require('./db_core.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js'),
    redis = require('./redis.js');

var device = {};

/**
 * Create
 */

device.create = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - create] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var body = req.body;
    if (!body) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }

    db_core.createDocument(req, k.XCSDesignDocumentDevice, req.body, function (err, url, newDevice) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            te.broadcast(k.XCSIsListenerForDeviceUpdates, k.XCSEmitNotificationDeviceCreated, newDevice);

            redis.delDynamicQuery(req, k.XCSDesignDocumentDevice);

            res.writeHead(201, url);

            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

            return xcsutil.standardizedResponseWrite(res, newDevice);
        }
    });

};

/**
 * Read
 */

device.findDeviceWithUUID = function (req, deviceUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Device - findDeviceWithUUID] find device with UUID...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var error = {};

    if (!deviceUUID) {
        error.status = 400;
        error.message = 'Bad Request';
        xcsutil.logLevelDec(req);
        return cb(error);
    }

    db_core.findDocumentWithUUID(req, deviceUUID, k.XCSDesignDocumentDevice, function (err, doc) {
        xcsutil.logLevelDec(req);
        if (err) {
            return cb(err);
        } else {
            return cb(null, doc);
        }
    });

};

device.find = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - find] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var deviceUUID = req.params.id,
        self = device;

    self.findDeviceWithUUID(req, deviceUUID, function (err, device) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            if (device) {
                return xcsutil.standardizedResponse(res, 200, device);
            } else {
                return xcsutil.standardizedErrorResponse(res, {
                    status: 404,
                    message: 'Not found'
                });
            }
        }
    });

};

device.list = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - list] ' + req.method + ' ' + req.url + '...',
        doc_type = k.XCSDesignDocumentDevice;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        query = {
            include_docs: true
        };

    if (unitTestUUID) {
        query.startkey = [unitTestUUID];
        query.endkey = [unitTestUUID, {}];
    }

    redis.getDynamicQuery(req, doc_type, function (err, docs) {
        if (err) {
            opFailed(err);
        } else if (docs) {
            konsole.log(req, '[Device - listAllBots] Bot found in Redis.');
            opSucceeded(JSON.parse(docs));
        } else {
            konsole.log(req, '[Device - listAllBots] find the bot document in CouchDB');

            var query = {
                include_docs: true
            };

            if (unitTestUUID) {
                query.startkey = [unitTestUUID];
                query.endkey = [unitTestUUID, {}];
            }

            db_core.findDocumentsWithQuery(req, doc_type, k.XCSDesignDocumentViewAllDevices, query, function (err, docs) {
                // Not finding documents doesn't mean it's an error. Let's report true errors instead.
                if (err && err.status !== 404) {
                    opFailed(err);
                } else {
                    konsole.log(req, '[Device - listAllBots] document found.');
                    redis.setDynamicQuery(req, doc_type, JSON.stringify(docs), function (err, wasSaved) {
                        if (wasSaved) {
                            konsole.log(req, '[Device - listAllBots] cache the results to Redis.');
                        }
                        // Even if there's an error (i.e. Redis suddenly went down), we can still continue since
                        // the next request would be redirected to CouchDB.
                        opSucceeded(docs);
                    });
                }

            });
        }
    });

    function opFailed(err) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, err);
    }

    function opSucceeded(docs) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedResponse(res, 200, docs);
    }

};

device.server = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - server] ' + req.method + ' ' + req.url + '...',
        doc_type = k.XCSDesignDocumentDevice;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    redis.getDynamicQuery(req, doc_type, function (err, docs) {
        if (err) {
            opFailed(err);
        } else if (docs) {
            konsole.log(req, '[Device - server] Device found in Redis.');
            opSucceeded(JSON.parse(docs));
        } else {
            konsole.log(req, '[Device - server] find the server document in CouchDB');

            var query = {
                key: 'device',
                include_docs: true
            };

            db_core.findDocumentsWithQuery(req, doc_type, k.XCSDesignDocumentViewThisDevice, query, function (err, docs) {
                // Not finding documents doesn't mean it's an error. Let's report true errors instead.
                if (err && err.status !== 404) {
                    opFailed(err);
                } else {
                    konsole.log(req, '[Device - server] server document found.');
                    redis.setDynamicQuery(req, doc_type, JSON.stringify(docs), function (err, wasSaved) {
                        if (wasSaved) {
                            konsole.log(req, '[Device - listAllBots] cache the results to Redis.');
                        }
                        // Even if there's an error (i.e. Redis suddenly went down), we can still continue since
                        // the next request would be redirected to CouchDB.
                        opSucceeded(docs);
                    });
                }

            });
        }
    });

    function opFailed(err) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, err);
    }

    function opSucceeded(docs) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedResponse(res, 200, docs);
    }

};

/**
 * Update
 */

device.update = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - update] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var self = device;

    // Verify that the body has been specified
    var set_props = req.body[k.XCSSetProperties],
        unset_props = req.body[k.XCSUnsetProperties];

    if (!set_props && !unset_props) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }


    var deviceUUID = req.params.id;

    // Retrieve the device to be patched
    self.findDeviceWithUUID(req, deviceUUID, function (err, device) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        }

        // Patch every property specified in the body
        for (var key in set_props) {
            if (set_props.hasOwnProperty(key)) {
                device[key] = db_core.patchObjectWithObject(req, device[key], set_props[key]);
            }
        }

        db_core.updateDocumentWithUUID(req, deviceUUID, device, k.XCSDesignDocumentDevice, function (err, body) {
            if (err) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                te.broadcast(k.XCSIsListenerForDeviceUpdates, k.XCSEmitNotificationDeviceUpdated, body);

                redis.delDynamicQuery(req, k.XCSDesignDocumentDevice);

                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);

                return xcsutil.standardizedResponse(res, 200, body);
            }
        });

    });
};

/**
 * Remove
 */

device.remove = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - remove] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var self = device,
        deviceUUID = req.params.id,
        deviceRev = req.params.rev;

    function doRemove() {
        db_core.removeDocument(req, deviceUUID, deviceRev, function (err) {
            if (err) {
                if (409 === err.status) {
                    // Retrieve the device to be patched
                    self.findDeviceWithUUID(req, deviceUUID, function (err, device) {
                        if (err) {
                            xcsutil.profilerSummary(req);
                            xcsutil.logLevelDec(req);
                            xcsutil.logLevelCheck(req, logLevel);

                            // Perhaps the document doesn't exist any longer?
                            // In any event, there is little we can do about this now.

                            return xcsutil.standardizedErrorResponse(res, err);
                        } else {
                            // Reset the revision we've just obtained and try again
                            deviceRev = device._rev;
                            doRemove();
                        }
                    });
                } else {
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedErrorResponse(res, err);
                }
            } else {
                // emit a notification
                te.broadcast(k.XCSIsListenerForDeviceUpdates, k.XCSEmitNotificationDeviceRemoved, {
                    _id: req.params.id
                });

                redis.delDynamicQuery(req, k.XCSDesignDocumentDevice);

                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);

                return xcsutil.standardizedResponse(res, 204);
            }
        });
    }

    doRemove();

};

device.removeAll = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - removeAll] ' + req.method + ' ' + req.url + '...';

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

    db_core.removeAll(req, k.XCSDesignDocumentDevice, k.XCSDesignDocumentViewAllDevices, query, function (err) {
        redis.delDynamicQuery(req, k.XCSDesignDocumentDevice);

        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (err && err.status !== 404) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

/* Module exports */
module.exports = device;