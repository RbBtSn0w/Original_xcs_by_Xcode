'use strict';

const xcsutil = require('../../util/xcsutil.js');
const logger = require('../../util/logger.js');
const dbcore = require('../dbCoreClass.js');
const k = require('../../constants.js');
const Errors = require('../../util/error.js');
const provisioningKeychain = require('../keychain/provisioning.js');

const profilePath = require('./file.js').profilePath;

const exportPassword = 'xcs-portal-export';

function listTeams(req) {
    const log = logger.withRequest(req);
    log.info('Listing all joined teams.');

    return dbcore.listAllDocuments(req, k.design.team.name)
        .catch(Errors.NotFound, () => []);
}

function findByTeamID(req, teamID) {
    const log = logger.withRequest(req);
    log.info('Finding team', teamID);

    const query = {
        key: teamID,
        include_docs: true
    };

    return dbcore.findDocumentsWithQuery(req, k.design.team.name, k.design.team.byTeamID, query).get(0);
}

function findIdentityByTeamID(req, teamID) {
    const log = logger.withRequest(req);
    log.info('Finding identity for team', teamID);

    return findByTeamID(req, teamID)
        .then(team => {
            if (!team.certificate) {
                throw new Errors.NotFound(`Team ${team.teamID} does not have an identity uploaded yet.`);
            }

            return provisioningKeychain.findIdentityAsync(team.certificate.commonName, null, exportPassword);
        });
}

function listSigningIdentities(req) {
    const log = logger.withRequest(req);
    log.info('Listing all uploaded signing identities');

    return dbcore.listAllDocuments(req, k.design.identity.name)
        .catch(Errors.NotFound, () => []);
}

function findSigningIdentityByID(req, identityID) {
    const log = logger.withRequest(req);
    log.info('Finding signing identity', identityID);

    return dbcore.findDocumentWithUUID(req, identityID, k.design.identity.name);
}

function exportSigningIdentityByID(req, identityID) {
    return findSigningIdentityByID(req, identityID)
        .then(identity => provisioningKeychain.findIdentityAsync(identity.commonName, null, exportPassword));
}

function listProvisioningProfiles(req) {
    const log = logger.withRequest(req);
    log.info('Listing all uploaded provisioning profiles');

    return dbcore.listAllDocuments(req, k.design.profile.name)
        .catch(Errors.NotFound, () => []);
}

function findProvisioningProfileByID(req, profileID) {
    const log = logger.withRequest(req);
    log.info('Finding provisioning profile', profileID);

    return dbcore.findDocumentWithUUID(req, profileID, k.design.profile.name);
}


function list(req, res) {
    let allTeams = listTeams(req);
    res.promise(200, allTeams);
}

function listIdentities(req, res) {
    let allIdentities = listSigningIdentities(req);
    res.promise(200, allIdentities);
}

function listProfiles(req, res) {
    let allProfiles = listProvisioningProfiles(req);
    res.promise(200, allProfiles);
}

function find(req, res) {
    let teamID = req.params.id;
    let team = findByTeamID(req, teamID);
    res.promise(200, team);
}

function downloadTeamIdentity(req, res) {
    let teamID = req.params.id;

    findIdentityByTeamID(req, teamID)
        .then(buffer => {
            // Since we're bypassing the standard xcsd response mechanism, clear the timeout watcher
            xcsutil.clearRequestWatcherTimeout(res);
            // clear the existing content type so it gets set automatically by res.send()
            res.setHeader('Content-type', null);
            res.send(buffer);
        }, err => {
            xcsutil.standardizedErrorResponse(res, err);
        });
}

function findIdentity(req, res) {
    let identityID = req.params.id;
    let identity = findSigningIdentityByID(req, identityID);
    res.promise(200, identity);
}

function downloadIdentity(req, res) {
    let identityID = req.params.id;

    exportSigningIdentityByID(req, identityID)
        .then(buffer => {
            // Since we're bypassing the standard xcsd response mechanism, clear the timeout watcher
            xcsutil.clearRequestWatcherTimeout(res);
            // clear the existing content type so it gets set automatically by res.send()
            res.setHeader('Content-type', null);
            res.send(buffer);
        }, err => {
            xcsutil.standardizedErrorResponse(res, err);
        });
}

function findProfile(req, res) {
    let profileID = req.params.id;
    let profile = findProvisioningProfileByID(req, profileID);
    res.promise(200, profile);
}

function downloadProfile(req, res) {
    let profileID = req.params.id;

    findProvisioningProfileByID(req, profileID)
        .then(profile => {
            let filePath = profilePath(profile.filename);
            // Since we're bypassing the standard xcsd response mechanism, clear the timeout watcher
            xcsutil.clearRequestWatcherTimeout(res);
            // clear the existing content type so it gets set automatically by res.sendFile()
            res.setHeader('Content-type', null);
            res.sendFile(filePath);
        }, err => {
            xcsutil.standardizedErrorResponse(res, err);
        });
}

module.exports = {
    listTeams,
    findByTeamID,
    listSigningIdentities,
    findSigningIdentityByID,
    listProvisioningProfiles,
    findProvisioningProfileByID,

    list,
    listIdentities,
    listProfiles,
    find,
    downloadTeamIdentity,
    findIdentity,
    downloadIdentity,
    findProfile,
    downloadProfile
};