'use strict';

var spawn = require('child_process').spawn;

var xcsutil = require('./xcsutil.js');

var xcsDashboardUtils = {};

xcsDashboardUtils.percentageDriveUsed = function percentageDriveUsed(cb) {

    var ps = spawn('df', ['-P', '/']),
        grep = spawn('grep', ['/']),
        awk = spawn('awk', ['{ print $5}']),
        sed = spawn('sed', ['s/%//g']);

    function returnResponse(err, value, cb) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, value);
        }
    }

    /*****************************************************/

    ps.stdout.on('data', function (data) {
        grep.stdin.write(data);
    });

    ps.stderr.on('data', function (data) {
        returnResponse({
            status: 500,
            message: data
        }, null, cb);
    });

    ps.on('close', function (code) {
        if (code !== 0) {
            returnResponse({
                status: 500,
                message: 'ps process exited with code ' + code
            }, null, cb);
        }
        grep.stdin.end();
    });

    /*****************************************************/

    grep.stdout.on('data', function (data) {
        awk.stdin.write(data);
    });

    grep.stderr.on('data', function (data) {
        returnResponse({
            status: 500,
            message: data
        }, null, cb);
    });

    grep.on('close', function (code) {
        if (code !== 0) {
            returnResponse({
                status: 500,
                message: 'grep process exited with code ' + code
            }, null, cb);
        }
        awk.stdin.end();
    });

    /*****************************************************/

    awk.stdout.on('data', function (data) {
        sed.stdin.write(data);
    });

    awk.stderr.on('data', function (data) {
        returnResponse({
            status: 500,
            message: data
        }, null, cb);
    });

    awk.on('close', function (code) {
        if (code !== 0) {
            returnResponse({
                status: 500,
                message: 'awk process exited with code ' + code
            }, null, cb);
        }
        sed.stdin.end();
    });

    /*****************************************************/

    sed.stdout.on('data', function (data) {
        returnResponse(null, data.toString(), cb);
    });

    sed.stderr.on('data', function (data) {
        returnResponse({
            status: 500,
            message: data
        }, null, cb);
    });

    sed.on('close', function (code) {
        if (code !== 0) {
            returnResponse({
                status: 500,
                message: 'sed process exited with code ' + code
            }, null, cb);
        }
    });
};

xcsDashboardUtils.percentageCPUUsed = function percentageCPUUsed(cb) {

    var top = spawn('top', ['-l', '1']),
        awk = spawn('awk', ['/CPU usage:/ {print $3}']);

    function returnResponse(err, value, cb) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, value);
        }
    }

    /*****************************************************/

    top.stdout.on('data', function (data) {
        awk.stdin.write(data);
    });

    top.stderr.on('data', function (data) {
        returnResponse({
            status: 500,
            message: data
        }, null, cb);
    });

    top.on('close', function (code) {
        if (code !== 0) {
            returnResponse({
                status: 500,
                message: 'top process exited with code ' + code
            }, null, cb);
        }
        awk.stdin.end();
    });

    /*****************************************************/

    awk.stdout.on('data', function (data) {
        returnResponse(null, parseInt(data.toString(), 10), cb);
    });

    awk.stderr.on('data', function (data) {
        returnResponse({
            status: 500,
            message: data
        }, null, cb);
    });

    awk.on('close', function (code) {
        if (code !== 0) {
            returnResponse({
                status: 500,
                message: 'awk process exited with code ' + code
            }, null, cb);
        }
    });

};

module.exports = xcsDashboardUtils;