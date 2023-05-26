'use strict';

const Promise = require('bluebird');
const config = require('config');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const logger = require('../../util/logger.js');
const dbcore = require('../dbCoreClass.js');
const k = require('../../constants.js');
const Errors = require('../../util/error.js');
const te = require('../../util/turboevents.js');
const profiles = require('../../util/xcsbridge.js').profiles;
const provisioningKeychain = require('../keychain/provisioning.js');

const findTeam = require('./find.js');

const importPassword = 'xcs-portal-import';

/**
 * Joins the server to a new ADC team.
 * 
 * Joining a team adds the record to the DB, but a separate request is needed to upload
 * the authentication credentials for the team.
 * 
 * @param {?Object} req The current HTTP request, if any.
 * @param {?Object} team The team to join.
 * @return {Promise} A promise resolving to the created team record.
 */
function joinTeam(req, team) {
    const log = logger.withRequest(req);
    log.info('Joining team', team.name, `(${team.teamID})`);

    return findTeam.findByTeamID(req, team.teamID)
        .then(() => {
            throw new Errors.BadRequest(`The server is already a member of the ${team.name} team.`);
        }, () => {
            return dbcore.createDocument(req, k.design.team.name, team);
        });
}

/**
 * Imports a P12 file containing a team's identity into the keychain.
 * 
 * The P12 should be encrypted with the passphrase "xcs-portal-import".
 * The team record will be updated with information about the status of the certificate.
 * 
 * @param {?Object} req The current HTTP request, if any.
 * @param {string} teamID The "_id" of the team corresponding to these credentials.
 * @param {string} identityFilename The path to the P12 file on disk containing the credentials.
 * @return {Promise} A promise resolving when the identity is imported.
 */
function importIdentity(req, teamID, identityFilename) {
    const log = logger.withRequest(req);
    log.info('Importing authentication identity for team', teamID);
    log.debug('Importing from file', identityFilename);

    return findTeam.findByTeamID(req, teamID)
        .then(team => {
            return provisioningKeychain.addIdentity(identityFilename, importPassword)
                .then(certificate => {
                    // assume the team is in a valid state if we are giving it a certificate
                    let changes = { certificate, status: 'valid' };
                    return dbcore.updateDocumentWithUUID(req, team._id, changes, true, k.design.team.name);
                });
        })
        .tap(team => {
            te.broadcast(k.XCSIsBuildService, k.XCSEmitNotificationTeamIdentityUpdated, {
                _id: team._id,
                name: team.name
            });
        });
}

function importSigningIdentity(req, identityFilename) {
    const log = logger.withRequest(req);
    log.info('Importing signing certificate');

    return provisioningKeychain.addIdentity(identityFilename, importPassword)
        .then(identity => {
            identity.createdAt = new Date().toISOString();
            return dbcore.createDocument(req, k.design.identity.name, identity);
        })
        .tap(results => {
            let identity = results[1];
            te.broadcast(k.XCSIsBuildService, k.XCSEmitNotificationSigningIdentityCreated, {
                _id: identity._id,
                commonName: identity.commonName
            });
        });
}

const profilesPath = config.get('path.provisioningProfiles');

function importProvisioningProfile(req, profileFilename) {
    const log = logger.withRequest(req);
    log.info('Importing provisioning profile');

    return profiles.getProfileInfo(profileFilename)
        .tap(profileInfo => {
            profileInfo.createdAt = new Date().toISOString();
            profileInfo.filename = `${profileInfo.identifier}.mobileprovision`;
            let newPath = path.join(profilesPath, profileInfo.filename);
            fs.renameAsync(profileFilename, newPath);
        })
        .then(profile => dbcore.createDocument(req, k.design.profile.name, profile))
        .tap(results => {
            let profile = results[1];
            te.broadcast(k.XCSIsBuildService, k.XCSEmitNotificationProvisioningProfileCreated, {
                _id: profile._id,
                filename: profile.filename
            });
        });
}


function join(req, res) {
    let team = req.body;
    let joinedTeam = joinTeam(req, team)
        .spread((location, team) => {
            res.location(location);
            return team;
        });

    res.promise(201, joinedTeam);
}

// import is a reserved word?
function upload(req, res, next) {
    let file = req.file;
    let teamID = req.params.id;

    if (!file) {
        next(new Errors.BadRequest('A P12 file upload is required.'));
        return;
    }

    let importedIdentity = importIdentity(req, teamID, file.path);
    res.promise(200, importedIdentity);
}

function addIdentity(req, res, next) {
    let file = req.file;

    if (!file) {
        next(new Errors.BadRequest('A P12 file upload is required.'));
        return;
    }

    let importedIdentity = importSigningIdentity(req, file.path)
        .spread((location, identity) => {
            res.location(location);
            return identity;
        });

    res.promise(200, importedIdentity);
}

function addProfile(req, res, next) {
    let file = req.file;

    if (!file) {
        next(new Errors.BadRequest('A provisioning profile file upload is required.'));
        return;
    }

    let importedProfile = importProvisioningProfile(req, file.path)
        .spread((location, profile) => {
            res.location(location);
            return profile;
        });

    res.promise(200, importedProfile);
}

module.exports = {
    joinTeam,
    importIdentity,
    importSigningIdentity,
    importProvisioningProfile,

    // routes
    join,
    upload,
    addIdentity,
    addProfile
};
