/*
    XCSDACLClass
    A class dedicated to manipulate the ACL document.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var async = require('async');

var k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    te = require('../util/turboevents.js'),
    sharedDocClass = require('./sharedDocClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('./redisClass.js'),
    xcssecurity = require('../util/xcssecurity');

/* XCSDACLClass object */

function XCSDACLClass() {}

XCSDACLClass.prototype.getExpandedACLKey = function XCSDACLClassGetExpandedACLKey(req) {
    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        aclKeyExpanded;

    if (unitTestUUID) {
        aclKeyExpanded = k.XCSDesignDocumentACL + ':' + unitTestUUID + ':expanded';
    } else {
        aclKeyExpanded = k.XCSDesignDocumentACL + ':expanded';
    }

    return aclKeyExpanded;
};

XCSDACLClass.prototype.getODIsBusyError = function XCSDACLClassGetODIsBusyError(aclKey) {
    return {
        status: 531,
        message: 'ACL expansion not yet completed: expansion not yet completed for key \'' + aclKey + '\''
    };
};

XCSDACLClass.prototype.findOrCreateDefaultACLDocument = function XCSDACLClassFindOrCreateDefaultACLDocument(req, loadFromCouchDB, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[XCSDACLClass - findOrCreateDefaultACLDocument] load from CouchDB: ' + loadFromCouchDB + ')';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var aclKey = getACLKey(req),
        defaults = aclDefaults();

    sharedDocClass.findOrCreateDefaultSharedDocument(req, aclKey, k.XCSDesignDocumentACL, defaults, loadFromCouchDB, function XCSDACLClassFindOrCreateDefaultACLDocumentCallback(err, doc, wasCreated) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

            // Improvement to minimize the 'canCreateBots' spam: do not brodcast if we're running unit tests
            // Reference: <rdar://problem/18964004> Xcode calls -[XCSService canUserCreateBots::] too much

            if (wasCreated && !unitTestUUID) {
                te.broadcast(k.XCSIsListenerForACLUpdates, k.XCSEmitNotificationACLUpdated, null);
            }

            return xcsutil.safeCallback(cb, null, doc);
        }
    });

};

XCSDACLClass.prototype.findACL = function XCSDACLClassFindACL(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[XCSDACLClass - findACL] ' + req.method + ' ' + req.url,
        loadFromCouchDB = false,
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.findOrCreateDefaultACLDocument(req, loadFromCouchDB, function XCSDACLClassFindACLCallback(err, doc) {

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

/*
    Goal:

        Given a request (can be one initiated from a unit test or a regular one), obtain
        its related ACL document, expand it and cache it in Redis. If it's a unit test
        ACL document, set an expiration date. Otherwise, cache indefinitely.

    Steps:

        1) find expanded ACL in Redis
            1.1) if found, return it
        2) via 'setnx', attempt to set the OD expansion flag for the given ACL
        3) if we fail to set it, it means that OD is in the middle of expanding the ACL: return HTTP 531
        4) if we succeed setting the OD expansion flag:
            2.1) load the proper ACL (unit test or default one)
            2.2) ask OD to expand it (non-blocking)
                2.2.1) if successfull, cache the expanded ACL + clear the flag
*/

XCSDACLClass.prototype.findExpandedACLInRedis = function XCSDACLClassFindExpandedACLInRedis(req, cb) {

    xcsutil.logLevelInc(req);

    var self = this,
        aclKeyExpanded = self.getExpandedACLKey(req),
        functionTitle = '[XCSDACLClass - findExpandedACLInRedis] Retrieve expanded ACL from Redis: ' + aclKeyExpanded;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    redisClass.get(req, aclKeyExpanded, function XCSDACLClassFindExpandedACLInRedisCallback(err, reply) {
        if (err || !reply) {
            konsole.warn(req, '[XCSDACLClass - findExpandedACLInRedis] Expanded ACL not found in Redis: ' + aclKeyExpanded);
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, {
                status: 404,
                message: 'Not found: expanded ACL not found in Redis'
            });
        } else {
            var aclDoc = JSON.parse(reply);
            konsole.debug(req, '[XCSDACLClass - findExpandedACLInRedis] Expanded ACL found in Redis: ' + JSON.stringify(aclDoc, null, 4));
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, null, aclDoc);
        }
    });

};

XCSDACLClass.prototype.askODToExpandACLDocument = function XCSDACLClassAskODToExpandACLDocument(req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[XCSDACLClass - askODToExpandACLDocument] load ACL from CouchDB';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        expandedACLKey = self.getExpandedACLKey(req),
        ODExpansionACLFlag = expandedACLKey + ':od_active',
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        odIsBusyErr = self.getODIsBusyError(ODExpansionACLFlag),
        message;

    async.waterfall([

        function ACLSetODExpansionACLFlag(callback) {
            // Set the ODExpansionACLFlag if it doesn't exist
            redisClass.client().setnx(ODExpansionACLFlag, '1', function XCSDACLClassSetODExpansionACLFlagCallback(err, reply) {
                if (err) {
                    message = '[XCSDACLClass - askODToExpandACLDocument] error checking if ODExpansionACLFlag \'' + ODExpansionACLFlag + '\' exists. Reason: ' + JSON.stringify(err);

                    konsole.error(req, message);

                    callback({
                        status: 500,
                        message: 'Internal Server Error (Redis): ' + message
                    });
                } else {
                    if (0 === reply) {
                        // The ODExpansionACLFlag already exists
                        var odIsBusyErr = self.getODIsBusyError(ODExpansionACLFlag);

                        konsole.debug(req, '[XCSDACLClass - askODToExpandACLDocument] ' + odIsBusyErr.message);

                        callback(odIsBusyErr);
                    } else {
                        // The ODExpansionACLFlag didn't exist and is now set
                        konsole.log(req, '[XCSDACLClass - askODToExpandACLDocument] setting flag: "' + ODExpansionACLFlag + '"');
                        callback(null);
                    }
                }
            });
        },
        function ACLFindACL(callback) {
            // We can now load the ACL
            konsole.log(req, '[XCSDACLClass - askODToExpandACLDocument] find ACL document');

            self.findOrCreateDefaultACLDocument(req, true, function XCSDACLClassFindACLCallback(err, aclDocument) {
                if (err) {
                    konsole.error(req, '[XCSDACLClass - askODToExpandACLDocument] error: ' + JSON.stringify(err));
                    callback(err);
                } else {
                    konsole.log(req, '[XCSDACLClass - askODToExpandACLDocument] ACL found.');
                    callback(null, aclDocument);
                }
            });
        },
        function ACLExpandACL(aclDocument, callback) {
            if (unitTestUUID) {
                konsole.log(req, '[XCSDACLClass - askODToExpandACLDocument] expanding ACL (blocking): ' + expandedACLKey);
                expandACL(req, aclDocument, expandedACLKey, ODExpansionACLFlag, function XCSDACLClassACLExpandACLCallback(err, expandedACL) {
                    callback(err, expandedACL);
                });
            } else {
                // Now we expand it without blocking
                setTimeout(function ACLExpandACLAsyncCallback() {
                    konsole.log(req, '[XCSDACLClass - askODToExpandACLDocument] expanding ACL (non-blocking): ' + expandedACLKey);
                    expandACL(req, aclDocument, expandedACLKey, ODExpansionACLFlag);
                }, 0);
                callback(odIsBusyErr);
            }
        }

    ], function ACLAskODToExpandACLDocumentFinalizer(err, expandedACL) {
        return xcsutil.safeCallback(cb, err, expandedACL);
    });

};

XCSDACLClass.prototype.findAndExpandACLDocument = function XCSDACLClassFindAndExpandACLDocument(req, useRedis, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle,
        self = this;

    if (useRedis) {
        functionTitle = '[XCSDACLClass - findAndExpandACLDocument] using Redis';
    } else {
        functionTitle = '[XCSDACLClass - findAndExpandACLDocument] using CouchDB';
    }

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (useRedis) {
        self.findExpandedACLInRedis(req, function XCSDACLClassFindAndExpandACLDocumentFindExpandedACLInRedis(err, expandedACL) {
            if (err) {
                konsole.warn(req, '[XCSDACLClass - findAndExpandACLDocument] findExpandedACLInRedis warning: ' + JSON.stringify(err));
                self.askODToExpandACLDocument(req, function XCSDACLClassFindAndExpandACLDocumentAskODToExpandACLDocumentAfterRedis(err, expandedACL) {
                    if (err) {
                        err.message = '[XCSDACLClass - findAndExpandACLDocument] askODToExpandACLDocument (CouchDB) error: ' + JSON.stringify(err);
                    }
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, err, expandedACL);
                });
            } else {
                konsole.log(req, '[XCSDACLClass - findAndExpandACLDocument] expanded ACL found in Redis.');
                return xcsutil.safeCallback(cb, null, expandedACL);
            }
        });
    } else {
        self.askODToExpandACLDocument(req, function XCSDACLClassFindAndExpandACLDocumentAskODToExpandACLDocument(err, expandedACL) {
            xcsutil.logLevelDec(req);
            konsole.error(req, '[XCSDACLClass - findAndExpandACLDocument] askODToExpandACLDocument (CouchDB) error: ' + JSON.stringify(err));
            return xcsutil.safeCallback(cb, err, expandedACL);
        });
    }

};

XCSDACLClass.prototype.findAndExpandACL = function XCSDACLClassFindAndExpandACL(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[XCSDACLClass - findAndExpandACL] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    var self = this,
        useRedis = true;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.findAndExpandACLDocument(req, useRedis, function ACLFindAndExpandACLCallback(err, expandedACL) {
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

XCSDACLClass.prototype.listACLs = function XCSDACLClassListACLs(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[XCSDACLClass - listACLs] ' + req.method + ' ' + req.url,
        query = {
            key: k.XCSDesignDocumentACL,
            include_docs: true
        };

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    redisClass.getDynamicQuery(req, k.XCSDesignDocumentACL, function ACLListRedisGetDynamicQuery(err, docs) {
        // Not finding documents doesn't mean it's an error. Let's report true errors instead.
        if (err && err.status !== 404) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else if (docs) {
            docs = JSON.parse(docs);
            konsole.log(req, '[Device - list] number of documents found in Redis: ' + docs.length);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedResponse(res, 200, docs);
        } else {
            konsole.log(req, '[Device - list] find the devices in CouchDB');

            sharedDocClass.list(req, k.XCSDesignDocumentACL, k.XCSDesignDocumentViewAllACLs, query, function ACLListCallback(err, docs) {
                // Not finding documents doesn't mean it's an error. Let's report true errors instead.
                if (err && err.status !== 404) {
                    xcsutil.profilerSummary(req);
                    xcsutil.logLevelDec(req);
                    xcsutil.logLevelCheck(req, logLevel);
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    konsole.log(req, '[XCSDACLClass - listACLs] number of documents found in CouchDB: ' + docs.length);
                    redisClass.setDynamicQuery(req, k.XCSDesignDocumentACL, JSON.stringify(docs), function BOTListAllACLsRedisSetDynamicQuery(err, wasSaved) {
                        if (wasSaved) {
                            konsole.log(req, '[XCSDACLClass - listACLs] list of bots retrieved. Cache the results to Redis.');
                        }
                        // Even if there's an error (i.e. Redis suddenly went down), we can still continue since
                        // the next request would be redirected to CouchDB.
                        xcsutil.profilerSummary(req);
                        xcsutil.logLevelDec(req);
                        xcsutil.logLevelCheck(req, logLevel);
                        return xcsutil.standardizedResponse(res, 200, docs);
                    });
                }
            });
        }
    });

};

XCSDACLClass.prototype.updateACL = function XCSDACLClassUpdateACL(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[XCSDACLClass - updateACL] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        aclKey = getACLKey(req),
        defaults = aclDefaults(),
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        body = xcsutil.patchBodyForClient(req);

    sharedDocClass.update(req, aclKey, k.XCSDesignDocumentACL, defaults, body, function ACLUpdateCallback(err, updated_doc) {
        if (err) {
            err.message = '[XCSDACLClass - updateACL] error: ' + JSON.stringify(err);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            if (unitTestUUID) {
                self.askODToExpandACLDocument(req, function ACLUpdateAskODToExpandACLDocumentCallback() {
                    broadcastAndRespondUpdatedACL(req, res, null, logLevel, updated_doc);
                });
            } else {
                // load the updated document and cache it in Redis
                setTimeout(function ACLUpdateAskODToExpandACLDocumentAsyncCallback() {
                    self.askODToExpandACLDocument(req);
                }, 0);
                broadcastAndRespondUpdatedACL(req, res, null, logLevel, updated_doc);
            }
        }
    });

};

/* Module exports */

module.exports = new XCSDACLClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function getACLKey(req) {
    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);
    var aclKey = k.XCSDesignDocumentACL;
    if (unitTestUUID) {
        aclKey = k.XCSDesignDocumentACL + ':' + unitTestUUID;
    }
    return aclKey;
}

function aclDefaults() {
    var defaultContents = {},
        aclList = {
            canCreateBots: k.XCSCanCreateBots,
            canViewBots: k.XCSCanViewBots,
            canCreateHostedRepositories: k.XCSCanCreateHostedRepositories
        };

    defaultContents[aclList.canCreateBots] = [k.XCSAccessAuthenticated];
    defaultContents[aclList.canViewBots] = [k.XCSAccessAnyone];
    defaultContents[aclList.canCreateHostedRepositories] = [k.XCSAccessAuthenticated];

    return defaultContents;
}

// Load and cache the ACL document
function expandGroups_internal(req, acl, cb) {

    xcsutil.logLevelInc(req);

    konsole.log(req, '[XCSDACLClass - expandGroups_internal] asking OD to expand the ACL');

    xcssecurity.expandGroups(req, acl, function ACLExpandGroupsInternal(err, expandedACL, unavailableNodes) {
        xcsutil.logLevelDec(req);
        if (err) {
            var error = {
                status: 500,
                message: 'Internal Server Error (xcssecurity): ' + err.message
            };
            return xcsutil.safeCallback(cb, error, null, unavailableNodes);
        } else {
            return xcsutil.safeCallback(cb, null, expandedACL, unavailableNodes);
        }
    });

}

function expandACL(req, aclDocument, expandedACLKey, ODExpansionACLFlag, callback) {

    xcsutil.logLevelInc(req);

    expandGroups_internal(req, aclDocument, function ACLExpandACLExpandGroups(err, expandedACL) {
        if (err) {
            clearODExpansionACLFlag(req, ODExpansionACLFlag, function () {
                err.message = '[XCSDACLClass - expandACL] expandGroups error: ' + JSON.stringify(err);
                konsole.error(req, JSON.stringify(err));
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(callback, err);
            });
        } else {
            konsole.log(req, '[XCSDACLClass - expandACL] ACL expanded successfully');

            var redisClient = redisClass.client();

            if (redisClient) {
                var value = JSON.stringify(expandedACL),
                    unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

                konsole.log(req, '[XCSDACLClass - expandACL] expanded ACL cached in Redis');

                if (unitTestUUID) {
                    // Save the expanded ACL with an expiration date since it belongs to a unit test.
                    redisClient.setex(expandedACLKey, k.XCSUnitTestTTLInSeconds, value);
                } else {
                    // Do not save the ACL with an expiration date. This way we'll always have a cached expanded ACL
                    // in memory, which will come in handy when OD does not satisfy the requests promptly.
                    redisClient.set(expandedACLKey, value);
                }

                clearODExpansionACLFlag(req, ODExpansionACLFlag, function () {
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(callback, null, expandedACL);
                });

            } else {
                konsole.warn(req, '[XCSDACLClass - expandACL] unable to cache the expanded ACL in Redis. Reason: redisClient not available.');
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(callback, null, expandedACL);
            }
        }
    });
}

function broadcastAndRespondUpdatedACL(req, res, err, logLevel, updated_doc) {

    konsole.log(req, '[XCSDACLClass - broadcastAndRespondUpdatedACL] ACL update successful. Broadcasting change');

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    // Improvement to minimize the 'canCreateBots' spam: do not brodcast if we're running unit tests
    // Reference: <rdar://problem/18964004> Xcode calls -[XCSService canUserCreateBots::] too much

    if (!unitTestUUID) {
        te.broadcast(k.XCSIsListenerForACLUpdates, k.XCSEmitNotificationACLUpdated, null);
    }

    xcsutil.profilerSummary(req);
    xcsutil.logLevelDec(req);
    xcsutil.logLevelCheck(req, logLevel);

    if (err) {
        return xcsutil.standardizedErrorResponse(res, err);
    } else {
        return xcsutil.standardizedResponse(res, 200, updated_doc);
    }
}

function clearODExpansionACLFlag(req, ODExpansionACLFlag, cb) {
    konsole.log(req, '[XCSDACLClass - clearODExpansionACLFlag] clearing flag: "' + ODExpansionACLFlag + '"');
    redisClass.client().del(ODExpansionACLFlag, function ACLClearODExpansionACLFlagCallback() {
        return xcsutil.safeCallback(cb);
    });
}