'use strict';

/*
    xcsbridge
    A module for interacting with the xcsbridge command-line tool.
*/

var cp = require('child_process'),
    async = require('async'),
    cluster = require('cluster'),
    k = require('../constants.js');

var konsole = require('./konsole.js'),
    xcsutil = require('./xcsutil.js');

// Constants
var XCSBRIDGE_PATH = '/Library/Developer/XcodeServer/CurrentXcodeSymlink/Contents/Developer/usr/bin/xcsbridge',
    XCSBRIDGE_TOTAL_CONCURRENCY_NUMBER = 24,
    XCSBRIDGE_DEFAULT_CONCURRENCY_NUMBER = 4;

// Global
var xcsBridgeQueue;

// Utility functions
/*!
 * Launches an instance of xcsbridge with the specified arguments and environment, and
 * collects its output.
 * @param args The arguments to pass through to xcsbridge.
 * @param environment A dictionary of environmental variables to expose to xcsbridge.
 * @param callback An optional callback to be fired when xcsbridge exits. This function should take
 * two parameters: an error object containing a status and message properties. The message is a string encoded
 * with the array of error or warning messages collected from STDERR. These error messages can be obtained via * split('\n');
 a Buffer representing the STDOUT of xcsbridge.
 */
function launchTool(args, environment, stdinData, callback) {

    if (!callback) {
        console.trace('*** Callback not specified!');
    }

    // Wrap the parameters in an object
    var newTask = {
        args: args,
        environment: environment,
        stdinData: stdinData
    };

    // Instantiate the async queue if needed
    if (!xcsBridgeQueue) {

        require('../classes/redisClass.js').client().get(k.XCSRedisSpecifiedNumOfCPUs, function (err, reply) {
            var concurrencyNumberPerNode = XCSBRIDGE_DEFAULT_CONCURRENCY_NUMBER;
            if (reply) {
                var numberOfNodes = parseInt(reply, 10);
                concurrencyNumberPerNode = Math.floor(XCSBRIDGE_TOTAL_CONCURRENCY_NUMBER / numberOfNodes);
                if (concurrencyNumberPerNode < 1) {
                    concurrencyNumberPerNode = XCSBRIDGE_DEFAULT_CONCURRENCY_NUMBER;
                }
            }

            setupXCSBridgeQueue(concurrencyNumberPerNode, function () {
                addTaskToBridgeQueue(newTask, callback);
            });

        });
    } else {
        addTaskToBridgeQueue(newTask, callback);
    }

}

function setupXCSBridgeQueue(concurrencyNumber, callback) {
    if (cluster.isMaster) {
        konsole.log(null, '[XCSBridge - launchTool] instantiating xcsBridgeQueue on master');
    } else {
        konsole.log(null, '[XCSBridge - launchTool] instantiating xcsBridgeQueue on worker: ' + cluster.worker.id);
    }

    xcsBridgeQueue = async.queue(function (task, cb) {

        var startTime = process.hrtime();

        // copy the environment, and merge in our new variables
        var env = JSON.parse(JSON.stringify(process.env));
        for (var prop in task.environment) {
            if (task.environment.hasOwnProperty(prop)) {
                env[prop] = task.environment[prop];
            }
        }

        // spawn the task
        var xcsbridge,
            pid;

        try {
            xcsbridge = cp.spawn(XCSBRIDGE_PATH, task.args, {
                env: env,
                stdio: 'pipe'
            });

            pid = xcsbridge.pid;

            konsole.log(null, '[XCSBridge - launchTool]     invoking: ' + JSON.stringify(task.args) + '(pid ' + pid + ')');

            // pipe in stdin, if necessary
            if (task.stdinData) {
                xcsbridge.stdin.write(task.stdinData);
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

            xcsbridge.on('close', function (status) {

                var diff = process.hrtime(startTime),
                    time = Math.floor((diff[0] * 1e9 + diff[1]) / 1000000),
                    error;

                /*
                    #define XCSReturnCodeSuccess                0
                    #define XCSReturnCodeIncorrectUsage         1
                    #define XCSReturnCodeUnknownError           2
                    #define XCSReturnCodeBadRequest             3
                    #define XCSReturnCodeUnauthorized           4
                    #define XCSReturnCodeInternalError          5
                    #define XCSReturnCodeServiceUnavailable     6
                */

                var httpStatus = xcsutil.launchToolStatusToXCSDStatus(status);

                if (0 === httpStatus) {
                    konsole.log(null, '[XCSBridge - launchTool]     success: ' + JSON.stringify(task.args) + ' (' + time + ' ms,  pid ' + pid + ')');
                    return xcsutil.safeCallback(cb, null, Buffer.concat(stdoutBufs, stdoutBufLen));
                } else {
                    var message = (stderrStr.length > 0) ? stderrStr.replace(/^xcsbridge: |\n$/mg, '') : '';
                    error = {
                        status: httpStatus,
                        message: '[XCSBridge - launchTool] Internal Server Error: ' + message
                    };
                    konsole.error(null, '[XCSBridge - launchTool]     error: ' + JSON.stringify(error) + ' (' + time + ' ms,  pid ' + pid + ')');
                    return xcsutil.safeCallback(cb, error);
                }
            });
        } catch (e) {
            var error = {
                status: 500,
                message: '[XCSBridge - launchTool] Internal Server Error: ' + e.toString()
            };
            konsole.error(null, '[XCSBridge - launchTool] exception: ' + JSON.stringify(error));
            return xcsutil.safeCallback(cb, error);
        }
    }, concurrencyNumber);

    konsole.log(null, '[XCSBridge - launchTool] setting queue concurrency to: ' + concurrencyNumber);

    return xcsutil.safeCallback(callback);
}

function addTaskToBridgeQueue(newTask, callback) {
    // Add the new task to the queue
    konsole.debug(null, '[XCSBridge - launchTool] adding task to queue: ' + JSON.stringify(newTask.args));
    xcsBridgeQueue.push(newTask, callback);

    konsole.debug(null, '[XCSBridge - launchTool] xcsSecurityQueue count: ' + xcsBridgeQueue.length());
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
        launchTool(['serialization', 'json2plist', '--path', '-'], {}, jsonData, callback);
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
    generateCertificateAuthorityProfile: function (certificatePath, callback) {
        launchTool(['profiles', 'generate-ca-profile', '--path', certificatePath], {}, null, callback);
    }
};

// XCSCore
exports.core = {
    /*!
     * Validates the JSON representation of an object of the specified class against XCSCore's validator.
     * @param className The name of the class represented by the JSON data (e.g., "XCSBot").
     * @param jsonData The object representation of the object to validate.
     * @param callback The callback to be fired after validation, which will take two parameters: an error parameter,
     * which will be a string description of any catastrohpic tool failures; an an array of validation error strings.
     * Both parameters will be null if validation succeeded.
     */
    validate: function (className, jsonData, callback) {
        if (!(typeof (jsonData) === 'string' || Buffer.isBuffer(jsonData))) {
            jsonData = JSON.stringify(jsonData);
        }

        launchTool(['core', 'validate', '--class', className, '--path', '-'], {}, jsonData, function (err) {
            if (err) {
                var validationErrors = [],
                    errors = ('' === err.message ? [] : err.message.split('\n'));

                for (var i = 0; i < errors.length; i++) {
                    var msg = errors[i];
                    if (msg.match(/^validation error: /)) {
                        validationErrors.push(msg.replace(/^validation error: /, ''));
                    } else {
                        return xcsutil.safeCallback(callback, null, [msg]);
                    }
                    return xcsutil.safeCallback(callback, null, validationErrors);
                }

                err.message = '[XCSBridge - validate] error while calling validate: ' + err.message;
                konsole.error(null, JSON.stringify(err));
                return xcsutil.safeCallback(callback, err);
            } else {
                return xcsutil.safeCallback(callback);
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

        // get the JSON version of the blueprint
        var blueprintStr = JSON.stringify(blueprint);

        // launch xcsbridge
        launchTool(['source-control', 'blueprint-preflight', '--path', '-', '--format', 'json'], {}, blueprintStr, function (err, output) {
            if (err) {
                err.message = '[XCSBridge - preflight] error while calling blueprint-preflight: ' + err.message;
                konsole.error(null, JSON.stringify(err));
                return xcsutil.safeCallback(callback, err);
            } else {
                var resultObj = JSON.parse(output.toString('utf8'));
                return xcsutil.safeCallback(callback, null, resultObj);
            }
        });
    },

    listBranches: function (blueprint, callback) {

        var functionTitle = '[xcsbridge] list branches';
        konsole.log(null, functionTitle);

        // get the JSON version of the blueprint
        var blueprintStr = JSON.stringify(blueprint);

        // launch xcsbridge
        launchTool(['source-control', 'blueprint-list-branches', '--path', '-', '--format', 'json'], {}, blueprintStr, function (err, output) {
            if (err) {
                err.message = '[XCSBridge - listBranches] error while calling blueprint-list-branches: ' + err.message;
                konsole.error(null, JSON.stringify(err));
                return xcsutil.safeCallback(callback, err);
            } else {
                var resultObj = JSON.parse(output.toString('utf8'));
                return xcsutil.safeCallback(callback, null, resultObj);
            }
        });
    },

    checkForUpdates: function (blueprint, callback) {

        var blueprintStr = JSON.stringify(blueprint);

        launchTool(['source-control', 'blueprint-update-check', '--path', '-'], {}, blueprintStr, function (err, output) {
            if (err) {
                err.message = '[XCSBridge - checkForUpdates] error while calling blueprint-update-check: ' + err.message;
                konsole.error(null, JSON.stringify(err));
                return xcsutil.safeCallback(callback, err);
            } else {
                var resultObj = JSON.parse(output.toString('utf8'));
                return xcsutil.safeCallback(callback, null, resultObj);
            }
        });
    },

    merge: function (existing, merge, callback) {

        var existingStr = JSON.stringify(existing),
            mergeStr = JSON.stringify(merge);

        xcsutil.writeTemporaryFile(existingStr, function (err, filename, cb) {
            if (err) {
                err.message = '[XCSBridge - merge] error while calling writeTemporaryFile: ' + err.message;
                konsole.error(null, JSON.stringify(err));
                return xcsutil.safeCallback(callback, err);
            }

            launchTool(['source-control', 'blueprint-merge', '--path', filename, '--merge-path', '-', '--with-auth', '--with-revisions'], {}, mergeStr, function (err, output) {
                return xcsutil.safeCallback(cb, function () {
                    if (err) {
                        err.message = '[XCSBridge - merge] error while calling blueprint-merge: ' + err.message;
                        konsole.error(null, JSON.stringify(err));
                        return xcsutil.safeCallback(callback, err);
                    } else {
                        var resultObj = JSON.parse(output.toString('utf8'));
                        return xcsutil.safeCallback(callback, null, resultObj);
                    }
                });
            });
        });
    },

    getMissingCredentials: function (blueprint, credentials, callback) {

        var blueprintStr = JSON.stringify(blueprint),
            credentialsStr = JSON.stringify(credentials);

        xcsutil.writeTemporaryFile(blueprintStr, function (err, filename, cb) {
            if (err) {
                err.message = '[XCSBridge - getMissingCredentials] error while calling writeTemporaryFile: ' + err.message;
                konsole.error(null, JSON.stringify(err));
                return xcsutil.safeCallback(callback, err);
            }

            launchTool(['source-control', 'blueprint-use-credentials', '--path', filename, '--credentials-path', '-', '--with-auth', '--with-revisions'], {}, credentialsStr, function (err, output) {
                return xcsutil.safeCallback(cb, function () {
                    if (err) {
                        err.message = '[XCSBridge - getMissingCredentials] error while calling blueprint-use-credentials: ' + err.message;
                        konsole.error(null, JSON.stringify(err));
                        return xcsutil.safeCallback(callback, err);
                    } else {
                        var resultObj = JSON.parse(output.toString('utf8'));
                        return xcsutil.safeCallback(callback, null, resultObj);
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
        exports.sourceControl.transformBlueprint(blueprint, ['--with-anonymous-urls'], callback);
    },

    transformBlueprint: function (blueprint, options, callback) {
        // get the JSON version of the blueprint
        var blueprintStr = JSON.stringify(blueprint),
            args = ['source-control', 'blueprint-transform', '--path', '-', '--format', 'json'].concat(options);

        // launch xcsbridge
        launchTool(args, {}, blueprintStr, function (err, output) {
            if (err) {
                err.message = '[XCSBridge - transformBlueprint] error while calling blueprint-transform: ' + err.message;
                konsole.error(null, JSON.stringify(err));
                return xcsutil.safeCallback(callback, err);
            } else {
                var resultObj = JSON.parse(output.toString('utf8'));
                return xcsutil.safeCallback(callback, null, resultObj);
            }
        });
    }
};