'use strict';

/*
    TurboEvents
    An event stream mechanism built atop TurboSocket and Socket.IO.
*/

var makeUUID = require('./xcsutil.js').makeUUID,
    logger = require('./logger.js'),
    events = require('events'),
    util = require('util'),
    cluster = require('cluster'),
    uuid = require('node-uuid');

/* Event socket */
function TurboEventSocket(socket, mode, manager) {
    this.socket = socket;
    this.mode = mode;
    this.manager = manager;
    this.observers = {}; // only used for TurboSocket
    this.callbacks = {}; // only used for TurboSocket

    if (this.socket.identity) {
        this.identity = this.socket.identity;
    }

    if (this.socket.username) {
        this.username = this.socket.username;
    }

    if (mode === 'turbo') {
        this.socket.on('message', this.handleDatagram.bind(this));
        this.socket.on('authenticate', this.handleAuthentication.bind(this));
        this.socket.on('privilegesUpgraded', this.handlePrivilegeChange.bind(this));
    }
}

/* Event system manager */
function TurboEventManager() {
    events.EventEmitter.call(this);
    this.sockets = [];
    this.inquireCallbacks = {};

    var self = this;

    if (cluster.isMaster) {
        // listen for messages from forked processes
        cluster.on('fork', function (worker) {
            worker.on('message', function (msg) {
                if (msg.command) {
                    self.distributeMessageToWorkers(msg, worker);
                }
            });
        });
    } else {
        process.on('message', function (msg) {
            if (msg.command) {
                if (msg.command === 'TurboEventBroadcast') {
                    self.internalBroadcast(msg.filter, msg.event, msg.data);
                } else if (msg.command === 'TurboEventBroadcastWithCallback') {
                    self.internalInquire(msg.filter, msg.event, msg.data, function (response) {
                        process.send({
                            command: 'TurboEventResponse',
                            identifier: msg.identifier,
                            worker: msg.worker,
                            data: response
                        });
                    });
                } else if (msg.command === 'TurboEventResponse') {
                    if (self.inquireCallbacks[msg.identifier]) {
                        self.inquireCallbacks[msg.identifier](msg.data);
                        delete self.inquireCallbacks[msg.identifier];
                    }
                }
            }
        });
    }
}

util.inherits(TurboEventManager, events.EventEmitter);

TurboEventManager.prototype.registerTurboSocket = function registerTurboSocket(socket) {
    var s = new TurboEventSocket(socket, 'turbo', this);
    this.register(s);
};

TurboEventManager.prototype.registerSocketIOSocket = function registerSocketIOSocket(socket) {
    var s = new TurboEventSocket(socket, 'socket.io', this);
    this.register(s);
};

TurboEventManager.prototype.register = function register(socket) {
    this.sockets.push(socket);

    var self = this;
    socket.on('disconnect', function () {
        var idx = self.sockets.indexOf(socket);
        if (idx > -1) {
            self.sockets.splice(idx, 1);
        }
    });

    this.emit('connection', socket);
};

TurboEventManager.prototype.distributeMessageToWorkers = function (msg, worker) {
    if (!cluster.isMaster) {
        return;
    }

    try {
        var id;
        if (msg.command === 'TurboEventBroadcast') {
            for (id in cluster.workers) {
                if (cluster.workers.hasOwnProperty(id)) {
                    cluster.workers[id].send(msg);
                }
            }
        } else if (msg.command === 'TurboEventBroadcastWithCallback') {
            msg.worker = worker && worker.id;
            for (id in cluster.workers) {
                if (cluster.workers.hasOwnProperty(id)) {
                    cluster.workers[id].send(msg);
                }
            }
        } else if (msg.command === 'TurboEventResponse') {
            var w = cluster.workers[msg.worker];
            if (w) {
                w.send(msg);
            }
        }
    } catch (e) {
        logger.warn('Could not relay turbosocket message to worker:', e);
    }
};

TurboEventManager.prototype.broadcast = function broadcast(filter, event, data) {
    if (this.broadcastHandler) {
        this.broadcastHandler(filter, event, data);
    }

    if (cluster.isDisabled) {
        return this.internalBroadcast(filter, event, data);
    }

    var message = {
        command: 'TurboEventBroadcast',
        filter: filter,
        event: event,
        data: data
    };

    if (cluster.isMaster) {
        this.distributeMessageToWorkers(message);
    } else {
        process.send(message);
    }
};

TurboEventManager.prototype.inquire = function inquire(filter, event, data, cb) {
    if (cluster.isDisabled) {
        return this.internalInquire(filter, event, data, cb);
    }

    if (cluster.isMaster) {
        return;
    }

    var identifier = uuid.v4();
    this.inquireCallbacks[identifier] = cb;

    process.send({
        command: 'TurboEventBroadcastWithCallback',
        filter: filter,
        event: event,
        data: data,
        identifier: identifier
    });
};

TurboEventManager.prototype.internalBroadcast = function internalBroadcast(filter, event, data) {
    var sockets = this.sockets;
    var filterFn = (filter) ? require('../socket.js')[filter] : null;

    if (filterFn) {
        sockets = sockets.filter(filterFn);
    }

    sockets.forEach(function (s) {
        s.emit(event, data);
    });
};

TurboEventManager.prototype.internalInquire = function internalInquire(filter, event, data, cb) {
    var sockets = this.sockets;
    var filterFn = (filter) ? require('../socket.js')[filter] : null;

    if (filterFn) {
        sockets = sockets.filter(filterFn);
    }

    sockets.forEach(function (s) {
        s.emit(event, data, cb);
    });
};

TurboEventManager.prototype.connectionStats = function connectionStats() {
    var connections = {
        'turbosocket': 0,
        'socketio': 0
    };
    this.sockets.forEach(function (s) {
        if (s.mode === 'turbo') {
            connections.turbosocket++;
        } else if (s.mode === 'socket.io') {
            connections.socketio++;
        }
    });

    return connections;
};

TurboEventSocket.prototype.on = function on(event, cb) {
    if (this.mode === 'socket.io') {
        this.socket.on(event, cb);
    } else if (this.mode === 'turbo') {
        if (event === 'disconnect') {
            this.socket.on('disconnect', cb);
            return;
        }

        var observers = this.observers[event];
        if (!observers) {
            observers = [];
            this.observers[event] = observers;
        }

        observers.push(cb);
    }
};

TurboEventSocket.prototype.emit = function emit(event, data, cb) {
    function prepareMessage(err, theUUID) {
        var theEvent = {
            name: event,
            data: data
        };
        if (cb) {
            if (err) {
                logger.error('#TurboEvents Error obtaining UUID', err);
                return;
            }

            self.callbacks[theUUID] = cb;
            theEvent.callback = theUUID;
        }

        var eventData = null;
        try {
            eventData = JSON.stringify(theEvent);
        } catch (e) {
            logger.warn('#TurboEvents Could not serialize a message, skipping.');
            return;
        }

        self.socket.sendDatagram(new Buffer(eventData, 'utf8'), 0);
    }

    if (this.mode === 'socket.io') {
        this.socket.emit(event, data, cb);
    } else if (this.mode === 'turbo') {
        var self = this;

        if (cb) {
            makeUUID(prepareMessage);
        } else {
            prepareMessage();
        }
    }
};

TurboEventSocket.prototype.internalEmit = function internalEmit(eventName) {
    var observers = this.observers[eventName];

    if (observers) {
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < observers.length; i++) {
            observers[i].apply(this, args);
        }
    }
};

TurboEventSocket.prototype.handleEvent = function handleEvent(eventName, data, callbackUUID) {
    var observers = this.observers[eventName];
    var self = this;

    function sendResponse(responseData) {
        self.sendResponse(callbackUUID, responseData);
    }

    if (observers) {
        for (var i = 0; i < observers.length; i++) {
            if (!callbackUUID) {
                observers[i](data);
            } else {
                observers[i](data, sendResponse);
            }
        }
    }
};

TurboEventSocket.prototype.handleCallback = function handleCallback(callbackUUID, data) {
    if (callbackUUID in this.callbacks) {
        this.callbacks[callbackUUID](data);
    }

    delete this.callbacks[callbackUUID];
};

TurboEventSocket.prototype.handleDatagram = function handleDatagram(datagram, tag) {
    var data = null;
    try {
        data = JSON.parse(datagram.toString('utf8'));
    } catch (e) {
        logger.error('#TurboEvents Could not deserialize a message, skipping.');
        return;
    }

    if (tag === 0) {
        this.handleEvent(data.name, data.data, data.callback);
    } else if (tag === 1) {
        this.handleCallback(data.callback, data.data);
    }
};

TurboEventSocket.prototype.sendResponse = function sendResponse(callbackUUID, theData) {
    var theResponse = {
        callback: callbackUUID
    };

    if (theData) {
        theResponse.data = theData;
    }

    var responseData = null;

    try {
        responseData = JSON.stringify(theResponse);
    } catch (e) {
        logger.warn('#TurboEvents Could not serialize a response, skipping.');
        return;
    }

    this.socket.sendDatagram(new Buffer(responseData, 'utf8'), 1);
};

TurboEventSocket.prototype.handleAuthentication = function handleAuthentication(username, password, callback) {
    this.internalEmit('authenticate', username, password, function (err) {
        callback(err);
    });
};

TurboEventSocket.prototype.handlePrivilegeChange = function handlePrivilegeChange(username) {
    this.username = username;
    this.internalEmit('privilegesUpgraded', username);
};

/* Module exports */
module.exports = new TurboEventManager();
