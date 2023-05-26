'use strict';

const config = require('config');
const path = require('path');

const profilesPath = config.get('path.provisioningProfiles');

function profilePath(filename) {
    return path.join(profilesPath, path.basename(filename));
}

module.exports = {
    profilePath
};