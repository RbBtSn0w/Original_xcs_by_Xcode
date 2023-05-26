'use strict';

var exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    os = require('os'),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    uuid = require('node-uuid'),
    async = require('async'),
    _ = require('underscore'),
    config = require('config'),
    childProcess = require('child_process');

var k = require('../constants.js'),
    logger = require('./logger.js');

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

xcsutil.makeUUID = function makeUUID(cb) {

    exec('/usr/bin/uuidgen', function (err, stdout) {
        if (err) {
            var error = {
                status: 500,
                message: 'Internal Server Error (uuidgen): ' + err.message
            };
            return xcsutil.safeCallback(cb, error);
        } else {
            return xcsutil.safeCallback(cb, null, stdout.trim());
        }
    });

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
                    log.debug('error attempting to remove directory', dirPath, '. Reason:', err, '. #DeleteBot');

                    err = {
                        status: 500,
                        message: 'the specified directory exists but it was not possible to remove it:' + dirPath
                    };
                }
                return xcsutil.safeCallback(cb, err);
            });
        }
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

xcsutil.checkForAppleInternalDirectory = function checkForAppleInternalDirectory(cb) {
    fs.exists('/AppleInternal', function (exists) {
        if (exists) {
            return xcsutil.safeCallback(cb);
        } else {
            return xcsutil.safeCallback(cb, {
                status: 404,
                message: 'directory not found'
            });
        }
    });
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
        523: 'Service is not Enabled',
        530: 'Client unsupported',
        531: 'ACL expansion not yet completed',
        532: 'Service maintenance task active'
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
    case 532: // Service startup task active
        obj = [{
            title: 'This is a test',
            completed: 45
        }];
        xcsutil.standardizedResponse(res, status, obj);
        break;
    case 204: // No Content
    case 523: // Service is not Enabled
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
        case 532: // Service startup task active
            responseWithObject(res, status, obj);
            break;
        case 204: // No Content
        case 503: // Service Unavailable
        case 523: // Service is not Enabled
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

    // If we ever call this function with a non-object that contains status and message,
    // trace it

    if ('object' !== typeof err) {
        return console.trace('*** Expected \'err\' parameter to be an object.');
    } else {
        if ((undefined === err.status) || (undefined === err.message)) {
            return console.trace('*** Expected \'err\' parameter to contain the \'status\' and \'message\' properties. Received instead: ' + JSON.stringify(err));
        }
    }

    xcsutil.clearMemWatchHeapDiff(res);
    xcsutil.clearRequestWatcherTimeout(res);

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
        if (document && (typeof document === 'object')) {
            Object.keys(document).forEach(function patchDocumentWithObjectIterateObject(key) {
                dst[key] = document[key];
            });
            Object.keys(changes).forEach(function patchDocumentWithObjectIterateNonObject(key) {
                if (typeof changes[key] !== 'object' || !changes[key]) {
                    dst[key] = changes[key];
                } else {
                    if (!document[key]) {
                        dst[key] = changes[key];
                    } else {
                        dst[key] = self.patchDocumentWithObject(document[key], changes[key]);
                    }
                }
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

xcsutil.maintenanceTasks = function status(req, res) {

    var log = logger.withRequest(req),
        redis = require('../classes/redisClass.js').client();

    log.info('Fetching maintenance tasks.');

    redis.get(k.XCSRedisMaintenanceTasksResults, function ASXCSRedisGetAuthTokenPrefix(err, reply) {
        if (err) {
            log.error('Error loading maintenance tasks:', err);
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: err.message
            });
        } else {
            if (reply) {
                var results = JSON.parse(reply);
                log.info('Found', results.length, 'maintenance tasks running.');
                return xcsutil.standardizedResponse(res, 532, results);
            } else {
                log.info('No maintenance tasks are running.');
                return xcsutil.standardizedResponse(res, 204);
            }
        }
    });

};

xcsutil.generateFakeMaintenanceTasks = function status(req, res) {

    var log = logger.withRequest(req);
    log.info('Generating fake maintenance tasks.');

    var redis = require('../classes/redisClass.js').client(),
        self = this;

    // Only continue if we have set the init phase manually
    redis.get(k.XCSRedisServiceInitPhaseManual, function (err, reply) {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: 'Internal Server Error (xcsd): ' + JSON.stringify(err)
            });
        } else {
            if ('1' === reply) {
                generateFakeMaintenanceTasks_internal(self, function () {
                    return xcsutil.standardizedResponse(res, 204);
                });
            } else {
                return xcsutil.standardizedResponse(res, 400, {
                    status: 400,
                    message: 'Unable to generate fake maintenance tasks: the manual init phase has to be set.'
                });
            }
        }
    });

};

xcsutil.maintenanceTasks_internal = function maintenanceTasks_internal(cb) {

    var maintenanceTaskList = [],
        obj;

    async.waterfall([
        function CouchDBMaintenanceTasks(callback) {

                // 1) Get the active CouchDB tasks
                require('../classes/databaseClass.js').activeCouchDBTasks_internal(null, function statusActiveCouchDBTasks(err, activeTasks) {
                    if (err) {
                        callback(err);
                    } else {
                        for (var activeTask in activeTasks) {
                            if (activeTasks.hasOwnProperty(activeTask)) {
                                obj = humanReadableCouchDBTask(activeTasks[activeTask]);
                                if (obj) {
                                    maintenanceTaskList.push(obj);
                                }
                            }
                        }
                        callback(null);
                    }
                });

        },
        function XcodeServerMaintenanceTasks(callback) {

                var redis = require('../classes/redisClass.js').client();

                redis.keys(k.XCSActiveTask + '*', function (err, keys) {
                    if (keys.length > 0) {
                        redis.mget(keys, function (err, vals) {
                            if (err) {
                                callback({
                                    status: 500,
                                    message: 'Internal Server Error (xcsd): ' + JSON.stringify(err)
                                });
                            } else {
                                for (var key in vals) {
                                    if (vals.hasOwnProperty(key)) {
                                        maintenanceTaskList.push({
                                            title: vals[key]
                                        });
                                    }
                                }
                                callback();
                            }
                        });
                    } else {
                        callback();
                    }
                });

        }],
        function (err) {
            if (err) {
                return cb(err);
            } else {
                return cb(null, maintenanceTaskList);
            }
        });

};

xcsutil.setActiveTaskWithLabel = function setActiveTaskWithLabel(key, value, cb) {
    require('../classes/redisClass.js').set(null, k.XCSActiveTask + key, value, cb);
};

xcsutil.removeActiveTask = function removeActiveTask(key, cb) {
    require('../classes/redisClass.js').deleteWithPattern(null, k.XCSActiveTask + key, cb);
};

xcsutil.handleInitPhaseOrServiceEnabledState = function handleInitPhaseOrServiceEnabledState(req, res, cb) {
    var log = logger.withRequest(req);
    log.debug('Checking that the service is enabled.');
    checkIfRequestCanBeServiced_internal(function (err, isInitPhaseOn, isInitPhaseOnManual, serviceIsEnabled) {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            if (isInitPhaseOn || isInitPhaseOnManual) {
                log.warn('Cannot service request: there are active maintenance tasks.');
                xcsutil.maintenanceTasks_internal(function (err, activeTasks) {
                    if (err) {
                        return xcsutil.standardizedErrorResponse(res, err);
                    } else {
                        return xcsutil.standardizedResponse(res, 532, activeTasks);
                    }
                });
            } else if (false === serviceIsEnabled) {
                log.error('Cannot service request: the service is not enabled.');
                return xcsutil.returnServerNotAvailableStatusResponse(req, res);
            } else {
                log.debug('Allowing request because the service is enabled.');
                return xcsutil.safeCallback(cb);
            }
        }
    });
};

xcsutil.checkIfRequestCanBeServiced = function checkIfRequestCanBeServiced(cb) {
    checkIfRequestCanBeServiced_internal(cb);
};

xcsutil.returnServerNotAvailableStatusResponse = function returnServerNotAvailableStatusResponse(req, res) {
    var apiVersion = ((req && req.headers[k.XCSClientVersion]) || '1');
    if ('1' === apiVersion) {
        return xcsutil.standardizedResponse(res, 503);
    } else {
        return xcsutil.standardizedResponse(res, 523);
    }
};

xcsutil.enableManualInitPhase = function enableInitPhase(req, res) {

    var redis = require('../classes/redisClass.js').client();

    async.waterfall([

            // Do not init the phase manually if we're already in it, either manually or automatically (on launch)

        function CheckAutomaticInitPhase(callback) {

                redis.get(k.XCSRedisServiceInitPhase, function (err, reply) {
                    if (err) {
                        callback({
                            status: 500,
                            message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
                        });
                    } else if ('1' === reply) {
                        callback({
                            status: 503,
                            message: 'Service Unavailable (xcsd): operation not available. The service is launching'
                        });
                    } else {
                        callback();
                    }
                });

        },

            // Do not init the phase manually if we're already in it, either manually or automatically (on launch)

        function CheckAndOrSetManualInitPhase(callback) {

                redis.setnx(k.XCSRedisServiceInitPhaseManual, '1', function (err, reply) {
                    if (err) {
                        callback({
                            status: 500,
                            message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
                        });
                    } else if (0 === reply) {
                        callback({
                            status: 409,
                            message: 'Conflict: manual init phase already enabled.'
                        });
                    } else {
                        callback();
                    }
                });

        }],
        function (err) {
            if (err) {
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                return xcsutil.standardizedResponse(res, 204);
            }
        });

};

xcsutil.disableManualInitPhase = function disableInitPhase(req, res) {

    xcsutil.disableManualInitPhase_internal(function (err) {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

xcsutil.disableManualInitPhase_internal = function disableManualInitPhase_internal(cb) {

    var redis = require('../classes/redisClass.js').client();

    redis.get(k.XCSRedisServiceInitPhaseManual, function (err, reply) {
        if (err) {
            return xcsutil.safeCallback(cb, {
                status: 500,
                message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
            });
        } else if ('1' === reply) {
            xcsutil.removeActiveTask('*', function (err) {
                if (err) {
                    return xcsutil.safeCallback(cb, {
                        status: 500,
                        message: 'Internal Server Error (xcsd): ' + JSON.stringify(err)
                    });
                } else {
                    redis.del(k.XCSRedisServiceInitPhaseManual, function (err) {
                        if (err) {
                            return xcsutil.safeCallback(cb, {
                                status: 500,
                                message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
                            });
                        } else {
                            return xcsutil.safeCallback(cb);
                        }
                    });
                }
            });
        } else {
            return xcsutil.safeCallback(cb);
        }
    });

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

    var k = 1000,
        dm = decimals + 1 || 3,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
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
                    case 523: // Service is not Enabled
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

function humanReadableCouchDBTask(activeTask) {
    var type = activeTask.type,
        designDocument = (activeTask.design_document || '<unknown>'),
        source = (activeTask.source || '<unknown>'),
        database = (activeTask.source || '<unknown>'),
        progress = (activeTask.progress || 0),
        obj = {};

    // CouchDB has 4 active task types:
    //
    //      - indexer
    //      - replication
    //      - database_compaction
    //      - view_compaction

    switch (type) {
    case 'indexer':
        obj.title = 'indexing: ' + designDocument.slice(designDocument.indexOf('/') + 1);
        break;
    case 'replication':
        obj.title = 'replicating database ' + source;
        break;
    case 'database_compaction':
        obj.title = 'compacting database ' + database;
        break;
    case 'view_compaction':
        obj.title = 'compacting view ' + designDocument;
        break;
    default:
        obj.title = type;
        break;
    }

    obj.completed = progress;

    return obj;
}

function generateFakeMaintenanceTasks_internal(self, cb) {
    var numberOfTasks = Math.floor(Math.random() * (11 - 3) + 3);

    logger.debug('Generating', numberOfTasks, 'fake maintenance tasks.');

    function setTimerForTask(self, key) {
        var timeoutInSeconds = Math.floor(Math.random() * (100 - 60) + 60);
        logger.debug('Setting timeout for task', k.XCSActiveTask + key, 'to be', timeoutInSeconds, 'seconds.');
        setTimeout(function setTimerForTask() {
            self.removeActiveTask(key);
        }, timeoutInSeconds * 1000);
    }

    for (var i = 0; i < numberOfTasks; i++) {
        var key = i;
        self.setActiveTaskWithLabel(key, 'Fake Maintenance Task - ' + i);
        setTimerForTask(self, key);
    }

    return self.safeCallback(cb);
}

function checkIfRequestCanBeServiced_internal(cb) {
    cb = xcsutil.callback(cb);
    const redis = require('../classes/redisClass.js');

    function redisError(err) {
        cb({
            status: 500,
            message: `Error checking Redis: ${err.message}`
        });
    }

    redis.get(null, k.XCSRedisServiceInitPhase, (err, isInitPhaseOn) => {
        if (err) {
            redisError(err);
        } else if (isInitPhaseOn === '1') {
            cb(null, true);
        } else {
            redis.get(null, k.XCSRedisServiceInitPhaseManual, (err, isInitPhaseOnManual) => {
                if (err) {
                    redisError(err);
                } else if (isInitPhaseOnManual === '1') {
                    cb(null, false, true);
                } else {
                    require('../classes/settingsClass.js').findOrCreateSettingsDocument(null, (err, settings) => {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, false, false, settings[k.XCSServiceEnabledKey]);
                        }
                    });
                }
            });
        }
    });
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