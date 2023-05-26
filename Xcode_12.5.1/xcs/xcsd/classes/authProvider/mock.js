'use strict';

var users = {};
var admins = [];

function authenticate(req, username, password, cb) {
    var lowercaseUsername = username.toLowerCase();
    if (users[username] === password) {
        cb();
    } else if (users[lowercaseUsername] === password) {
        cb();
    } else {
        cb({
            status: 401,
            message: 'Incorrect password.'
        });
    }
}

function isAdministrator(req, username, cb) {
    var lowercaseUsername = username.toLowerCase();
    if (admins.indexOf(username) >= 0) {
        cb();
    } else if (admins.indexOf(lowercaseUsername) >= 0) {
        cb();
    } else {
        cb({
            status: 403,
            message: 'User is not an administrator.'
        });
    }
}

function expandGroups(req, acl, cb) {
    // Just send back the original ACL we were given.
    cb(null, acl);
}

function validateClientCertificate(req, cb) {
    if (req.get('xcs-mock-fingerprint')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

function getFingerprint(req) {
    return req.get('xcs-mock-fingerprint');
}

function addUser(username, password, isAdmin) {
    users[username] = password;

    if (isAdmin) {
        admins.push(username);
    }
}

function reset() {
    users = {};
    admins = [];
}

module.exports = {
    authenticate: authenticate,
    isAdministrator: isAdministrator,
    expandGroups: expandGroups,
    validateClientCertificate: validateClientCertificate,
    getFingerprint: getFingerprint,

    reset: reset,
    addUser: addUser
};
