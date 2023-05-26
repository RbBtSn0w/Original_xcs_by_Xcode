'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    net = require('net');

var shortTimeout = 5 * 1000, // 5 seconds
    longTimeout = 5 * 60 * 1000, // 5 minutes
    maxRetries = 12,
    interval;

var konsole = function () {
    if (!this.initialized) {
        this.initialized = true;
        this.retriedTimes = 0;
        this.connect();
    }
};

function loggingTimestamp() {
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
}

konsole.prototype.reconnect = function () {

    var self = this;

    clearInterval(interval);

    if (self.retriedTimes >= maxRetries) {
        console.log('[Konsole] Maximum retry connection count reached. Going to retry every 5 minutes...');
        interval = setTimeout(self.connect.bind(self), longTimeout);
    } else {
        self.retriedTimes += 1;
        console.log('[Konsole] [' + self.retriedTimes + ' of ' + maxRetries + '] Attempting to connect to ' + k.XCSKonsoleHost + '...');
        interval = setTimeout(self.connect.bind(self), shortTimeout);
    }
};

konsole.prototype.connect = function () {

    var self = this;

    if (k.XCSKonsoleHost === '') {
        self.isConnected = false;
        return;
    }

    console.log('[Konsole] Attempting to establish a conection to: ' + k.XCSKonsoleHost + ':' + k.XCSKonsolePort);

    self.socket = new net.Socket();
    self.socket.connect(k.XCSKonsolePort, k.XCSKonsoleHost, function () {
        console.log('[Konsole] Konsole is now listening: ' + k.XCSKonsoleHost + ':' + k.XCSKonsolePort);
        self.isConnected = true;
        self.retriedTimes = 0;
    });

    self.socket.on('error', function (err) {
        if (('ENOTFOUND' === err.code) || ('ETIMEDOUT' === err.code) || ('EADDRNOTAVAIL' === err.code)) {
            // Assume the xcslog server is down. Try to reconnect in 'longTimeout' minutes
            self.retriedTimes = maxRetries;
            console.log('[Konsole] Error attempting to connect to ' + k.XCSKonsoleHost + ':' + k.XCSKonsolePort + '. Reason: ' + err.message);
        } else {
            console.log('[Konsole] Error attempting to connect to ' + k.XCSKonsoleHost + ':' + k.XCSKonsolePort + '. Reason: ' + err.message);
        }
    });

    self.socket.on('close', function () {
        console.log('[Konsole] Connection with Konsole has been closed.');
        self.isConnected = false;
        self.reconnect();
    });

};

konsole.prototype.logWithoutTimestamp = function () {

    if (k.XCSKonsoleLogLevel > k.XCSKonsoleLogLevels.info) {
        return;
    }

    var self = this,
        req = arguments[0],
        otherArgs = Array.prototype.slice.call(arguments, 1),
        times = ((req && req.logLevel) || 0);

    if (times < 0) {
        times = 0;
    } else if (times > 10) {
        times = 10;
    }

    var message = Array.prototype.slice.call(otherArgs).join(' ');

    log(message, 'info ', self.isConnected, self.socket);

};

konsole.prototype.logmax = function () {

    if (k.XCSKonsoleLogLevel > k.XCSKonsoleLogLevels.info) {
        return;
    }

    var self = this,
        req = arguments[0],
        otherArgs = Array.prototype.slice.call(arguments, 1),
        text = Array.prototype.slice.call(otherArgs).join(' ');

    prepareLogMessage(req, self.isConnected, self.socket, true, 'info ', text);

};

konsole.prototype.debug = function () {

    if (k.XCSKonsoleLogLevel > k.XCSKonsoleLogLevels.debug) {
        return;
    }

    var self = this,
        req = arguments[0],
        otherArgs = Array.prototype.slice.call(arguments, 1),
        text = Array.prototype.slice.call(otherArgs).join(' ');

    prepareLogMessage(req, self.isConnected, self.socket, false, 'debug', text);

};

konsole.prototype.log = function () {

    if (k.XCSKonsoleLogLevel > k.XCSKonsoleLogLevels.info) {
        return;
    }

    var self = this,
        req = arguments[0],
        otherArgs = Array.prototype.slice.call(arguments, 1),
        text = Array.prototype.slice.call(otherArgs).join(' ');

    prepareLogMessage(req, self.isConnected, self.socket, false, 'info ', text);

};

konsole.prototype.warn = function () {

    if (k.XCSKonsoleLogLevel > k.XCSKonsoleLogLevels.warn) {
        return;
    }

    var self = this,
        req = arguments[0],
        otherArgs = Array.prototype.slice.call(arguments, 1),
        text = Array.prototype.slice.call(otherArgs).join(' ');

    prepareLogMessage(req, self.isConnected, self.socket, false, 'warn ', text);

};

konsole.prototype.error = function () {

    if (k.XCSKonsoleLogLevel > k.XCSKonsoleLogLevels.error) {
        return;
    }

    var self = this,
        req = arguments[0],
        otherArgs = Array.prototype.slice.call(arguments, 1),
        text = Array.prototype.slice.call(otherArgs).join(' ');

    prepareLogMessage(req, self.isConnected, self.socket, false, 'error', text);

};

function prepareLogMessage(req, isConnected, socket, log_max, log_type, text) {
    var prefix = (req && req.requestUUID),
        times = ((req && req.logLevel) || 0);

    if (times < 0) {
        times = 0;
    } else if (times > 10) {
        times = 10;
    }

    var logIndent = require('./xcsutil.js').repeatChar(' ', times * 4),
        message;

    if (prefix) {
        if (k.XCSKonsoleDebugLogLevel) {
            message = loggingTimestamp() + '[' + prefix + ']' + '[' + times + ']' + logIndent + text;
        } else {
            message = loggingTimestamp() + '[' + prefix + ']' + logIndent + text;
        }
    } else {
        if (k.XCSKonsoleDebugLogLevel) {
            message = loggingTimestamp() + '[' + times + ']' + logIndent + text;
        } else {
            message = loggingTimestamp() + logIndent + text;
        }
    }

    if (log_max) {
        if ((k.XCSAsteriskHeaderLength - message.length) > 0) {
            message = message + new Array(k.XCSAsteriskHeaderLength - message.length + 1).join('*');
        } else {
            message = message.substring(0, k.XCSAsteriskHeaderLength);
            message = message + new Array(k.XCSAsteriskHeaderLength - message.length + 1).join('*');
        }
    }

    log(message, log_type, isConnected, socket);
}

function log(message, level, isConnected, socket) {
    // log it!
    console.log(level, message);

    // send to logstash via TCP
    if (isConnected) {
        socket.write(JSON.stringify({
            level: level,
            message: message
        }, null, 4) + '\n');
    }
}

module.exports = new konsole();