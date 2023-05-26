'use strict';

var cluster = require('cluster'),
    fs = require('fs'),
	config = require('config');

var k = require('../constants.js'),
    xcsbridge = require('../util/xcsbridge.js'),
    security = require('../util/xcssecurity.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js');

module.exports = function app_OTA_install_init(cb) {

    if (cluster.isMaster || cluster.isDisabled) {

        logger.debug('Setting up configuration profile for over-the-air app distribution.');

		var otaProfilePath = config.get('path.otaProfile');
        if (fs.existsSync(otaProfilePath)) {
            logger.debug('Found existing OTA configuration profile, deleting.');
            fs.unlinkSync(otaProfilePath);
        }

        xcsbridge.profiles.generateCertificateAuthorityProfile(config.get('ssl.ca.server'), function AOICertificateAuthorityProfileCallback(err, profileData) {
            if (err) {
                err.message = 'Error generating OTA configuration profile: ' + JSON.stringify(err);
                logger.error(err.message);
                return xcsutil.safeCallback(cb, err);
            } else {
                // sign the profile
                var keychain = security.openKeychain(config.get('keychain.xcsd'));
                var identity = keychain.openIdentity(k.XCSCASigningIdentityCommonName, null);

                logger.debug('Signing the OTA configuration profile.');

                identity.signMessage(profileData, function AOIIdentitySignatureCallback(err, signedProfileData) {
                    if (err) {
                        err.message = 'Error signing OTA configuration profile: ' + JSON.stringify(err);
                        logger.error(err.message);
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        logger.debug('Saving the OTA configuration profile to', k.XCSOTAConfigurationProfilePath);
                        fs.writeFile(otaProfilePath, signedProfileData, function AOIWriteConfigurationProfile(err) {
                            if (err) {
                                err.message = 'Error writing OTA configuration profile to disk: ' + JSON.stringify(err);
                                logger.error(err.message);
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
