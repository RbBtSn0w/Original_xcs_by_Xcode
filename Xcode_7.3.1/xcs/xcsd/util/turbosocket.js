/*
    XCSTurboSocket
    A lightweight, reliable datagram service for Xcode Server IPC.
*/

'use strict';

var tls = require('tls'),
    events = require('events'),
    util = require('util'),
    fs = require('fs'),
    logger = require('./logger.js');

var STATE_CATEGORY = 0;
var STATE_USER_TAG = 1;
var STATE_PAYLOAD_SIZE = 2;
var STATE_PAYLOAD = 3;
var STATE_CONTROL_TYPE = 4;
var STATE_CONTROL_PAYLOAD = 5;

var CATEGORY_CONTROL = 0;
var CATEGORY_DATAGRAM = 1;

/* Socket object */
function XCSTurboSocket(socket) {
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
        logger.error('TurboSocket encountered an error on the socket\n' + err.stack);
    });
}

util.inherits(XCSTurboSocket, events.EventEmitter);

XCSTurboSocket.prototype.receiveDatagram = function receiveDatagram(datagram, tag) {
    if (this.loopback) {
        this.sendDatagram(datagram, tag);
    } else {
        this.emit('message', datagram, tag);
    }
};

XCSTurboSocket.prototype.receiveControlMessage = function receiveControlMessage(type, payload) {
    var self = this;

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
        logger.info('Forcibly disconnecting a socket in response to a "kick" message.');
        this.socket.end();
    } else if (type === 'rndm') {
        if (this.readingRandomDataLength) {
            delete this.readingRandomDataLength;

            var len = payload.readUInt32BE(0);
            if (len > 1073741817) // Node's max - 6 byte header
            {
                logger.warn('Socket requested more random data than Node.js allows. Ignoring.');
                return 0;
            }

            fs.open('/dev/random', 'r', function (err, fd) {
                if (err) {
                    logger.error('Error opening random device:', err);
                } else {
                    var buf = new Buffer(len);
                    fs.read(fd, buf, 0, len - 5, null, function (err, bytesRead, b) {
                        if (err) {
                            logger.error('Error occurred reading random bytes:', err);
                        } else if (bytesRead !== (len - 5)) {
                            logger.error('Random bytes read not equal to bytes expected (' + bytesRead + ' != ' + len + ')');
                        } else {
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

XCSTurboSocket.prototype.sendDatagram = function sendDatagram(datagram, tag) {
    if (!Buffer.isBuffer(datagram)) {
        datagram = new Buffer(datagram, 'utf8');
    }

    if (datagram.length > 0xffffffff) // uint32_t max
    {
        logger.warn('Attempted to send a message larger than the 4GiB maximum, length =', datagram.length);
        return;
    }

    var header = new Buffer(6);
    header[0] = CATEGORY_DATAGRAM;
    header[1] = tag || 0;
    header.writeUInt32BE(datagram.length, 2);

    this.socket.write(Buffer.concat([header, datagram], header.length + datagram.length));
};

XCSTurboSocket.prototype.sendControlMessage = function sendControlMessage(type, payload) {
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

XCSTurboSocket.prototype.sendCertificateTrustMessage = function sendCertificateTrustMessage(trusted) {
    var trustPayload = new Buffer(1);
    trustPayload[0] = (trusted) ? 1 : 0;
    this.sendControlMessage('cert', trustPayload);
};

XCSTurboSocket.prototype.sendHeartbeat = function sendHeartbeat() {
    this.sendControlMessage('hrtb');
};

XCSTurboSocket.prototype.completeHandshake = function completeHandshake() {
    this.sendControlMessage('helo');
    this.handshakeCompleted = true;
};

XCSTurboSocket.prototype.upgradeWithPrivilegesOfUser = function upgradeWithPrivilegesOfUser(username) {
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
        var ts = new XCSTurboSocket(socket);
        self.emit('connection', ts);
    });
}

util.inherits(TurboSocketServer, events.EventEmitter);

TurboSocketServer.prototype.listen = function listen(port, cb) {
    this.tlsServer.listen(port, cb);
};

/* Module exports */
exports.createServer = function createServer(tlsOptions, cb) {
    var server = new TurboSocketServer(tlsOptions);
    if (cb) {
        server.on('connection', cb);
    }
    return server;
};
