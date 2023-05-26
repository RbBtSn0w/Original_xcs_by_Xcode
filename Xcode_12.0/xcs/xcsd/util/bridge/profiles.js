'use strict';

const Promise = require('bluebird');

var logger = require('../logger.js');
var security = require('../xcssecurity.js');

/*!
 * Produces a configuration profile containing this server's current public-facing SSL certificate for the
 * purposes of OTA app installation.
 * @param certificatePath The path to the certificate to embed in the configuration profile.
 * @param callback The callback to be fired once the profile has been generated, which will take two parameters:
 * an error parameter, and a Buffer representing the resulting Property List data.
 */
exports.generateCertificateAuthorityProfile = function (certificatePath, callback) {
    logger.debug('Creating certificate authority profile for', certificatePath);
    
    security.launchTool(['generateCertificateAuthorityProfile', '-i', certificatePath], {}, null, null, function(error, output) {
                            callback(error, output);
                        });
};

exports.getProfileInfo = function getProfileInfo(filePath) {
    return new Promise((resolve, reject) => {
        security.launchTool(['getProfileInfo', '-i', filePath], {}, null, null, function(error, output) {
            if (error) {
                reject(error.message);
            } else {
                resolve(JSON.parse(output.toString()));
            }
        });
    });
};
