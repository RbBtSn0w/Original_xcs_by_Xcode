'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var te = require('../util/turboevents.js'),
    k = require('../constants.js'),
    cluster = require('cluster'),
    uuid = require('node-uuid'),
    http = require('http'),
    https = require('https'),
    database = require('./database.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

function Health() {
    var self = this;
    if (!cluster.isDisabled) {
        if (cluster.isMaster) {
            cluster.on('fork', function (worker) {
                worker.on('message', function (msg) {
                    if (msg.command && msg.command === 'healthFetchStatus') {
                        self.vendStatusToWorker(worker, msg.id);
                    } else if (msg.command && msg.command === 'healthVendStatus') {
                        cluster.workers[msg.requestor].send(msg);
                    }
                });
            });
        } else {
            process.on('message', function (msg) {
                if (msg.command && msg.command === 'healthFetchStatus') {
                    process.send({
                        command: 'healthVendStatus',
                        status: self.currentStatus(),
                        worker: cluster.worker.id,
                        requestor: msg.requestor,
                        id: msg.id
                    });
                } else if (msg.command && msg.command === 'healthVendStatus') {
                    self.fulfillStatusRequest(msg.status, msg.id, msg.worker);
                } else if (msg.command && msg.command === 'healthStatusExpect') {
                    self.expectStatusResponses(msg.id, msg.workers, msg.masterInfo);
                }
            });
        }
    }
}

var trackedConnections = [];
var totalRequests = 0;
var rollingRequestCount = 0;

function cleanupReq() {
    rollingRequestCount--;
}

Health.prototype.trackRequest = function (req, res, next) {
    // hold onto the connection so we know when it dies
    if (trackedConnections.indexOf(req.connection) === -1) {
        trackedConnections.push(req.connection);
        req.connection.on('close', function () {
            var c = trackedConnections.indexOf(req.connection);
            if (c > -1) {
                trackedConnections.splice(c, 1);
            }
        });
    }

    // keep track of number of requests for our stats
    var urlInfo = require('url').parse(req.url);
    if (urlInfo.pathname !== k.XCSAPIBasePath + '/health') {
        totalRequests++;
        rollingRequestCount++;
        setTimeout(cleanupReq, 1000);
    }

    next();
};

Health.prototype.currentStatus = function () {
    var openDBConnections = 0,
        host;

    for (host in http.globalAgent.sockets) {
        if (http.globalAgent.sockets.hasOwnProperty(host)) {
            openDBConnections += http.globalAgent.sockets[host].length;
        }
    }

    for (host in https.globalAgent.sockets) {
        if (https.globalAgent.sockets.hasOwnProperty(host)) {
            openDBConnections += https.globalAgent.sockets[host].length;
        }
    }

    return {
        persistentConnections: te.connectionStats(),
        openHTTPConnections: trackedConnections.length,
        openDBConnections: openDBConnections,
        requestsPerSecond: rollingRequestCount,
        totalRequests: totalRequests,
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
    };
};

Health.prototype.fetchMasterStatus = function (cb) {
    database.health_internal(null, function (err, dbHealth) {
        cb({
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            dbHealth: dbHealth
        });
    });
};

var outstandingResponses = {};
var expectedStatuses = {};
var masterResults = {};
var statusResults = {};

Health.prototype.status = function (req, res) {

    var functionTitle = '[Health - status] obtaining xcsd health info...';

    konsole.log(req, functionTitle);

    var identifier = uuid.v4();
    outstandingResponses[identifier] = res;

    if (cluster.isDisabled) {
        var self = this;
        this.fetchMasterStatus(function (masterInfo) {
            masterResults[identifier] = masterInfo;
            expectedStatuses[identifier] = 1;
            statusResults[identifier] = {
                '1': self.currentStatus()
            };
            self.checkRequestDone(identifier);
        });
    } else {
        statusResults[identifier] = {};
        process.send({
            command: 'healthFetchStatus',
            id: identifier
        });
    }
};

Health.prototype.vendStatusToWorker = function (worker, identifier) {
    this.fetchMasterStatus(function (masterInfo) {
        worker.send({
            command: 'healthStatusExpect',
            id: identifier,
            workers: Object.keys(cluster.workers),
            masterInfo: masterInfo
        });

        for (var id in cluster.workers) {
            if (cluster.workers.hasOwnProperty(id)) {
                cluster.workers[id].send({
                    command: 'healthFetchStatus',
                    requestor: worker.id,
                    id: identifier
                });
            }
        }
    });
};

Health.prototype.expectStatusResponses = function (identifier, workerIDs, masterInfo) {
    expectedStatuses[identifier] = workerIDs.length;
    masterResults[identifier] = masterInfo;
    this.checkRequestDone(identifier);
};

Health.prototype.fulfillStatusRequest = function (status, identifier, workerID) {
    statusResults[identifier][workerID] = status;
    this.checkRequestDone(identifier);
};

Health.prototype.checkRequestDone = function (identifier) {
    if (identifier in expectedStatuses && Object.keys(statusResults[identifier]).length === expectedStatuses[identifier]) {
        var masterInfo = masterResults[identifier];

        var persistentConnections = {
            turbosocket: 0,
            socketio: 0
        };
        var openHTTPConnections = 0;
        var openDBConnections = 0;
        var requestsPerSecond = 0;
        var totalRequests = 0;
        var uptime = masterInfo.uptime;
        var memoryUsage = {
            rss: masterInfo.memoryUsage.rss,
            heapTotal: masterInfo.memoryUsage.heapTotal,
            heapUsed: masterInfo.memoryUsage.heapUsed
        };

        for (var id in statusResults[identifier]) {
            if (statusResults[identifier].hasOwnProperty(id)) {
                var results = statusResults[identifier][id];
                persistentConnections.turbosocket += results.persistentConnections.turbosocket;
                persistentConnections.socketio += results.persistentConnections.socketio;
                openHTTPConnections += results.openHTTPConnections;
                openDBConnections += results.openDBConnections;
                requestsPerSecond += results.requestsPerSecond;
                totalRequests += results.totalRequests;

                // we don't want to double-count the master memory usage
                if (!cluster.isDisabled) {
                    memoryUsage.rss += results.memoryUsage.rss;
                    memoryUsage.heapTotal += results.memoryUsage.heapTotal;
                    memoryUsage.heapUsed += results.memoryUsage.heapUsed;
                }
            }
        }

        xcsutil.standardizedResponse(outstandingResponses[identifier], 200, {
            persistentConnections: persistentConnections,
            openHTTPConnections: openHTTPConnections,
            openDBConnections: openDBConnections,
            requestsPerSecond: requestsPerSecond,
            totalRequests: totalRequests,
            uptime: uptime,
            memoryUsage: memoryUsage,
            workers: statusResults[identifier],
            dbHealth: masterInfo.dbHealth
        });

        delete outstandingResponses[identifier];
        delete expectedStatuses[identifier];
        delete statusResults[identifier];
        delete masterResults[identifier];
    }
};

/* Module exports */
module.exports = new Health();