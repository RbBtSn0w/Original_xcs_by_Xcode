'use strict';

let Promise = require('bluebird');

const k = require('../constants.js');
const redis = require('./redisClass.js');
const logger = require('../util/logger.js');
const xcsutil = Promise.promisifyAll(require('../util/xcsutil.js'));
const delegation = Promise.promisifyAll(require('../util/delegation.js'));

let workerKillTimers = new Map();

let workers = module.exports = {
    /**
     * Sets up the master process for handling worker processes.
     *
     * Should start the appropriate number of worker processes before resolving.
     *
     * @returns {Promise} a promise that resolves once the worker processes have been started.
     */
    initializeMaster() {
        if (!this.workerProvider.isMaster || this.workerProvider.isDisabled) {
            return Promise.reject(new Error('Initializing worker processes should only happen from the master process.'));
        }

        // used to queue up and prevent overlap in starting new workers in response to exiting ones.
        this.lastWorkersStarted = Promise.resolve();

        return deleteOldClusterData()
            .then(() => {
                this.workerProvider.on('exit', handleWorkerExit);
                this.workerProvider.on('message', handleWorkerMessage);
                return this.startMissingWorkers();
            });
    },

    /**
     * Ensures that enough workers are currently running, starting any that are
     * needed.
     *
     * Checks whether the service is disabled, which determines how many processes
     * should be running, as well as whether they should be started in a disabled
     * mode that limits their functionality.
     *
     * @returns {Promise} a promise that resolves once any necessary processes
     * have been forked.
     */
    startMissingWorkers() {
        this.lastWorkersStarted = this.lastWorkersStarted
            .then(expectedWorkerConfiguration)
            .then(config => {
                let numWorkers = config.num_processes;

                let currentWorkers = this.workerProvider.numberOfWorkers;
                let missingWorkers = numWorkers - currentWorkers;
                logger.debug('There are', missingWorkers, 'missing workers (' + numWorkers, '-', currentWorkers + ')');

                if (missingWorkers > 0) {
                    logger.info('Starting', missingWorkers, 'new workers');
                    return Promise.each(new Array(missingWorkers).fill(null), startWorker);
                }

                if (missingWorkers < 0) {
                    logger.warn('There are', currentWorkers, 'but there should only be', numWorkers, 'at most.');
                }
                return null;
            });

        return this.lastWorkersStarted;
    },

    /**
     * Kills all existing workers.
     *
     * This is the correct way to restart the existing workers in a different
     * configuration. When a worker exits, it triggers us to start any new
     * workers that are needed based on the current configuration of the server.
     *
     * After killing all workers, there is no need to call
     * startMissingWorkers(). It will happen automatically as the workers
     * actually exit.
     */
    killAllWorkers() {
        logger.debug('Terminating all existing workers.');
        for (let worker of this.workerProvider.workers.values()) {
            logger.debug('Sending SIGTERM to worker', worker.id, 'with PID', worker.pid);

            // a shutdown command allows us to close any open TurboSocket
            // connections. since those connections are persistent, we have to
            // force them to close, or they'll stop the worker from exiting.
            worker.send({ command: 'Shutdown' });

            setWorkerKillTimeout(worker);
            worker.kill('SIGTERM');
        }
    },

    /**
     * The provider module that handles determining which workers are running,
     * and handles the actual forking and killing of processes.
     *
     * By default, this uses Node's cluster module, but a mock implementation is
     * available for use in tests.
     */
    workerProvider: require('./worker/clusterProvider.js'),

    get environment() {
        return {};
    }
};

let cachedNumberOfProcesses = null;

function deleteOldClusterData() {
    cachedNumberOfProcesses = null;
    return redis.deleteWithPattern(null, 'cluster:*')
        .catch(() => null); // ignore errors
}

function handleWorkerExit(worker, code, signal) {
    logger.info('Worker process', worker.id, 'is exiting');
    logger.debug('Worker', worker.id, 'exiting with code', code, 'and signal', signal);

    clearTimeout(workerKillTimers.get(worker.id));

    Promise.join(
        redis.client().del(`cluster:${worker.id}`).reflect(),
        delegation.cleanupWorkerWithIDAsync(worker.id).reflect(),
        () => {
            logger.debug('Removed Redis references to worker', worker.id);
            workers.startMissingWorkers();
        }
    );
}

function handleWorkerMessage(msg) {
    if (msg.command === 'ManageWorkers') {
        workers.killAllWorkers();
    }
}

function setWorkerKillTimeout(worker) {
    workerKillTimers.set(worker.id, setTimeout(killStalledWorker, 60000, worker));
}

function killStalledWorker(worker) {
    logger.debug('Killing stalled worker', worker.id);
    worker.kill('SIGKILL');
}

function expectedWorkerConfiguration() {
    if (cachedNumberOfProcesses) {
        return Promise.resolve({num_processes: cachedNumberOfProcesses});
    }

    return redis.client().get(k.XCSRedisSpecifiedNumOfCPUs)
        .then(reply => parseInt(reply, 10))
        .tap(num => cachedNumberOfProcesses = num)
        .then(num_processes => ({
            num_processes
        }));
}

function startWorker() {
    logger.debug('Starting new worker');
    let worker = workers.workerProvider.fork();
    logger.debug('Forked new worker', worker.id, 'with PID', worker.pid);
    return redis.client().set(`cluster:${worker.id}`, worker.pid);
}
