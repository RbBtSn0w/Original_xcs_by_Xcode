'use strict';

// const Promise = require('bluebird');
const k = require('../constants.js');
const logger = require('../util/logger.js');
const agent = require('./agentClass.js');
const dbcore = require('./dbCoreClass.js');
const Errors = require('../util/error.js');

function createXcode(req, xcode) {
    const log = logger.withRequest(req);

    log.info('Creating Xcode', xcode.version, `(${xcode.buildNumber})`);

    return agent.getCurrentAgent(req)
        .then(agent => {
            xcode.agentID = agent._id;
            return dbcore.createDocument(req, k.design.xcode.name, xcode);
        });
}

function updateXcode(req, xcodeID, changes) {
    const log = logger.withRequest(req);

    log.info('Updating Xcode', xcodeID);

    return dbcore.updateDocumentWithUUID(req, xcodeID, changes, true, k.design.xcode.name);
}

function removeXcode(req, xcodeID) {
    const log = logger.withRequest(req);

    log.info('Removing Xcode', xcodeID);

    return dbcore.removeDocument(req, xcodeID);
}

function listXcodes(req) {
    const log = logger.withRequest(req);

    log.info('Listing all registered Xcodes.');

    return dbcore.listAllDocuments(req, 'xcode')
        .catch(Errors.NotFound, () => []);
}

function listXcodesForAgent(req, agentID) {
    const log = logger.withRequest(req);

    log.info('Fetching all Xcodes for agent', agentID);

    let query = {
        startkey: [agentID],
        endkey: [agentID, {}],
        include_docs: true
    };

    return dbcore.findDocumentsWithQuery(req, k.design.xcode.name, k.design.xcode.byAgent, query)
        .catch(Errors.NotFound, () => []);
}

function listXcodesForCurrentAgent(req) {
    return agent.getCurrentAgent(req)
        .then(agent => listXcodesForAgent(req, agent._id));
}

function getPrimaryXcode(req, agentID) {
    const log = logger.withRequest(req);

    log.info('Fetching primary Xcode for builder:', agentID);

    let query = {
        key: [agentID, 0],
        include_docs: true
    };

    return dbcore.findDocumentsWithQuery(req, k.design.xcode.name, k.design.xcode.byAgent, query).get(0);
}

function findXcodeWithID(req, id) {
    const log = logger.withRequest(req);
    log.debug('Finding Xcode with ID', id);
    return dbcore.findDocumentWithUUID(req, id, k.design.xcode.name);
}

// Routes

function create(req, res) {
    let xcode = req.body;
    let createdXcode = createXcode(req, xcode)
        .spread((location, xcode) => {
            res.location(location);
            return xcode;
        });

    res.promise(201, createdXcode);
}

function update(req, res) {
    let xcode = req.body,
        xcodeID = req.params.id;

    let updatedXcode = updateXcode(req, xcodeID, xcode);
    res.promise(200, updatedXcode);
}

function remove(req, res) {
    let xcodeID = req.params.id;

    let removedXcode = removeXcode(req, xcodeID);
    res.promise(204, removedXcode);
}

function list(req, res) {
    let xcodes = req.query.currentAgent === 'true' ?
        listXcodesForCurrentAgent(req) :
        listXcodes(req);

    res.promise(200, xcodes);
}

module.exports = {
    // Methods
    createXcode,
    getPrimaryXcode,
    findXcodeWithID,

    // Routes
    create,
    update,
    remove,
    list
};
