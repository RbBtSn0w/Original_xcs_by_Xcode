'use strict';

var cluster = require('cluster');
var util = require('util');
var nativeLogger = require('bindings')('logger');
var objc = require('./bridge/objc.js'),
    $ = objc.$;

objc.importSharedFramework('XCSCore');

// we don't call this from xcsd, but objective-c bridged code might, so make its logging go to the same place.
$.XCSLogFacility('setDefaultFacilityName', $('com.apple.xcsd'));

nativeLogger.setFacility('com.apple.xcsd');

function logify(input) {
    var type = Object.prototype.toString.call(input);
    if (type === '[object Array]' || type === '[object Object]') {
        if (input.status && input.message) {
            // An object with status and message is probably an error, let's format it as such.
            return input.message + ' (' + input.status + ')';
        }
        return util.inspect(input, { maxArrayLength: 10 });
    } else if (type === '[object Null]') {
        return '(null)';
    } else if (type === '[object Undefined]') {
        return '(undefined)';
    }

    return input;
}

function Logger(request) {
    this.request = request;
}

Logger.prototype.withRequest = function (request) {
    return new Logger(request);
};

Logger.prototype.withRequestID = function (requestID) {
    return new Logger({requestUUID: requestID});
};

Logger.prototype.logMessage = function (level) {
    var messageArgs = Array.prototype.slice.call(arguments, 1),
        message = messageArgs.map(logify).join(' ');

    nativeLogger.logMessage(level, message, this.additionalLogData());

    // Log stack traces for any errors in the arguments
    messageArgs.forEach(arg => {
        if (arg && arg.stack) {
            nativeLogger.logMessage(7, arg.stack, this.additionalLogData());
        }
    });
};

Logger.prototype.additionalLogData = function () {
    var req = this.request,
        reqID = (req && req.requestUUID) || "",
        workerID = "" + (cluster.isMaster ? 0 : cluster.worker.id),
        username = (req && req.session && req.session.username) || "",
        ipAddress = (req && req.ip) || "",
        ua = (req && req.get && req.get('User-Agent')) || "",
        xcode = (req && req.get && req.get('Xcode-Version')) || "";

    return {
        RequestID: reqID,
        WorkerID: workerID,
        Environment: process.env.NODE_ENV || '',
        Username: username,
        ClientIP: ipAddress,
        UserAgent: ua,
        Xcode: xcode
    };
};

function makeLoggerForLevel(level) {
    return function() {
        this.logMessage.apply(this, [level].concat(Array.prototype.slice.call(arguments)));
    };
}

Logger.prototype.debug = makeLoggerForLevel(7);
Logger.prototype.info = makeLoggerForLevel(6);
Logger.prototype.warn = makeLoggerForLevel(4);
Logger.prototype.error = makeLoggerForLevel(3);
Logger.prototype.critical = makeLoggerForLevel(2);

module.exports = new Logger(null);
