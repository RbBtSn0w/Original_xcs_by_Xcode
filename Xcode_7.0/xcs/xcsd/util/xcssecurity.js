'use strict';

/*
    xcssecurity
    A module for interacting with the xcssecurity command-line tool.
*/

var cp = require('child_process'),
    cluster = require('cluster'),
    async = require('async');

var konsole = require('./konsole.js'),
    xcsutil = require('./xcsutil.js'),
    k = require('../constants.js'),
    konsole = require('../util/konsole.js');

// Constants
var XCSSECURITY_PATH = '/Library/Developer/XcodeServer/CurrentXcodeSymlink/Contents/Developer/usr/bin/xcssecurity',
    XCSSECURITY_TOTAL_CONCURRENCY_NUMBER = 24,
    XCSSECURITY_DEFAULT_CONCURRENCY_NUMBER = 4;

// Global
var xcsSecurityQueue;

// Identity object
function Identity(commonName, emailAddress, keychain) {
    this.commonName = commonName;
    this.emailAddress = emailAddress;
    this.keychain = keychain;
}

// Utility functions
/*!
 * Launches an instance of xcssecurity with the specified arguments and environment, and
 * collects its output.
 * @param args The arguments to pass through to xcssecurity.
 * @param environment A dictionary of environmental variables to expose to xcssecurity.
 * @param keychain An optional Keychain to bind against (passes keychain path and master password).
 * @param stdinData Optional data to be written to STDIN, as a string or Buffer.
 * @param callback An optional callback to be fired when xcssecurity exits. This function should take
 * three parameters: an error object containing a status and message properties; a Buffer representing the
 * STDOUT of xcssecurity; and an array of error or warning messages (as strings) collected from STDERR.
 */
function launchTool(args, environment, keychain, stdinData, callback) {

    if (!callback) {
        console.trace('*** Callback not specified!');
    }

    // Wrap the parameters in an object
    var newTask = {
        args: args,
        environment: environment,
        keychain: keychain,
        stdinData: stdinData
    };

    // Instantiate the async queue if needed
    if (!xcsSecurityQueue) {

        require('../classes/redisClass.js').client().get(k.XCSRedisSpecifiedNumOfCPUs, function (err, reply) {
            var concurrencyNumberPerNode = XCSSECURITY_DEFAULT_CONCURRENCY_NUMBER;
            if (reply) {
                var numberOfNodes = parseInt(reply, 10);
                concurrencyNumberPerNode = Math.floor(XCSSECURITY_TOTAL_CONCURRENCY_NUMBER / numberOfNodes);
                if (concurrencyNumberPerNode < 1) {
                    concurrencyNumberPerNode = XCSSECURITY_DEFAULT_CONCURRENCY_NUMBER;
                }
            }

            setupXCSSecurityQueue(concurrencyNumberPerNode, function () {
                addTaskToSecurityQueue(newTask, callback);
            });

        });
    } else {
        addTaskToSecurityQueue(newTask, callback);
    }
}

function setupXCSSecurityQueue(concurrencyNumber, callback) {
    if (cluster.isMaster) {
        konsole.log(null, '[XCSSecurity - launchTool] instantiating xcsSecurityQueue on master');
    } else {
        konsole.log(null, '[XCSSecurity - launchTool] instantiating xcsSecurityQueue on worker: ' + cluster.worker.id);
    }

    xcsSecurityQueue = async.queue(function (task, cb) {

        var startTime = process.hrtime(),
            prop;

        // copy the environment and remove the password
        var environmentCopy = {};
        for (prop in task.environment) {
            if (task.environment.hasOwnProperty(prop)) {
                environmentCopy[prop] = task.environment[prop];
            }
        }

        delete environmentCopy.XCS_PASSWORD;

        // copy the environment, and merge in our new variables
        var env = JSON.parse(JSON.stringify(process.env));
        for (prop in task.environment) {
            if (task.environment.hasOwnProperty(prop)) {
                env[prop] = task.environment[prop];
            }
        }

        if (task.keychain) {
            if (task.keychain.path) {
                env.XCS_KEYCHAIN = task.keychain.path;
            }
            if (task.keychain.secretPath) {
                env.XCS_KEYCHAIN_PASSWORD = task.keychain.secretPath;
            }
        }

        // spawn the task
        var xcssecurity,
            pid;

        try {
            xcssecurity = cp.spawn(XCSSECURITY_PATH, task.args, {
                env: env,
                stdio: 'pipe'
            });

            pid = xcssecurity.pid;

            konsole.log(null, '[XCSSecurity - launchTool]     invoking: ' + JSON.stringify(task.args) + ' - ' + JSON.stringify(environmentCopy) + ' (pid ' + pid + ')');

            // pipe in stdin, if necessary
            if (task.stdinData) {
                xcssecurity.stdin.write(task.stdinData);
                xcssecurity.stdin.end();
            }

            // capture the output
            var stderrStr = '';
            var stdoutBufs = [];
            var stdoutBufLen = 0;

            xcssecurity.stderr.setEncoding('utf8');
            xcssecurity.stderr.on('data', function (str) {
                stderrStr += str;
            });

            xcssecurity.stdout.on('data', function (buf) {
                stdoutBufs.push(buf);
                stdoutBufLen += buf.length;
            });

            xcssecurity.on('close', function (status) {

                var diff = process.hrtime(startTime),
                    time = Math.floor((diff[0] * 1e9 + diff[1]) / 1000000);

                var errors = (stderrStr.length > 0) ? stderrStr.replace(/^xcssecurity: |\n$/mg, '').split('\n') : [];

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
                    konsole.log(null, '[XCSSecurity - launchTool]     success: ' + JSON.stringify(task.args) + ' - ' + JSON.stringify(environmentCopy) + ' (' + time + ' ms,  pid ' + pid + ')');
                    return xcsutil.safeCallback(cb, null, Buffer.concat(stdoutBufs, stdoutBufLen), errors);
                } else {
                    var error = {
                        status: httpStatus,
                        message: '[XCSSecurity - launchTool] Internal Server Error (xcssecurity): ' + ((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error')
                    };
                    konsole.error(null, '[XCSSecurity - launchTool]     error: ' + JSON.stringify(error) + ' (' + time + ' ms,  pid ' + pid + ')');
                    return xcsutil.safeCallback(cb, error, Buffer.concat(stdoutBufs, stdoutBufLen), errors);
                }

            });
        } catch (e) {
            var error = {
                status: 500,
                message: '[XCSSecurity - launchTool] Internal Server Error: ' + e.toString()
            };
            konsole.error(null, '[XCSSecurity - launchTool] exception: ' + JSON.stringify(error));
            return xcsutil.safeCallback(cb, error);
        }

    }, concurrencyNumber);

    konsole.log(null, '[XCSSecurity - launchTool] setting queue concurrency to: ' + concurrencyNumber);

    return xcsutil.safeCallback(callback);
}

function addTaskToSecurityQueue(newTask, callback) {
    // Add the new task to the queue
    konsole.log(null, '[XCSSecurity - launchTool] adding task to queue: ' + JSON.stringify(newTask.args));
    xcsSecurityQueue.push(newTask, callback);

    konsole.log(null, '[XCSSecurity - launchTool] xcsSecurityQueue count: ' + xcsSecurityQueue.length());
}

// Keychain object
function Keychain(path, secretPath) {
    this.path = path;
    this.secretPath = secretPath;
}

/*!
 * Adds a generic item to the Keychain.
 * @param username The username to use in the Keychain item.
 * @param password The password to be stored in the Keychain item. Can be a UTF-8 string or a Buffer.
 * @param serviceName The service name under which to store this item in the Keychain.
 * @param trustedApps Optionally, an array of paths to applications which should be allowed to access
 * this Keychain item.
 * @param callback An optional callback to be executed when the item has been added to the Keychain. It should
 * take one parameter, an error, which will be null if everything succeeded, or an informative string otherwise.
 */
Keychain.prototype.addItem = function addItem(req, username, password, serviceName, trustedApps, callback) {

    if (req && req.snitch) {
        req.snitch.next('[xcssecurity] addItem');
    }

    var args = ['keychain-add'];

    if (trustedApps) {
        for (var i = 0; i < trustedApps.length; i++) {
            args.push('-T', trustedApps[i]);
        }
    }

    launchTool(args, {
        XCS_USERNAME: username,
        XCS_PASSWORD: '-',
        XCS_SERVICE_NAME: serviceName
    }, this, password, function (err) {
        xcsutil.profilerSummary(req);
        if (err) {
            err.message = '[XCSSecurity - addItem] error: ' + err.message;
            konsole.error(null, JSON.stringify(err));
            return xcsutil.safeCallback(callback, err);
        } else {
            return xcsutil.safeCallback(callback);
        }
    });
};

/*!
 * Finds a generic item in the Keychain and retrieves its associated password.
 * @param username The username to find in the Keychain.
 * @param serviceName The service name to find in the Keychain.
 * @param callback An optional callback to be executed when the item has been retrieved. It should
 * take two parameters: an error, which will be null if everything succeeded, or an informative string otherwise;
 * and the password as a Buffer.
 */
Keychain.prototype.findItem = function findItem(req, username, serviceName, callback) {

    if (req && req.snitch) {
        req.snitch.next('[xcssecurity] findItem');
    }

    launchTool(['keychain-find'], {
        XCS_USERNAME: username,
        XCS_SERVICE_NAME: serviceName
    }, this, null, function (err, output) {
        xcsutil.profilerSummary(null);
        if (err) {
            err.message = '[XCSSecurity - findItem] error: ' + err.message;
            konsole.error(null, JSON.stringify(err));
            return xcsutil.safeCallback(callback, err);
        } else {
            return xcsutil.safeCallback(callback, null, output);
        }
    });
};

/*!
 * Finds and removes a generic item from the Keychain.
 * @param username The username to find in the Keychain.
 * @param serviceName The service name to find in the Keychain.
 * @param callback An optional callback to be executed when the item has been removed from the Keychain. It should
 * take one parameter, an error, which will be null if everything succeeded, or an informative string otherwise.
 */
Keychain.prototype.removeItem = function removeItem(req, username, serviceName, callback) {

    if (req && req.snitch) {
        req.snitch.next('[xcssecurity] removeItem');
    }

    launchTool(['keychain-remove'], {
        XCS_USERNAME: username,
        XCS_SERVICE_NAME: serviceName
    }, this, null, function (err) {
        xcsutil.profilerSummary(null);
        if (err) {
            err.message = '[XCSSecurity - removeItem] error: ' + err.message;
            konsole.error(null, JSON.stringify(err));
            return xcsutil.safeCallback(callback, err);
        } else {
            return xcsutil.safeCallback(callback);
        }
    });
};

/*!
 * Generates a certificate signing request, storing the keypair in this Keychain.
 * @param commonName The common name for the new certificate.
 * @param emailAddress The email address for the new certificate.
 * @param callback An optional callback to be executed when the CSR has been generated. It should take two
 * parameters: an error, which will be null if everything succeeded, or an informative string otherwise;
 * and the generated CSR as a Buffer.
 */
Keychain.prototype.generateCSR = function generateCSR(commonName, emailAddress, callback) {
    var env = {};

    if (commonName) {
        env.XCS_COMMON_NAME = commonName;
    }

    if (emailAddress) {
        env.XCS_EMAIL = emailAddress;
    }

    launchTool(['certificate-request'], env, this, null, function (err, output) {
        if (err) {
            err.message = '[XCSSecurity - generateCSR] error: ' + err.message;
            konsole.error(null, JSON.stringify(err));
            return xcsutil.safeCallback(callback, err);
        } else {
            return xcsutil.safeCallback(callback, null, output);
        }
    });
};

/*!
 * Locates the specified certificate and private key pair, and exports it as PKCS12 data encoded using
 * the provided passphrase.
 * @param commonName The common name of the identity to locate.
 * @param emailAddress The email address of the identity to locate.
 * @param exportPassphrase The passphrase to use when exporting the data.
 * @param callback An optional callback to be executed when the identity is located. It should take two
 * parameters: an error, which will be null if everything succeeded, or an informative string otherwise;
 * and the exported .p12 identity as a Buffer.
 */
Keychain.prototype.findIdentity = function findIdentity(commonName, emailAddress, exportPassphrase, callback) {
    var env = {
        XCS_PASSWORD: '-'
    };

    if (commonName) {
        env.XCS_COMMON_NAME = commonName;
    }

    if (emailAddress) {
        env.XCS_EMAIL = emailAddress;
    }

    launchTool(['identity-find', '--first', '--require'], env, this, exportPassphrase, function (err, output) {
        if (err) {
            err.message = '[XCSSecurity - findIdentity] error: ' + err.message;
            konsole.error(null, JSON.stringify(err));
            return xcsutil.safeCallback(callback, err);
        } else {
            return xcsutil.safeCallback(callback, null, output);
        }
    });
};

/*!
 * Locates the specified certificate and private key pair, and exports it to the specified paths.
 * @param commonName The common name of the identity to locate.
 * @param emailAddress The email address of the identity to locate.
 * @param certificatePath The path to which the certificate should be exported.
 * @param privateKeyPath The path to which the private key should be exported.
 * @param callback An optional callback to be executed when the identity is located. It should take one
 * parameter: an error, which will be null if everything succeeded, or an informative string otherwise.
 */
Keychain.prototype.exportIdentity = function exportIdentity(commonName, emailAddress, certificatePath, privateKeyPath, callback) {
    var env = {
        XCS_PASSWORD: '-'
    };

    if (commonName) {
        env.XCS_COMMON_NAME = commonName;
    }

    if (emailAddress) {
        env.XCS_EMAIL = emailAddress;
    }

    env.XCS_CERTIFICATE_PATH = certificatePath;
    env.XCS_KEY_PATH = privateKeyPath;

    launchTool(['identity-export'], env, this, null, function (err) {
        if (err) {
            err.message = '[XCSSecurity - exportIdentity] error: ' + err.message;
            konsole.error(null, JSON.stringify(err));
            return xcsutil.safeCallback(callback, err);
        } else {
            return xcsutil.safeCallback(callback);
        }
    });
};

/*!
 * Creates a new identity object to use for things like signing.
 * @param commonName The common name of the identity to locate.
 * @param emailAddress The email address of the identity to locate.
 * @return An Identity object.
 */
Keychain.prototype.openIdentity = function openIdentity(commonName, emailAddress) {
    return new Identity(commonName, emailAddress, this);
};

// Certificate Authority object
function CertificateAuthority(path, keychain) {
    this.path = path;
    this.keychain = keychain;
}

/*!
 * Fulfills the given Certificate Signing Request.
 * @param csrData The data of the Certificate Signing Request, as a string or Buffer.
 * @param destinationKeychain The keychain into which the resulting certificate and key pair will be exported.
 * @param validityPeriod The validity period of the issued certificate, in days. Pass null to use the default.
 * @param callback An optional callback to be executed when the signed certificate has been generated. It should
 * take two parameters: an error, which will be null if everything succeeded, or an informative string otherwise;
 * and the new certificate as a Buffer.
 */
CertificateAuthority.prototype.fulfillCSR = function fulfillCSR(csrData, destinationKeychain, validityPeriod, callback) {

    var env = {
        XCS_AUTHORITY_PATH: this.path,
        XCS_DESTINATION_KEYCHAIN: (destinationKeychain) ? destinationKeychain.path : this.keychain.path,
        XCS_DESTINATION_KEYCHAIN_PASSWORD: (destinationKeychain) ? destinationKeychain.secretPath : this.keychain.secretPath
    };

    if (validityPeriod !== null) {
        env.XCS_VALIDITY_PERIOD = '' + validityPeriod;
    }

    launchTool(['authority-fulfill-request', '-r', '-', '--pem'], env, this.keychain, csrData, function (err, output) {
        xcsutil.profilerSummary(null);
        if (err) {
            err.message = '[XCSSecurity - fulfillCSR] error: ' + err.message;
            konsole.error(null, JSON.stringify(err));
            return xcsutil.safeCallback(callback, err);
        } else {
            return xcsutil.safeCallback(callback, null, output);
        }
    });
};

/*!
 * Signs a blob of data and returns the results via callback.
 * @param inputData The data that you would like to sign, as a Buffer or string.
 * @param callback An optional callback to be executed when the data has been signed. It should take two
 * parameters: an error, which will be null if everything succeeded, or an informative string otherwise;
 * and the signed data as a Buffer, represented as DER-encoded CSM Signed Data.
 */
Identity.prototype.signMessage = function signMessage(inputData, callback) {
    var env = {};

    if (this.commonName) {
        env.XCS_COMMON_NAME = this.commonName;
    }

    if (this.emailAddress) {
        env.XCS_EMAIL = this.emailAddress;
    }

    launchTool(['message-sign', '-i', '-'], env, this.keychain, inputData, function (err, output) {
        xcsutil.profilerSummary(null);
        if (err) {
            err.message = '[XCSSecurity - signMessage] error: ' + err.message;
            konsole.error(null, JSON.stringify(err));
            return xcsutil.safeCallback(callback, err);
        } else {
            return xcsutil.safeCallback(callback, null, output);
        }
    });
};

// Exports
/*!
 * Creates an object representing a Keychain.
 * @param path The path to the Keychain file, or null to use the login Keychain.
 * @param passwordOrPath The master password for the Keychain, or a path to its secret file. This may be null
 * for the login and system keychains.
 * @return A Keychain object.
 */
exports.openKeychain = function openKeychain(path, passwordOrPath) {
    return new Keychain(path, passwordOrPath);
};

/*!
 * Creates an object representing a Certificate Authority.
 * @param path The path to the Certificate Authority directory.
 * @param keychain An initialized Keychain object that contains the CA's keys and certificate (use openKeychain).
 * @return A Certificate Authority object.
 */
exports.openCertificateAuthority = function openCertificateAuthority(path, keychain) {
    return new CertificateAuthority(path, keychain);
};

/*!
 * Attempts to authenticate a user against Open Directory using the given username and password.
 * @param username The username of the user to authenticate.
 * @param password The password for the given user.
 * @param callback An optional callback to be executed when the user has been authenticated. It should take
 * one parameter, an error, which will be null if the username and password are authenticated successfully,
 * or an informative string otherwise.
 */
exports.authenticateUser = function authenticateUser(req, username, password, callback) {

    if (req && req.snitch) {
        req.snitch.next('[xcssecurity] authenticateUser');
    }

    launchTool(['user-authenticate'], {
        XCS_USERNAME: username,
        XCS_PASSWORD: password
    }, null, null, function (err) {
        if (err) {
            err.message = '[XCSSecurity - authenticateUser] error: ' + err.message;
            konsole.error(req, JSON.stringify(err));
            return xcsutil.safeCallback(callback, err);
        } else {
            return xcsutil.safeCallback(callback, null);
        }
    });
};

/*!
 * Checks to see whether the specified user is a member of the "admin" group.
 * @param username The username of the user whose admin status you wish to check.
 * @param callback An optional callback to be executed when the user's admin status has been determine.
 * It should take one paramter, an error, which will be null if the user is an admin, or will contain
 * an informative string otherwise.
 */
exports.userIsAdministrator = function userIsAdministrator(req, username, callback) {

    if (req && req.snitch) {
        req.snitch.next('[xcssecurity] userIsAdministrator');
    }

    launchTool(['user-is-admin'], {
        XCS_USERNAME: username
    }, null, null, function (err) {
        if (err) {
            err.message = '[XCSSecurity - userIsAdministrator] error: ' + err.message;
            konsole.error(req, JSON.stringify(err));
            return xcsutil.safeCallback(callback, err);
        } else {
            return xcsutil.safeCallback(callback);
        }
    });
};

/*!
 * Expands the groups in the provided access control list into their constituent members. Valid usernames get
 * left unaltered in the result.
 * @param groupSpec Either an array of group/usernames, or an object containing keys that map to such arrays.
 * So, passing ['u1', 'g1', 'g2'] will return ['u1', 'u2', 'u3', etc.], while passing {foo: ['u1'], bar: ['g1', 'g2']}
 * will return {foo: ['u1'], bar: ['u2', 'u3', etc.]}. This makes it easy to build hierarchical access control lists.
 * @param callback An optional callback to be executed after expansion. It should take three parameters: an error, which
 * will be null if everything succeeded, or an informative string otherwise; a result object, which will be in the
 * same format as groupSpec (e.g., an array or an object mapping onto arrays); and an array which will contain the list
 * of Open Directory nodes that were unreachable at expansion time, if any.
 */
exports.expandGroups = function expandGroups(req, groupSpec, callback) {

    if (req && req.snitch) {
        req.snitch.next('[xcssecurity] expandGroups');
    }

    var spec = JSON.stringify(groupSpec);
    launchTool(['group-expand', '-g', '-', '--deduplicate', '--preserve-nonexistent', '--warn-unavailable'], {}, null, spec, function (err, output, errors) {
        if (callback) {
            var unavailableNodes = [];
            var warningPattern = /^warning: Open Directory node "([^"]+)" appears to be unavailable$/;

            for (var i = 0; i < errors.length; i++) {
                var matches = errors[i].match(warningPattern);
                if (matches) {
                    errors.splice(i, 1);
                    unavailableNodes.push(matches[1]);
                    i--;
                }
            }

            if (err) {
                err.message = '[XCSSecurity - expandGroups] error: ' + err.message;
                konsole.error(req, JSON.stringify(err));
                return xcsutil.safeCallback(callback, err, null, unavailableNodes);
            } else {
                return xcsutil.safeCallback(callback, null, JSON.parse(output.toString('utf8')), unavailableNodes);
            }
        }
    });
};