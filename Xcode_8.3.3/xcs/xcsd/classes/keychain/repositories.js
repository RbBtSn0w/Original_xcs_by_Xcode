'use strict';

const security = require('../../util/xcssecurity.js');
const config = require('config');

module.exports = security.openKeychain(config.get('keychain.repositories'));
