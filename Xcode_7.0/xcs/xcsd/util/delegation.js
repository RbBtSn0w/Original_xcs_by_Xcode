'use strict';

/*
    delegation
    A module for managing node delegation in a clustered environment.

    Using delegation in combination with Redis, you can register certain methods as being "delegated" to a
    particular worker ID. Start by configuring delegation with your store, by passing in a node_redis
    client instance:

        delegation.configureStore(redis.createClient());

    You should do this in both the master and worker processes.

    Next, in the worker processes, register function calls with identifying labels.

        delegation.register('schedulePeriodicBotRuns', function(req){
            bot.schedulePeriodicBotRuns(req);
        });
    
    Finally, in the method implementations, nest the implementation inside a call to "invoke":

        bot.schedulePeriodicBotRuns = function(req, cb){
            delegation.invoke('schedulePeriodicBotRuns', req, arguments, function(){
                // your implementation here...
            });
        };
    
    delegation will check to see if your worker node is the node designated to handle that type of method;
    if so, it will executed it immediately; if not, it will instead tell the master process to find the correct
    node, and execute it there.

    When a worker dies, you should call delegation.cleanup with the worker ID and a callback; once your callback
    is called, you can fork a new worker to take its place.

    -----------------------------------

    There is also a simpler mode of operation for methods that do not need to be triggered from multiple workers.
    You can use delegation.once to provide something like a dispatch_once mechanism:

        delegation.once('portalSync', function(){
            // your code here
        });
    
    Delegation will guarantee that only one worker will actually run that code. Calling delegation.cleanup will
    reset this value, so a new worker coming up will have the opportunity to do it.
*/

var k = require('../constants.js'),
    cluster = require('cluster');

var redisClass = require('../classes/redisClass.js'),
    konsole = require('./konsole.js'),
    xcsutil = require('./xcsutil.js');

function DelegationManager() {
    this.redis = null;
    this.registeredMethods = {};
    this.invoking = false;

    var self = this;
    if (cluster.isMaster) {
        cluster.on('fork', function (worker) {
            worker.on('message', function (msg) {
                if (msg.command) {
                    if (msg.command === 'DelegationInvoke') {
                        self._invokeInWorker(msg.label, null, msg.args);
                    }
                }
            });
        });
    } else {
        process.on('message', function (msg) {
            if (msg.command) {
                if (msg.command === 'DelegationInvoke') {
                    self._reallyInvoke(msg.label, msg.args);
                }
            }
        });
    }
}

DelegationManager.prototype.configureStore = function configureStore(redis) {
    this.redis = redis;
};

DelegationManager.prototype.register = function register(label, cb) {
    this.registeredMethods[label] = cb;
};

DelegationManager.prototype.invoke = function invoke(label, req, args, cb) {
    if (cluster.isDisabled) {
        return xcsutil.safeCallback(cb);
    }

    if (this.invoking) {
        // if I was called from _reallyInvoke, then just go with it, man!
        this.invoking = false;
        return xcsutil.safeCallback(cb);
    } else {
        args = Array.prototype.slice.call(args);

        // determine if I'm the worker designated to handle this function
        if (cluster.isMaster) {
            this._invokeInWorker(label, req, args);
        } else {
            // do a set-if-not-exists for this label
            this.redis.set(k.XCSDelegationOnce + label, cluster.worker.id, 'NX', function (err, reply) {
                if (err) {
                    konsole.warn(req, '[Delegation - Invoke] Could not compete for delegation for ' + label + ': ' + JSON.stringify(err));
                    return;
                }

                if (reply) {
                    // I won, so execute!
                    return xcsutil.safeCallback(cb);
                } else {
                    // I lost, so forward
                    process.send({
                        command: 'DelegationInvoke',
                        label: label,
                        args: args
                    });
                }
            });
        }
    }
};

DelegationManager.prototype._invokeInWorker = function _invokeInWorker(label, req, args) {
    this.redis.get(k.XCSDelegationOnce + label, function (err, workerID) {
        if (err) {
            konsole.log(req, '[Delegation - Invoke] Could not find a designated worker for ' + label);
            return;
        }

        var worker = cluster.workers[workerID];
        if (!worker) {
            konsole.log(req, '[Delegation - Invoke] Designated worker ' + workerID + ' for ' + label + ' does not exist');
            return;
        }

        worker.send({
            command: 'DelegationInvoke',
            label: label,
            args: args
        });
    });
};

DelegationManager.prototype._reallyInvoke = function _reallyInvoke(label, args) {
    this.invoking = true;

    var m = this.registeredMethods[label];
    if (m) {
        m.apply(this, args);
    } else {
        konsole.log(null, '[Delegation - _reallyInvoke] Could not find a registered method to invoke labeled ' + label);
    }
};

DelegationManager.prototype.cleanupWorkerWithID = function cleanup(workerID, cb) {
    var redis = this.redis;

    redis.keys(k.XCSDelegationOnce + '*', function (err, keys) {
        if (keys.length > 0) {
            redis.mget(keys, function (err, vals) {
                for (var i = 0; i < keys.length; i++) {
                    if (parseInt(vals[i], 10) === workerID) {
                        redisClass.deleteWithPattern(null, keys[i]);
                    }
                }

                return xcsutil.safeCallback(cb);
            });
        } else {
            return xcsutil.safeCallback(cb);
        }
    });
};

DelegationManager.prototype.cleanAll = function cleanAll(cb) {
    redisClass.deleteWithPattern(null, k.XCSDelegationOnce + '*', cb);
};

DelegationManager.prototype.once = function once(label, cb) {
    if (cluster.isDisabled) {
        return xcsutil.safeCallback(cb);
    }

    this.redis.set(k.XCSDelegationOnce + label, cluster.worker.id, 'NX', function (err, reply) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        }

        if (reply) {
            // I won, so execute!
            konsole.log(null, '[Delegation - once] ' + k.XCSDelegationOnce + label + ' assigned to worker ID: ' + cluster.worker.id + ' (pid ' + process.pid + ')');
            return xcsutil.safeCallback(cb);
        } else {
            // I lost, some other process has already done it; do nothing
            return xcsutil.safeCallback(cb, {
                status: 409,
                message: 'Conflict: another process has processed label: ' + label
            });
        }
    });
};

/* Module exports */
module.exports = new DelegationManager();