/*
    XCSRedisClass
    A class dedicated to interact with CouchDB and Redis.
*/

'use strict';

var Promise = require('bluebird'),
    fs = require('fs'),
    async = require('async'),
    config = require('config');

var k = require('../constants.js'),
    xcsutil = require('../util/xcsutil.js'),
    logger = require('../util/logger.js'),
    Errors = require('../util/error.js');

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
        self.Redis = require('ioredis');
    } catch (e) {
        logger.error('#Redis is not installed. xcsd cannot function without Redis. Exiting.');
        return process.exit(1);
    }

    if (self.Redis) {
        self.connectToRedis();
    } else {
        logger.error('#Redis module is not available, even though we were able to require it without error. Exiting.');
        return process.exit(1);
    }
}

XCSRedisClass.prototype.client = function client() {
    return this.redisClient;
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

XCSRedisClass.prototype.createClient = function createClient() {
    var Redis = this.Redis;

    if (!Redis) {
        return null;
    }

    var redisConfig = config.get('redis');
    if (redisConfig.socket) {
        logger.debug('Connecting to #Redis on socket', redisConfig.socket);
        return new Redis(redisConfig.socket);
    } else {
        logger.debug('Connecting to #Redis on', redisConfig.host + ':' + redisConfig.port);
        return new Redis(redisConfig.port, redisConfig.host);
    }
};

XCSRedisClass.prototype.connectToRedis = function connectToRedis() {

    var self = this;

    self.numberOfAttempts++;

    self.redisClient = self.createClient();
    if (!self.redisClient) {
        return;
    }

    self.redisClient.on('ready', function REDClientReadyEvent() {
        // Mark it as initialized
        self.previouslyInitialized = true;
        self.numberOfAttempts = 0;
        self.delayInMs = k.XCSRedisReconnectDelay;
        self.clearRedisConnectionTimeout();
    });

    self.redisClient.on('end', function REDClientEndEvent(err) {
        if (err) {
            logger.warn('#Redis is not available:', err, 'Will try to connect in', self.delayInMs / 1000, 'seconds.');
        } else {
            logger.warn('#Redis is not available. Will try to connect in', self.delayInMs / 1000, 'seconds.');
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
                logger.error('Could not connect to #Redis after 60 attempts. Exiting.');
                return process.exit(1);
            }
        }
        self.setRedisConnectionTimeout();
    });

    self.redisClient.on('error', function REDClientErrorEvent(err) {
        if (err) {
            logger.error('A #Redis error occurred:', err);
        } else {
            logger.error('A #Redis error occurred for an unknown reason.');
        }
    });

    if (process.env.REDIS_CACHING && process.env.REDIS_CACHING.toLowerCase() === 'disabled') {
        self.redisClient.disableCaching = true;
    }

};

XCSRedisClass.prototype.set = function set(req, key, value, cb) {
    return this._set(req, key, value, '', cb);
};

XCSRedisClass.prototype.cache = function cache(req, key, value, cb) {
    return this._set(req, key, value, 'NX', cb);
};

XCSRedisClass.prototype._set = function _set(req, key, value, options, cb) {
    var log = logger.withRequest(req);

    if (this.redisClient && !this.redisClient.disableCaching) {
        var unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
            short_value = value;

        if (short_value.length > 20) {
            short_value = short_value.substring(0, 30);
        }

        let optionsList = [];

        if (unitTestUUID) {
            optionsList = optionsList.concat('EX', k.XCSUnitTestTTLInSeconds);
        }

        if (options && options.length > 0) {
            optionsList.push(options);
        }

        log.debug('#Redis SET', key, short_value, optionsList);
        let result = this.redisClient.set.apply(this.redisClient, [key, value].concat(optionsList));

        return result.asCallback(cb);
    } else {
        return Promise.resolve().asCallback(cb);
    }
};

XCSRedisClass.prototype.get = function get(req, key, cb) {
    var log = logger.withRequest(req);

    if (this.redisClient && !this.redisClient.disableCaching) {
        log.debug('#Redis GET', key);

        return this.redisClient.get(key)
            .catch(err => {
                log.error('Error retrieving key', key, 'from Redis:', err);
                throw new Errors.Internal('Could not complete request because we failed to access Redis.');
            })
            .then(value => setUnitTestRedisCacheValue(this, req, value))
            .asCallback(cb);
    } else {
        return Promise.resolve().asCallback(cb);
    }
};

XCSRedisClass.prototype.del = function del(req, key, cb) {
    var log = logger.withRequest(req);

    if (this.redisClient && !this.redisClient.disableCaching) {
        log.debug('#Redis DEL', key);
        return this.redisClient.del(key, cb);
    } else {
        return Promise.resolve().asCallback(cb);
    }
};

XCSRedisClass.prototype.deleteWithPattern = function deleteWithPattern(req, pattern, cb) {
    let log = logger.withRequest(req);

    return this.redisClient.keys(pattern)
        .catch(err => {
            log.error('Error deleting all items from Redis with pattern', pattern, err);
            throw new Errors.Internal('Could not complete request because we failed to access Redis.');
        })
        .each(key => this.redisClient.del(key))
        .asCallback(cb);
};

XCSRedisClass.prototype.incrHotpath = function incrHotpath(req) {


    var self = this;

    if (self.redisClient && req && !self.redisClient.disableCaching) {
        var url = req.url,
            doc_type = url.slice(1);

        if (doc_type !== '') {
            doc_type = require('url').parse(doc_type, true).pathname;
            var temp_doc_type = doc_type.substr(0, doc_type.indexOf('/'));
            if (temp_doc_type !== '') {
                doc_type = temp_doc_type;
            }
            self.redisClient.hincrby(k.XCSRedisHotPath + doc_type, req.method + ' ' + url, 1);
        }
    }

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
                                var fullHotPath = 'https://' + config.get('app.host') + ':' + config.get('app.httpsPort') + hotPath;
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
    var log = logger.withRequest(req);

    return Promise.resolve().then(() => {
        if (this.redisClient && req && !this.redisClient.disableCaching) {
            if (!doc_type) {
                throw new Errors.BadRequest('No document type was provided for the dynamic query.');
            }

            if (!results) {
                throw new Errors.BadRequest('No results were provided to be saved for the dynamic query.');
            }

            var short_value = results,
                key = this.makeDynamicQueryKey(req, doc_type),
                url = req.url;

            if (!key) {
                throw new Errors.BadRequest('The key for the dynamic query has not been provided.');
            }

            if (short_value.length > 20) {
                short_value = short_value.substring(0, 30);
            }

            log.debug('#Redis Set dynamic query:', key, url, short_value);
            return this.redisClient.hmset(key, url, results);
        }

        return undefined;
    }).asCallback(cb);
};

XCSRedisClass.prototype.getDynamicQuery = function getDynamicQuery(req, doc_type, cb) {
    var log = logger.withRequest(req);

    return Promise.resolve().then(() => {
        if (this.redisClient && req && !this.redisClient.disableCaching) {
            if (!doc_type) {
                throw new Errors.BadRequest('No document type was provided for the dynamic query.');
            }

            var key = this.makeDynamicQueryKey(req, doc_type),
                url = req.url;

            if (!key) {
                throw new Errors.BadRequest('The key for the dynamic query has not been provided.');
            }

            log.debug('#Redis Get dynamic query:', key, url);
            return this.redisClient.hget(key, url)
                .catch(err => {
                    log.error('Error loading dynamic query from Redis:', err);
                    throw new Errors.Internal('Could not complete request because the documents could not be loaded from Redis.');
                })
                .then(value => setUnitTestRedisCacheValue(this, req, value));
        }

        return undefined;
    }).asCallback(cb);
};

XCSRedisClass.prototype.delDynamicQuery = function delDynamicQuery(req, doc_type, cb) {
    var log = logger.withRequest(req);

    return Promise.resolve().then(() => {
        if (this.redisClient && req && !this.redisClient.disableCaching) {
            if (!doc_type) {
                throw new Errors.BadRequest('No document type was provided for the dynamic query.');
            }

            var key = this.makeDynamicQueryKey(req, doc_type);

            if (!key) {
                throw new Errors.BadRequest('The key for the dynamic query has not been provided.');
            }

            log.debug('#Redis Delete dynamic query:', key);
            return this.redisClient.del(key);
        }

        return undefined;
    }).asCallback(cb);
};

XCSRedisClass.prototype.makeUnitTestRedisCacheKey = function makeUnitTestRedisCacheKey(unitTestUUID) {
    if (unitTestUUID) {
        return k.XCSUnitTestRedisCachePrefix + unitTestUUID;
    } else {
        return null;
    }
};

XCSRedisClass.prototype.flush = function flush(req, res) {


    var self = this,
        log = logger.withRequest(req);

    if (self.redisClient && !self.redisClient.disableCaching) {
        log.debug('Flushing #Redis.');

        self.redisClient.flushdb(function () {
            return xcsutil.standardizedResponse(res, 204);
        });
    } else {

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

module.exports = xcsutil.bindAll(new XCSRedisClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function setUnitTestRedisCacheValue(self, req, value) {
    if (!value) {
        return Promise.resolve(value);
    }

    var unitTestUUID = req && req.headers[k.XCSUnitTestHeader];
    var unitTestRedisCacheKey = self.makeUnitTestRedisCacheKey(unitTestUUID);

    if (unitTestRedisCacheKey) {
        return self.redisClient.setex(unitTestRedisCacheKey, k.XCSUnitTestRedisCachedTTLInSeconds, '1')
            .catch(err => {
                throw Errors.Internal('Error saving to Redis:' + err.message);
            })
            .thenReturn(value);
    } else {
        return Promise.resolve(value);
    }
}