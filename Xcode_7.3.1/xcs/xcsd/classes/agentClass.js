'use strict';

var k = require('../constants.js'),
	xcsutil = require('../util/xcsutil.js'),
	logger = require('../util/logger.js');

var dbcore = require('./dbCoreClass.js');

function XCSAgentClass() {}

XCSAgentClass.prototype.findAgentWithFingerprint = function findAgentWithFingerprint(req, fingerprint, cb) {
	logger.withRequest(req).debug('Fetching build agent with fingerprint', fingerprint);

	var query = {
		key: fingerprint,
		include_docs: true
	};

	dbcore.findDocumentsWithQuery(req, k.XCSDesignDocumentAgent, k.XCSDesignDocumentViewAgentsByFingerprint, query, function (err, docs) {
		if (err) {
			return xcsutil.safeCallback(cb, err);
		} else {
			return xcsutil.safeCallback(cb, null, docs[0]);
		}
	});
};

XCSAgentClass.prototype.createAgentWithFingerprint = function createAgentWithFingerprint(req, fingerprint, cb) {
	logger.withRequest(req).debug('Creating build agent with fingerprint', fingerprint);

    var document = {
        fingerprint: fingerprint
    };

    dbcore.createDocument(req, 'agent', document, cb);
};

XCSAgentClass.prototype.findOrCreateAgentWithFingerprint = function findOrCreateAgentWithFingerprint(req, fingerprint, cb) {
	var log = logger.withRequest(req);

	log.debug('Finding or creating build agent with fingerprint', fingerprint);

    var self = this;

    self.findAgentWithFingerprint(req, fingerprint, function (err, agent) {
        if (err) {
            if (err.status === 404) {
				log.debug('Could not find existing build agent with fingerprint', fingerprint + ', creating one.');
                self.createAgentWithFingerprint(req, fingerprint, cb);
            } else {
                return xcsutil.safeCallback(cb, err);
            }
        } else {
            return xcsutil.safeCallback(cb, null, agent);
        }
    });
};

XCSAgentClass.prototype.shouldReceiveIntegration = function shouldReceiveIntegration(req, fingerprint, integration, cb) {
	var log = logger.withRequest(req);

	log.debug('Checking if bot', integration.bot.name, 'should be built by build agent with fingerprint', fingerprint);

    var self = this;

    self.findOrCreateAgentWithFingerprint(req, fingerprint, function (err, agent) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {

            var botName = integration.bot.name;

            // without any filters, always send the integration
            if (!agent.whitelist && !agent.blacklist) {
				log.debug('Build agent', fingerprint, 'has no filters, allowing integration.');
                return xcsutil.safeCallback(cb, null, true);
            }

            if (agent.whitelist && agent.whitelist.indexOf(botName) !== -1) {
				log.debug('Bot', botName, 'is in the whitelist of', fingerprint + ', allowing integration.');
                return xcsutil.safeCallback(cb, null, true);
            } else if (agent.blacklist) {
				var allowed = agent.blacklist.indexOf(botName) === -1;
				if (allowed) {
					log.debug('Bot', botName, 'is not on blacklist of', fingerprint + ', allowing integration.');
				} else {
					log.debug('Bot', botName, 'is on blacklist of', fingerprint + ', denying integration.');
				}
                return xcsutil.safeCallback(cb, null, allowed);
            } else {
				log.debug('Bot', botName, 'is not on whitelist of', fingerprint + ', denying integration.');
                return xcsutil.safeCallback(cb, null, false);
            }
        }
    });
};

module.exports = xcsutil.bindAll(new XCSAgentClass());
