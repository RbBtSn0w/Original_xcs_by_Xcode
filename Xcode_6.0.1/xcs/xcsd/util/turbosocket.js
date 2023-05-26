/*
    TurboSocket
    A lightweight, reliable datagram service for Xcode Server IPC.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var tls = require('tls'),
    events = require('events'),
    util = require('util'),
    fs = require('fs'),
    konsole = require('./konsole.js');

var STATE_CATEGORY = 0;
var STATE_USER_TAG = 1;
var STATE_PAYLOAD_SIZE = 2;
var STATE_PAYLOAD = 3;
var STATE_CONTROL_TYPE = 4;
var STATE_CONTROL_PAYLOAD = 5;

var CATEGORY_CONTROL = 0;
var CATEGORY_DATAGRAM = 1;

/* Socket object */
function TurboSocket(socket) {
    events.EventEmitter.call(this);
    this.socket = socket;
    this.identity = (socket.authorized) ? socket.getPeerCertificate() : null;
    this.username = null;
    this.handshakeHeloReceived = false;
    this.handshakeCompleted = false;

    this.sendCertificateTrustMessage(!!this.identity);

    var currentDatagramTag = 0;
    var currentDatagramSize = 0;
    var currentControlType = 0;
    var currentControlPayloadSize = 0;
    var state = STATE_CATEGORY;

    var heartbeatInterval = setInterval(this.sendHeartbeat.bind(this), 30000);

    var self = this;
    socket.on('readable', function () {
        while (true) {
            switch (state) {
            case STATE_CATEGORY:
                var category = socket.read(1);
                if (!category) {
                    return;
                }

                if (category[0] === CATEGORY_DATAGRAM) {
                    state = STATE_USER_TAG;
                } else if (category[0] === CATEGORY_CONTROL) {
                    state = STATE_CONTROL_TYPE;
                }
                break;

            case STATE_USER_TAG:
                var tag = socket.read(1);
                if (!tag) {
                    return;
                }

                currentDatagramTag = tag[0];
                state = STATE_PAYLOAD_SIZE;
                break;

            case STATE_PAYLOAD_SIZE:
                var size = socket.read(4);
                if (!size) {
                    return;
                }

                currentDatagramSize = size.readUInt32BE(0);
                state = STATE_PAYLOAD;
                break;

            case STATE_PAYLOAD:
                var datagram = socket.read(currentDatagramSize);
                if (!datagram) {
                    return;
                }

                self.receiveDatagram(datagram, currentDatagramTag);
                state = STATE_CATEGORY;
                break;

            case STATE_CONTROL_TYPE:
                var type = socket.read(4);
                if (!type) {
                    return;
                }

                currentControlType = type.toString('ascii');
                currentControlPayloadSize = self.receiveControlMessage(currentControlType, null);
                if (currentControlPayloadSize > 0) {
                    state = STATE_CONTROL_PAYLOAD;
                } else {
                    state = STATE_CATEGORY;
                }
                break;

            case STATE_CONTROL_PAYLOAD:
                var payload = socket.read(currentControlPayloadSize);
                if (!payload) {
                    return;
                }

                currentControlPayloadSize = self.receiveControlMessage(currentControlType, payload);
                if (currentControlPayloadSize > 0) {
                    state = STATE_CONTROL_PAYLOAD;
                } else {
                    state = STATE_CATEGORY;
                }
                break;
            }
        }
    });

    socket.on('close', function () {
        clearInterval(heartbeatInterval);
        self.emit('disconnect');
    });

    socket.on('error', function (err) {
        konsole.log(null, '[XCSNode TurboSocket] Socket encountered an error:');
        konsole.log(null, err.stack);
    });
}

util.inherits(TurboSocket, events.EventEmitter);

TurboSocket.prototype.receiveDatagram = function (datagram, tag) {
    if (this.loopback) {
        this.sendDatagram(datagram, tag);
    } else {
        this.emit('message', datagram, tag);
    }
};

TurboSocket.prototype.receiveControlMessage = function (type, payload) {
    if (type === 'helo') {
        this.handshakeHeloReceived = true;

        if (this.handshakePendingAuth) {
            return 0;
        }

        this.completeHandshake();
    } else if (type === 'auth') {
        if (!this.handshakeCompleted) {
            this.handshakePendingAuth = true;
        }

        if (!payload) // start by reading the size
        {
            this.readingAuthPayloadLength = true;
            return 2;
        } else {
            if (this.readingAuthPayloadLength) {
                this.authUsernameLength = payload[0];
                this.authPasswordLength = payload[1];
                this.readingAuthPayloadLength = false;
                return (this.authUsernameLength + this.authPasswordLength);
            } else {
                var username = payload.toString('utf8', 0, this.authUsernameLength);
                var password = payload.toString('utf8', this.authUsernameLength, this.authUsernameLength + this.authPasswordLength);
                delete this.authUsernameLength;
                delete this.authPasswordLength;
                delete this.readingAuthPayloadLength;

                var self = this;
                this.emit('authenticate', username, password, function (err) {
                    if (!err) {
                        self.upgradeWithPrivilegesOfUser(username);
                    } else {
                        self.upgradeWithPrivilegesOfUser(null);
                    }
                });
            }
        }
    } else if (type === 'loop') {
        this.loopback = true;
    } else if (type === 'kick') {
        konsole.log(null, '[XCSNode TurboSocket] Forcibly disconnecting a socket in response to a "kick" message');
        this.socket.end();
    } else if (type === 'rndm') {
        if (this.readingRandomDataLength) {
            delete this.readingRandomDataLength;

            var len = payload.readUInt32BE(0);
            if (len > 1073741817) // Node's max - 6 byte header
            {
                konsole.log(null, '[XCSNode TurboSocket] Requested more random data than is allowed by Node, ignoring');
                return 0;
            }

            var self = this;
            fs.open('/dev/random', 'r', function (err, fd) {
                if (err)
                    konsole.log(null, '[XCSNode TurboSocket] Error opening random device: ' + err.message);
                else {
                    var buf = new Buffer(len);
                    fs.read(fd, buf, 0, len - 5, null, function (err, bytesRead, b) {
                        if (err)
                            konsole.log(null, '[XCSNode TurboSocket] Error occurred reading random bytes: ' + err.message);
                        else if (bytesRead != (len - 5))
                            konsole.log(null, '[XCSNode TurboSocket] Error: random bytes read (' + bytesRead + ') not equal to bytes expected (' + len + ')');
                        else {
                            buf.write('!DONE', len - 5); // makes debugging easier
                            self.sendDatagram(b, 255);
                        }
                    });
                }
            });
        } else {
            this.readingRandomDataLength = true;
            return 4;
        }
    }

    return 0; // we don't expect a payload
};

TurboSocket.prototype.sendDatagram = function (datagram, tag) {
    if (!Buffer.isBuffer(datagram)) {
        datagram = new Buffer(datagram, 'utf8');
    }

    if (datagram.length > 0xffffffff) // uint32_t max
    {
        konsole.log(null, '[XCSNode TurboSocket] Attempted to send a message larger than the 4 GiB maximum (' + datagram.length + ')');
        return;
    }

    var header = new Buffer(6);
    header[0] = CATEGORY_DATAGRAM;
    header[1] = tag || 0;
    header.writeUInt32BE(datagram.length, 2);

    this.socket.write(Buffer.concat([header, datagram], header.length + datagram.length));
};

TurboSocket.prototype.sendControlMessage = function (type, payload) {
    var header = new Buffer(5);
    header[0] = CATEGORY_CONTROL;
    header.write(type, 1, 4, 'ascii');

    if (payload) {
        if (!Buffer.isBuffer(payload)) {
            payload = new Buffer(payload, 'utf8');
        }

        this.socket.write(Buffer.concat([header, payload], header.length + payload.length));
    } else {
        this.socket.write(header);
    }
};

TurboSocket.prototype.sendCertificateTrustMessage = function (trusted) {
    var trustPayload = new Buffer(1);
    trustPayload[0] = (trusted) ? 1 : 0;
    this.sendControlMessage('cert', trustPayload);
};

TurboSocket.prototype.sendHeartbeat = function () {
    this.sendControlMessage('hrtb');
};

TurboSocket.prototype.completeHandshake = function () {
    this.sendControlMessage('helo');
    this.handshakeCompleted = true;
};

TurboSocket.prototype.upgradeWithPrivilegesOfUser = function (username) {
    var lenBuf;
    this.username = username;
    if (username) {
        var usernameBuf = new Buffer(username, 'utf8');
        if (usernameBuf.length > 255) {
            usernameBuf = usernameBuf.slice(0, 255); // it's just advisory anyway, we can truncate
        }

        lenBuf = new Buffer(1);
        lenBuf[0] = usernameBuf.length;
        this.sendControlMessage('priv', Buffer.concat([lenBuf, usernameBuf], 1 + usernameBuf.length));
    } else {
        lenBuf = new Buffer(1);
        lenBuf[0] = 0;
        this.sendControlMessage('priv', lenBuf);
    }

    if (this.handshakePendingAuth) {
        delete this.handshakePendingAuth;
        if (this.handshakeHeloReceived) {
            this.completeHandshake();
        }
    }

    this.emit('privilegesUpgraded', this.username);
};

/* Server object */
function TurboSocketServer(tlsOptions) {
    events.EventEmitter.call(this);

    var self = this;
    this.tlsServer = tls.createServer(tlsOptions, function (socket) {
        var ts = new TurboSocket(socket);
        self.emit('connection', ts);
    });
}

util.inherits(TurboSocketServer, events.EventEmitter);

TurboSocketServer.prototype.listen = function (port, cb) {
    this.tlsServer.listen(port, cb);
};

/* Module exports */
exports.createServer = function (tlsOptions, cb) {
    var server = new TurboSocketServer(tlsOptions);
    if (cb) {
        server.on('connection', cb);
    }
    return server;
};