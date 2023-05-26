'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

// Create a new 'xcs' database
var async = require('async'),
    spawn = require('child_process').spawn;

console.log('');

async.series([

  function (cb) {
            console.log('***** xcscontrol --reset...');

            var curl = spawn('/usr/bin/xcrun', [
                'xcscontrol',
                '--reset'
            ]);

            curl.on('close', function (err) {
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    console.log('    Success.');
                }
                cb();
            });
  },
  function (cb) {
            console.log('***** xcscontrol --initialize...');

            var curl = spawn('/usr/bin/xcrun', [
                'xcscontrol',
                '--initialize'
            ]);

            curl.on('close', function (err) {
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    console.log('    Success.');
                }
                cb(err);
            });
  },
  function (cb) {
            console.log('***** xcscontrol --delete-debug-users...');

            var curl = spawn('/usr/bin/xcrun', [
                'xcscontrol',
                '--delete-debug-users'
            ]);

            curl.on('close', function (err) {
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    console.log('    Success.');
                }
                cb(err);
            });
  },
  function (cb) {
            console.log('***** xcscontrol --create-debug-users...');

            var curl = spawn('/usr/bin/xcrun', [
                'xcscontrol',
                '--create-debug-users'
            ]);

            curl.on('close', function (err) {
                if (err) {
                    console.log('Error: ' + err);
                } else {
                    console.log('    Success.');
                }
                cb(err);
            });
  }
 ],

    function (err) {
        console.log('');
        if (err) {
            console.log('Bootstrapping XCSNode/CouchDB failed.');
        } else {
            console.log('Bootstrapping XCSNode/CouchDB succeeded.');
        }
        console.log('');
    });