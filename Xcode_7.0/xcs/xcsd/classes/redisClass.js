/*
    XCSRedisClass
    A class dedicated to interact with CouchDB and Redis.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var util = require('util'),
    fs = require('fs'),
    async = require('async');

var k = require('../constants.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js');

/* XCSRedisClass object */

function XCSRedisClass() {

    var self = this;

    self.Redis = null;
    self.redisClient = null;
    self.redisIntervalID = null;
    self.numberOfAttempts = 0;
    self.delayInMs = k.XCSRedisFirstConnectDelay;
    self.previouslyInitialized = false;

    try {
        self.Redis = require('redis');
    } catch (e) {
        var message = 'Redis is not installed. XCSNode will not be able to function properly. Exiting now.';
        self.redisLog('[dbCoreClass - Redis] ***** ' + message);
        return process.exit(1);
    }

    if (self.Redis) {
        self.connectToRedis();
    } else {
        konsole.error(null, '[dbCoreClass - Redis] self.Redis is undefined and we didn\'t catch it!? Exiting now.');
        return process.exit(1);
    }
}

XCSRedisClass.prototype.findDocumentWithUUID = function XCSDBCoreClassFindDocumentWithUUID(req, doc_UUID, doc_type, cb) {
    var self = this;
    self.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

XCSRedisClass.prototype.client = function client() {
    return this.redisClient;
};

XCSRedisClass.prototype.redisLog = function redisLog() {
    if (false === k.XCSRedisQuietMode) {
        var otherArgs = Array.prototype.slice.call(arguments, 0),
            message = Array.prototype.slice.call(otherArgs).join(' ');

        // log to console
        konsole.log(null, message);
    }
};

XCSRedisClass.prototype.setRedisConnectionTimeout = function setRedisConnectionTimeout() {
    var self = this;
    if (!self.redisIntervalID) {
        self.numberOfAttempts = 0;
        self.redisIntervalID = setInterval(self.connectToRedis, self.delayInMs);
    }
};

XCSRedisClass.prototype.clearRedisConnectionTimeout = function clearRedisConnectionTimeout() {
    var self = this;
    if (self.redisIntervalID) {
        self.clearInterval(self.redisIntervalID);
        self.redisIntervalID = null;
    }
};

XCSRedisClass.prototype.connectToRedis = function connectToRedis() {

    var self = this;

    self.numberOfAttempts++;

    var Redis = self.Redis;

    if (!Redis) {
        return;
    }

    self.redisClient = Redis.createClient(k.XCSRedisSocket);

    self.redisClient.on('ready', function REDClientReadyEvent() {
        // Mark it as initialized
        self.previouslyInitialized = true;
        self.numberOfAttempts = 0;
        self.delayInMs = k.XCSRedisReconnectDelay;
        self.clearRedisConnectionTimeout();
    });

    self.redisClient.on('end', function REDClientEndEvent(err) {
        if (err) {
            var reason = util.inspect(err);
            self.redisLog('[Redis - connectToRedis] ***** Error: ' + reason + '. Redis is not available. Will try to connect in ' + self.delayInMs / 1000 + ' second.');
        } else {
            self.redisLog('[Redis - connectToRedis] ***** Error: Redis is not available. Will try to connect in ' + self.delayInMs / 1000 + ' second.');
        }
        self.redisClient.end();
        self.redisClient = null;

        // If we have previously connected and we have lost the connection, set the delay to a less-aggressive value
        if (!self.previouslyInitialized) {
            // We have never been able to connect. If we have tried less than 60 times, continue trying for a little longer
            if (self.numberOfAttempts < 60) {
                self.setRedisConnectionTimeout();
            } else {
                // OK. It seems that Redis is now showing up. After 60 attempts we have to give up and exit because
                // we cannot cache crucial xcsd info we'll need later in the initialization.
                konsole.error(null, '[Redis - connectToRedis] Could not connect to Redis after 60 attempts. Exiting now.');
                return process.exit(1);
            }
        }
        self.setRedisConnectionTimeout();
    });

    self.redisClient.on('error', function REDClientErrorEvent(err) {
        if (err) {
            var reason = util.inspect(err);
            self.redisLog('[Redis - connectToRedis] ***** A Redis error occurred. Reason: ' + reason);
        } else {
            self.redisLog('[Redis - connectToRedis] ***** A Redis error occurred. Reason: unknown (the error event didn\'t specify the reason.');
        }
    });

    if (process.env.REDIS_CACHING && process.env.REDIS_CACHING.toLowerCase() === 'disabled') {
        self.redisClient.disableCaching = true;
    }

};

XCSRedisClass.prototype.set = function set(req, key, value, cb) {
    xcsutil.logLevelInc(req);

    var self = this;

    if (self.redisClient && !self.redisClient.disableCaching) {
        var unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
            short_value = value;

        if (short_value.length > 20) {
            short_value = short_value.substring(0, 30);
        }

        if (unitTestUUID) {
            konsole.debug(req, '[Redis - setex] ' + key + ' -> ' + short_value + ' (' + k.XCSUnitTestTTLInSeconds + ' second)');
            self.redisClient.setex(key, k.XCSUnitTestTTLInSeconds, value);
        } else {
            konsole.debug(req, '[Redis - set] ' + key + ' -> ' + short_value);
            self.redisClient.set(key, value);
        }

        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, null, true);
    } else {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb);
    }
};

XCSRedisClass.prototype.get = function get(req, key, cb) {
    xcsutil.logLevelInc(req);

    var self = this;

    if (self.redisClient && !self.redisClient.disableCaching) {
        konsole.debug(req, '[Redis - get] ' + key);
        xcsutil.logLevelDec(req);
        self.redisClient.get(key, function (err, value) {
            if (err) {
                return xcsutil.safeCallback(cb, {
                    status: 500,
                    message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
                });
            } else {
                if (value) {
                    setUnitTestRedisCacheValue(self, req, value, function (err, value) {
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb, err, value);
                    });
                } else {
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb);
                }
            }
        });
    } else {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb);
    }
};

XCSRedisClass.prototype.del = function del(req, key, cb) {
    xcsutil.logLevelInc(req);

    var self = this;

    if (self.redisClient && !self.redisClient.disableCaching) {
        konsole.debug(req, '[Redis - del] ' + key);
        xcsutil.logLevelDec(req);
        self.redisClient.del(key, cb);
    } else {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb);
    }
};

XCSRedisClass.prototype.deleteWithPattern = function deleteWithPattern(req, pattern, cb) {
    xcsutil.logLevelInc(req);

    var self = this;

    self.redisClient.keys(pattern, function (err, reply) {
        xcsutil.logLevelDec(req);
        if (err) {
            return xcsutil.safeCallback(cb, {
                status: 500,
                message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
            });
        } else {
            for (var key in reply) {
                if (reply.hasOwnProperty(key)) {
                    self.redisClient.del(reply[key]);
                }
            }
            return xcsutil.safeCallback(cb);
        }
    });
};

XCSRedisClass.prototype.incrHotpath = function incrHotpath(req) {
    xcsutil.logLevelInc(req);

    var self = this;

    if (self.redisClient && req && !self.redisClient.disableCaching) {
        var url = req.url,
            doc_type = url.replace(k.XCSAPIBasePath + '/', '');

        if (doc_type !== '') {
            doc_type = require('url').parse(doc_type, true).pathname;
            var temp_doc_type = doc_type.substr(0, doc_type.indexOf('/'));
            if (temp_doc_type !== '') {
                doc_type = temp_doc_type;
            }
            self.redisClient.hincrby(k.XCSRedisHotPath + doc_type, req.method + ' ' + url, 1);
        }
    }
    xcsutil.logLevelDec(req);
};

XCSRedisClass.prototype.hotpaths = function hotpaths(req, res) {

    var self = this;


    // Function to verify whether the hoptpath should be included in the final list
    // We use a for() loop because it's by far the fastest way in Chrome.

    function shouldHotPathBeIncluded(hotPath) {
        var unwantedAPIs = ['/api/auth/login',
                            '/api/auth/logout',
                            '/api/hotpaths'];

        for (var i = 0; i < unwantedAPIs.length; i++) {
            var index = hotPath.indexOf(unwantedAPIs[i]);
            if (index >= 0) {
                return false;
            }
        }

        return true;
    }

    if (self.redisClient && !self.redisClient.disableCaching) {
        var filePath = req.query.filepath,
            httpMethod = req.query.method,
            stats = {},
            i;

        if (httpMethod) {
            httpMethod = httpMethod.toUpperCase();
        }

        self.redisClient.keys(k.XCSRedisHotPath + '*', function REDHotPathsShouldHotPathBeIncludedRedisGetPaths(err, hotpaths) {
            if (err) {
                return xcsutil.standardizedErrorResponse(res, {
                    status: 500,
                    message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
                });
            } else {
                async.each(hotpaths, function REDHotPathsShouldHotPathBeIncludedApply(hotpath, callback) {
                    self.redisClient.hgetall(hotpath, function REDHotPathsShouldHotPathBeIncludedApplyHGetAll(err, stat) {
                        if (stat) {
                            var keys = Object.keys(stat);
                            for (var i = 0; i < keys.length; i++) {
                                var key = keys[i];

                                // If the HTTP method (i.e. GET, POST) has been specified, skip the paths that do not match the filter
                                if (undefined !== httpMethod) {
                                    if (key.indexOf(httpMethod) !== 0) {
                                        continue;
                                    }
                                }

                                stats[key] = stat[key];
                            }
                            callback();
                        }
                    });
                }, function REDHotPathsFinalizer() {
                    if (filePath) {
                        var allPaths = [],
                            keys = Object.keys(stats);

                        for (i = 0; i < keys.length; i++) {
                            var key = keys[i],
                                hotPath = key.substring(key.indexOf(k.XCSAPIBasePath + '/'));

                            // If the HTTP method (i.e. GET, POST) has been specified, skip the paths that do not match the filter
                            if (undefined !== httpMethod) {
                                if (key.indexOf(httpMethod) !== 0) {
                                    continue;
                                }
                            }

                            // Only include the hotpaths that we care about
                            if (shouldHotPathBeIncluded(hotPath)) {
                                var fullHotPath = 'https://' + k.XCSHost + ':' + k.XCSHTTPSPort + hotPath;
                                allPaths.push(fullHotPath);
                            }
                        }

                        var wstream = fs.createWriteStream(filePath);

                        allPaths.forEach(function REDHotPathsFinalizerApply(hotpath) {
                            wstream.write(hotpath + '\n');
                        });

                        wstream.on('error', function REDHotPathsFinalizerWStreamErrorEvent(err) {
                            return xcsutil.standardizedErrorResponse(res, {
                                status: 500,
                                message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
                            });
                        });

                        wstream.end();
                        return xcsutil.standardizedResponse(res, 204);
                    } else {
                        // Sort the keys by most requested
                        var sortedKeys = Object.keys(stats).sort(function REDHotPathsFinalizerSort(a, b) {
                            return -(stats[a] - stats[b]);
                        });

                        // Collect the stats in the right order
                        var topRequests = [];

                        for (i = 0; i < sortedKeys.length; ++i) {
                            var stat = {},
                                sortedkey = sortedKeys[i],
                                value = stats[sortedKeys[i]];

                            stat[sortedkey] = value;

                            topRequests.push(stat);
                        }
                        return xcsutil.standardizedResponse(res, 200, topRequests);
                    }
                });
            }
        });
    } else {
        return xcsutil.standardizedErrorResponse(res, {
            status: 404,
            message: 'Not found: hotpaths is not available. Redis is not running'
        });
    }
};

XCSRedisClass.prototype.makeDynamicQueryKey = function makeDynamicQueryKey(req, doc_type) {
    if (!doc_type) {
        return null;
    }

    var unitTestUUID = req && req.headers[k.XCSUnitTestHeader];
    if (unitTestUUID) {
        return unitTestUUID + ':' + doc_type + ':dynamic';
    } else {
        return doc_type + ':dynamic';
    }
};

XCSRedisClass.prototype.setDynamicQuery = function setDynamicQuery(req, doc_type, results, cb) {
    xcsutil.logLevelInc(req);

    var self = this;

    if (self.redisClient && req && !self.redisClient.disableCaching) {
        if (doc_type && results) {
            var short_value = results,
                key = self.makeDynamicQueryKey(req, doc_type),
                url = req.url;

            if (!key) {
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, {
                    status: 400,
                    message: 'the key has not been specified'
                });
            } else {
                if (short_value.length > 20) {
                    short_value = short_value.substring(0, 30);
                }

                konsole.log(req, '[Redis - setDynamicQuery] ' + key + ' -> ' + url + ' -> ' + short_value);
                xcsutil.logLevelDec(req);
                return self.redisClient.hmset(key, url, results, cb);
            }
        } else {
            xcsutil.logLevelDec(req);

            var reasons = [];

            if (!doc_type) {
                reasons.push('the doc_type has not been specified');
            }

            if (!results) {
                reasons.push('the results have not been specified');
            }

            return xcsutil.safeCallback(cb, {
                status: 400,
                message: JSON.stringify(reasons),
                reasons: reasons
            });
        }
    } else {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb);
    }
};

XCSRedisClass.prototype.getDynamicQuery = function getDynamicQuery(req, doc_type, cb) {
    xcsutil.logLevelInc(req);

    var self = this;

    if (self.redisClient && req && !self.redisClient.disableCaching) {
        if (doc_type) {
            var key = self.makeDynamicQueryKey(req, doc_type),
                url = req.url;

            if (!key) {
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, {
                    status: 400,
                    message: 'the key has not been specified'
                });
            } else {
                konsole.log(req, '[Redis - getDynamicQuery] ' + key + ' -> ' + url);
                xcsutil.logLevelDec(req);
                return self.redisClient.hget(key, url, function (err, value) {
                    if (err) {
                        return xcsutil.safeCallback(cb, {
                            status: 500,
                            message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
                        });
                    }
                    if (value) {
                        setUnitTestRedisCacheValue(self, req, value, function (err, value) {
                            xcsutil.logLevelDec(req);
                            return xcsutil.safeCallback(cb, err, value);
                        });
                    } else {
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb);
                    }
                });
            }
        } else {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, {
                status: 400,
                message: 'the doc_type has not been specified'
            });
        }
    } else {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb);
    }
};

XCSRedisClass.prototype.delDynamicQuery = function delDynamicQuery(req, doc_type, cb) {
    xcsutil.logLevelInc(req);

    var self = this;

    if (self.redisClient && req && !self.redisClient.disableCaching) {
        if (doc_type) {
            var key = self.makeDynamicQueryKey(req, doc_type);

            if (!key) {
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, {
                    status: 400,
                    message: 'the key has not been specified'
                });
            } else {
                konsole.log(req, '[Redis - delDynamicQuery] ' + key);
                xcsutil.logLevelDec(req);
                self.redisClient.del(key, cb);
            }
        } else {
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, {
                status: 400,
                message: 'the doc_type has not been specified'
            });
        }
    } else {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb);
    }
};

XCSRedisClass.prototype.makeUnitTestRedisCacheKey = function makeUnitTestRedisCacheKey(unitTestUUID) {
    if (unitTestUUID) {
        return k.XCSUnitTestRedisCachePrefix + unitTestUUID;
    } else {
        return null;
    }
};

XCSRedisClass.prototype.flush = function flush(req, res) {
    xcsutil.logLevelInc(req);

    var self = this;

    if (self.redisClient && !self.redisClient.disableCaching) {
        konsole.log(req, '[Redis - flush] flushing Redis');
        xcsutil.logLevelDec(req);
        self.redisClient.flushdb();
        return xcsutil.standardizedResponse(res, 204);
    } else {
        xcsutil.logLevelDec(req);
        if (!self.redisClient) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 503,
                message: 'Service Unavailable (Redis): client not available'
            });
        } else {
            return xcsutil.standardizedErrorResponse(res, {
                status: 503,
                message: 'Service Unavailable (Redis): service is disabled'
            });
        }
    }
};

/* Module exports */

module.exports = new XCSRedisClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function setUnitTestRedisCacheValue(self, req, value, cb) {

    var unitTestUUID = req && req.headers[k.XCSUnitTestHeader];
    var unitTestRedisCacheKey = self.makeUnitTestRedisCacheKey(unitTestUUID);

    if (unitTestRedisCacheKey) {
        self.redisClient.setex(unitTestRedisCacheKey, k.XCSUnitTestRedisCachedTTLInSeconds, '1', function (err) {
            if (err) {
                return xcsutil.safeCallback(cb, {
                    status: 500,
                    message: 'Internal Server Error (Redis): ' + JSON.stringify(err)
                });
            } else {
                return xcsutil.safeCallback(cb, null, value);
            }
        });
    } else {
        return xcsutil.safeCallback(cb, null, value);
    }
}