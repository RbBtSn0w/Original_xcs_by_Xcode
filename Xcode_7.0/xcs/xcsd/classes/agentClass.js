'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
	xcsutil = require('../util/xcsutil.js'),
	konsole = require('../util/konsole.js');
	
var dbcore = require('./dbCoreClass.js');
	
function XCSAgentClass() {}

XCSAgentClass.prototype.findAgentWithFingerprint = function findAgentWithFingerprint(req, fingerprint, cb) {
	xcsutil.logLevelInc(req);
	
	konsole.log(req, '[Agent - findAgentWithFingerprint] fingerprint: ' + fingerprint);
	
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
    xcsutil.logLevelInc(req);
    
    konsole.log(req, '[Agent - createAgentWithFingerprint] fingerprint: ' + fingerprint);
    
    var document = {
        fingerprint: fingerprint
    };
    
    dbcore.createDocument(req, 'agent', document, cb);
};

XCSAgentClass.prototype.findOrCreateAgentWithFingerprint = function findOrCreateAgentWithFingerprint(req, fingerprint, cb) {
    xcsutil.logLevelInc(req);
    
    konsole.log(req, '[Agent - findOrCreateAgentWithFingerprint] fingerprint: ' + fingerprint);
    
    var self = this;
    
    self.findAgentWithFingerprint(req, fingerprint, function (err, agent) {
        if (err) {
            if (err.status === 404) {
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
    xcsutil.logLevelInc(req);
    
    konsole.log(req, '[Agent - shouldReceiveIntegration] fingerprint: ' + fingerprint + ', bot: ' + integration.bot.name);
    
    var self = this;
    
    self.findOrCreateAgentWithFingerprint(req, fingerprint, function (err, agent) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            
            var botName = integration.bot.name;
            
            // without any filters, always send the integration
            if (!agent.whitelist && !agent.blacklist) {
                return xcsutil.safeCallback(cb, null, true);
            }
            
            if (agent.whitelist && agent.whitelist.indexOf(botName) !== -1) {
                return xcsutil.safeCallback(cb, null, true);
            } else if (agent.blacklist) {
                return xcsutil.safeCallback(cb, null, agent.blacklist.indexOf(botName) === -1);
            } else {
                return xcsutil.safeCallback(cb, null, false);
            }
        }
    });
};

module.exports = new XCSAgentClass();