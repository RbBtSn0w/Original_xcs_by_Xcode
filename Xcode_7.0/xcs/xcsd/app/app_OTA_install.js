'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var cluster = require('cluster'),
    fs = require('fs');

var k = require('../constants.js'),
    xcsbridge = require('../util/xcsbridge.js'),
    security = require('../util/xcssecurity.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

module.exports = function app_OTA_install_init(cb) {

    if (cluster.isMaster || cluster.isDisabled) {

        konsole.log(null, '[XCSNode - OTA install] Setting up configuration profile for OTA app distribution');

        if (fs.existsSync(k.XCSOTAConfigurationProfilePath)) {
            fs.unlinkSync(k.XCSOTAConfigurationProfilePath);
        }

        xcsbridge.profiles.generateCertificateAuthorityProfile(k.XCS_SSL_SERVER_CA_CERT_PATH, function AOICertificateAuthorityProfileCallback(err, profileData) {
            if (err) {
                err.message = '[XCSNode - OTA install] Error generating configuration profile: ' + JSON.stringify(err);
                return xcsutil.safeCallback(cb, err);
            } else {
                // sign the profile
                var keychain = security.openKeychain(k.XCSDKeychainPath, k.XCSDKeychainSharedSecretPath);
                var identity = keychain.openIdentity(k.XCSCASigningIdentityCommonName, null);

                konsole.log(null, '[XCSNode - OTA install] Signing the configuration profile');

                identity.signMessage(profileData, function AOIIdentitySignatureCallback(err, signedProfileData) {
                    if (err) {
                        err.message = '[XCSNode - OTA install] Error signing configuration profile: ' + JSON.stringify(err);
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        konsole.log(null, '[XCSNode - OTA install] Saving the configuration profile');
                        fs.writeFile(k.XCSOTAConfigurationProfilePath, signedProfileData, function AOIWriteConfigurationProfile(err) {
                            if (err) {
                                err.message = '[XCSNode - OTA install] Error writing configuration profile to disk: ' + JSON.stringify(err);
                            }
                            return xcsutil.safeCallback(cb, err);
                        });
                    }
                });
            }
        });
    } else {
        return xcsutil.safeCallback(cb);
    }

};