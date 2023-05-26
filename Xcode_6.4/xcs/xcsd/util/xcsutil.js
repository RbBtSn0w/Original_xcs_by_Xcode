'use strict';

var k = require('../constants.js'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    os = require('os'),
    http = require('http'),
    konsole = require('./konsole.js'),
    util = require('util'),
    crypto = require('crypto'),
    fs = require('fs'),
    path = require('path'),
    uuid = require('node-uuid');

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

xcsutil.makeUUID = function (cb) {

    exec('/usr/bin/uuidgen', function (err, stdout) {
        if (err) {
            var error = {
                status: 500,
                message: 'Unable to generate a UUID. Reason: ' + err.message
            };
            return cb(error);
        } else {
            return cb(null, stdout);
        }
    });

};

xcsutil.removeDirectory = function (dirPath, cb) {
    var rm = spawn('rm', ['-rf', dirPath]);

    rm.on('close', function (code) {
        if (code === 0) {
            cb(null);
        } else {
            cb('rm exited with code ' + code);
        }
    });
};

xcsutil.writeTemporaryFile = function (str, cb) {
    var filename = path.join(os.tmpdir(), uuid.v4());
    fs.writeFile(filename, str, function (err) {
        cb(err, filename, function (cb) {
            fs.unlink(filename, cb);
        });
    });
};

xcsutil.ping = function (req, res) {

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
                status: 502,
                message: 'Database unavailable'
            });
        });
    }

    http.get('http://' + k.XCSCouchHost + ':' + k.XCSCouchPort, callback);
};

xcsutil.hostname = function (req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[XCSUtil - hostname] ' + req.method + ' ' + req.url;
    konsole.log(req, functionTitle);

    var hostname = os.hostname();

    konsole.log(req, '[XCSUtil - hostname] hostname: ' + hostname);

    xcsutil.logLevelDec(req);

    return xcsutil.standardizedResponse(res, 200, {
        hostname: hostname
    });

};

xcsutil.unitTestCleanup = function (req, res) {
    res.useChunkedEncodingByDefault = false;
    return xcsutil.standardizedResponse(res, 204);
};

xcsutil.dateComponentsFromDate = function (date) {

    // Segment the date into [YYYY,MM,DD] components

    var components = [date.getUTCFullYear(),
                      date.getUTCMonth() + 1,
                      date.getUTCDate(),
                      date.getUTCHours(),
                      date.getUTCMinutes(),
                      date.getUTCSeconds()];

    return components;
};

xcsutil.setTTLInDocumentIfNeeded = function (req, body) {

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

xcsutil.formalizeIDAndRev = function (doc) {
    // Problem: Nano returns id and rev, not _id and _rev.
    // Solution: formalize the id and rev properties.

    doc._id = doc.id;
    doc._rev = doc.rev;
    delete doc.id;
    delete doc.rev;

    return doc;
};

xcsutil.repeatChar = function (c, times) {

    var string = '';

    for (var i = 0; i < times; ++i) {
        string += c;
    }

    return string;
};

xcsutil.logLevelInc = function (req) {
    var currentLogLevel = 0;

    if (req) {
        currentLogLevel = req.logLevel;
        req.logLevel += 1;
    }

    return currentLogLevel;
};

xcsutil.logLevelDec = function (req) {

    if (req) {
        req.logLevel -= 1;
    }

};

xcsutil.logLevelCheck = function (req, previousLogLevel) {

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

xcsutil.loggingTimestamp = function () {
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


xcsutil.profilerSummary = function (req) {

    if (req && req.snitch) {
        var prefix = (req && req.requestUUID);

        if (!prefix) {
            prefix = '';
        }

        var title = req.snitch.title;

        if (!title) {
            title = '<Profiler title not set>';
        }

        var message = '[' + prefix + '] [Profiler] Summary for: ' + title + '\n' + util.inspect(req.snitch.summarize());

        konsole.log(message);
    }

};

xcsutil.bulkPost = function (body, cb) {
    if (body.length) {
        var curl = spawn('/usr/bin/curl', [
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
            return cb(err);
        });
    } else {
        return cb(null);
    }
};

xcsutil.sha1 = function (obj) {
    var temp = {};

    Object.keys(obj)
        .sort()
        .forEach(function (k) {
            temp[k] = obj[k];
        });

    var json = JSON.stringify(temp);
    return crypto.createHash('sha1').update(json).digest('hex');
};

xcsutil.displayLogRouteHeader = function (req) {
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

xcsutil.displayLogDivision = function (req, title) {

    title = title + ' ';

    konsole.logmax(req, title);
};

/**
 * Standard responses
 */

function wrapObjectIfNativeDatatype(obj) {
    // If obj is a boolean, wrap it
    if ((typeof obj === 'boolean') || (typeof obj === 'number') || (typeof obj === 'string')) {
        obj = {
            result: obj
        };
    }
    return obj;
}

function responseWithObject(res, status, obj) {
    res.status(status);

    // If the object hasn't been specified, instantiate an empty one
    if (obj === undefined) {
        obj = {};
    }

    return xcsutil.standardizedResponseWrite(res, obj);
}

function responseWithNoObject(res, status) {
    return res.send(status);
}

xcsutil.standardizedResponse = function (res, status, obj) {

    switch (status) {
    case 200:
    case 201:
    case 202:
    case 400:
    case 401:
    case 403:
    case 404:
    case 409:
    case 410:
    case 500:
    case 501:
    case 502:
    case 503:
    case 530:
    case 531:
        responseWithObject(res, status, obj);
        break;
    case 204:
        responseWithNoObject(res, status);
        break;
    default:
        throw new Error('[XCSUtil - standardizedResponse] status not handled: ' + status);
    }

};

xcsutil.standardizedResponseWrite = function (res, obj) {

    obj = wrapObjectIfNativeDatatype(obj);

    if (obj) {
        // If the object is an array, wrap it in the count/results combo
        if (Array.isArray(obj)) {
            res.setHeader(k.XCSResultsList, 'true');
            res.write(JSON.stringify({
                count: obj.length,
                results: obj
            }));
        } else {
            // Otherwise, if the object is an object return it verbatim
            res.write(JSON.stringify(obj));
        }
    }

    return res.end();

};

xcsutil.standardizedErrorResponse = function (res, err) {
    return res.send(err.status, err.message);
};

module.exports = xcsutil;