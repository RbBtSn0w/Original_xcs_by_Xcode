/*
    XCSDeviceClass
    A class dedicated to interact with devices.
*/

'use strict';

var async = require('async');

var k = require('../constants.js'),
    te = require('../util/turboevents.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    logger = require('../util/logger.js'),
    redisClass = require('./redisClass.js');

/* XCSDeviceClass object */

function XCSDeviceClass() {}

XCSDeviceClass.prototype.create = function create(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Device - create] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var body = req.body;
    if (!body) {
        xcsutil.profilerSummary(req);


        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body is empty'
        });
    }

    log.info('Creating new device', body.name);

    dbCoreClass.createDocument(req, k.XCSDesignDocumentDevice, req.body, function DEVCreateDocument(err, url, newDevice) {
        if (err) {
            xcsutil.profilerSummary(req);


            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            redisClass.delDynamicQuery(req, k.XCSDesignDocumentDevice, function () {
                xcsutil.profilerSummary(req);
                te.broadcast(k.XCSIsListenerForDeviceUpdates, k.XCSEmitNotificationDeviceCreated, newDevice);
                res.set(k.XCSResponseLocation, url);
                return xcsutil.standardizedResponse(res, 201, newDevice);
            });
        }
    });

};

XCSDeviceClass.prototype.findDeviceWithUUID = function findDeviceWithUUID(req, deviceUUID, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Device - findDeviceWithUUID] find device with UUID';

    log.info('Fetching device', deviceUUID);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!deviceUUID) {

        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the device ID has not been specified'
        });
    }

    dbCoreClass.findDocumentWithUUID(req, deviceUUID, k.XCSDesignDocumentDevice, function DEVFindDeviceWithUUID(err, doc) {

        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, doc);
        }
    });

};

XCSDeviceClass.prototype.find = function find(req, res) {

    var functionTitle = '[Device - find] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var deviceUUID = req.params.id,
        self = this;

    self.findDeviceWithUUID(req, deviceUUID, function DEVFindDevice(err, device) {
        xcsutil.profilerSummary(req);


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

    var log = logger.withRequest(req),
        functionTitle = '[Device - list] ' + req.method + ' ' + req.url,
        doc_type = k.XCSDesignDocumentDevice;

    log.info('Fetching all devices.');

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
            log.info('Found', docs.length, 'devices in Redis.');
            opSucceeded(docs);
        } else {
            log.debug('No devices found in Redis. Falling back to CouchDB.');

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
                    log.info('Found', docs.length, 'devices in CouchDB.');

                    redisClass.setDynamicQuery(req, doc_type, JSON.stringify(docs), function DEVListRedisSetDynamicQuery(err, wasSaved) {
                        if (wasSaved) {
                            log.debug('Successfully cached devices to Redis.');
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


        return xcsutil.standardizedErrorResponse(res, err);
    }

    function opSucceeded(docs) {
        xcsutil.profilerSummary(req);



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

    var log = logger.withRequest(req),
        functionTitle = '[Device - server] ' + req.method + ' ' + req.url,
        doc_type = k.XCSDesignDocumentDevice;

    log.info('Loading the Mac device for the server.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    redisClass.getDynamicQuery(req, doc_type, function DEVServerRedisGetDynamicQuery(err, docs) {
        if (err) {
            opFailed(err);
        } else if (docs) {
            docs = JSON.parse(docs);
            log.info('Found', docs.length, 'server documents in Redis.');
            opSucceeded(docs);
        } else {
            log.debug('No server devices found in Redis. Falling back to CouchDB.');

            var query = {
                key: 'device',
                include_docs: true
            };

            dbCoreClass.findDocumentsWithQuery(req, doc_type, k.XCSDesignDocumentViewThisDevice, query, function DEVServerFindDocument(err, docs) {
                // Not finding documents doesn't mean it's an error. Let's report true errors instead.
                if (err && err.status !== 404) {
                    opFailed(err);
                } else {
                    log.info('Found', docs.length, 'server documents in CouchDB.');
                    redisClass.setDynamicQuery(req, doc_type, JSON.stringify(docs), function DEVServerRedisSetDynamicQuery(err, wasSaved) {
                        if (wasSaved) {
                            log.debug('Successfully cached server devices to Redis.');
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


        return xcsutil.standardizedErrorResponse(res, err);
    }

    function opSucceeded(docs) {
        xcsutil.profilerSummary(req);


        return xcsutil.standardizedResponse(res, 200, docs);
    }

};

XCSDeviceClass.prototype.update = function update(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Device - update] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this;

    var body = xcsutil.patchBodyForClient(req);

    if (!body) {
        xcsutil.profilerSummary(req);


        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the body is empty'
        });
    }


    var deviceUUID = req.params.id;

    log.info('Updating device', deviceUUID);

    // Retrieve the device to be patched
    self.findDeviceWithUUID(req, deviceUUID, function DEVUpdateDeviceFindDevice(err, device) {
        if (err) {
            xcsutil.profilerSummary(req);


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


                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                redisClass.delDynamicQuery(req, k.XCSDesignDocumentDevice, function () {
                    xcsutil.profilerSummary(req);
                    te.broadcast(k.XCSIsListenerForDeviceUpdates, k.XCSEmitNotificationDeviceUpdated, body);
                    return xcsutil.standardizedResponse(res, 200, body);
                });
            }
        });

    });
};

XCSDeviceClass.prototype.remove = function remove(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Device - remove] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        deviceUUID = req.params.id,
        deviceRev = req.params.rev;

    log.info('Removing device', deviceUUID);

    function doRemove() {
        dbCoreClass.removeDocument(req, deviceUUID, deviceRev, function DEVDoRemove(err) {
            if (err) {
                if (409 === err.status) {
                    // Retrieve the device to be patched
                    self.findDeviceWithUUID(req, deviceUUID, function DEVDoRemoveFindDevice(err, device) {
                        if (err) {
                            xcsutil.profilerSummary(req);



                            // Perhaps the document doesn't exist any longer?
                            // In any event, there is little we can do about this now.

                            return xcsutil.standardizedErrorResponse(res, err);
                        } else {
                            // Reset the revision we've just obtained and try again
                            deviceRev = device._rev;
                            log.info('Conflict while trying to remove device', deviceUUID + ', retrying.');
                            doRemove();
                        }
                    });
                } else {
                    xcsutil.profilerSummary(req);


                    return xcsutil.standardizedErrorResponse(res, err);
                }
            } else {
                redisClass.delDynamicQuery(req, k.XCSDesignDocumentDevice, function () {
                    xcsutil.profilerSummary(req);

                    // emit a notification
                    te.broadcast(k.XCSIsListenerForDeviceUpdates, k.XCSEmitNotificationDeviceRemoved, {
                        _id: req.params.id
                    });

                    return xcsutil.standardizedResponse(res, 204);
                });
            }
        });
    }

    doRemove();

};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSDeviceClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/