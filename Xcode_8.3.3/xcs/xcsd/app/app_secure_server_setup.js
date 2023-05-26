'use strict';

var cluster = require('cluster'),
    https = require('https'),
    fs = require('fs'),
    config = require('config'),
    Promise = require('bluebird');

var ts = require('../util/turbosocket.js'),
    te = require('../util/turboevents.js'),
    logger = require('../util/logger.js'),
    Errors = require('../util/error.js'),
    XCSSSLCyphers = require('../constants.js').XCSSSLCyphers,
    keyPath = config.get('ssl.keyPath'),
    certPath = config.get('ssl.certificatePath'),
    clientCertsPath = config.get('ssl.ca.client');

module.exports = Promise.method(function app_secure_server_setup_init(app) {
    if (cluster.isWorker || cluster.isDisabled) {
        // check if we have the required key files
        if (!fs.existsSync(keyPath)) {
            throw new Errors.Internal('Server SSL private key missing, skipping SSL setup.');
        }

        if (!fs.existsSync(certPath)) {
            throw new Errors.Internal('Server SSL certificate key missing, skipping SSL setup.');
        }

        if (!fs.existsSync(clientCertsPath)) {
            throw new Errors.Internal('Client SSL certificate authority missing, skipping SSL setup.');
        }

        logger.debug('Creating and configuring secure servers.');

        /**
         * Mitigating the BEAST TLS attack in Node.js:
         * http://www.ericmartindale.com/2012/07/19/mitigating-the-beast-tls-attack-in-nodejs/
         */

		var keyData = fs.readFileSync(keyPath),
			certificateData = fs.readFileSync(certPath),
			certificateAuthorityData = fs.readFileSync(clientCertsPath);

        var secureOptions = {
            key: keyData,
            cert: certificateData,
            ciphers: XCSSSLCyphers,
            honorCipherOrder: true
        };

        var secureServer = https.createServer(secureOptions, app);
        app.set('secureServer', secureServer);

        var secureOptionsWithClientAuth = {
            key: keyData,
            cert: certificateData,
            ca: certificateAuthorityData,
            requestCert: true,
            rejectUnauthorized: false,
            ciphers: XCSSSLCyphers,
            honorCipherOrder: true
        };

        var secureServerWithClientAuth = https.createServer(secureOptionsWithClientAuth, app);
        app.set('secureServerWithClientAuth', secureServerWithClientAuth);

        var turbosocketServer = ts.createServer(secureOptionsWithClientAuth, socket => {
            te.registerTurboSocket(socket);
        });
        app.set('turbosocketServer', turbosocketServer);

        var turbosocketServerWithClientAuth = ts.createServer(secureOptionsWithClientAuth, socket => {
            te.registerTurboSocket(socket);
        });
        app.set('turbosocketServerWithClientAuth', turbosocketServerWithClientAuth);
        logger.debug('Secure servers created, configured, and ready to listen.');
    }
});
