'use strict';

var NR = require('node-resque');

var jobs = require('./worker/jobs.js'),
    redis = require('./classes/redisClass.js'),
    logger = require('./util/logger.js'),
    te = require('./util/turboevents.js');

var connectionDetails = {
    redis: redis.client()
};

// Allow distributing socket messages from the worker to the master, so it can
// tell its child workers to send the message on to any listeners.
//
// We do this over Redis PubSub.
te.broadcastHandler = function (filter, event, data) {
    logger.debug('Broadcasting a socket message for event', event);
    var message = JSON.stringify([filter, event, data]);
    redis.client().publish('socketMessages', message);
};

var scheduler = new NR.scheduler({connection: connectionDetails});
scheduler.connect(() => {
    logger.debug('Starting background job scheduler.');
    scheduler.start();

    var queue = require('./classes/backgroundQueue.js');
    queue.connect(() => {
        // schedule tasks that run on a regular schedule
        setTimeout(require('./worker/schedules.js'), 10000, scheduler, queue);
    });
});

var worker = new NR.worker({connection: connectionDetails, queues: ['scheduler', 'bg']}, jobs);

var jobTimeoutTimer;

function failCurrentJob() {
    worker.error = new Error('Job timed out.');
    worker.completeJob(null, false);
    
    jobTimeoutTimer = null;
}

function clearFailTimer() {
    if (jobTimeoutTimer) {
        clearTimeout(jobTimeoutTimer);
        jobTimeoutTimer = null;
    }
}

worker.on('start', () => {
    logger.info('Background worker started.');
});

worker.on('job', (queue, job) => {
    logger.info('Background worker got', job.class, 'job on', queue, 'queue.');
    logger.debug('Background job details:', job);
    
    // no job may take longer than 10 minutes
    jobTimeoutTimer = setTimeout(failCurrentJob, 1000 * 60 * 10).unref();
});

worker.on('success', (queue, job) => {
    logger.debug('Background worker', job.class, 'job succeeded.');
    clearFailTimer();
});

worker.on('failure', (queue, job, failure) => {
    logger.debug('Background worker', job.class, 'job failed:', failure);
    clearFailTimer();
});

worker.on('error', (queue, job, err) => {
    logger.error('Error occurred in background worker:', err);
});

worker.connect(() => {
    worker.workerCleanup();
    worker.start();
});

function shutdown() {
    scheduler.end(() => {
        worker.end(() => {
            logger.info('Background worker shutting down.');
            process.exit();
        });
    });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
