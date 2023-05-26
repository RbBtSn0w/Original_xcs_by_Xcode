'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var cluster = require('cluster'),
    fs = require('fs'),
    os = require('os');

var konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

var security = require('../util/xcssecurity.js'),
    k = require('../constants.js');

var XCS_SSL_SERVER_KEY_PATH = require('../constants.js').XCS_SSL_SERVER_KEY_PATH,
    XCS_SSL_SERVER_CERT_PATH = require('../constants.js').XCS_SSL_SERVER_CERT_PATH,
    XCS_SSL_SERVER_CA_PATH = require('../constants.js').XCS_SSL_SERVER_CA_PATH;

module.exports = function app_SSL_init(cb) {

    // setup our server-side SSL certificates
    if (cluster.isMaster || cluster.isDisabled) {
        konsole.log(null, '[XCSNode - SSL] setup our server-side SSL certificates');

        // clean up our old SSL certificates
        if (fs.existsSync(XCS_SSL_SERVER_KEY_PATH)) {
            fs.unlinkSync(XCS_SSL_SERVER_KEY_PATH);
        }

        if (fs.existsSync(XCS_SSL_SERVER_CERT_PATH)) {
            fs.unlinkSync(XCS_SSL_SERVER_CERT_PATH);
        }

        // open the server-side certificate authority
        konsole.log(null, '[XCSNode - SSL] open the keychain');
        var keychain = security.openKeychain(k.XCSDKeychainPath, k.XCSDKeychainSharedSecretPath);

        // see if we can find a certificate for our current hostname
        var commonName = os.hostname();
        var emailAddress = k.XCS_SSL_SERVER_CERT_EMAIL_USER + '@' + commonName;

        // our initial search is done without email address to support older builds of XCS
        konsole.log(null, '[XCSNode - SSL] find a certificate for: ' + commonName);
        keychain.exportIdentity(commonName, null, XCS_SSL_SERVER_CERT_PATH, XCS_SSL_SERVER_KEY_PATH, function ASSLFindCertificateCallback(err) {
            if (err) {
                // generate a new one
                konsole.warn(null, '[XCSNode - SSL] didn\'t find a certificate for ' + commonName + '. Generating a new one.');
                keychain.generateCSR(commonName, emailAddress, function ASSLGenerateCSRCallback(err, csr) {
                    if (err) {
                        err.message = '[XCSNode - SSL] could not generate a CSR for our SSL certificate: ' + JSON.stringify(err);
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        konsole.log(null, '[XCSNode - SSL] fulfill CSR: open the Certificate Authority');
                        var ca = security.openCertificateAuthority(XCS_SSL_SERVER_CA_PATH, keychain);
                        ca.fulfillCSR(csr, keychain, k.XCSSSLCertificateValidityPeriod, function ASSLFulfillCSRCallback(err) {
                            if (err) {
                                err.message = '[XCSNode - SSL] could not fulfill CSR for our SSL certificate: ' + JSON.stringify(err);
                                return xcsutil.safeCallback(cb, err);
                            } else {
                                konsole.log(null, '[XCSNode - SSL] export the certificate just created');
                                keychain.exportIdentity(commonName, emailAddress, XCS_SSL_SERVER_CERT_PATH, XCS_SSL_SERVER_KEY_PATH, function ASSLExportCertificateCallback(err) {
                                    if (err) {
                                        err.message = '[XCSNode - SSL] could not export certificate and private key: ' + JSON.stringify(err);
                                        return xcsutil.safeCallback(cb, err);
                                    } else {
                                        return xcsutil.safeCallback(cb);
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                konsole.log(null, '[XCSNode - SSL] certificate for ' + commonName + ' found.');
                return xcsutil.safeCallback(cb);
            }
        });
    } else {
        return xcsutil.safeCallback(cb);
    }

};