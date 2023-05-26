'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    auth = require('./auth.js'),
    te = require('../util/turboevents.js'),
    shared_doc = require('./shared_doc.js'),
    xcsutil = require('../util/xcsutil.js'),
    redis = require('../classes/redisClass.js');

var acl = {},
    aclList = {
        canCreateBots: k.XCSCanCreateBots,
        canViewBots: k.XCSCanViewBots,
        canCreateHostedRepositories: k.XCSCanCreateHostedRepositories
    },
    unavailableNodesTimeout = null;

function getACLKey(req) {
    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);
    var aclKey = k.XCSDesignDocumentACL;
    if (unitTestUUID) {
        aclKey = k.XCSDesignDocumentACL + ':' + unitTestUUID;
    }
    return aclKey;
}

function getExpandedACLKey(req) {
    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        aclKeyExpanded;

    if (unitTestUUID) {
        aclKeyExpanded = k.XCSDesignDocumentACL + ':' + unitTestUUID + ':expanded';
    } else {
        aclKeyExpanded = k.XCSDesignDocumentACL + ':expanded';
    }

    return aclKeyExpanded;
}

function aclDefaults() {
    var defaultContents = {};

    defaultContents[aclList.canCreateBots] = [k.XCSAccessAuthenticated];
    defaultContents[aclList.canViewBots] = [k.XCSAccessAnyone];
    defaultContents[aclList.canCreateHostedRepositories] = [k.XCSAccessAuthenticated];

    return defaultContents;
}

acl.findOrCreateDefaultACLDocument = function (req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[ACL - findOrCreateDefaultACLDocument] findOrCreateDefaultACLDocument...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var aclKey = getACLKey(req),
        defaults = aclDefaults();

    shared_doc.findOrCreateDefaultSharedDocument(req, aclKey, k.XCSDesignDocumentACL, defaults, function (err, doc) {
        xcsutil.logLevelDec(req);
        if (err) {
            return cb(err);
        } else {
            te.broadcast(k.XCSIsListenerForACLUpdates, k.XCSEmitNotificationACLUpdated, null);
            return cb(null, doc);
        }
    });

};

/**
 * Read
 */

acl.findACL = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[ACL - findACL] ' + req.method + ' ' + req.url + '...',
        self = acl;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    self.findOrCreateDefaultACLDocument(req, function (err, doc) {

        xcsutil.logLevelDec(req);
        xcsutil.profilerSummary(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, doc);
        }
    });

};

acl.findAndExpandACLDocument = function (req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[ACL - findAndExpandACLDocument] findAndExpandACLDocument...';

    konsole.log(req, functionTitle);

    var self = acl,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);


    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var aclKeyExpanded = getExpandedACLKey(req);

    redis.get(req, aclKeyExpanded, function (err, reply) {
        if (err || !reply) {

            // The expanded ACL was not found in Redis: retrieve the ACL and expand it

            self.findOrCreateDefaultACLDocument(req, function (err, acl) {
                if (err) {
                    xcsutil.logLevelDec(req);
                    return cb(err);
                } else {
                    konsole.log(req, '[ACL - findAndExpandACLDocument] expanding ACL...');
                    auth.expandGroups(req, acl, function (err, expandedACL, unavailableNodes) {
                        if (!unavailableNodes) {
                            unavailableNodes = [];
                        }
                        if (unavailableNodes.length > 0 && unavailableNodesTimeout === null) {
                            konsole.log(req, '[ACL - findAndExpandACLDocument] WARNING: Some nodes (' + unavailableNodes.join(', ') + ') were unavailable, scheduling retry in 15 seconds');
                            unavailableNodesTimeout = setTimeout(function () {
                                unavailableNodesTimeout = null;
                                self.findAndExpandACLDocument(req, function () {});
                            }, k.XCSACLUnavailableNodesRefreshTimeout);
                        }

                        if (err) {
                            xcsutil.logLevelDec(req);
                            return cb(err);
                        } else {
                            konsole.log(req, '[ACL - findAndExpandACLDocument] ACL expanded successfully.');
                            konsole.log(req, '[ACL - findAndExpandACLDocument] expanded ACL cached in Redis: ' + aclKeyExpanded);

                            // Set eviction policy for the ACL
                            var redisClient = redis.client();

                            if (redisClient) {
                                var value = JSON.stringify(expandedACL);

                                if (unitTestUUID) {
                                    redisClient.setex(aclKeyExpanded, k.XCSUnitTestTTLInSeconds, value);
                                } else {
                                    redisClient.setex(aclKeyExpanded, k.XCSACLExpandedGroupsTTLInSeconds, value);
                                }
                            }
                            xcsutil.logLevelDec(req);
                            return cb(null, expandedACL);
                        }
                    });
                }
            });
        } else {
            konsole.log(req, '[ACL - findAndExpandACLDocument] Expanded ACL found in Redis: ' + aclKeyExpanded);
            xcsutil.logLevelDec(req);
            return cb(null, JSON.parse(reply));
        }
    });

};

acl.findAndExpandACL = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[ACL - findAndExpandACL] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    var self = acl;

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    self.findAndExpandACLDocument(req, function (err, expandedACL) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err || !expandedACL) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, expandedACL);
        }
    });

};

acl.list = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[ACL - list] ' + req.method + ' ' + req.url + '...',
        query = {
            key: k.XCSDesignDocumentACL,
            include_docs: true
        };

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    shared_doc.list(req, k.XCSDesignDocumentACL, k.XCSDesignDocumentViewAllACLs, query, function (err, docs) {
        // Not finding documents doesn't mean it's an error. Let's report true errors instead.
        if (err && err.status !== 404) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedResponse(res, 200, docs);
        }
    });

};

/**
 * Update
 */

acl.update = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[ACL - update] ' + req.method + ' ' + req.url + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        aclKey = getACLKey(req),
        defaults = aclDefaults();

    shared_doc.update(req, aclKey, k.XCSDesignDocumentACL, defaults, function (err, updated_doc) {
        if (err) {
            konsole.error(req, '[ACL - update] error: ' + err.message);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            var aclKeyExpanded = getExpandedACLKey(req);

            // Remove the expanded version
            if (unitTestUUID) {
                konsole.log(req, '[ACL - update] removed expanded unit test ACL document from Redis: ' + aclKeyExpanded);
            } else {
                konsole.log(req, '[ACL - update] removed expanded document from Redis: ' + aclKeyExpanded);
            }
            redis.del(req, aclKeyExpanded);

            auth.loadAndCacheACLDocumentWithUUID(req, function (err) {

                te.broadcast(k.XCSIsListenerForACLUpdates, k.XCSEmitNotificationACLUpdated, null);

                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);

                if (err) {
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    return xcsutil.standardizedResponse(res, 200, updated_doc);
                }
            });
        }
    });

};

module.exports = acl;