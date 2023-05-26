/*
    XCSDACLClass
    A class dedicated to manipulate the ACL document.
*/

'use strict';

var config = require('config');

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    Errors = require('../util/error.js'),
    te = require('../util/turboevents.js'),
    sharedDocClass = require('./sharedDocClass.js'),
    auth = require('./authClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('./redisClass.js');

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

XCSDACLClass.prototype.findOrCreateDefaultACLDocument = function XCSDACLClassFindOrCreateDefaultACLDocument(req, loadFromCouchDB, cb) {
    var log = logger.withRequest(req),
        functionTitle = '[XCSDACLClass - findOrCreateDefaultACLDocument] load from CouchDB: ' + loadFromCouchDB;

    log.debug('Finding or creating ACL document from', loadFromCouchDB ? 'CouchDB.' : 'Redis.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var aclKey = getACLKey(req),
        defaults = aclDefaults();

    sharedDocClass.findOrCreateDefaultSharedDocument(req, aclKey, k.XCSDesignDocumentACL, defaults, loadFromCouchDB, function XCSDACLClassFindOrCreateDefaultACLDocumentCallback(err, doc, wasCreated) {

        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

            // Improvement to minimize the 'canCreateBots' spam: do not brodcast if we're running unit tests
            // Reference: <rdar://problem/18964004> Xcode calls -[XCSService canUserCreateBots::] too much

            if (wasCreated && !unitTestUUID) {
                log.debug('ACLs created, broadcasting change to clients.');
                te.broadcast(k.XCSIsListenerForACLUpdates, k.XCSEmitNotificationACLUpdated, null);
            }

            return xcsutil.safeCallback(cb, null, doc);
        }
    });

};

XCSDACLClass.prototype.findACL = function XCSDACLClassFindACL(req, res) {
    var log = logger.withRequest(req),
        functionTitle = '[XCSDACLClass - findACL] ' + req.method + ' ' + req.url,
        loadFromCouchDB = false,
        self = this;

    log.info('Fetching ACLs.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.findOrCreateDefaultACLDocument(req, loadFromCouchDB, function XCSDACLClassFindACLCallback(err, doc) {
        xcsutil.profilerSummary(req);

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
    cb = xcsutil.callback(cb);
    var self = this,
        log = logger.withRequest(req),
        aclKeyExpanded = self.getExpandedACLKey(req),
        functionTitle = '[XCSDACLClass - findExpandedACLInRedis] Retrieve expanded ACL from Redis: ' + aclKeyExpanded;

    log.debug('Retrieving expanded ACL from Redis using key', aclKeyExpanded);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    redisClass.get(req, aclKeyExpanded, function XCSDACLClassFindExpandedACLInRedisCallback(err, reply) {
        if (err || !reply) {
            log.debug('Expanded ACL not found in Redis under key', aclKeyExpanded);
            return cb(new Errors.NotFound('The expanded ACL could not be found in Redis.'));
        } else {
            var aclDoc = JSON.parse(reply);
            log.debug('Found expanded ACL in Redis. Contents:', JSON.stringify(aclDoc, null, 4));
            return xcsutil.safeCallback(cb, null, aclDoc);
        }
    });

};

XCSDACLClass.prototype.expandACLDocument = function (req, cb) {

    var self = this,
        log = logger.withRequest(req),
        expandedACLKey = self.getExpandedACLKey(req);

    log.debug('Expanding ACL document.');

    self.findOrCreateDefaultACLDocument(req, true, function (err, aclDocument) {
        if (err) {
            log.error('Could not load ACL document to expand:', err);
            xcsutil.safeCallback(cb, err);
        } else {
            self.expandACL(req, aclDocument, expandedACLKey, cb);
        }
    });
};

XCSDACLClass.prototype.askODToExpandACLDocument = function (req, cb) {
    var log = logger.withRequest(req),
        functionTitle = '[XCSDACLClass - askODToExpandACLDocument] load ACL from CouchDB';

    log.debug('Attempting to expand ACL document using OpenDirectory.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var self = this,
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    if (unitTestUUID || !config.get('acl.expandInBackground')) {
        log.debug('Expanding ACL document, and blocking while we do so.');
        self.expandACLDocument(req, cb);
    } else {
        require('./backgroundQueue.js').enqueue('bg', 'expandACL', function (err) {
            if (err) {
                log.error('Could not enqueue job:', err);
                xcsutil.safeCallback(cb, err);
            } else {
                xcsutil.safeCallback(cb, new Errors.OpenDirectoryBusy());
            }
        });
    }
};

XCSDACLClass.prototype.findAndExpandACLDocument = function XCSDACLClassFindAndExpandACLDocument(req, useRedis, cb) {
    var log = logger.withRequest(req),
        functionTitle,
        self = this;

    if (useRedis) {
        functionTitle = '[XCSDACLClass - findAndExpandACLDocument] using Redis';
    } else {
        functionTitle = '[XCSDACLClass - findAndExpandACLDocument] using CouchDB';
    }

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    log.debug('Attempting to load expanded ACL document from', useRedis ? 'Redis.' : 'CouchDB.');

    if (useRedis) {
        self.findExpandedACLInRedis(req, function XCSDACLClassFindAndExpandACLDocumentFindExpandedACLInRedis(err, expandedACL) {
            if (err) {
                log.warn('Error loading expanded ACL document from Redis:', err);
                self.askODToExpandACLDocument(req, cb);
            } else {
                log.debug('Found expanded ACL document in Redis.');
                return xcsutil.safeCallback(cb, null, expandedACL);
            }
        });
    } else {
        self.askODToExpandACLDocument(req, cb);
    }

};

XCSDACLClass.prototype.findAndExpandACL = function XCSDACLClassFindAndExpandACL(req, res, next) {
    var log = logger.withRequest(req),
        functionTitle = '[XCSDACLClass - findAndExpandACL] ' + req.method + ' ' + req.url;

    log.info('Finding and expanding ACL.');

    var self = this,
        useRedis = true;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.findAndExpandACLDocument(req, useRedis, function ACLFindAndExpandACLCallback(err, expandedACL) {
        xcsutil.profilerSummary(req);
        if (err || !expandedACL) {
            next(err);
        } else {
            return xcsutil.standardizedResponse(res, 200, expandedACL);
        }
    });

};

XCSDACLClass.prototype.listACLs = function XCSDACLClassListACLs(req, res) {
    var log = logger.withRequest(req),
        functionTitle = '[XCSDACLClass - listACLs] ' + req.method + ' ' + req.url,
        query = {
            key: k.XCSDesignDocumentACL,
            include_docs: true
        };

    log.info('Listing ACLs.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    redisClass.getDynamicQuery(req, k.XCSDesignDocumentACL, function ACLListRedisGetDynamicQuery(err, docs) {
        // Not finding documents doesn't mean it's an error. Let's report true errors instead.
        if (err && err.status !== 404) {
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else if (docs) {
            docs = JSON.parse(docs);
            log.info('Found', docs.length, 'ACLs in Redis.');
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedResponse(res, 200, docs);
        } else {
            log.debug('Could not find ACLs cached in Redis, checking in CouchDB.');
            sharedDocClass.list(req, k.XCSDesignDocumentACL, k.XCSDesignDocumentViewAllACLs, query, function ACLListCallback(err, docs) {
                // Not finding documents doesn't mean it's an error. Let's report true errors instead.
                if (err && err.status !== 404) {
                    xcsutil.profilerSummary(req);
                    return xcsutil.standardizedErrorResponse(res, err);
                } else {
                    log.info('Found', docs.length, 'ACLs in CouchDB. Caching to Redis.');
                    redisClass.setDynamicQuery(req, k.XCSDesignDocumentACL, JSON.stringify(docs), function BOTListAllACLsRedisSetDynamicQuery(err, wasSaved) {
                        if (wasSaved) {
                            log.debug('Successfully cached ACLs to Redis.');
                        }
                        // Even if there's an error (i.e. Redis suddenly went down), we can still continue since
                        // the next request would be redirected to CouchDB.
                        xcsutil.profilerSummary(req);
                        return xcsutil.standardizedResponse(res, 200, docs);
                    });
                }
            });
        }
    });

};

XCSDACLClass.prototype.update = function XCSDACLClassUpdateACL(req, res) {
    var functionTitle = '[XCSDACLClass - updateACL] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var body = xcsutil.patchBodyForClient(req);

    this.updateACL(req, body, function(err, updated_doc) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            broadcastAndRespondUpdatedACL(req, res, null, updated_doc);
        }
    });

};

XCSDACLClass.prototype.updateACL = function updateACL(req, newACL, cb) {
    var log = logger.withRequest(req);
    log.info('Updating ACLs.');

    var self = this,
        aclKey = getACLKey(req),
        defaults = aclDefaults(),
        unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    sharedDocClass.update(req, aclKey, k.XCSDesignDocumentACL, defaults, newACL, function ACLUpdateCallback(err, updated_doc) {
        if (err) {
            err.message = 'Error updating ACLs: ' + err.message;
            xcsutil.safeCallback(cb, err);
        } else {
            if (unitTestUUID || !config.get('acl.expandInBackground')) {
                self.askODToExpandACLDocument(req, function ACLUpdateAskODToExpandACLDocumentCallback() {
                    xcsutil.safeCallback(cb, null, updated_doc);
                });
            } else {
                // load the updated document and cache it in Redis
                setTimeout(function ACLUpdateAskODToExpandACLDocumentAsyncCallback() {
                    self.askODToExpandACLDocument(req);
                }, 0);
                xcsutil.safeCallback(cb, null, updated_doc);
            }
        }
    });
};

XCSDACLClass.prototype.expandACL = function expandACL(req, aclDocument, expandedACLKey, callback) {
    var log = logger.withRequest(req);

    expandGroups_internal(req, aclDocument, function ACLExpandACLExpandGroups(err, expandedACL) {
        if (err) {
            log.error('Error expanding ACL groups:', err);
            return xcsutil.safeCallback(callback, err);
        } else {
            log.debug('ACL groups expanded successfully.');

            var redisClient = redisClass.client();

            if (redisClient) {
                var value = JSON.stringify(expandedACL),
                    unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

                log.debug('Saving expanded ACL to Redis.');

                if (unitTestUUID) {
                    // Save the expanded ACL with an expiration date since it belongs to a unit test.
                    redisClient.setex(expandedACLKey, k.XCSUnitTestTTLInSeconds, value);
                } else {
                    // Do not save the ACL with an expiration date. This way we'll always have a cached expanded ACL
                    // in memory, which will come in handy when OD does not satisfy the requests promptly.
                    redisClient.set(expandedACLKey, value);
                }

                return xcsutil.safeCallback(callback, null, expandedACL);

            } else {
                log.warn('Unable to cache expanded ACL to Redis because the Redis client is not available.');
                return xcsutil.safeCallback(callback, null, expandedACL);
            }
        }
    });
};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSDACLClass());

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
    var log = logger.withRequest(req);

    log.debug('Asking OD to expand ACL groups.');

    auth.getAuthProvider().expandGroups(req, acl, function ACLExpandGroupsInternal(err, expandedACL, unavailableNodes) {
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

function broadcastAndRespondUpdatedACL(req, res, err, updated_doc) {

    var log = logger.withRequest(req);
    log.debug('ACL update successful. Broadcasting change.');

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]);

    // Improvement to minimize the 'canCreateBots' spam: do not brodcast if we're running unit tests
    // Reference: <rdar://problem/18964004> Xcode calls -[XCSService canUserCreateBots::] too much

    if (!unitTestUUID) {
        te.broadcast(k.XCSIsListenerForACLUpdates, k.XCSEmitNotificationACLUpdated, null);
    }

    xcsutil.profilerSummary(req);
    if (err) {
        return xcsutil.standardizedErrorResponse(res, err);
    } else {
        return xcsutil.standardizedResponse(res, 200, updated_doc);
    }
}
