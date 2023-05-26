'use strict';

var xcssecurity = require('../../util/xcssecurity.js');

function validateClientCertificate(req, cb) {
    if (req && req.connection && req.connection.authorized) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

module.exports = {
    authenticate: xcssecurity.authenticateUser,
    isAdministrator: xcssecurity.userIsAdministrator,
    expandGroups: xcssecurity.expandGroups,
    validateClientCertificate: validateClientCertificate
};
