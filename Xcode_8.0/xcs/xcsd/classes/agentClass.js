'use strict';

var _ = require('underscore');

var k = require('../constants.js'),
    xcsutil = require('../util/xcsutil.js'),
    logger = require('../util/logger.js');

var dbcore = require('./dbCoreClass.js');

function XCSAgentClass() {}

XCSAgentClass.prototype.list = function list(req, res, next) {
    const log = logger.withRequest(req);

    log.info('Listing all registered builders.');

    return dbcore.listAllDocuments(req, k.XCSDesignDocumentAgent)
        .then(docs => xcsutil.standardizedResponse(res, 200, docs))
        .catch(next);
};

/**
 * Parameters for creating or updating a build agent.
 * @typedef {Object} AgentParams
 * @property {string} name The common name of the build agent's certificate.
 * @property {string} fingerprint The fingerprint of the build agent's certificate
 */


/**
 * Associates an agent name with a certificate fingerprint, and marks the agent
 * as connected.
 *
 * Agents are uniqued by name. If an agent already exists with the name given,
 * we will overwrite the fingerprint, replacing it with the one provided. This
 * is because when Xcode Server is initialized, it will generate a new
 * certificate for the builder. We keep around a list of previous fingerprints
 * for record-keeping purposes: we don't currently use them.
 *
 * A build agent with name "Xcode Server Builder" is special, and will be flagged
 * as the primary build agent. This is the build service that runs on the same
 * machine as the rest of the server.
 *
 * @param {Object?} req The current HTTP request, if any.
 * @param {AgentParams} params Parameters for finding or creating the agent.
 * @returns {Promise} A promise fulfilled once the agent is registered.
 */
XCSAgentClass.prototype.registerAgent = function registerAgent(req, params) {
    const log = logger.withRequest(req);

    params = _.extend({}, params, {name: normalizeAgentName(params.name)});

    log.info('Register agent', params.name);
    log.debug('Registering agent with fingerprint', params.fingerprint);

    return this.findAgentWithName(req, params.name)
        .catch(err => {
            if (err.status !== 404) { throw err; }

            log.info('No existing agent with name', params.name + ', creating.');
            return this.createAgent(req, params);
        })
        .then(agent => {
            if (agent.fingerprint !== params.fingerprint) {
                // Fingerprint has changed. We should update to have the new one,
                // and move the old fingerprint to the old fingerprints list.
                agent.previousFingerprints = agent.previousFingerprints || [];
                agent.previousFingerprints.push(agent.fingerprint);
            }

            _.extend(agent, params);

            agent.connected = true;
            agent.primary = "Xcode Server Builder" === agent.name;

            return this.updateAgent(req, agent);
        });
};

/**
 * Finds the build agent with the given name.
 *
 * @param {Object?} req The current HTTP request, if any.
 * @param {string} name The name of the build agent.
 * @returns {Promise} A promise fulfilled with the document found, or with a
 * NotFound error if no agent with the name exists
 */
XCSAgentClass.prototype.findAgentWithName = function findAgentWithName(req, name) {
    logger.withRequest(req).debug('Fetching build agent with name', name);

    const query = {
        key: name,
        include_docs: true
    };

    return dbcore.findDocumentsWithQuery(req, k.XCSDesignDocumentAgent, k.XCSDesignDocumentViewAgentsByName, query).get(0);
};

/**
 * Creates a new agent with a name and fingerprint.
 *
 * @param {Object?} req The current HTTP request, if any.
 * @param {AgentParams} params Parameters for creating the agent.
 * @returns {Promise} A promise for the created agent document.
 */
XCSAgentClass.prototype.createAgent = function createAgent(req, params) {
    logger.withRequest(req).debug('Creating agent', params.name);
    return dbcore.createDocument(req, k.XCSDesignDocumentAgent, params).get(1);
};

/**
 * Updates an agent with new parameters.
 *
 * @param {Object?} req The current HTTP request, if any.
 * @param {AgentParams} agent The full contents of the agent document to save.
 * @returns {Promise} A promise fulfilled with the updated agent document.
 */
XCSAgentClass.prototype.updateAgent = function updateAgent(req, agent) {
    logger.withRequest(req).debug('Updating agent', agent.name);
    return dbcore.updateDocumentWithUUID(req, agent._id, agent, false, k.XCSDesignDocumentAgent);
};

/**
 * Updates whether the agent with the given name is connected or not.
 *
 * @param {Object?} req The current HTTP request, if any.
 * @param {string} name The name of the agent to update.
 * @param {boolean} connected True if the agent is connected.
 * @returns {Promise} A promise fulfilled with the updated agent document.
 */
XCSAgentClass.prototype.setAgentConnected = function setAgentConnected(req, name, connected) {
    name = normalizeAgentName(name);

    logger.withRequest(req).info('Marking agent', name, 'as', connected ? 'connected' : 'disconnected');
    return this.findAgentWithName(req, name)
        .then(agent => {
            agent.connected = connected;
            return this.updateAgent(req, agent);
        });
};

/**
 * Marks all agents as disconnected.
 *
 * Intended for use at server startup, in case there are agents that were left
 * connected. This can happen on system reboot, for instance.
 *
 * @param {Object?} req The current HTTP request, if any.
 */
XCSAgentClass.prototype.disconnectAll = function(req) {
    logger.withRequest(req).debug('Disconnecting all connected build agents.');

    const query = {include_docs: true};

    return dbcore.findDocumentsWithQuery(req, k.XCSDesignDocumentAgent, k.XCSDesignDocumentViewConnectedAgents, query)
        .catch(err => {
            if (err.status !== 404) { throw err; }
            return [];
        })
        .each(agent => {
            agent.connected = false;
            return this.updateAgent(req, agent);
        });
};

XCSAgentClass.prototype.findAgentWithFingerprint = function findAgentWithFingerprint(req, fingerprint) {
    logger.withRequest(req).debug('Fetching build agent with fingerprint', fingerprint);

    const query = {
        key: fingerprint,
        include_docs: true
	  };

    return dbcore.findDocumentsWithQuery(req, k.XCSDesignDocumentAgent, k.XCSDesignDocumentViewAgentsByFingerprint, query).get(0);
};

XCSAgentClass.prototype.shouldReceiveIntegration = function shouldReceiveIntegration(req, fingerprint, integration, cb) {
    var log = logger.withRequest(req);

    log.debug('Checking if bot', integration.bot.name, 'should be built by build agent with fingerprint', fingerprint);

    this.findAgentWithFingerprint(req, fingerprint)
        .then(agent => {
            var botName = integration.bot.name;

            // without any filters, always send the integration
            if (!agent.whitelist && !agent.blacklist) {
                log.debug('Build agent', fingerprint, 'has no filters, allowing integration.');
                return true;
            }

            if (agent.whitelist && agent.whitelist.indexOf(botName) !== -1) {
                log.debug('Bot', botName, 'is in the whitelist of', fingerprint + ', allowing integration.');
                return true;
            } else if (agent.blacklist) {
                var allowed = agent.blacklist.indexOf(botName) === -1;
                if (allowed) {
                    log.debug('Bot', botName, 'is not on blacklist of', fingerprint + ', allowing integration.');
                } else {
                    log.debug('Bot', botName, 'is on blacklist of', fingerprint + ', denying integration.');
                }
                return allowed;
            } else {
                log.debug('Bot', botName, 'is not on whitelist of', fingerprint + ', denying integration.');
                return false;
            }
        })
        .catch(err => {
            if (err.status === 404) {
                return true;
            }
            throw err;
        })
        .asCallback(cb);
};

module.exports = xcsutil.bindAll(new XCSAgentClass());

function normalizeAgentName(name) {
    return name.replace(/ \(.*\)$/, '');
}
