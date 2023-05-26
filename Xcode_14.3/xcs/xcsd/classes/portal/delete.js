'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const logger = require('../../util/logger.js');
const dbcore = require('../dbCoreClass.js');
const k = require('../../constants.js');
const te = require('../../util/turboevents.js');

const find = require('./find.js');
const profiles = require('./file.js');
const provisioningKeychain = require('../keychain/provisioning.js');

function removeTeam(req, teamID) {
    const log = logger.withRequest(req);
    log.info('Removing team', teamID);

    return find.findByTeamID(req, teamID)
        .tap(team => {
            if (team.certificate) {
                log.debug('Removing identity', team.certificate.commonName, 'from provisioning keychain.');
                return provisioningKeychain.removeIdentity(team.certificate.commonName, null);
            } else {
                log.debug('No identity stored for team', teamID);
            }
        })
        .tap(team => dbcore.removeDocument(req, team._id, null))
        .then(team => {
            te.broadcast(k.XCSIsBuildService, k.XCSEmitNotificationTeamRemoved, {
                _id: team._id,
                teamID: team.teamID,
                certificate: team.certificate
            });
        });
}

function removeSigningIdentity(req, identityID) {
    const log = logger.withRequest(req);
    log.info('Removing signing identity', identityID);

    return find.findSigningIdentityByID(req, identityID)
        .tap(identity => {
            log.debug('Removing identity', identity.commonName, 'from provisioning keychain.');
            return provisioningKeychain.removeIdentity(identity.commonName, null);
        })
        .tap(identity => dbcore.removeDocument(req, identity._id, null))
        .then(identity => {
            te.broadcast(k.XCSIsBuildService, k.XCSEmitNotificationSigningIdentityRemoved, {
                _id: identity._id
            });
        });
}

function removeProvisioningProfile(req, profileID) {
    const log = logger.withRequest(req);
    log.info('Removing provisioning profile', profileID);

    return find.findProvisioningProfileByID(req, profileID)
        .tap(profile => {
            log.debug('Removing profile', profile.filename, 'from disk');
            let path = profiles.profilePath(profile.filename);
            return fs.unlinkAsync(path);
        })
        .tap(profile => dbcore.removeDocument(req, profile._id, null))
        .then(profile => {
            te.broadcast(k.XCSIsBuildService, k.XCSEmitNotificationProvisioningProfileRemoved, {
                _id: profile._id
            });
        });
}


function remove(req, res) {
    let teamID = req.params.id;
    let teamRemoved = removeTeam(req, teamID);

    res.promise(204, teamRemoved);
}

function removeIdentity(req, res) {
    let identityID = req.params.id;
    let identityRemoved = removeSigningIdentity(req, identityID);

    res.promise(204, identityRemoved);
}

function removeProfile(req, res) {
    let profileID = req.params.id;
    let profileRemoved = removeProvisioningProfile(req, profileID);

    res.promise(204, profileRemoved);
}

module.exports = {
    removeTeam,
    removeSigningIdentity,
    removeProvisioningProfile,

    remove,
    removeIdentity,
    removeProfile
};