'use strict';

const security = require('../../util/xcssecurity.js');
const config = require('config');

module.exports = function makeKeychain(key) {
    return security.openKeychain(config.get(`keychain.${key}`));
};
