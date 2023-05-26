'use strict';

// Create a new 'xcs' database
var async = require('async'),
    spawn = require('child_process').spawn;

var xcsutil = require('./util/xcsutil.js');

console.log('');

async.series([

  function BSReset(cb) {
            console.log('***** xcscontrol --reset');

            var curl;

            try {
                curl = spawn('/usr/bin/xcrun', [
                'xcscontrol',
                '--reset'
            ]);

                curl.on('close', function BSResetCloseEvent(err) {
                    if (err) {
                        console.error('Error: ' + JSON.stringify(err));
                    } else {
                        console.log('    Success.');
                    }
                    return xcsutil.safeCallback(cb);
                });

            } catch (e) {
                return xcsutil.safeCallback(cb, {
                    status: 500,
                    message: 'Internal Server Error (xcsd): ' + JSON.stringify(e.toString())
                });
            }
  },
  function BSInitialize(cb) {
            console.log('***** xcscontrol --initialize');

            var curl;

            try {
                curl = spawn('/usr/bin/xcrun', [
                'xcscontrol',
                '--initialize'
            ]);

                curl.on('close', function BSInitializeCloseEvent(err) {
                    if (err) {
                        console.error('Error: ' + JSON.stringify(err));
                    } else {
                        console.log('    Success.');
                    }
                    return xcsutil.safeCallback(cb, err);
                });
            } catch (e) {
                return xcsutil.safeCallback(cb, {
                    status: 500,
                    message: 'Internal Server Error (xcsd): ' + JSON.stringify(e.toString())
                });
            }
  },
  function BSDeleteDebugUsers(cb) {
            console.log('***** xcscontrol --delete-debug-users');

            var curl;

            try {
                curl = spawn('/usr/bin/xcrun', [
                'xcscontrol',
                '--delete-debug-users'
            ]);

                curl.on('close', function BSDeleteDebugUsersCloseEvent(err) {
                    if (err) {
                        console.error('Error: ' + JSON.stringify(err));
                    } else {
                        console.log('    Success.');
                    }
                    return xcsutil.safeCallback(cb, err);
                });
            } catch (e) {
                return xcsutil.safeCallback(cb, {
                    status: 500,
                    message: 'Internal Server Error (xcsd): ' + JSON.stringify(e.toString())
                });
            }

  },
  function BSCreateDebugUsers(cb) {
            console.log('***** xcscontrol --create-debug-users');

            var curl;

            try {
                curl = spawn('/usr/bin/xcrun', [
                'xcscontrol',
                '--create-debug-users'
            ]);

                curl.on('close', function BSCreateDebugUsersCloseEvent(err) {
                    if (err) {
                        console.error('Error: ' + JSON.stringify(err));
                    } else {
                        console.log('    Success.');
                    }
                    return xcsutil.safeCallback(cb, err);
                });
            } catch (e) {
                return xcsutil.safeCallback(cb, {
                    status: 500,
                    message: 'Internal Server Error (xcsd): ' + JSON.stringify(e.toString())
                });
            }

  }
 ],

    function BSFinalizer(err) {
        console.log('');
        if (err) {
            console.error('Bootstrapping XCSNode/CouchDB failed.');
        } else {
            console.log('Bootstrapping XCSNode/CouchDB succeeded.');
        }
        console.log('');
    });