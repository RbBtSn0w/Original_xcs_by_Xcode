'use strict';

var Promise = require('bluebird'),
    spawn = require('child_process').spawn,
    os = require('os'),
    http = require('http'),
    fs = Promise.promisifyAll(require('fs')),
    path = require('path'),
    uuid = require('node-uuid'),
    async = require('async'),
    _ = require('underscore'),
    config = require('config'),
    childProcess = require('child_process');

var k = require('../constants.js'),
    logger = require('./logger.js'),
    Errors = require('./error.js');

require('colors');

var xcsutil = {};

function noop() {}

xcsutil.callback = function callback(cb) {
    return typeof cb === 'function' ? cb : noop;
};

xcsutil.safeCallback = function safeCallback() {
    if (arguments && arguments.length > 0) {
        var cb = arguments[0],
            otherArgs = Array.prototype.slice.call(arguments, 1);

        if (cb) {
            cb.apply(this, otherArgs);
        }
    }
};

xcsutil.requireCallback = function requiredCallback() {

    function throwObjIsNotFunctionError() {
        throw new Error('Required callback is missing!');
    }

    if (arguments && arguments.length > 0) {
        var cb = arguments[0];
        if (cb) {
            if (typeof cb !== 'function') {
                throwObjIsNotFunctionError();
            }
        } else {
            throwObjIsNotFunctionError();
        }
    } else {
        throwObjIsNotFunctionError();
    }

};

xcsutil.bindAll = function bindAll(obj) {
    for (var key in obj) {
        // Silly test to silence the linter
        if (key) {
            var val = obj[key];
            if (_.isFunction(val)) {
                obj[key] = val.bind(obj);
            }
        }
    }
    return obj;
};

xcsutil.snitch = function snitch(req, name) {
    if (req && req.snitch) {
        req.snitch.next(name);
    }
};

xcsutil.makeUUID = function makeUUID(cb) {
    return Promise.resolve(uuid().toUpperCase()).asCallback(cb);
};

xcsutil.removeDirectory = function removeDirectory(dirPath, cb) {
    var log = logger.withRequest(null);

    fs.exists(dirPath, function (exists) {
        if (!exists) {
            return xcsutil.safeCallback(cb, {
                status: 404,
                message: 'directory ' + dirPath + ' not found'
            });
        } else {
            childProcess.execFile('/bin/rm', ['-rf', dirPath], function (err) {
                if (err) {
                    log.debug('error attempting to remove directory', dirPath, '. Reason:', err, '.');

                    err = {
                        status: 500,
                        message: 'the specified directory exists but it was not possible to remove it:' + dirPath + ' Reason: ' + JSON.stringify(err)
                    };
                }
                return xcsutil.safeCallback(cb, err);
            });
        }
    });
};

xcsutil.removeDirectoryContents = function removeDirectoryContents(dir, numberOfDaysOld, debugHashtag, cb) {

    var log = logger.withRequest(null),
        spaceFreed = 0;

    // Remove the trailing '/'
    dir = dir.replace(/\/$/, "");

    if (debugHashtag) {
        log.debug('Getting directory contents at', dir, debugHashtag);
    }

    fs.readdir(dir, function (err, list) {
        if (err) {
            log.debug('Unable to read the contents of', dir, '. Reason:', err, '.');
            return xcsutil.safeCallback(cb, err);
        }

        var i = 0,
            oneDayInMiliseconds = 24 * 60 * 60 * 1000,
            today = Date.now();

        if ((null === numberOfDaysOld) || (undefined === numberOfDaysOld) || (numberOfDaysOld < 0)) {
            numberOfDaysOld = k.XCSCodeCoverageCacheFileMinAgeInDaysToBePruned;
        }

        (function next() {
            var file = list[i++];

            if (!file) {
                return xcsutil.safeCallback(cb, null, spaceFreed);
            }

            file = dir + '/' + file;

            if (debugHashtag) {
                log.debug('    Stating file', file, debugHashtag);
            }

            fs.stat(file, function (error, stat) {

                if (stat && stat.isDirectory()) {
                    removeDirectoryContents(file, numberOfDaysOld, debugHashtag, function () {
                        next();
                    });
                } else {
                    // Touch the file. This will change the modified time, which we check during pruning.
                    // mtime "Modified Time" - Time when file data last modified.
                    var days = Math.floor((today - stat.atime) / oneDayInMiliseconds);

                    if (debugHashtag) {
                        log.debug('    Last access time:', JSON.stringify(stat.atime), debugHashtag);
                    }

                    if (days >= numberOfDaysOld) {
                        // Remove the file
                        if (debugHashtag) {
                            console.log('    File is', days, 'days old. Removing it.', debugHashtag);
                        }
                        fs.unlink(file, function () {
                            spaceFreed += stat.size;
                            next();
                        });
                    } else {
                        if (debugHashtag) {
                            console.log('    File is', file, 'is', days, 'days old. Skipping it.', debugHashtag);
                        }
                        next();
                    }
                }
            });
        })();
    });
};

xcsutil.movePath = function movePath(path, newPath, cb) {

    fs.exists(path, function (exists) {
        if (!exists) {
            return xcsutil.safeCallback(cb, {
                status: 404,
                message: 'path ' + path + ' not found'
            });
        } else {
            childProcess.execFile('/bin/mv', ['-n', path, newPath], function (err) {
                if (err) {
                    err = {
                        status: 500,
                        message: 'the specified path exists but it was not possible to move it:' + path
                    };
                }
                return xcsutil.safeCallback(cb, err);
            });
        }
    });
};

xcsutil.stringEndsWith = function stringEndsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

xcsutil.groupsOf = function groupsOf(array, size) {
    let groups = [];

    for (let i = 0; i < array.length; i += size) {
        groups.push(array.slice(i, i + size));
    }

    return groups;
};

xcsutil.tarBZ2 = function tarBZ2(req, fileNameToCompress, destinationFilePath, cb) {

    var log = logger.withRequest(req),
        self = this;

    async.waterfall([
        function (callback) {
                fs.exists('/tmp/' + fileNameToCompress, function (exists) {
                    if (!exists) {
                        callback({
                            status: 404,
                            message: 'file /tmp/' + fileNameToCompress + ' not found'
                        });
                    } else {
                        callback();
                    }
                });
        },
        function (callback) {
                if (!self.stringEndsWith(destinationFilePath, '.bz2')) {
                    destinationFilePath = destinationFilePath + '.bz2';
                }

                fs.exists(destinationFilePath, function (exists) {
                    if (exists) {
                        callback({
                            status: 200,
                            message: 'File ' + destinationFilePath + ' already exists. Skipping caching.'
                        });
                    } else {
                        callback();
                    }
                });
        },
        function (callback) {
                var tar,
                    tmpFile = '/tmp/' + path.basename(destinationFilePath);

                try {

                    log.debug('Compressing', fileNameToCompress, 'to', tmpFile);
                    log.debug('Running command tar -jcf', tmpFile, '-C /tmp', fileNameToCompress);

                    tar = spawn('tar', ['-jcf', tmpFile, fileNameToCompress], {
                        cwd: '/tmp'
                    });

                    tar.on('close', function (code) {
                        if (0 === code) {
                            log.debug('Finished compressing file.');

                            // Moving the temp compressed file to 'destinationFilePath'
                            log.debug('Moving temp cached file to', destinationFilePath);
                            xcsutil.moveFile(tmpFile, destinationFilePath, function (err) {
                                if (err) {
                                    log.error('Error moving file', tmpFile, 'to', destinationFilePath);
                                }
                                callback(err);
                            });
                        } else {
                            var message = 'tar exited with code ' + code;
                            log.error('Error compressing file:', message);
                            callback({
                                status: 500,
                                message: message
                            });
                        }
                    });
                } catch (e) {
                    callback({
                        status: 500,
                        message: 'Internal Server Error (xcsd): ' + e.toString()
                    });
                }
        }
    ],
        function (err) {
            if (err && (200 === err.status)) {
                // It's our indicator that the destination file already exists, so it's not really an error
                err = null;
            }
            xcsutil.safeCallback(cb, err);
        });

};

xcsutil.moveFile = function (fromPath, toPath, cb) {
    fs.readFile(fromPath, function (err, data) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        }

        fs.writeFile(toPath, data, function (err) {
            if (err) {
                return xcsutil.safeCallback(cb, err);
            }

            fs.unlink(fromPath, function () {
                return xcsutil.safeCallback(cb);
            });
        });
    });
};

const appleInternalPath = config.get('path.appleInternal');

xcsutil.checkForAppleInternalDirectory = function checkForAppleInternalDirectory(cb) {
    return fs.statAsync(appleInternalPath)
        .then(() => true, () => { throw new Errors.NotFound('No directory found.'); })
        .asCallback(cb);
};

xcsutil.writeTemporaryFile = function writeTemporaryFile(str, cb) {
    var filename = path.join(os.tmpdir(), uuid.v4());
    fs.writeFile(filename, str, function (err) {
        return xcsutil.safeCallback(cb, err, filename, function (cb) {
            fs.unlink(filename, cb);
        });
    });
};

xcsutil.ping = function ping(req, res) {

    logger.withRequest(req).info('Responding to ping request.');

    function callback(response) {
        var body = '';

        response.on('data', function (chunk) {
            body += chunk;
        });

        response.on('end', function () {
            return xcsutil.standardizedResponse(res, 204, body);
        });

        response.on('error', function () {
            return xcsutil.standardizedErrorResponse(res, {
                status: 503,
                message: 'Service Unavailable (CouchDB): database unavailable'
            });
        });
    }

    http.get('http://' + config.get('database.host') + ':' + config.get('database.port'), callback);
};

xcsutil.hostname = function hostname(req, res) {
    var log = logger.withRequest(req);

    var theHostname = xcsutil.machineHostname();

    log.info('Getting server hostname:', theHostname);

    return xcsutil.standardizedResponse(res, 200, {
        hostname: theHostname
    });
};

xcsutil.machineHostname = function machineHostname() {
    var theHostname = os.hostname();
    if (theHostname === undefined || theHostname === null || theHostname === '') {
        var ipAddress = xcsutil.machineIpAddress();
        if (ipAddress.length > 0) {
            theHostname = ipAddress[0];
        }
    }
    return theHostname;
};


xcsutil.machineIpAddress = function machineIpAddress() {
    var interfaces = os.networkInterfaces();
    var addresses = [];

    for (var key in interfaces) {
        if (interfaces.hasOwnProperty(key)) {
            var intf = interfaces[key];

            for (var i = 0; i < intf.length; i++) {
                var address = intf[i];
                if (address.family === 'IPv4' && address.internal === false) {
                    addresses.push(address.address);
                }
            }
        }
    }

    return addresses;
};

xcsutil.dateComponentsFromDate = function dateComponentsFromDate(date) {

    // Segment the date into [YYYY,MM,DD,hh,mm,ss,ms] components

    var components = [date.getUTCFullYear(),
                      date.getUTCMonth() + 1,
                      date.getUTCDate(),
                      date.getUTCHours(),
                      date.getUTCMinutes(),
                      date.getUTCSeconds(),
                     date.getUTCMilliseconds()];

    return components;
};

xcsutil.formatISO8601LocalDate = function formatISO8601LocalDate(date) {
    var pad = function (num) {
        var norm = Math.abs(Math.floor(num));
        return (norm < 10 ? '0' : '') + norm;
    };
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) + 'T' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' + pad(date.getSeconds()) + '.' + pad(date.getMilliseconds()) + 'Z';
};

xcsutil.setTTLInDocumentIfNeeded = function setTTLInDocumentIfNeeded(req, body) {

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    function newExpirationDate() {
        var date = new Date();
        date.setSeconds(date.getSeconds() + k.XCSUnitTestTTLInSeconds);
        return date;
    }

    if (unitTestUUID) {
        body[k.XCSUnitTestProperty] = unitTestUUID;
        body.willExpire = newExpirationDate();
    }

    return body;
};

xcsutil.formalizeIDAndRev = function formalizeIDAndRev(doc) {
    // Problem: Nano returns id and rev, not _id and _rev.
    // Solution: formalize the id and rev properties.

    doc._id = doc.id;
    doc._rev = doc.rev;
    delete doc.id;
    delete doc.rev;

    return doc;
};

xcsutil.profilerSummary = function profilerSummary(req) {

    if (req && req.snitch) {
        var prefix = (req && req.requestUUID);

        if (!prefix) {
            prefix = '';
        }

        var stack = req.snitch.summarize(),
            offenders = req.snitch.sortedSummary(),
            totalMs = 0,
            layer;

        async.parallel({
                cleanStack: function (callback) {
                    for (layer in stack) {
                        if (stack.hasOwnProperty(layer)) {
                            layer = stack[layer];
                            totalMs += layer.ms;
                            delete layer.start;
                            delete layer.stop;
                        }
                    }
                    callback();
                },
                cleanOffenders: function (callback) {
                    for (layer in offenders) {
                        if (offenders.hasOwnProperty(layer)) {
                            layer = offenders[layer];
                            delete layer.start;
                            delete layer.stop;
                        }
                    }
                    callback();
                }
            },
            function () {
                var profilerInfo = {
                    stack: stack,
                    offenders: offenders,
                    totalMs: totalMs
                };

                var response = req.xcsResponse;
                if (response) {
                    response.profilerInfo = profilerInfo;
                }

                return profilerInfo;
            });
    } else {
        return null;
    }

};

xcsutil.displayLogRouteHeader = function displayLogRouteHeader(req) {
    var log = logger.withRequest(req),
        unitTestName = req.headers[k.XCSUnitTestNameHeader];

    log.info('*****', req.method, req.url);
    if (unitTestName) {
        log.info('*****', unitTestName);
    }
};

/**
 * Standard responses
 */

function filterChanges(changeDetails, cb) {
    var filteredDetails = [],
        ignoredLabels = ['HTTPParser', 'IncomingMessage', 'ReadableState', 'WritableState', 'ClientRequest', 'ChildProcess', 'Gzip', 'TransformState'];

    async.each(changeDetails, function (detail, callback) {

        // Skip over the labels we don't care about
        if (ignoredLabels.indexOf(detail.what) === -1) {
            // Retain the positive values (leaks)
            if (detail.size_bytes > 0) {
                filteredDetails.push(detail);
            }
        }

        callback();

    }, function () {

        return xcsutil.safeCallback(cb, filteredDetails);

    });
}

xcsutil.clearMemWatchHeapDiff = function clearMemWatchHeapDiff(res) {
    if (res && res[k.XCSMemWatchActive]) {
        var hd = res[k.XCSMemWatchActive],
            diff = hd.end(),
            now = new Date();

        if (diff && (diff.change.size_bytes > 0)) {

            // Filter details and make sure we have a real leak...
            filterChanges(diff.change.details, function (filteredDetails) {

                // Save the filtered details
                diff.change.details = filteredDetails;

                var log = {
                    url: res.XCSMemWatchMethod + ' ' + res.XCSMemWatchURL,
                    heap_diff: diff,
                };

                logger.warn(null, 'MemWatch diff: ' + JSON.stringify(log, null, 4));

                log.dateISO8601 = now.toISOString();
                log.date = xcsutil.dateComponentsFromDate(now);

                require('../classes/dbCoreClass.js').createDocument(null, k.XCSDesignDocumentMemWatchDiff, log);
            });

        }

        // Cleanup
        res[k.XCSMemWatchActive] = null;

    }
};

xcsutil.clearRequestWatcherTimeout = function clearRequestWatcherTimeout(res) {
    if (res) {
        var timeoutID = res[k.XCSRequestWatcher];
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
    }
};

function wrapObjectIfNativeDatatype(obj) {

    if (undefined !== obj) {
        // If obj is a boolean, wrap it
        if ((typeof obj === 'boolean') || (typeof obj === 'number') || (typeof obj === 'string')) {
            obj = {
                result: obj
            };
        }
    }

    return obj;
}

xcsutil.supportedStatusCodes = function supportedStatusCodes() {
    return {
        200: 'OK',
        201: 'Created',
        202: 'Accepted',
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        410: 'Gone',
        500: 'Internal Server Error',
        503: 'Service Unavailable',
        204: 'No Content',
        530: 'Client unsupported',
        531: 'ACL expansion not yet completed'
    };
};

xcsutil.handleXCSResponseStatusRequest = function handleXCSResponseStatusRequest(res, status) {
    if (!res) {
        return console.trace('*** Attempting to respond with an undefined \'res\' parameter.');
    }
    var obj = null;

    switch (status) {
    case 200: // OK
    case 201: // Created
    case 202: // Accepted
    case 400: // Bad Request
    case 401: // Unauthorized
    case 403: // Forbidden
    case 404: // Not Found
    case 409: // Conflict
    case 410: // Gone
    case 500: // Internal Server Error
    case 503: // Service Unavailable
        obj = [];
        xcsutil.standardizedResponse(res, status, obj);
        break;
    case 204: // No Content
    case 530: // Client unsupported.
    case 531: // ACL expansion not yet completed. Waiting for OD.
        xcsutil.standardizedResponse(res, status);
        break;
    default:
        throw new Error('[XCSUtil - handleXCSResponseStatusRequest] status not handled: ' + status);
    }
};

xcsutil.standardizedResponse = function standardizedResponse(res, status, obj) {

    if (!res) {
        return console.trace('*** Attempting to respond with an undefined \'res\' parameter.');
    }

    // If the profiler is active for this request, return a response with the profiler info
    var profilerInfo = res.profilerInfo;
    if (profilerInfo) {
        return responseWithObject(res, 200, profilerInfo);
    }

    var self = this;

    res.status(status);

    setUnitTestRedisCachedIfNeeded(self, res, function () {
        switch (status) {
        case 200: // OK
        case 201: // Created
        case 202: // Accepted
        case 400: // Bad Request
        case 401: // Unauthorized
        case 403: // Forbidden
        case 404: // Not Found
        case 409: // Conflict
        case 410: // Gone
        case 500: // Internal Server Error
            responseWithObject(res, status, obj);
            break;
        case 204: // No Content
        case 503: // Service Unavailable
        case 530: // Client unsupported.
        case 531: // ACL expansion not yet completed. Waiting for OD.
            responseWithoutObject(res, status);
            break;
        default:
            throw new Error('[XCSUtil - standardizedResponse] status not handled: ' + JSON.stringify(status));
        }
    });
};

xcsutil.standardizedErrorResponse = function standardizedErrorResponse(res, err) {

    if (!res) {
        return;
    }

    var log = logger.withRequestID(res.xcsRequestUUID),
        errString = JSON.stringify(err);

    if ('string' === typeof err) {
        err = {
            status: 500,
            message: 'Internal Server Error (xcsd): ' + errString
        };
    }

    xcsutil.clearRequestWatcherTimeout(res);

    // If we ever call this function with a non-object that contains status and message,
    // trace it

    if ('object' !== typeof err) {
        return console.trace('*** Expected \'err\' parameter to be an object.');
    }
    if (undefined === err.message) {
        return console.trace('*** Expected \'err\' parameter to contain a \'message\' property. Received instead: ' + JSON.stringify(err));
    }
    if (undefined === err.status) {
        err = new Errors.Internal(err.message);
    }

    xcsutil.clearMemWatchHeapDiff(res);

    log.error(xcsutil.colorizedErrorMessage(res, err));

    // Check whether we need to broadcast the occurrence to the dashboard
    processStatusCode(err.status);

    res.status(err.status);
    res.write(errString);

    return res.end();

};

function responseWithObject(res, status, obj) {

    if (undefined === obj) {
        return console.trace('*** Attempting to respond with an undefined \'obj\' parameter.');
    }

    xcsutil.clearMemWatchHeapDiff(res);
    xcsutil.clearRequestWatcherTimeout(res);

    // Check whether we need to broadcast the occurrence to the dashboard
    processStatusCode(status);

    return standardizedResponseWrite(res, obj);

}

function standardizedResponseWrite(res, obj) {

    xcsutil.clearMemWatchHeapDiff(res);
    xcsutil.clearRequestWatcherTimeout(res);

    if (undefined !== obj) {
        obj = wrapObjectIfNativeDatatype(obj);

        // If the object is an array, wrap it in the count/results combo
        if (Array.isArray(obj)) {
            res.setHeader(k.XCSResultsList, 'true');
            obj = {
                count: obj.length,
                results: obj
            };
        }

        res.write(JSON.stringify(obj));
    }

    var message = xcsutil.colorizedSuccessMessage(res);
    logger.withRequestID(res.xcsRequestUUID).info(message);

    return res.end();

}

function responseWithoutObject(res, status) {

    xcsutil.clearMemWatchHeapDiff(res);
    xcsutil.clearRequestWatcherTimeout(res);

    var message = xcsutil.colorizedSuccessMessage(res);
    logger.withRequestID(res.xcsRequestUUID).info(message);

    // Check whether we need to broadcast the occurrence to the dashboard
    processStatusCode(status);

    return res.sendStatus(status);
}

xcsutil.colorizedSuccessMessage = function colorizedSuccessMessage(res) {

    var xcsMethod = (res.xcsMethod || ''),
        xcsURL = (res.xcsURL || ''),
        xcsStatus = (res.statusCode || 500),
        xcsTotalRequestTimeInMs = 0;

    if (res.xcsRequestStartTime) {
        xcsTotalRequestTimeInMs = new Date().getTime() - res.xcsRequestStartTime;
        return xcsMethod.toString() + ' ' + xcsURL.toString() + ' HTTP ' + xcsStatus.toString() + ' (' + xcsTotalRequestTimeInMs.toString() + 'ms)';
    } else {
        return xcsMethod.toString() + ' ' + xcsURL.toString() + ' HTTP ' + xcsStatus.toString();
    }

};

xcsutil.colorizedErrorMessage = function colorizedErrorMessage(res, err) {

    var xcsMethod = (res.xcsMethod || ''),
        xcsURL = (res.xcsURL || ''),
        xcsStatus = (err.status || 500),
        xcsmessage = (err.message || 'Error unknown'),
        xcsTotalRequestTimeInMs = new Date().getTime() - res.xcsRequestStartTime;

    return xcsMethod.toString() + ' ' + xcsURL.toString() + ' HTTP ' + xcsStatus.toString() + ' (' + xcsmessage.toString() + ')' + ' (' + xcsTotalRequestTimeInMs.toString() + 'ms)';
};

xcsutil.patchDocumentWithObject = function patchDocumentWithObject(document, changes) {

    var array = Array.isArray(changes),
        dst = array && [] || {},
        self = xcsutil;

    if (array) {
        document = document || [];
        dst = dst.concat(document);
        changes.forEach(function patchDocumentWithObjectIterate(e, i) {
            if (typeof document[i] === 'undefined') {
                dst[i] = e;
            } else if (typeof e === 'object') {
                dst[i] = self.patchDocumentWithObject(document[i], e);
            } else {
                if (document.indexOf(e) === -1) {
                    dst.push(e);
                }
            }
        });
    } else {
        if (document && changes &&
            (typeof document === 'object') &&
            (typeof changes === 'object')) {

            Object.keys(document).forEach(key => {
                dst[key] = document[key];
            });
            Object.keys(changes).forEach(key => {
                dst[key] = self.patchDocumentWithObject(document[key], changes[key]);
            });
        } else {
            dst = changes;
        }
    }

    return dst;
};

xcsutil.deleteExpiredDocuments = function deleteExpiredDocuments(req, cb) {

    var date = new Date(),
        log = logger.withRequest(req);

    log.info('Removing expired unit test documents.');

    var query = {
        startkey: [date],
        endkey: ['2000-01-01T00:00:00.000Z', {}],
        include_docs: false,
        descending: true
    };

    require('../classes/dbCoreClass.js').findDocumentsWithQuery(req, k.XCSDesignDocumentAll, k.XCSDesignDocumentViewAllByExpirationTime, query, function ExpiredDocumentsInternalCallback(err, results) {
        // Not finding documents doesn't mean it's an error. Let's report true errors instead.
        if (err && err.status !== 404) {
            return xcsutil.safeCallback(cb, err);
        } else {
            if (results.length) {
                log.info('Found', results.length, 'documents to delete.');

                var toDelete = _.flatten(_.compact(results)).map(function MarkExpiredDocumentsForDeletionMap(doc) {
                    return {
                        _id: doc._id,
                        _rev: doc._rev,
                        _deleted: true
                    };
                });

                require('../classes/dbCoreClass.js').bulkUpdateDocuments(req, toDelete, null, function (err) {
                    if (err) {
                        log.error('Error trying to delete expired unit test documents:', err);
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        log.debug('Successfully deleted expired unit test documents.');
                        return xcsutil.safeCallback(cb);
                    }
                });
            } else {
                log.debug('No expired documents to delete.');
                return xcsutil.safeCallback(cb);
            }
        }
    });

};

xcsutil.bulk_import = function bulk_import(req, cb) {

    if (!req.body) {
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'the body is empty'
        });
    }

    if (!req.body.docs) {
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'Property \'docs\' in missing from the body'
        });
    }

    require('../classes/dbCoreClass.js').bulkUpdateDocuments(req, req.body.docs, null, cb);

};

xcsutil.dashboard = function dashboard(req, res) {
    var log = logger.withRequest(req);

    require('../classes/redisClass.js').client().hget('XCSDashboard key', 'isDashboardInstalled', function Dashboard(err, reply) {

        xcsutil.clearMemWatchHeapDiff(res);
        xcsutil.clearRequestWatcherTimeout(res);

        if (!reply || !fs.existsSync(reply)) {
            log.error('The Xcode Server Dashboard is not installed: ' + reply);
            return res.sendStatus(404);
        } else {
            var url = req.url,
                fileToServe;

            if ('/dashboard' === url) {
                fileToServe = reply + '/index.html';
                res.set('Content-Type', 'text/html');
                return res.sendfile(fileToServe);
            } else {
                fileToServe = reply + url.replace('/dashboard', '');
                res.setHeader('Content-type', null);
                return res.download(fileToServe);
            }
        }
    });
};

xcsutil.hardwareInfo = function hardwareInfo(req, res) {
    const log = logger.withRequest(req);
    const hardware = require('./hardware.js');

    log.info('Getting hardware information');

    xcsutil.standardizedResponse(res, 200, {
        computerName: hardware.getComputerName(),
        hardwareUUID: hardware.getHardwareUUID()
    });
};

xcsutil.stringForScheduleType = function stringForScheduleType(scheduleType) {
    switch (scheduleType) {
    case k.XCSBotScheduleType.periodic.value:
        return k.XCSBotScheduleType.periodic.name;
    case k.XCSBotScheduleType.onCommit.value:
        return k.XCSBotScheduleType.onCommit.name;
    case k.XCSBotScheduleType.manual.value:
        return k.XCSBotScheduleType.manual.name;
    default:
        return 'unknown';
    }
};

// This is here to not break older clients, but xcsd doesn't have maintenance tasks anymore.
xcsutil.maintenanceTasks = function maintenanceTasks(req, res) {
    xcsutil.standardizedResponse(res, 200, []);
};

xcsutil.launchToolStatusToXCSDStatus = function (status) {

    /*
        #define XCSReturnCodeSuccess                0
        #define XCSReturnCodeIncorrectUsage         1
        #define XCSReturnCodeUnknownError           2
        #define XCSReturnCodeBadRequest             3
        #define XCSReturnCodeUnauthorized           4
        #define XCSReturnCodeInternalError          5
        #define XCSReturnCodeServiceUnavailable     6
    */

    switch (status) {
    case k.XCSReturnCodeIncorrectUsage:
        status = 400;
        break;
    case k.XCSReturnCodeUnknownError:
        status = 500;
        break;
    case k.XCSReturnCodeBadRequest:
        status = 400;
        break;
    case k.XCSReturnCodeUnauthorized:
        status = 403;
        break;
    case k.XCSReturnCodeInternalError:
        status = 500;
        break;
    case k.XCSReturnCodeServiceUnavailable:
        status = 503;
        break;
    default:
        // leave it as is
    }

    return status;
};

xcsutil.upsertValueForKeyPathInObject = function (object, keyPath, value) {
    if (typeof keyPath === 'string') {
        keyPath = keyPath.split('.');
    }

    if (keyPath.length > 1) {
        var e = keyPath.shift();
        xcsutil.upsertValueForKeyPathInObject(object[e] = Object.prototype.toString.call(object[e]) === '[object Object]' ? object[e] : {}, keyPath, value);
    } else {
        object[keyPath[0]] = value;
    }
};

xcsutil.removeKeyPathInObject = function (object, keyPath, value) {
    if (typeof keyPath === 'string') {
        keyPath = keyPath.split('.');
    }

    if (keyPath.length > 1) {
        var e = keyPath.shift();
        xcsutil.removeKeyPathInObject(object[e] = Object.prototype.toString.call(object[e]) === '[object Object]' ? object[e] : {}, keyPath, value);
    } else {
        delete object[keyPath[0]];
    }
};

xcsutil.patchBodyForClient = function (req) {
    var clientVersion = req && req.headers[k.XCSClientVersion];

    if (clientVersion >= k.XCSFirstVersionWithoutSetProps) {
        return req.body;
    } else {
        return req.body[k.XCSSetProperties];
    }
};

xcsutil.formatBytes = function (bytes, decimals) {
    if (!bytes || 0 === bytes) {
        return '0 bytes';
    }

    var k = 1024,
        dm = decimals + 1 || 3,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
};

xcsutil.calculateDayDeltaForDateFromDate = function (inDate, inSecondDate) {

    if (!inDate || !inSecondDate) {
        return undefined;
    }

    // Strip everything but the day/month/year from the supplied dates.
    var inSecondDateStripped = new Date(inSecondDate.getFullYear(), inSecondDate.getMonth(), inSecondDate.getDate());
    var inDateStripped = new Date(inDate.getFullYear(), inDate.getMonth(), inDate.getDate());

    // If the difference between the two dates is zero, the day delta is 0.
    var dateDifference = inSecondDateStripped.getTime() - inDateStripped.getTime();

    // If the difference is greater than zero, the supplied date is before the stripped today date.
    // Otherwise if the difference is less than zero, the supplied date is after the stripped today
    // date. We negate the result here so one full day in the past is returned as -1.
    if (dateDifference > 0) {
        return -1 * ((dateDifference / (1000 * 60 * 60)) / 24);
    } else if (dateDifference < 0) {
        return ((Math.abs(dateDifference) / (1000 * 60 * 60)) / 24);
    }

    return 0;

};

module.exports = xcsutil;

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function processStatusCode(status) {
    if (status) {
        var redisClient = require('../classes/redisClass.js').client();

        if (redisClient) {
            redisClient.hget('XCSDashboard key', k.XCSDashboardInited, function (reply) {
                if (reply) {
                    switch (status) {
                    case 503: // Service Unavailable
                        var xcsStatusEvent = {
                            type: k.XCSStatusEvent,
                            status: status,
                            value: new Date().toString()
                        };

                        redisClient.hmset('XCSDashboard key', k.XCSStatus503, xcsStatusEvent.value);
                        redisClient.hmset('XCSDashboard key', k.XCSLastError, xcsStatusEvent.value);

                        process.send(xcsStatusEvent);
                        process.send({
                            type: k.XCSLastError,
                            value: xcsStatusEvent.value
                        });

                        break;
                    }
                }

            });
        }
    }
}

function setUnitTestRedisCachedIfNeeded(self, res, cb) {

    if (!res) {
        return console.trace('*** Undefined required \'res\' parameter.');
    }

    if (!cb) {
        return console.trace('*** Undefined required \'cb\' parameter.');
    }

    var redisClass = require('../classes/redisClass.js'),
        unitTestRedisCacheKey = redisClass.makeUnitTestRedisCacheKey(res.xcsUnitTestUUID);

    if (unitTestRedisCacheKey) {
        redisClass.client().get(unitTestRedisCacheKey, function setUnitTestRedisCachedIfNeeded(err, reply) {
            if (err) {
                return self.safeCallback(cb, {
                    status: 500,
                    message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
                });
            } else {
                if (reply) {
                    res.setHeader(k.XCSUnitTestRedisCached, reply);
                }
                return self.safeCallback(cb);
            }
        });
    } else {
        return self.safeCallback(cb);
    }

}
