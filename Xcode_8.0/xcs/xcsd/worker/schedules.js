'use strict';

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    schedule = require('../util/scheduler.js');

module.exports = function (scheduler, queue) {
    logger.debug('Scheduling background jobs.');

    function enqueueRebuildPeriodicScheduleJob() {
        if (scheduler.master) {
            logger.debug('Enqueuing #Periodic schedule rebuild job.');
            queue.enqueue('scheduler', 'periodic');
        } else {
            logger.debug('Not enqueuing #Periodic schedule rebuild job because we are not the master scheduler.');
        }
    }

    function enqueuePollForCommitJob() {
        if (scheduler.master) {
            logger.debug('Enqueuing #PollForCommit job.');
            queue.enqueue('bg', 'scm');
        } else {
            logger.debug('Not enqueuing #PollForCommit job because we are not the master scheduler.');
        }
    }

    function enqueueExpandACLJob() {
        if (scheduler.master) {
            logger.debug('Enqueuing ACL expansion job.');
            queue.enqueue('bg', 'expandACL');
        } else {
            logger.debug('Not enqueuing ACL expansion job because we are not the master scheduler.');
        }
    }

    function enqueueEmailReportSchedulerJob() {
        if (scheduler.master) {
            logger.debug('Enqueuing #EmailReportPeriodic schedule rebuild job.');
            queue.enqueue('scheduler', 'emailReportPeriodic');
        } else {
            logger.debug('Not enqueuing #EmailReportPeriodic schedule rebuild job because we are not the master scheduler.');
        }
    }

    logger.debug('Setting up rebuilding #Periodic schedule now and 55 minutes after the hour.');
    schedule.scheduleHourlyAtTime(55, enqueueRebuildPeriodicScheduleJob, true);

    logger.debug('Setting up rebuilding #EmailReportScheduler schedule now and 55 minutes after the hour.');
    schedule.scheduleHourlyAtTime(55, enqueueEmailReportSchedulerJob, true);

    var i;

    logger.debug('Setting up #PollForCommit schedule every', k.XCSPollForCommitInterval, 'minutes.');
    for (i = 0; i < 60; i += k.XCSPollForCommitInterval) {
        schedule.scheduleHourlyAtTime(i, enqueuePollForCommitJob);
    }

    logger.debug('Setting up OD caching schedule every', k.XCSACLStandardRefreshTimeout, 'minutes.');
    for (i = 0; i < 60; i += k.XCSACLStandardRefreshTimeout) {
        schedule.scheduleHourlyAtTime(i, enqueueExpandACLJob);
    }
};