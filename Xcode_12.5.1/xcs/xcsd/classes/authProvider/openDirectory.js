'use strict';

const _ = require('underscore');

const xcssecurity = require('../../util/xcssecurity.js');

function validateClientCertificate(req, cb) {
    if (req && req.connection && req.connection.authorized) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

function getFingerprint(req) {
    if (req.connection && _.isFunction(req.connection.getPeerCertificate)) {
        let clientIdentity = req.connection.getPeerCertificate();
        return clientIdentity && clientIdentity.fingerprint;
    }

    return null;
}

module.exports = {
    authenticate: xcssecurity.authenticateUser,
    isAdministrator: xcssecurity.userIsAdministrator,
    expandGroups: xcssecurity.expandGroups,
    validateClientCertificate: validateClientCertificate,
    getFingerprint: getFingerprint
};
