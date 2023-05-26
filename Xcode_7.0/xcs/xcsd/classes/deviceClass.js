/*
    XCSDeviceClass
    A class dedicated to interact with devices.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var async = require('async');

var k = require('../constants.js'),
    te = require('../util/turboevents.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js'),
    redisClass = require('./redisClass.js');

/* XCSDeviceClass object */

function XCSDeviceClass() {}

XCSDeviceClass.prototype.findDocumentWithUUID = function XCSDBCoreClassFindDocumentWithUUID(req, doc_UUID, doc_type, cb) {
    var self = this;
    self.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

XCSDeviceClass.prototype.create = function create(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - create] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var body = req.body;
    if (!body) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body is empty'
        });
    }

    dbCoreClass.createDocument(req, k.XCSDesignDocumentDevice, req.body, function DEVCreateDocument(err, url, newDevice) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            te.broadcast(k.XCSIsListenerForDeviceUpdates, k.XCSEmitNotificationDeviceCreated, newDevice);

            redisClass.delDynamicQuery(req, k.XCSDesignDocumentDevice);

            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

            res.set(k.XCSResponseLocation, url);

            return xcsutil.standardizedResponse(res, 201, newDevice);
        }
    });

};

XCSDeviceClass.prototype.findDeviceWithUUID = function findDeviceWithUUID(req, deviceUUID, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Device - findDeviceWithUUID] find device with UUID';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!deviceUUID) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the device ID has not been specified'
        });
    }

    dbCoreClass.findDocumentWithUUID(req, deviceUUID, k.XCSDesignDocumentDevice, function DEVFindDeviceWithUUID(err, doc) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, doc);
        }
    });

};

XCSDeviceClass.prototype.find = function find(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - find] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var deviceUUID = req.params.id,
        self = this;

    self.findDeviceWithUUID(req, deviceUUID, function DEVFindDevice(err, device) {
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

XCSDeviceClass.prototype.list = function list(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - list] ' + req.method + ' ' + req.url,
        doc_type = k.XCSDesignDocumentDevice;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
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

    redisClass.getDynamicQuery(req, doc_type, function DEVListRedisGetDynamicQuery(err, docs) {
        if (err) {
            opFailed(err);
        } else if (docs) {
            docs = JSON.parse(docs);
            konsole.log(req, '[Device - list] number of documents found in Redis: ' + docs.length);
            opSucceeded(docs);
        } else {
            konsole.log(req, '[Device - list] find the devices in CouchDB');

            var query = {
                include_docs: true
            };

            if (unitTestUUID) {
                query.startkey = [unitTestUUID];
                query.endkey = [unitTestUUID, {}];
            }

            dbCoreClass.listAllDocuments(req, k.XCSDesignDocumentDevice, function DEVListAllDocuments(err, docs) {
                // Not finding documents doesn't mean it's an error. Let's report true errors instead.
                if (err && err.status !== 404) {
                    opFailed(err);
                } else {
                    konsole.log(req, '[Device - list] number of documents found in CouchDB: ' + docs.length);
                    redisClass.setDynamicQuery(req, doc_type, JSON.stringify(docs), function DEVListRedisSetDynamicQuery(err, wasSaved) {
                        if (wasSaved) {
                            konsole.log(req, '[Device - list] list of devices retrieved. Cache the results to Redis.');
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

        xcsutil.checkForAppleInternalDirectory(function (err) {
            if (err) {
                async.reject(docs, function (device, callback) {
                    callback((device.platformIdentifier && ('com.apple.platform.watchsimulator' === device.platformIdentifier)));
                }, function (filteredDevices) {
                    return xcsutil.standardizedResponse(res, 200, filteredDevices);
                });
            } else {
                return xcsutil.standardizedResponse(res, 200, docs);
            }
        });

    }

};

XCSDeviceClass.prototype.server = function server(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - server] ' + req.method + ' ' + req.url,
        doc_type = k.XCSDesignDocumentDevice;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    redisClass.getDynamicQuery(req, doc_type, function DEVServerRedisGetDynamicQuery(err, docs) {
        if (err) {
            opFailed(err);
        } else if (docs) {
            docs = JSON.parse(docs);
            konsole.log(req, '[Device - server] number of documents found in Redis: ' + docs.length);
            opSucceeded(docs);
        } else {
            konsole.log(req, '[Device - server] find the server document in CouchDB');

            var query = {
                key: 'device',
                include_docs: true
            };

            dbCoreClass.findDocumentsWithQuery(req, doc_type, k.XCSDesignDocumentViewThisDevice, query, function DEVServerFindDocument(err, docs) {
                // Not finding documents doesn't mean it's an error. Let's report true errors instead.
                if (err && err.status !== 404) {
                    opFailed(err);
                } else {
                    konsole.log(req, '[Device - server] number of documents found in CouchDB: ' + docs.length);
                    redisClass.setDynamicQuery(req, doc_type, JSON.stringify(docs), function DEVServerRedisSetDynamicQuery(err, wasSaved) {
                        if (wasSaved) {
                            konsole.log(req, '[Device - server] server document cached to Redis.');
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

XCSDeviceClass.prototype.update = function update(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - update] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this;

    var body = xcsutil.patchBodyForClient(req);

    if (!body) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body is empty'
        });
    }


    var deviceUUID = req.params.id;

    // Retrieve the device to be patched
    self.findDeviceWithUUID(req, deviceUUID, function DEVUpdateDeviceFindDevice(err, device) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        }

        // Patch every property specified in the body
        for (var key in body) {
            if (body.hasOwnProperty(key)) {
                device[key] = xcsutil.patchDocumentWithObject(device[key], body[key]);
            }
        }

        dbCoreClass.updateDocumentWithUUID(req, deviceUUID, device, false, k.XCSDesignDocumentDevice, function DEVUpdateDevice(err, body) {
            if (err) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                te.broadcast(k.XCSIsListenerForDeviceUpdates, k.XCSEmitNotificationDeviceUpdated, body);

                redisClass.delDynamicQuery(req, k.XCSDesignDocumentDevice);

                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);

                return xcsutil.standardizedResponse(res, 200, body);
            }
        });

    });
};

XCSDeviceClass.prototype.remove = function remove(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Device - remove] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        deviceUUID = req.params.id,
        deviceRev = req.params.rev;

    function doRemove() {
        dbCoreClass.removeDocument(req, deviceUUID, deviceRev, function DEVDoRemove(err) {
            if (err) {
                if (409 === err.status) {
                    // Retrieve the device to be patched
                    self.findDeviceWithUUID(req, deviceUUID, function DEVDoRemoveFindDevice(err, device) {
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

                redisClass.delDynamicQuery(req, k.XCSDesignDocumentDevice);

                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);

                return xcsutil.standardizedResponse(res, 204);
            }
        });
    }

    doRemove();

};

/* Module exports */

module.exports = new XCSDeviceClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/