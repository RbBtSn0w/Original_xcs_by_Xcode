'use strict';

const EventEmitter = require('events');

let workers = new Map();
let cluster;

class Process extends EventEmitter {
    constructor(id, env) {
        super();
        this.id = id;
        this.pid = id;
        this.env = env;
    }

    kill(signal) {
        this.killed = true;
        this.signal = signal;

        workers.delete(this.id);
        this.emit('exit', null, signal);
        cluster.emit('exit', this, null, signal);
    }

    send() {
        // noop until we try to test this
    }

    sendToMaster(message) {
        this.emit('message', message);
        cluster.emit('message', message);
    }
}

let nextWorkerID = 1;

class Cluster extends EventEmitter {
    get workerIDs() {
        return Array.from(workers.keys());
    }

    get numberOfWorkers() {
        return workers.size;
    }

    get workers() {
        return workers;
    }

    get allWorkers() {
        return Array.from(workers.values());
    }

    fork(env) {
        let worker = new Process(nextWorkerID++, env || {});
        workers.set(worker.id, worker);
        this.emit('fork', worker);
        return worker;
    }

    get isMaster() { return true; }
    get isWorker() { return false; }

    reset() {
        this.removeAllListeners();
        for (let worker of workers.values()) {
            worker.removeAllListeners();
        }
        workers = new Map();
    }
}

cluster = module.exports = new Cluster();
cluster.isDisabled = false;
