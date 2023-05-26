'use strict';

/*
    scheduler
    A module for scheduling periodic tasks with minute resolution.
*/

var logger = require('./logger.js');

/* Task object */
function Task(year, month, day, weekday, hour, minute, scheduler, callback) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.weekday = weekday;
    this.hour = hour;
    this.minute = minute;

    this.scheduler = scheduler;
    this.callback = callback;
}

Task.prototype.cancel = function scheduler_init() {
    this.scheduler.cancelTask(this);
};

Task.prototype.matches = function matches(year, month, day, weekday, hour, minute) {
    if (typeof (this.year) !== 'undefined' && this.year !== null &&
        typeof (year) !== 'undefined' && year !== null) {
        if (this.year !== year) {
            return false;
        }
    }

    if (typeof (this.month) !== 'undefined' && this.month !== null &&
        typeof (month) !== 'undefined' && month !== null) {
        if (this.month !== month) {
            return false;
        }
    }

    if (typeof (this.day) !== 'undefined' && this.day !== null &&
        typeof (day) !== 'undefined' && day !== null) {
        if (this.day !== day) {
            return false;
        }
    }

    if (typeof (this.weekday) !== 'undefined' && this.weekday !== null &&
        typeof (weekday) !== 'undefined' && weekday !== null) {
        if (this.weekday !== weekday) {
            return false;
        }
    }

    if (typeof (this.hour) !== 'undefined' && this.hour !== null &&
        typeof (hour) !== 'undefined' && hour !== null) {
        if (this.hour !== hour) {
            return false;
        }
    }

    if (typeof (this.minute) !== 'undefined' && this.minute !== null &&
        typeof (minute) !== 'undefined' && minute !== null) {
        if (this.minute !== minute) {
            return false;
        }
    }

    return true;
};

Task.prototype.matchesDate = function matchesDate(date) {
    return this.matches(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getDay(), date.getHours(), date.getMinutes());
};

Task.prototype.matchesNow = function matchesNow() {
    return this.matchesDate(new Date());
};

Task.prototype.run = function run() {
    this.callback();
};

Task.prototype.runIfMatches = function runIfMatches(year, month, day, weekday, hour, minute) {
    if (this.matches(year, month, day, weekday, hour, minute)) {
        this.run();
    }
};

Task.prototype.runIfMatchesDate = function runIfMatchesDate(date) {
    if (this.matchesDate(date)) {
        this.run();
    }
};

Task.prototype.runIfMatchesNow = function runIfMatchesNow() {
    if (this.matchesNow()) {
        this.run();
    }
};

/* Scheduler object */
function Scheduler() {
    this.tasks = [];
    this.reschedule();
}

/* Task execution */
Scheduler.prototype.reschedule = function reschedule(existingDate) {
    // determine the lead time until the next minute
    var now = existingDate || new Date();
    var msIntoMinute = (now.getSeconds() * 1000) + now.getMilliseconds();
    this.lastFiredMinute = now.getMinutes();
    this.schedulerTimeout = setTimeout(this.executePendingTasks.bind(this), (60000 - msIntoMinute) + 100); // fire 100ms into the next minute
};

Scheduler.prototype.executePendingTasks = function executePendingTasks() {
    // clear the timeout
    if (this.schedulerTimeout) {
        clearTimeout(this.schedulerTimeout);
        this.schedulerTimeout = null;
    }

    // determine what minute we're firing for
    var now = new Date();
    var currentMinute = now.getMinutes();
    var expectedMinute = ((this.lastFiredMinute + 1) % 60);

    // this lets us at least detect if we're skipping minutes
    if (expectedMinute !== currentMinute) {
        // TODO: if we can get a quality date math library, we can recover from this situation
        // recovery is not difficult, but it does require us to accurately be able to walk over every minute between
        // this.lastFiredMinute and currentMinute, which does require date math (think about midnight boundaries)
        logger.warn('Scheduler expected to fire tasks for', expectedMinute, 'but current minute is actually', currentMinute);
    }

    // run any due tasks
    this.tasks.forEach(function (task) {
        task.runIfMatchesDate(now); // explicitly pass the same date for all tasks
    });

    // reschedule
    this.reschedule(now);
};

/* Schedule management */
Scheduler.prototype.schedule = function schedule(year, month, day, weekday, hour, minute, task, immediately) {
    var t = new Task(year, month, day, weekday, hour, minute, this, task);
    return this.scheduleTask(t, immediately);
};

Scheduler.prototype.scheduleTask = function scheduleTask(task, immediately) {
    this.tasks.push(task);
    if (immediately) {
        task.run();
    }
    return task;
};

Scheduler.prototype.cancelTask = function cancelTask(task) {
    var idx = this.tasks.indexOf(task);
    if (idx > -1) {
        this.tasks.splice(idx, 1);
    }
};

Scheduler.prototype.cancelTasksMatchingFilter = function cancelTasksMatchingFilter(filter) {
    this.tasks.filter(filter).forEach(function (task) {
        task.cancel();
    });
};

/* Scheduling convenience methods */
Scheduler.prototype.scheduleHourly = function scheduleHourly(task, immediately) {
    return this.scheduleHourlyAtTime(null, task, immediately);
};

Scheduler.prototype.scheduleHourlyAtTime = function scheduleHourlyAtTime(minute, task, immediately) {
    var now = new Date();

    if (typeof (minute) === 'undefined' || minute === null) {
        minute = now.getMinutes();
    }

    return this.schedule(null, null, null, null, null, minute, task, immediately);
};

Scheduler.prototype.scheduleDaily = function scheduleDaily(task, immediately) {
    return this.scheduleDailyAtTime(null, null, task, immediately);
};

Scheduler.prototype.scheduleDailyAtTime = function scheduleDailyAtTime(hour, minute, task, immediately) {
    var now = new Date();

    if (typeof (hour) === 'undefined' || hour === null) {
        hour = now.getHours();
    }

    if (typeof (minute) === 'undefined' || minute === null) {
        minute = now.getMinutes();
    }

    return this.schedule(null, null, null, null, hour, minute, task, immediately);
};

Scheduler.prototype.scheduleWeekly = function scheduleWeekly(task, immediately) {
    return this.scheduleWeeklyAtTime(null, null, null, task, immediately);
};

Scheduler.prototype.scheduleWeeklyAtTime = function scheduleWeeklyAtTime(weekday, hour, minute, task, immediately) {
    var now = new Date();

    if (typeof (weekday) === 'undefined' || weekday === null) {
        weekday = now.getDay();
    }

    if (typeof (hour) === 'undefined' || hour === null) {
        hour = now.getHours();
    }

    if (typeof (minute) === 'undefined' || minute === null) {
        minute = now.getMinutes();
    }

    return this.schedule(null, null, null, weekday, hour, minute, task, immediately);
};

/* Module exports */
module.exports = new Scheduler();
