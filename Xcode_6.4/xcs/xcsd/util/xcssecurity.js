'use strict';

/*
    xcssecurity
    A module for interacting with the xcssecurity command-line tool.
*/

var cp = require('child_process'),
    xcsutil = require('./xcsutil.js'),
    k = require('../constants.js');

// Constants
var XCSSECURITY_PATH = '/Library/Developer/XcodeServer/CurrentXcodeSymlink/Contents/Developer/usr/bin/xcssecurity';

// Utility functions
/*!
 * Launches an instance of xcssecurity with the specified arguments and environment, and
 * collects its output.
 * @param args The arguments to pass through to xcssecurity.
 * @param environment A dictionary of environmental variables to expose to xcssecurity.
 * @param keychain An optional Keychain to bind against (passes keychain path and master password).
 * @param stdinData Optional data to be written to STDIN, as a string or Buffer.
 * @param callback An optional callback to be fired when xcssecurity exits. This function should take
 * three parameters: the exit status code of xcssecurity as an integer; a Buffer representing the
 * STDOUT of xcssecurity; and an array of error or warning messages (as strings) collected from STDERR.
 */
function launchTool(args, environment, keychain, stdinData, callback) {
    // copy the environment, and merge in our new variables
    var env = JSON.parse(JSON.stringify(process.env));
    for (var prop in environment) {
        if (environment.hasOwnProperty(prop)) {
            env[prop] = environment[prop];
        }
    }

    if (keychain) {
        if (keychain.path) {
            env.XCS_KEYCHAIN = keychain.path;
        }
        if (keychain.secretPath) {
            env.XCS_KEYCHAIN_PASSWORD = keychain.secretPath;
        }
    }

    // spawn the task
    var xcssecurity = cp.spawn(XCSSECURITY_PATH, args, {
        env: env,
        stdio: 'pipe'
    });

    // pipe in stdin, if necessary
    if (stdinData) {
        xcssecurity.stdin.write(stdinData);
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

    if (callback) {
        xcssecurity.on('close', function (status) {
            var messages = (stderrStr.length > 0) ? stderrStr.replace(/^xcssecurity: |\n$/mg, '').split('\n') : [];
            callback(status, Buffer.concat(stdoutBufs, stdoutBufLen), messages);
        });
    }
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
Keychain.prototype.addItem = function (req, username, password, serviceName, trustedApps, callback) {

    if (k.XCSProfilerActive) {
        var snitch;

        if (req && req.snitch) {

            snitch = req.snitch;

        } else {

            try {
                var Snitch = require('speedsnitch');
                snitch = new Snitch();
            } catch (e) {
                snitch = null;
            }

        }

        if (snitch) {
            snitch.next('[xcssecurity-Keychain] addItem');
        }
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
    }, this, password, function (status, output, errors) {
        xcsutil.profilerSummary(req);
        if (callback) {
            if (status === 0) {
                callback(null);
            } else {
                callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error');
            }
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
Keychain.prototype.findItem = function (req, username, serviceName, callback) {

    if (k.XCSProfilerActive) {
        var snitch;

        if (req && req.snitch) {

            snitch = req.snitch;

        } else {

            try {
                var Snitch = require('speedsnitch');
                snitch = new Snitch();
            } catch (e) {
                snitch = null;
            }

        }

        if (snitch) {
            snitch.next('[xcssecurity-Keychain] findItem');
        }
    }

    launchTool(['keychain-find'], {
        XCS_USERNAME: username,
        XCS_SERVICE_NAME: serviceName
    }, this, null, function (status, output, errors) {
        xcsutil.profilerSummary(null);
        if (callback) {
            if (status === 0) {
                callback(null, output);
            } else {
                callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error', null);
            }
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
Keychain.prototype.removeItem = function (req, username, serviceName, callback) {

    if (k.XCSProfilerActive) {
        var snitch;

        if (req && req.snitch) {

            snitch = req.snitch;

        } else {

            try {
                var Snitch = require('speedsnitch');
                snitch = new Snitch();
            } catch (e) {
                snitch = null;
            }

        }

        if (snitch) {
            snitch.next('[xcssecurity-Keychain] removeItem');
        }
    }

    launchTool(['keychain-remove'], {
        XCS_USERNAME: username,
        XCS_SERVICE_NAME: serviceName
    }, this, null, function (status, output, errors) {
        xcsutil.profilerSummary(null);
        if (callback) {
            if (status === 0) {
                callback(null);
            } else {
                callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error');
            }
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
Keychain.prototype.generateCSR = function(commonName, emailAddress, callback) {
    var env = {};
    if (commonName)
        env.XCS_COMMON_NAME = commonName;
    if (emailAddress)
        env.XCS_EMAIL = emailAddress;
    
    launchTool(['certificate-request'], env, this, null, function(status, output, errors){
        if (callback) {
            if (status === 0) {
                callback(null, output);
            } else {
                callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error', null);
            }
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
Keychain.prototype.findIdentity = function(commonName, emailAddress, exportPassphrase, callback) {
    var env = {
        XCS_PASSWORD: '-'
    };
    
    if (commonName)
        env.XCS_COMMON_NAME = commonName;
    if (emailAddress)
        env.XCS_EMAIL = emailAddress;
    
    launchTool(['identity-find', '--first', '--require'], env, this, exportPassphrase, function(status, output, errors){
        if (callback) {
            if (status === 0) {
                callback(null, output);
            } else {
                callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error', null);
            }
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
Keychain.prototype.exportIdentity = function(commonName, emailAddress, certificatePath, privateKeyPath, callback) {
    var env = {
        XCS_PASSWORD: '-'
    };
    
    if (commonName)
        env.XCS_COMMON_NAME = commonName;
    if (emailAddress)
        env.XCS_EMAIL = emailAddress;
    
    env.XCS_CERTIFICATE_PATH = certificatePath;
    env.XCS_KEY_PATH = privateKeyPath;
    
    launchTool(['identity-export'], env, this, null, function(status, output, errors){
        if (callback) {
            if (status === 0) {
                callback(null);
            } else {
                callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error');
            }
        }
    });
};

/*!
 * Creates a new identity object to use for things like signing.
 * @param commonName The common name of the identity to locate.
 * @param emailAddress The email address of the identity to locate.
 * @return An Identity object.
 */
Keychain.prototype.openIdentity = function(commonName, emailAddress) {
    return new Identity(commonName, emailAddress, this);
}

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
CertificateAuthority.prototype.fulfillCSR = function (csrData, destinationKeychain, validityPeriod, callback) {

    if (k.XCSProfilerActive) {

        var snitch;

        try {
            var Snitch = require('speedsnitch');
            snitch = new Snitch();
        } catch (e) {
            snitch = null;
        }

        if (snitch) {
            snitch.next('[xcssecurity-CertificateAuthority] fulfillCSR');
        }
    }
    
    var env = {
        XCS_AUTHORITY_PATH: this.path,
        XCS_DESTINATION_KEYCHAIN: (destinationKeychain) ? destinationKeychain.path : this.keychain.path,
        XCS_DESTINATION_KEYCHAIN_PASSWORD: (destinationKeychain) ? destinationKeychain.secretPath : this.keychain.secretPath
    };
    
    if (validityPeriod !== null) {
        env.XCS_VALIDITY_PERIOD = '' + validityPeriod;
    }

    launchTool(['authority-fulfill-request', '-r', '-', '--pem'], env, this.keychain, csrData, function (status, output, errors) {
        xcsutil.profilerSummary(null);
        if (callback) {
            if (status === 0) {
                callback(null, output);
            } else {
                callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error');
            }
        }
    });
};

// Identity object
function Identity(commonName, emailAddress, keychain) {
    this.commonName = commonName;
    this.emailAddress = emailAddress;
    this.keychain = keychain;
}

/*!
 * Signs a blob of data and returns the results via callback.
 * @param inputData The data that you would like to sign, as a Buffer or string.
 * @param callback An optional callback to be executed when the data has been signed. It should take two
 * parameters: an error, which will be null if everything succeeded, or an informative string otherwise;
 * and the signed data as a Buffer, represented as DER-encoded CSM Signed Data.
 */
Identity.prototype.signMessage = function (inputData, callback) {
    if (k.XCSProfilerActive) {

        var snitch;

        try {
            var Snitch = require('speedsnitch');
            snitch = new Snitch();
        } catch (e) {
            snitch = null;
        }

        if (snitch) {
            snitch.next('[xcssecurity-Identity] signMessage');
        }
    }
    
    var env = {};
    
    if (this.commonName)
        env.XCS_COMMON_NAME = this.commonName;
    if (this.emailAddress)
        env.XCS_EMAIL = this.emailAddress;
    
    launchTool(['message-sign', '-i', '-'], env, this.keychain, inputData, function (status, output, errors) {
        xcsutil.profilerSummary(null);
        if (callback) {
            if (status === 0) {
                callback(null, output);
            } else {
                callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error');
            }
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
exports.openKeychain = function (path, passwordOrPath) {
    return new Keychain(path, passwordOrPath);
};

/*!
 * Creates an object representing a Certificate Authority.
 * @param path The path to the Certificate Authority directory.
 * @param keychain An initialized Keychain object that contains the CA's keys and certificate (use openKeychain).
 * @return A Certificate Authority object.
 */
exports.openCertificateAuthority = function (path, keychain) {
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
exports.authenticateUser = function (req, username, password, callback) {

    if (req && req.snitch) {
        req.snitch.next('[xcssecurity] authenticateUser');
    }

    launchTool(['user-authenticate'], {
        XCS_USERNAME: username,
        XCS_PASSWORD: password
    }, null, null, function (status, output, errors) {
        if (callback) {
            if (status === 0) {
                callback(null);
            } else {
                callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error');
            }
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
exports.userIsAdministrator = function (req, username, callback) {

    if (req && req.snitch) {
        req.snitch.next('[xcssecurity] userIsAdministrator');
    }

    launchTool(['user-is-admin'], {
        XCS_USERNAME: username
    }, null, null, function (status, output, errors) {
        if (callback) {
            if (status === 0) {
                callback(null);
            } else {
                callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error');
            }
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
exports.expandGroups = function (req, groupSpec, callback) {

    if (req && req.snitch) {
        req.snitch.next('[xcssecurity] expandGroups');
    }

    var spec = JSON.stringify(groupSpec);
    launchTool(['group-expand', '-g', '-', '--deduplicate', '--preserve-nonexistent', '--warn-unavailable'], {}, null, spec, function (status, output, errors) {
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

            if (status === 0) {
                callback(null, JSON.parse(output.toString('utf8')), unavailableNodes);
            } else {
                callback((errors.length > 0) ? errors[errors.length - 1] : 'unexpected error', null, unavailableNodes);
            }
        }
    });
};