'use strict';

const cluster = require('cluster');

class Process {
    constructor(worker) {
        this.id = worker.id;
        this.pid = worker.process.pid;
        this.process = worker;
    }

    kill(signal) {
        this.process.kill(signal);
    }

    on(event, fn) {
        this.process.on(event, fn);
    }

    send(message) {
        this.process.send(message);
    }
}

module.exports = {
    get workerIDs() {
        return Object.keys(cluster.workers);
    },

    get workers() {
        let workerMap = new Map();
        this.workerIDs.forEach(id => {
            workerMap.set(id, new Process(cluster.workers[id]));
        });
        return workerMap;
    },

    get numberOfWorkers() {
        return this.workerIDs.length;
    },

    fork(env) {
        let worker = cluster.fork(env);
        return new Process(worker);
    },

    on(event, fn) {
        if (event === 'exit') {
            cluster.on(event, (oldWorker, code, signal) => {
                fn(new Process(oldWorker), code, signal);
            });
        } else {
            cluster.on(event, fn);
        }
    },

    get isMaster() {
        return cluster.isMaster;
    },

    get isDisabled() {
        return cluster.isDisabled;
    },

    get isWorker() {
        return cluster.isWorker;
    }
};
