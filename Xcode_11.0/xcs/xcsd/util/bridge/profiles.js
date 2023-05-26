'use strict';

const Promise = require('bluebird');

var async = require('async'),
    uuid = require('node-uuid');

var logger = require('../logger.js');

var objc = require('./objc.js'),
    $ = objc.$,
    tryError = objc.tryError;

$.import('Security');
objc.importSharedFramework('XCSSecurity');

/*!
 * Produces a configuration profile containing this server's current public-facing SSL certificate for the
 * purposes of OTA app installation.
 * @param certificatePath The path to the certificate to embed in the configuration profile.
 * @param callback The callback to be fired once the profile has been generated, which will take two parameters:
 * an error parameter, and a Buffer representing the resulting Property List data.
 */
exports.generateCertificateAuthorityProfile = function (certificatePath, callback) {
    logger.debug('Creating certificate authority profile for', certificatePath);

    var decodedData;

    async.waterfall([
        function (cb) {
            tryError($.NSData, 'dataWithContentsOfFile', $(certificatePath), 'options', 0, 'error', cb);
        },
        function (data, cb) {
            tryError($.XCSSecurityGetPEMDecodedData, data, cb);
        },
        function (data, cb) {
            decodedData = data;
            tryError($.XCSSecurityCertificateDataGetCommonName, data, cb);
        },
        function (commonName, cb) {
            commonName = commonName('UTF8String');

            var profile = objc.convertToNSObject({
                PayloadType: 'Configuration',
                PayloadVersion: 1,
                PayloadDisplayName: 'Xcode Server OTA Installation',
                PayloadDescription: 'This profile enables over-the-air installation of iOS products built by Xcode Server.',
                PayloadIdentifier: 'com.apple.xcs.ota.' + commonName,
                PayloadOrganization: commonName,
                PayloadUUID: uuid(),
                ConsentText: {
                    'default': 'This profile will install and trust a root certificate that will allow this device to recognize your server.'
                }
            });

            var certPayload = objc.convertToNSObject({
                PayloadType: 'com.apple.security.root',
                PayloadVersion: 1,
                PayloadIdentifier: 'com.apple.xcs.ota.' + commonName + '.com.apple.security.root.' + uuid(),
                PayloadUUID: uuid(),
                PayloadDisplayName: commonName,
                PayloadDescription: 'Configures certificate settings.'
            });
            certPayload('setObject', decodedData, 'forKey', $('PayloadContent'));

            var contents = $.NSArray('arrayWithObject', certPayload);
            profile('setObject', contents, 'forKey', $('PayloadContent'));

            tryError($.NSPropertyListSerialization, 'dataWithPropertyList', profile, 'format', $.NSPropertyListXMLFormat_v1_0, 'options', 0, 'error', cb);
        }
    ], function (err, plistData) {
        if (err) {
            callback({status: 500, message: 'Could not generate CA profile: ' + err('localizedDescription')('UTF8String')});
        } else {
            callback(null, plistData('bytes').reinterpret(plistData('length')));
        }
    });
};

exports.getProfileInfo = function getProfileInfo(filePath) {
    return Promise.try(() => {
        let data = $.NSData('dataWithContentsOfFile', $(filePath));

        let decoderRef = $.alloc($.NSObject).ref();
        let result = $.CMSDecoderCreate(decoderRef);
        if (result !== 0) {
            throw new Error('Could not create decoder.');
        }

        let decoder = $.CFBridgingRelease(decoderRef.deref());
        let bytes = data('bytes');
        $.CMSDecoderUpdateMessage(decoder.pointer, bytes, data('length'));
        $.CMSDecoderFinalizeMessage(decoder.pointer);
        let decodedDataRef = $.alloc($.NSData).ref();
        $.CMSDecoderCopyContent(decoder.pointer, decodedDataRef);

        let errorRef = $.alloc($.NSError).ref();
        let plist = $.NSPropertyListSerialization('propertyListWithData', decodedDataRef.deref(), 'options', $.NSPropertyListImmutable, 'format', null, 'error', errorRef);
        if (!plist) {
            let error = errorRef.deref();
            throw new Error(error('localizedDescription')('UTF8String'));
        }

        let empty = $('');
        let emptyArray = $.NSArray('array');

        let teamIDs = plist('valueForKey', $('TeamIdentifier')) || emptyArray;

        return {
            name: (plist('valueForKey', $('Name')) || empty)('UTF8String'),
            teamID: (teamIDs('firstObject') || empty)('UTF8String'),
            teamName: (plist('valueForKey', $('TeamName')) || empty)('UTF8String'),
            identifier: (plist('valueForKey', $('UUID')) || empty)('UTF8String')
        };
    });
};
