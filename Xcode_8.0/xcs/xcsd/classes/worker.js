'use strict';

let Promise = require('bluebird');

const k = require('../constants.js');
const redis = require('./redisClass.js');
const logger = require('../util/logger.js');
const xcsutil = Promise.promisifyAll(require('../util/xcsutil.js'), {multiArgs: true});
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
     * Checks whether the service is in the init phase or is disabled, which
     * determines how many processes should be running, as well as whether they
     * should be started in a disabled mode that limits their functionality.
     *
     * @returns {Promise} a promise that resolves once any necessary processes
     * have been forked.
     */
    startMissingWorkers() {
        return expectedWorkerConfiguration()
            .then(config => {
                let numWorkers = config.num_processes;

                let currentWorkers = this.workerProvider.numberOfWorkers;
                let missingWorkers = numWorkers - currentWorkers;
                logger.debug('There are', missingWorkers, 'missing workers (' + numWorkers, '-', currentWorkers + ')');

                if (missingWorkers > 0) {
                    let env = {};
                    if (!config.enabled) {
                        env.XCS_DISABLED = 'true';
                    }
                    if (config.init_phase) {
                        env.XCS_INIT_PHASE = 'true';
                    }

                    this.lastWorkerEnvironment = env;

                    logger.info('Starting', missingWorkers, 'new workers');
                    return Promise.each(new Array(missingWorkers).fill(env), startWorker);
                }

                if (missingWorkers < 0) {
                    logger.warn('There are', currentWorkers, 'but there should only be', numWorkers, 'at most.');
                }
                return null;
            });
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
        if (this.workerProvider.isMaster) {
            return this.lastWorkerEnvironment || {};
        } else {
            return process.env || {};
        }
    },

    /**
     * Checks if the current worker process is in the disabled mode.
     *
     * Disabled workers will not answer most requests. If the worker is in the
     * init phase, it is always considered disabled, whether or not the service
     * is actually disabled.
     */
    get isDisabled() {
        return this.isInitPhase || this.environment.XCS_DISABLED === 'true';
    },

    /**
     * Checks if the current worker process is in the init phase.
     */
    get isInitPhase() {
        return this.environment.XCS_INIT_PHASE === 'true';
    }
};

function deleteOldClusterData() {
    return redis.deleteWithPattern(null, 'cluster:*')
        .catch(() => null); // ignore errors
}

function handleWorkerExit(worker, code, signal) {
    logger.info('Worker process', worker.id, 'is exiting');
    logger.debug('Worker', worker.id, 'exiting with code', code, 'and signal', signal);

    clearTimeout(workerKillTimers.get(worker.id));

    Promise.join(
        redis.client().del(`cluster:${worker.id}`).reflect(),
        redis.client().del(`cluster-mem:${worker.id}`).reflect(),
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
    return xcsutil.checkIfRequestCanBeServicedAsync().spread((initPhase, initPhaseManual, serviceEnabled) => {
        if (initPhase || initPhaseManual || !serviceEnabled) {
            logger.debug('We are in maintenance mode, returning appropriate configuration');
            return { num_processes: 1, enabled: serviceEnabled, init_phase: initPhase || initPhaseManual };
        } else {
            logger.debug('We are in production mode, querying Redis for the correct number of worker processes');
            return redis.client().get(k.XCSRedisSpecifiedNumOfCPUs)
                .then(reply => parseInt(reply, 10))
                .then(num_processes => ({
                    num_processes,
                    enabled: true,
                    init_phase: false
                }));
        }
    });
}

function startWorker(env) {
    logger.debug('Starting new worker with environment:', env);
    let worker = workers.workerProvider.fork(env);
    logger.debug('Forked new worker', worker.id, 'with PID', worker.pid);
    return redis.client().set(`cluster:${worker.id}`, worker.pid);
}
