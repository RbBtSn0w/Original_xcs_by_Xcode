'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    util = require('util'),
    xcsutil = require('../util/xcsutil.js'),
    async = require('async'),
    konsole = require('../util/konsole.js'),
    Redis;

var redisClient,
    redisIntervalID;

function client() {
    return redisClient;
}

function redisLog() {
    if (false === k.XCSRedisQuietMode) {
        var otherArgs = Array.prototype.slice.call(arguments, 0),
            message = xcsutil.loggingTimestamp() + Array.prototype.slice.call(otherArgs).join(' ');

        // log to console
        konsole.log(message);
    }
}

function setRedisConnectionTimeout() {
    if (!redisIntervalID) {
        redisIntervalID = setInterval(connectToRedis, k.XCSRedisReconnectDelay);
    }
}

function clearRedisConnectionTimeout() {
    if (redisIntervalID) {
        clearInterval(redisIntervalID);
        redisIntervalID = null;
    }
}

function connectToRedis() {

    redisLog('[Redis - connectToRedis] ***** Connecting to Redis...');

    redisClient = Redis.createClient(k.XCSRedisPort, k.XCSRedisHost);

    redisClient.on('ready', function () {
        redisLog('[Redis - connectToRedis] ***** Redis is ready.');
        clearRedisConnectionTimeout();
    });

    redisClient.on('error', function (err) {
        var reason = util.inspect(err);
        redisLog('[Redis - connectToRedis] ***** Error: ' + reason);
    });

    redisClient.on('end', function (err) {
        var reason = util.inspect(err);
        redisLog('[Redis - connectToRedis] ***** Error: ' + reason + '. Connection is closed. Will try again in ' + k.XCSRedisReconnectDelay / 1000 + ' seconds.');
        redisClient.end();
        redisClient = null;
        setRedisConnectionTimeout();
    });

    if (process.env.REDIS_CACHING && process.env.REDIS_CACHING.toLowerCase() === 'disabled') {
        redisClient.disableCaching = true;
    }

}

function set(req, key, value, cb) {
    if (redisClient && req && !redisClient.disableCaching) {
        var unitTestUUID = req && req.headers[k.XCSUnitTestHeader],
            short_value = value;

        if (short_value.length > 20) {
            short_value = short_value.substring(0, 30) + '...';
        }

        if (unitTestUUID) {
            konsole.log(req, '[Redis - setex] ' + key + ' -> ' + short_value + ' (' + k.XCSUnitTestTTLInSeconds + ' seconds)');
            redisClient.setex(key, k.XCSUnitTestTTLInSeconds, value);
        } else {
            konsole.log(req, '[Redis - set] ' + key + ' -> ' + short_value + ' (' + k.XCSTTLInSeconds + ' seconds)');
            redisClient.setex(key, k.XCSTTLInSeconds, value);
        }
        if (cb) {
            return cb(null, true);
        }
    } else {
        if (cb) {
            return cb();
        }
    }
}

function get(req, key, cb) {
    if (redisClient && !redisClient.disableCaching) {
        konsole.log(req, '[Redis - get] ' + key);
        redisClient.get(key, cb);
    } else {
        if (cb) {
            return cb();
        }
    }
}

function del(req, key, cb) {
    if (redisClient && !redisClient.disableCaching) {
        konsole.log(req, '[Redis - del] ' + key);
        redisClient.del(key, cb);
    } else {
        if (cb) {
            return cb();
        }
    }
}

function incrHotpath(req) {
    if (redisClient && req && !redisClient.disableCaching) {
        var url = req.url,
            doc_type = url.replace(k.XCSAPIBasePath + '/', '');

        if (doc_type !== '') {
            doc_type = require('url').parse(doc_type, true).pathname;
            var temp_doc_type = doc_type.substr(0, doc_type.indexOf('/'));
            if (temp_doc_type !== '') {
                doc_type = temp_doc_type;
            }
            redisClient.hincrby(k.XCSRedisHotPath + doc_type, req.method + ' ' + url, 1);
        }
    }
}

function hotpaths(req, res) {
    if (redisClient && !redisClient.disableCaching) {
        var stats = {};
        redisClient.keys(k.XCSRedisHotPath + '*', function (err, hotpaths) {
            if (err) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: err.message
            });
            } else {
                async.each(hotpaths, function (hotpath, callback) {
                    redisClient.hgetall(hotpath, function (err, stat) {
                        if (stat) {
                            var keys = Object.keys(stat);
                            for (var i = 0; i < keys.length; i++) {
                                var key = keys[i];
                                stats[key] = stat[key];
                            }
                            callback();
                        }
                    });
                }, function () {
                    // Sort the keys by most requested
                    var sortedKeys = Object.keys(stats).sort(function (a, b) {
                        return -(stats[a] - stats[b]);
                    });

                    // Collect the stats in the right order
                    var topRequests = [];

                    for (var i = 0; i < sortedKeys.length; ++i) {
                        var stat = {},
                            key = sortedKeys[i],
                            value = stats[sortedKeys[i]];

                        stat[key] = value;

                        topRequests.push(stat);
                    }
                    return xcsutil.standardizedResponse(res, 200, topRequests);
                });
            }
        });
    } else {
        return xcsutil.standardizedErrorResponse(res, {
            status: 404,
            message: 'Hotpaths is not available. Redis is not running'
        });
    }
}

function setDynamicQuery(req, doc_type, results, cb) {
    if (redisClient && req && !redisClient.disableCaching) {
        if (doc_type && results) {
            var short_value = results,
                key = makeDynamicQueryKey(req, doc_type),
                url = req.url;

            if (!key) {
                if (cb) {
                    return cb({
                        status: 400,
                        message: 'Bad request'
                    });
                }
            }

            if (short_value.length > 20) {
                short_value = short_value.substring(0, 30) + '...';
            }

            konsole.log(req, '[Redis - setDynamicQuery] ' + key + ' -> ' + url + ' -> ' + short_value);
            return redisClient.hmset(key, url, results, cb);
        } else {
            if (cb) {
                return cb({
                    status: 400,
                    message: 'Bad request'
                });
            }
        }
    } else {
        return cb();
    }
}

function getDynamicQuery(req, doc_type, cb) {
    if (redisClient && req && !redisClient.disableCaching) {
        if (doc_type) {
            var key = makeDynamicQueryKey(req, doc_type),
                url = req.url;

            if (!key) {
                if (cb) {
                    return cb({
                        status: 400,
                        message: 'Bad request'
                    });
                }
            }

            konsole.log(req, '[Redis - getDynamicQuery] ' + key + ' -> ' + url);
            return redisClient.hget(key, url, cb);
        } else {
            if (cb) {
                return cb({
                    status: 400,
                    message: 'Bad request'
                });
            }
        }
    } else {
        return cb();
    }
}

function delDynamicQuery(req, doc_type, cb) {
    if (redisClient && req && !redisClient.disableCaching) {
        if (doc_type) {
            var key = makeDynamicQueryKey(req, doc_type);

            if (!key) {
                if (cb) {
                    return cb({
                        status: 400,
                        message: 'Bad request'
                    });
                }
            }

            konsole.log(req, '[Redis - delDynamicQuery] ' + key);
            redisClient.del(key, cb);
            if (cb) {
                return cb();
            }
        } else {
            if (cb) {
                return cb({
                    status: 400,
                    message: 'Bad request'
                });
            }
        }
    } else {
        if (cb) {
            return cb();
        }
    }
}

function makeDynamicQueryKey(req, doc_type) {
    if (!doc_type) {
        return null;
    }

    var unitTestUUID = req && req.headers[k.XCSUnitTestHeader];
    if (unitTestUUID) {
        return unitTestUUID + ':' + doc_type + ':dynamic';
    } else {
        return doc_type + ':dynamic';
    }
}

module.exports = function () {
    try {
        Redis = require('redis');
    } catch (e) {
        redisLog('[db_core - Redis] ***** Redis is not installed. XCSNode will be accessing the database directly.');
    }

    if (Redis) {
        connectToRedis();
    }
};

module.exports.client = client;
module.exports.set = set;
module.exports.get = get;
module.exports.del = del;
module.exports.incrHotpath = incrHotpath;
module.exports.hotpaths = hotpaths;
module.exports.setDynamicQuery = setDynamicQuery;
module.exports.getDynamicQuery = getDynamicQuery;
module.exports.delDynamicQuery = delDynamicQuery;