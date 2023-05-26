'use strict';

var fs = require('fs');

var logger = require('../../util/logger.js');

var cacheCoverageNeeded = function (worker, func, queue, job, args, options) {
    var self = this;
    self.name = 'cacheCoverageNeeded';
    self.worker = worker;
    self.queue = queue;
    self.func = func;
    self.job = job;
    self.args = args;
    self.options = options;

    if (args) {
        self.integrationID = args[0];
        self.coverageDataPath = args[1];
    }
};

cacheCoverageNeeded.prototype.before_enqueue = function (cb) {
    fs.stat(this.coverageDataPath, err => {
        if (err) {
            logger.debug('No coverage data for integration', this.integrationID, 'found, enqueuing job.');
            return cb(null, true); // if the file is not found, run the job
        } else {
            logger.debug('Coverage data for integration', this.integrationID, 'already exists on disk, not enqueuing job to cache.');
            return cb({
                status: 204,
                message: "Coverage data for this integration is already cached."
            }, false);
        }
    });
};

module.exports = cacheCoverageNeeded;
