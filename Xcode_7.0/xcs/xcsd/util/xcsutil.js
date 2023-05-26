'use strict';

var exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    os = require('os'),
    http = require('http'),
    crypto = require('crypto'),
    fs = require('fs'),
    path = require('path'),
    uuid = require('node-uuid'),
    async = require('async'),
    _ = require('underscore'),
    request = require('request');

var k = require('../constants.js'),
    konsole = require('./konsole.js');

require('colors');

var xcsutil = {};

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

xcsutil.makeUUID = function makeUUID(cb) {

    exec('/usr/bin/uuidgen', function (err, stdout) {
        if (err) {
            var error = {
                status: 500,
                message: 'Internal Server Error (uuidgen): ' + err.message
            };
            return xcsutil.safeCallback(cb, error);
        } else {
            return xcsutil.safeCallback(cb, null, stdout);
        }
    });

};

xcsutil.removeDirectory = function removeDirectory(dirPath, cb) {
    fs.exists(dirPath, function (exists) {
        if (!exists) {
            return xcsutil.safeCallback(cb, {
                status: 404,
                message: 'directory not found'
            });
        } else {
            var rm;

            try {
                rm = spawn('rm', ['-rf', dirPath]);

                rm.on('close', function (code) {
                    if (code === 0) {
                        return xcsutil.safeCallback(cb, null);
                    } else {
                        return xcsutil.safeCallback(cb, {
                            status: 500,
                            message: 'rm exited with code ' + code
                        });
                    }
                });
            } catch (e) {
                return xcsutil.safeCallback(cb, {
                    status: 500,
                    message: 'Internal Server Error (xcsd): ' + e.toString()
                });
            }
        }
    });
};

xcsutil.checkForAppleInternalDirectory = function removeDirectory(cb) {
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

    var functionTitle = '[XCSUtil] ' + req.method + ' ' + req.url;
    konsole.log(req, functionTitle);

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

    http.get('http://' + k.XCSCouchHost + ':' + k.XCSCouchPort, callback);
};

xcsutil.hostname = function hostname(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[XCSUtil - hostname] ' + req.method + ' ' + req.url;
    konsole.log(req, functionTitle);

    var theHostname = xcsutil.machineHostname();

    konsole.log(req, '[XCSUtil - hostname] hostname: ' + theHostname);

    xcsutil.logLevelDec(req);

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

xcsutil.timestamp = function timestamp() {
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var ms = now.getMilliseconds();

    var monthStr = ((month < 10) ? '0' : '') + month;
    var dayStr = ((day < 10) ? '0' : '') + day;
    var hourStr = ((hours < 10) ? '0' : '') + hours;
    var minuteStr = ((minutes < 10) ? '0' : '') + minutes;
    var secondStr = ((seconds < 10) ? '0' : '') + seconds;
    var msString = '' + ms;

    while (msString.length < 3) {
        msString = '0' + msString;
    }

    return now.getFullYear() + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minuteStr + ':' + secondStr + '.' + msString;
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

xcsutil.repeatChar = function repeatChar(c, times) {

    var string = '';

    for (var i = 0; i < times; ++i) {
        string += c;
    }

    return string;
};

xcsutil.logLevelInc = function logLevelInc(req) {
    var currentLogLevel = 0;

    if (req) {
        currentLogLevel = req.logLevel;
        req.logLevel += 1;
    }

    return currentLogLevel;
};

xcsutil.logLevelDec = function logLevelDec(req) {

    if (req) {
        req.logLevel -= 1;
    }

};

xcsutil.logLevelCheck = function logLevelCheck(req, previousLogLevel) {

    if (req) {
        if (req.logLevel !== 0) {
            if (req.headers[k.XCSUnitTestHeader] && (req.logLevel !== previousLogLevel)) {
                if (k.XCSKonsoleDebugLogLevel) {
                    throw new Error('LogLevel is now ' + req.logLevel + ' but it should be ' + previousLogLevel + '.');
                }
            }
        }
    }

};

xcsutil.loggingTimestamp = function loggingTimestamp() {
    var now = new Date();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var ms = now.getMilliseconds();

    var monthStr = ((month < 10) ? '0' : '') + month;
    var dayStr = ((day < 10) ? '0' : '') + day;
    var hourStr = ((hours < 10) ? '0' : '') + hours;
    var minuteStr = ((minutes < 10) ? '0' : '') + minutes;
    var secondStr = ((seconds < 10) ? '0' : '') + seconds;
    var msString = '' + ms;

    while (msString.length < 3) {
        msString = '0' + msString;
    }

    var ts = '[' + now.getFullYear() + '-' + monthStr + '-' + dayStr + ' ' + hourStr + ':' + minuteStr + ':' + secondStr + '.' + msString + ']';

    return ts;
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

xcsutil.bulkPost = function bulkPost(body, cb) {
    if (body.length) {
        var curl;

        try {

            curl = spawn('/usr/bin/curl', [
                            '--silent',
                            '-H',
                            'Content-Type: application/json',
                            '-X',
                            'POST',
                            'http://127.0.0.1:' + k.XCSCouchPort + k.XCSCouchBulkImportOptions.path,
                            '-d',
                            JSON.stringify({
                    docs: body
                })
                    ]);

            curl.on('close', function (err) {
                return xcsutil.safeCallback(cb, err);
            });

        } catch (e) {
            return xcsutil.safeCallback(cb, {
                status: 500,
                message: 'Internal Server Error (xcsd): ' + e.toString()
            });
        }
    } else {
        return xcsutil.safeCallback(cb, null);
    }
};

xcsutil.sha1 = function sha1(obj) {
    var temp = {};

    Object.keys(obj)
        .sort()
        .forEach(function (k) {
            temp[k] = obj[k];
        });

    var json = JSON.stringify(temp);
    return crypto.createHash('sha1').update(json).digest('hex');
};

xcsutil.displayLogRouteHeader = function displayLogRouteHeader(req) {
    var requestUUID = req.requestUUID,
        unitTestName = req.headers[k.XCSUnitTestNameHeader],
        routeMarker = new Array(k.XCSAsteriskHeaderLength + 1).join('*'),
        routeHeader = '***** [Router] ' + req.method + ' ' + req.url;

    var routeTrailingMarker;

    if ((k.XCSAsteriskHeaderLength - routeHeader.length) > 0) {
        routeTrailingMarker = new Array(k.XCSAsteriskHeaderLength - routeHeader.length).join('*');
    } else {
        routeHeader = routeHeader.substring(0, k.XCSAsteriskHeaderLength - 5) + '...';
        routeTrailingMarker = new Array(k.XCSAsteriskHeaderLength - routeHeader.length).join('*');
    }

    if (requestUUID || unitTestName) {
        var unitTestNameHeader,
            unitTestNameTrailingMarker;

        /*
         ***********************************************************************************************************
         ***** [Client] [0FBD4EB1:4A5024E3] -[XCSomeTestCase testFoo] **********************************************
         ***** [Router] POST /api/auth/login ***********************************************************************
         ***********************************************************************************************************
         */

        if (requestUUID && unitTestName) {
            unitTestNameHeader = '***** [Client] ' + requestUUID + ' ' + unitTestName;
        } else {
            if (requestUUID) {
                unitTestNameHeader = '***** [Client] ' + requestUUID;
            } else {
                unitTestNameHeader = '***** [Client] ' + unitTestName;
            }
        }
        unitTestNameTrailingMarker = new Array(k.XCSAsteriskHeaderLength - unitTestNameHeader.length).join('*');

        konsole.logmax(req, routeMarker);
        konsole.logmax(req, unitTestNameHeader + ' ' + unitTestNameTrailingMarker.toString());
        konsole.logmax(req, routeHeader + ' ' + routeTrailingMarker.toString());
        konsole.logmax(req, routeMarker);

    } else {

        konsole.logmax(req, routeMarker);
        konsole.logmax(req, routeHeader + ' ' + routeTrailingMarker.toString());
        konsole.logmax(req, routeMarker);

    }
};

xcsutil.displayLogDivision = function displayLogDivision(req, title) {

    title = title + ' ';

    konsole.logmax(req, title);
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

                konsole.warn(null, 'MemWatch diff: ' + JSON.stringify(log, null, 4));

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
            throw new Error('[XCSUtil - standardizedResponse] status not handled: ' + status);
        }
    });
};

xcsutil.standardizedErrorResponse = function standardizedErrorResponse(res, err) {

    if (!res) {
        return;
    }

    var errString = JSON.stringify(err);

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
        konsole.error(null, errString);
    }

    xcsutil.clearMemWatchHeapDiff(res);
    xcsutil.clearRequestWatcherTimeout(res);

    var message = xcsutil.colorizedErrorMessage(res, err);

    konsole.error(null, message);

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

    konsole.log(null, message);

    return res.end();

}

function responseWithoutObject(res, status) {

    xcsutil.clearMemWatchHeapDiff(res);
    xcsutil.clearRequestWatcherTimeout(res);

    var message = xcsutil.colorizedSuccessMessage(res);

    konsole.log(null, message);

    // Check whether we need to broadcast the occurrence to the dashboard
    processStatusCode(status);

    return res.sendStatus(status);
}

xcsutil.colorizedSuccessMessage = function colorizedSuccessMessage(res) {

    var requestUUID = res.xcsRequestUUID;
    if (requestUUID) {
        requestUUID = '[' + requestUUID + ']';
    } else {
        requestUUID = '';
    }

    var xcsMethod = (res.xcsMethod || ''),
        xcsURL = (res.xcsURL || ''),
        xcsStatus = (res.statusCode || 500);

    return requestUUID + xcsMethod.toString().blue + ' ' + xcsURL.toString().blue + ' HTTP '.green + xcsStatus.toString().green;

};

xcsutil.colorizedErrorMessage = function colorizedErrorMessage(res, err) {

    var requestUUID = res.xcsRequestUUID;
    if (requestUUID) {
        requestUUID = '[' + requestUUID + ']';
    } else {
        requestUUID = '';
    }

    var xcsMethod = (res.xcsMethod || ''),
        xcsURL = (res.xcsURL || ''),
        xcsStatus = (err.status || 500),
        xcsmessage = (err.message || 'Error unknown');

    return requestUUID + xcsMethod.toString().red + ' ' + xcsURL.toString().red + ' HTTP '.red + xcsStatus.toString().red + ' ('.red + xcsmessage.toString().red + ')'.red;
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

    xcsutil.logLevelInc(req);

    var date = new Date(),
        functionTitle = '[XCSUtil - deleteExpiredDocuments] automatic removal of expired documents';

    konsole.log(req, functionTitle);

    var query = {
        startkey: [date],
        endkey: ['2000-01-01T00:00:00.000Z', {}],
        include_docs: false,
        descending: true
    };

    require('../classes/dbCoreClass.js').findDocumentsWithQuery(req, k.XCSDesignDocumentAll, k.XCSDesignDocumentViewAllByExpirationTime, query, function ExpiredDocumentsInternalCallback(err, results) {
        // Not finding documents doesn't mean it's an error. Let's report true errors instead.
        if (err && err.status !== 404) {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            if (results.length) {
                konsole.log(req, '[XCSUtil - deleteExpiredDocuments] Expired documents found to be deleted: ' + results.length);

                var toDelete = _.flatten(_.compact(results)).map(function MarkExpiredDocumentsForDeletionMap(doc) {
                    return {
                        _id: doc._id,
                        _rev: doc._rev,
                        _deleted: true
                    };
                });

                require('../classes/dbCoreClass.js').bulkUpdateDocuments(req, toDelete, null, function (err) {
                    xcsutil.logLevelDec(req);
                    if (err) {
                        konsole.error(req, '[XCSUtil - deleteExpiredDocuments] error: ' + err.message);
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        konsole.log(req, '[XCSUtil - deleteExpiredDocuments] Expired documents deleted successfully.');
                        return xcsutil.safeCallback(cb);
                    }
                });
            } else {
                konsole.log(req, '[XCSUtil - deleteExpiredDocuments] No expired documents found.');
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb);
            }
        }
    });

};

xcsutil.bulk_import = function bulk_import(req, cb) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[XCSUtil - bulk_import] Importing documents (bulk mode)';

    konsole.log(req, functionTitle);

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

    var headers = {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        },
        docs = JSON.stringify({
            docs: req.body.docs
        });

    request({
        url: 'http://localhost:' + k.XCSCouchPort + '/xcs/_bulk_docs',
        method: 'POST',
        headers: headers,
        body: docs
    }, function (err, couchRes) {
        if (err) {
            return xcsutil.safeCallback(cb, {
                status: 500,
                message: 'Internal Server Error (xcsd): ' + JSON.stringify(err)
            });
        } else {
            // We don't want to return a 201 (Created) because it's a bulk import. A 204 will do just fine.
            var status = couchRes.statusCode;
            konsole.log(req, '[XCSUtil - bulk_import] completed successfully: HTTP ' + status + ' (returning HTTP 204)');

            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

            return xcsutil.safeCallback(cb, null);
        }
    });
};

xcsutil.dashboard = function dashboard(req, res) {
    require('../classes/redisClass.js').client().hget('XCSDashboard key', 'isDashboardInstalled', function Dashboard(err, reply) {

        xcsutil.clearMemWatchHeapDiff(res);
        xcsutil.clearRequestWatcherTimeout(res);

        if (!reply || !fs.existsSync(reply)) {
            var message = 'the Xcode Server Dashboard is not installed: ' + reply;
            konsole.log(req, message);
            return res.sendStatus(404);
        } else {
            var url = req.url,
                fileToServe;

            if ('/api/dashboard' === url) {
                fileToServe = reply + '/index.html';
                res.set('Content-Type', 'text/html');
                return res.sendfile(fileToServe);
            } else {
                fileToServe = reply + url.replace('/api/dashboard', '');
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

xcsutil.isPIDRunning = function isPIDRunning(pid, cb) {
    exec('ps -p ' + pid + ' > /dev/null ', function (err) {
        xcsutil.safeCallback(cb, err);
    });
};

xcsutil.maintenanceTasks = function status(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[XCSUtil - maintenanceTasks] ' + req.method + ' ' + req.url,
        redis = require('../classes/redisClass.js').client();

    konsole.log(req, functionTitle);

    redis.get(k.XCSRedisMaintenanceTasksResults, function ASXCSRedisGetAuthTokenPrefix(err, reply) {
        if (err) {
            var message = 'Internal Server Error (Redis): ' + JSON.stringify(err);
            konsole.error(req, message);
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: message
            });
        } else {
            if (reply) {
                var results = JSON.parse(reply);
                konsole.log(req, '[XCSUtil - maintenanceTasks] there are ' + results.length + ' maintenance tasks running.');
                return xcsutil.standardizedResponse(res, 532, results);
            } else {
                konsole.log(req, '[XCSUtil - maintenanceTasks] there are no tasks running.');
                return xcsutil.standardizedResponse(res, 204);
            }
        }
    });

};

xcsutil.generateFakeMaintenanceTasks = function status(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[XCSUtil - fakeMaintenanceTasks] ' + req.method + ' ' + req.url;
    konsole.log(req, functionTitle);

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
                    message: 'unable to generate fake maintenance tasks. Reason: the manual init phase has to be set.'
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

xcsutil.isUserAgentAllowedInEnabledMode = function isUserAgentAllowedInEnabledMode(req) {

    // If there is no req, it means it's an internal request (xcsd-triggered)
    if (!req) {
        return true;
    }

    var agent = (req.headers[k.XCSUserAgent] || null);

    if (!agent || agent.indexOf('Xcode') > -1) {
        return false;
    } else {
        return true;
    }
};

xcsutil.handleInitPhaseOrServiceEnabledState = function handleInitPhaseOrServiceEnabledState(req, res, cb) {
    checkIfRequestCanBeServiced_internal(function (err, isInitPhaseOn, isInitPhaseOnManual, serviceIsEnabled) {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            if (isInitPhaseOn || isInitPhaseOnManual) {
                konsole.log(req, '[XCSUtil - handleInitPhaseOrServiceEnabledState] service is on the init phase.');
                xcsutil.maintenanceTasks_internal(function (err, activeTasks) {
                    if (err) {
                        return xcsutil.standardizedErrorResponse(res, err);
                    } else {
                        return xcsutil.standardizedResponse(res, 532, activeTasks);
                    }
                });
            } else if (false === serviceIsEnabled) {
                konsole.error(req, '[XCSUtil - handleInitPhaseOrServiceEnabledState] error: Service is not enabled');
                return xcsutil.returnServerNotAvailableStatusResponse(req, res);
            } else {
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

    konsole.log(null, '    [XCSUtil - generateFakeMaintenanceTasks_internal] generating ' + numberOfTasks + ' tasks');

    function setTimerForTask(self, key) {
        var timeoutInSeconds = Math.floor(Math.random() * (100 - 60) + 60);
        konsole.log(null, '[XCSUtil - generateFakeMaintenanceTasks_internal] setting timeout for task ' + k.XCSActiveTask + key + ': ' + timeoutInSeconds + ' seconds');
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

    var redis = require('../classes/redisClass.js').client();

    async.waterfall([

            // Check if we're on a regular init phase

        function CheckAutomaticInitPhase(callback) {

                redis.get(k.XCSRedisServiceInitPhase, function (err, isInitPhaseOn) {
                    if (err) {
                        callback({
                            status: 500,
                            message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
                        });
                    } else {
                        callback(null, isInitPhaseOn);
                    }
                });

        },

            // Check if we're on a manual init phase

        function CheckAndOrSetManualInitPhase(isInitPhaseOn, callback) {

                if ('1' === isInitPhaseOn) {
                    callback(null, isInitPhaseOn, null);
                } else {
                    redis.get(k.XCSRedisServiceInitPhaseManual, function (err, isInitPhaseOnManual) {
                        if (err) {
                            callback({
                                status: 500,
                                message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
                            });
                        } else {
                            callback(null, null, isInitPhaseOnManual);
                        }
                    });
                }

        },

            // Check if the service is disabled

        function CheckIfServiceIsEnabled(isInitPhaseOn, isInitPhaseOnManual, callback) {

                if ('1' === isInitPhaseOn) {
                    callback(null, isInitPhaseOn, null, null);
                } else {
                    redis.get(k.XCSRedisServiceInitPhaseManual, function (err, isInitPhaseOnManual) {
                        if (err) {
                            callback({
                                status: 500,
                                message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
                            });
                        } else {
                            if ('1' === isInitPhaseOnManual) {
                                callback(null, null, isInitPhaseOnManual, null);
                            } else {
                                require('../classes/settingsClass.js').findOrCreateSettingsDocument(null, function (err, settings) {
                                    if (err) {
                                        konsole.error(null, '[XCSUtil - checkIfRequestCanBeServiced_internal] error: ' + err.message);
                                        callback(err);
                                    } else {
                                        callback(null, null, null, settings[k.XCSServiceEnabledKey]);
                                    }
                                });
                            }
                        }
                    });
                }

        }],
        function (err, isInitPhaseOn, isInitPhaseOnManual, serviceIsEnabled) {
            if (err) {
                return xcsutil.safeCallback(cb, err);
            } else {
                return xcsutil.safeCallback(cb, null, isInitPhaseOn, isInitPhaseOnManual, serviceIsEnabled);
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