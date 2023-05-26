'use strict';

var xcsutil = require('../../util/xcsutil.js'),
    logger = require('../../util/logger.js');

var canService = function (worker, func, queue, job, args, options) {
    var self = this;
    self.name = 'canService';
    self.worker = worker;
    self.queue = queue;
    self.func = func;
    self.job = job;
    self.args = args;
    self.options = options;

    if (options) {
        self.eventType = options.type || 'enqueue'; // can be either enqueue or perform
    }
};

canService.prototype.before_enqueue = function(cb) {
    var self = this;

    if (self.eventType === 'enqueue') {
        xcsutil.checkIfRequestCanBeServiced((err, isInitPhaseOn, isInitPhaseOnManual, serviceIsEnabled) => {
            if (err) {
                logger.warn('Not enqueuing job', self.job.class, 'due to error:', err);
                cb(err, false);
            } else if (isInitPhaseOn || isInitPhaseOnManual) {
                logger.warn('Not enqueuing job', self.job.class, 'because xcsd is still in init phase.');
                cb(null, false);
            } else if (!serviceIsEnabled) {
                logger.warn('Not enqueuing job', self.job.class, 'because xcsd is disabled.');
                cb(null, false);
            } else {
                cb(null, true);
            }
        });
    } else {
        cb(null, true);
    }
};

canService.prototype.before_perform = function(cb) {
    var self = this;

    if (self.eventType === 'perform') {
        xcsutil.checkIfRequestCanBeServiced((err, isInitPhaseOn, isInitPhaseOnManual, serviceIsEnabled) => {
            if (err) {
                logger.warn('Not enqueuing job', self.job.class, 'due to error:', err);
                cb(err, false);
            } else if (isInitPhaseOn || isInitPhaseOnManual) {
                logger.warn('Not enqueuing job', self.job.class, 'because xcsd is still in init phase.');
                cb(null, false);
            } else if (!serviceIsEnabled) {
                logger.warn('Not enqueuing job', self.job.class, 'because xcsd is disabled.');
                cb(null, false);
            } else {
                cb(null, true);
            }
        });
    } else {
        cb(null, true);
    }
};

module.exports = canService;
