'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var cluster = require('cluster'),
    fs = require('fs');

var k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

function reload() {
    fs.closeSync(1);
    fs.openSync(k.XCSKonsoleXCSDLogFilePath, 'a+');
    fs.closeSync(2);
    fs.openSync(k.XCSKonsoleXCSDLogFilePath, 'a+');
}

module.exports = function app_log_rolling_init(cb) {

    if (cluster.isMaster && !cluster.isDisabled) {

        konsole.log(null, '[XCSNode - Log Rolling] setting up SIGHUP handling.');

        process.on('SIGHUP', function ALRMasterSIGHUPEvent() {
            konsole.log(null, '[XCSNode - Log Rolling] SIGHUP received on master.');

            reload();

            konsole.log(null, '[XCSNode - Log Rolling] number of workers to be told about the SIGHUP: ' + Object.keys(cluster.workers).length);

            for (var id in cluster.workers) {
                if (cluster.workers.hasOwnProperty(id)) {
                    konsole.log(null, '[XCSNode - Log Rolling] notifying SIGHUP to worker: ' + id);
                    cluster.workers[id].process.kill('SIGHUP');
                }
            }
        });
    } else {
        process.on('SIGHUP', function ALRClusterSIGHUPEvent() {
            if (cluster.isDisabled) {
                konsole.log(null, '[XCSNode - Log Rolling] SIGHUP received.');
            } else {
                konsole.log(null, '[XCSNode - Log Rolling] SIGHUP received on worker: ' + cluster.worker.id);
            }
            reload();
        });
    }

    return xcsutil.safeCallback(cb);
};