'use strict';

/*
    xcsbridge
    A module for interacting with the xcsbridge command-line tool.
*/

var cp = require('child_process'),
    os = require('os'),
    fs = require('fs'),
    uuid = require('node-uuid'),
    konsole = require('./konsole.js'),
    k = require('../constants.js'),
    xcsutil = require('./xcsutil.js');

// Constants
var XCSBRIDGE_PATH = '/Library/Developer/XcodeServer/CurrentXcodeSymlink/Contents/Developer/usr/bin/xcsbridge';

// Utility functions
/*!
 * Launches an instance of xcsbridge with the specified arguments and environment, and
 * collects its output.
 * @param args The arguments to pass through to xcsbridge.
 * @param environment A dictionary of environmental variables to expose to xcsbridge.
 * @param callback An optional callback to be fired when xcsbridge exits. This function should take
 * three parameters: the exit status code of xcsbridge as an integer; a Buffer representing the
 * STDOUT of xcsbridge; and an array of error or warning messages (as strings) collected from STDERR.
 */
function launchTool(args, environment, stdinData, callback) {
    // copy the environment, and merge in our new variables
    var env = JSON.parse(JSON.stringify(process.env));
    for (var prop in environment) {
        if (environment.hasOwnProperty(prop)) {
            env[prop] = environment[prop];
        }
    }

    // spawn the task
    var xcsbridge = cp.spawn(XCSBRIDGE_PATH, args, {
        env: env,
        stdio: 'pipe'
    });

    // pipe in stdin, if necessary
    if (stdinData) {
        xcsbridge.stdin.write(stdinData);
        xcsbridge.stdin.end();
    }

    // capture the output
    var stderrStr = '';
    var stdoutBufs = [];
    var stdoutBufLen = 0;

    xcsbridge.stderr.setEncoding('utf8');
    xcsbridge.stderr.on('data', function (str) {
        stderrStr += str;
    });

    xcsbridge.stdout.on('data', function (buf) {
        stdoutBufs.push(buf);
        stdoutBufLen += buf.length;
    });

    if (callback) {
        xcsbridge.on('close', function (status) {
            var messages = (stderrStr.length > 0) ? stderrStr.replace(/^xcsbridge: |\n$/mg, '').split('\n') : [];
            callback(status, Buffer.concat(stdoutBufs, stdoutBufLen), messages);
        });
    }
}

// Serialization
exports.serialization = {
    /*!
     * Converts the given JavaScript object into an XML Property List, and returns the results via callback.
     * @param jsonData The object you want to serialize. This must be JSON-serializable.
     * @param callback The callback to be fired when the results are available, which will take two parameters: an error
     * parameter, and a Buffer representing the resulting Property List data.
     */
    createPropertyList: function (jsonObj, callback) {
        this.json2plist(JSON.stringify(jsonObj), callback);
    },
    
    /*!
     * Converts the given JSON string into an XML Property List, and returns the results via callback.
     * @param jsonData The object you want to serialize, as a JSON string.
     * @param callback The callback to be fired when the results are available, which will take two parameters: an error
     * parameter, and a Buffer representing the resulting Property List data.
     */
    json2plist: function (jsonData, callback) {
        launchTool(['serialization', 'json2plist', '--path', '-'], {}, jsonData, function (status, output, errors) {
            if (callback) {
                if (status === 0) {
                    callback(null, output);
                } else {
                    callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error', null);
                }
            }
        });
    }
};

// Profiles
exports.profiles = {
    /*!
     * Produces a configuration profile containing this server's current public-facing SSL certificate for the
     * purposes of OTA app installation.
     * @param certificatePath The path to the certificate to embed in the configuration profile.
     * @param callback The callback to be fired once the profile has been generated, which will take two parameters:
     * an error parameter, and a Buffer representing the resulting Property List data.
     */
    generateCertificateAuthorityProfile: function(certificatePath, callback) {
        launchTool(['profiles', 'generate-ca-profile', '--path', certificatePath], {}, null, function (status, output, errors) {
            if (callback) {
                if (status === 0) {
                    callback(null, output);
                } else {
                    callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error', null);
                }
            }
        });
    }
};

// Source Control framework
exports.sourceControl = {
    /*!
     * Validates the authentication information in the provided blueprint, and returns the results.
     * @param blueprint The blueprint, as a JavaScript object.
     * @param callback The optional callback to be fired after validation, which will take two parameters: an error parameter,
     * and a JavaScript object representing the error summary from xcsbridge.
     */
    preflight: function (blueprint, callback) {

        var functionTitle = '[xcsbridge] preflight';
        konsole.log(null, functionTitle);

        if (k.XCSProfilerActive) {

            var snitch;

            try {
                var Snitch = require('speedsnitch');
                snitch = new Snitch();
            } catch (e) {
                snitch = null;
            }

            if (snitch) {
                snitch.next('[xcsbridge] preflight');
            }
        }

        // get the JSON version of the blueprint
        var blueprintStr = JSON.stringify(blueprint);

        // launch xcsbridge
        launchTool(['source-control', 'blueprint-preflight', '--path', '-', '--format', 'json'], {}, blueprintStr, function (status, output, errors) {
            
            if (callback) {
                if (status === 0) {
                    var resultObj = JSON.parse(output.toString('utf8'));
                    callback(null, resultObj);
                } else {
                    callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error', null);
                }
            }
        });
    },

    checkForUpdates: function (blueprint, callback) {

        if (k.XCSProfilerActive) {

            var snitch;

            try {
                var Snitch = require('speedsnitch');
                snitch = new Snitch();
            } catch (e) {
                snitch = null;
            }

            if (snitch) {
                snitch.next('[xcsbridge] checkForUpdates');
            }
        }

        var blueprintStr = JSON.stringify(blueprint);

        launchTool(['source-control', 'blueprint-update-check', '--path', '-'], {}, blueprintStr, function (status, output, errors) {
            if (callback) {
                if (status === 0) {
                    var resultObj = JSON.parse(output.toString('utf8'));
                    callback(null, resultObj);
                } else {
                    callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error', null);
                }
            }
        });
    },

    merge: function (existing, merge, callback) {

        if (k.XCSProfilerActive) {

            var snitch;

            try {
                var Snitch = require('speedsnitch');
                snitch = new Snitch();
            } catch (e) {
                snitch = null;
            }

            if (snitch) {
                snitch.next('[xcsbridge] merge');
            }
        }

        var existingStr = JSON.stringify(existing),
            mergeStr = JSON.stringify(merge);

        xcsutil.writeTemporaryFile(existingStr, function (err, filename, cb) {
            if (err) {
                return cb(function() {
                    callback(err, null);
                });
            }

            launchTool(['source-control', 'blueprint-merge', '--path', filename, '--merge-path', '-', '--with-auth', '--with-revisions'], {}, mergeStr, function (status, output, errors) {
                cb(function () {
                    if (callback) {
                        if (status === 0) {
                            callback(null, JSON.parse(output.toString('utf8')));
                        } else {
                            callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error', null);
                        }
                    }
                });
            });
        });
    },

    /*!
     * Strips the provided blueprint of its authentication information, and returns a new version.
     * @param blueprint The blueprint, as a JavaScript object.
     * @param callback The optional callback to be fired after validation, which will take two parameters: an error parameter,
     * and a JavaScript object representing the new version of the blueprint.
     */
    removeCredentialsFromBlueprint: function (blueprint, callback) {

        if (k.XCSProfilerActive) {

            var snitch;

            try {
                var Snitch = require('speedsnitch');
                snitch = new Snitch();
            } catch (e) {
                snitch = null;
            }

            if (snitch) {
                snitch.next('[xcsbridge] removeCredentialsFromBlueprint');
            }
        }

        // get the JSON version of the blueprint
        var blueprintStr = JSON.stringify(blueprint);

        // launch xcsbridge
        launchTool(['source-control', 'blueprint-transform', '--path', '-', '--format', 'json', '--with-anonymous-urls'], {}, blueprintStr, function (status, output, errors) {
            if (callback) {
                if (status === 0) {
                    var resultObj = JSON.parse(output.toString('utf8'));
                    callback(null, resultObj);
                } else {
                    callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error', null);
                }
            }
        });
    }
};