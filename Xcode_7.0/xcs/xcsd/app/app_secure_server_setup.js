'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var cluster = require('cluster'),
    https = require('https'),
    fs = require('fs');

var ts = require('../util/turbosocket.js'),
    te = require('../util/turboevents.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js'),
    XCSSSLCyphers = require('../constants.js').XCSSSLCyphers,
    XCS_SSL_SERVER_KEY_PATH = require('../constants.js').XCS_SSL_SERVER_KEY_PATH,
    XCS_SSL_SERVER_CERT_PATH = require('../constants.js').XCS_SSL_SERVER_CERT_PATH,
    XCS_SSL_CLIENT_CA_CERT_PATH = require('../constants.js').XCS_SSL_CLIENT_CA_CERT_PATH;

module.exports = function app_secure_server_setup_init(app, cb) {

    var message = null;

    if (cluster.isWorker || cluster.isDisabled) {
        // check if we have the required key files
        if (!fs.existsSync(XCS_SSL_SERVER_KEY_PATH)) {
            message = '[XCSNode - Secure server setup] Server SSL private key missing, skipping SSL setup';
            konsole.error(null, message);
            return xcsutil.safeCallback(cb, {
                status: 500,
                message: 'Internal Server Error (xcsd): ' + message
            });
        } else {
            if (!fs.existsSync(XCS_SSL_SERVER_CERT_PATH)) {
                message = '[XCSNode - Secure server setup] Server SSL certificate key missing, skipping SSL setup';
                konsole.error(null, message);
                return xcsutil.safeCallback(cb, {
                    status: 500,
                    message: 'Internal Server Error (xcsd): ' + message
                });
            } else {
                if (!fs.existsSync(XCS_SSL_CLIENT_CA_CERT_PATH)) {
                    message = '[XCSNode - Secure server setup] Client SSL certificate authority missing, skipping SSL setup';
                    konsole.error(null, message);
                    return xcsutil.safeCallback(cb, {
                        status: 500,
                        message: 'Internal Server Error (xcsd): ' + message
                    });
                } else {

                    konsole.log(null, '[XCSNode - Secure server setup] setup security options');

                    /**
                     * Mitigating the BEAST TLS attack in Node.js:
                     * http://www.ericmartindale.com/2012/07/19/mitigating-the-beast-tls-attack-in-nodejs/
                     */

                    var secureOptions = {
                        key: fs.readFileSync(XCS_SSL_SERVER_KEY_PATH),
                        cert: fs.readFileSync(XCS_SSL_SERVER_CERT_PATH),
                        ciphers: XCSSSLCyphers,
                        honorCipherOrder: true
                    };

                    var secureServer = https.createServer(secureOptions, app);
                    app.set('secureServer', secureServer);

                    var secureOptionsWithClientAuth = {
                        key: fs.readFileSync(XCS_SSL_SERVER_KEY_PATH),
                        cert: fs.readFileSync(XCS_SSL_SERVER_CERT_PATH),
                        ca: fs.readFileSync(XCS_SSL_CLIENT_CA_CERT_PATH),
                        requestCert: true,
                        rejectUnauthorized: false,
                        ciphers: XCSSSLCyphers,
                        honorCipherOrder: true
                    };

                    konsole.log(null, '[XCSNode - Secure server setup] creating secure servers');

                    var secureServerWithClientAuth = https.createServer(secureOptionsWithClientAuth, app);
                    app.set('secureServerWithClientAuth', secureServerWithClientAuth);

                    var turbosocketServer = ts.createServer(secureOptionsWithClientAuth, function ASSSCreateTurboSocketCallback(socket) {
                        te.registerTurboSocket(socket);
                    });
                    app.set('turbosocketServer', turbosocketServer);

                    var turbosocketServerWithClientAuth = ts.createServer(secureOptionsWithClientAuth, function ASSSCreateTurboSocketWithClientAuthCallback(socket) {
                        te.registerTurboSocket(socket);
                    });
                    app.set('turbosocketServerWithClientAuth', turbosocketServerWithClientAuth);

                    return xcsutil.safeCallback(cb);

                }
            }
        }
    } else {
        konsole.log(null, '[XCSNode - Secure server setup] secure server setup completed');

        return xcsutil.safeCallback(cb);
    }

};