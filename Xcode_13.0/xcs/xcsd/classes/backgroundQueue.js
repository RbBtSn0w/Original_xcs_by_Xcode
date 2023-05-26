'use strict';

var NR = require('node-resque');

var redis = require('./redisClass.js'),
    jobs = require('../worker/jobs.js'),
    logger = require('../util/logger.js');

var queue = new NR.queue({connection: {redis: redis.client()}}, jobs);

queue.on('error', err => {
    logger.error('Error using background worker queue:', err);
});

module.exports = queue;
