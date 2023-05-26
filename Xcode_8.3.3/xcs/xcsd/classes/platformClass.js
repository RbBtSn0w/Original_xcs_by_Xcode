'use strict';

var k = require('../constants.js'),
    Errors = require('../util/error.js'),
    dbCore = require('./dbCoreClass.js'),
    agent = require('./agentClass.js'),
    xcode = require('./xcode.js'),
    xcsutil = require('../util/xcsutil.js'),
    logger = require('../util/logger.js'),
    te = require('../util/turboevents.js');

function listPlatforms(req, cb) { // Called from non-Promise code
    const log = logger.withRequest(req);
    log.info('Loading platforms for primary Xcode.');

    return agent.getPrimaryAgent(req)
        .then(agent => xcode.getPrimaryXcode(req, agent._id))
        .then(xcode => listPlatformsByXcode(req, xcode._id))
        .catch(Errors.NotFound, () => [])
        .asCallback(cb);
}

function listPlatformsByXcode(req, xcodeID) {
    const log = logger.withRequest(req);
    log.info('Finding platforms for Xcode:', xcodeID);

    let query = {
        startkey: [xcodeID],
        endkey: [xcodeID, {}],
        include_docs: true
    };

    return dbCore.findDocumentsWithQuery(req, k.design.platform.name, k.design.platform.byXcode, query)
        .catch(Errors.NotFound, () => []);
}

function findPlatformByIdentifier(req, xcodeID, identifier) {
    const log = logger.withRequest(req);
    log.info('Finding platform', identifier, 'for Xcode:', xcodeID);

    let query = {
        key: [xcodeID, identifier],
        include_docs: true
    };

    return dbCore.findDocumentsWithQuery(req, k.design.platform.name, k.design.platform.byXcode, query)
        .get(0);
}

function savePlatform(req, platform) {
    const log = logger.withRequest(req);
    log.info('Saving platform', platform.identifier, 'for Xcode:', platform.xcodeID);

    return findPlatformByIdentifier(req, platform.xcodeID, platform.identifier)
        .then(existingPlatform => updatePlatform(req, existingPlatform, platform), err => {
            if (err instanceof Errors.NotFound) {
                // No existing platform. Create a new one.
                return createPlatform(req, platform);
            } else {
                throw err;
            }
        })
        .tap(results => {
            te.broadcast(k.XCSIsListenerForDeviceUpdates, k.XCSEmitNotificationPlatformUpdated, results[1]);
        });
}

function updatePlatform(req, existingPlatform, changes) {
    const log = logger.withRequest(req);
    log.debug('Updating platform', existingPlatform.identifier, 'for Xcode:', existingPlatform.xcodeID);

    delete existingPlatform._rev;
    existingPlatform = xcsutil.patchDocumentWithObject(existingPlatform, changes);

    return dbCore.updateDocumentWithUUID(req, existingPlatform._id, existingPlatform, false, k.design.platform.name)
        .then(updatedPlatform => {
            // mimic creating new document
            return ['https://' + req.headers.host + '/platforms/' + updatedPlatform._id, updatedPlatform];
        });
}

function createPlatform(req, platform) {
    const log = logger.withRequest(req);
    log.debug('Creating new platform', platform.identifier, 'for Xcode:', platform.xcodeID);

    return xcode.findXcodeWithID(req, platform.xcodeID)
        .then(xcode => {
            platform.agentID = xcode.agentID;
            return dbCore.createDocument(req, k.design.platform.name, platform);
        });
}

// Routes

function list(req, res) {
    res.promise(200, listPlatforms(req));
}

function listByXcode(req, res) {
    let xcodeID = req.params.id;

    let platforms = listPlatformsByXcode(req, xcodeID);
    res.promise(200, platforms);
}

function save(req, res) {
    let platform = req.body;
    platform.xcodeID = req.params.id;

    let savedPlatform = savePlatform(req, platform)
        .spread((url, platform) => {
            res.location(url);
            return platform;
        });

    res.promise(201, savedPlatform);
}

module.exports = {
    // Routes
    list,
    listByXcode,
    save,

    // Methods
    listPlatforms
};
