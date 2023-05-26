'use strict';

const logger = require('../../util/logger.js');
const dbcore = require('../dbCoreClass.js');
const xcsutil = require('../../util/xcsutil.js');
const k = require('../../constants.js');

function updateTeam(req, teamID, changes) {
    const log = logger.withRequest(req);
    log.info('Updating team', teamID);

    return dbcore.updateDocumentWithUUID(req, teamID, changes, true, k.design.team.name);
}


function update(req, res) {
    let teamID = req.params.id;
    let changes = xcsutil.patchBodyForClient(req);

    let updatedTeam = updateTeam(req, teamID, changes);
    res.promise(200, updatedTeam);
}

module.exports = {
    updateTeam,

    update
};