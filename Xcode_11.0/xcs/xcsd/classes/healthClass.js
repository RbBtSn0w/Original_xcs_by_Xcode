'use strict';

var te = require('../util/turboevents.js'),
    cluster = require('cluster'),
    uuid = require('node-uuid'),
    http = require('http'),
    https = require('https'),
    databaseClass = require('./databaseClass.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js');

/* XCSHealthClass object */

function XCSHealthClass() {

    var self = this;

    if (!cluster.isDisabled) {
        if (cluster.isMaster) {
            cluster.on('fork', function HEAMasterForkEvent(worker) {
                worker.on('message', function HEAMasterMessageEvent(msg) {
                    if (msg.command && msg.command === 'healthFetchStatus') {
                        self.vendStatusToWorker(worker, msg.id);
                    } else if (msg.command && msg.command === 'healthVendStatus') {
                        cluster.workers[msg.requestor].send(msg);
                    }
                });
            });
        } else {
            process.on('message', function HEAMessageEvent(msg) {
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

XCSHealthClass.prototype.findDocumentWithUUID = function XCSDBCoreClassFindDocumentWithUUID(req, doc_UUID, doc_type, cb) {
    var self = this;
    self.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

var trackedConnections = [];
var totalRequests = 0;
var rollingRequestCount = 0;

function cleanupReq() {
    rollingRequestCount--;
}

XCSHealthClass.prototype.trackRequest = function trackRequest(req, res, next) {
    // hold onto the connection so we know when it dies
    if (trackedConnections.indexOf(req.connection) === -1) {
        trackedConnections.push(req.connection);
        req.connection.on('close', function HEATrackRequestCloseEvent() {
            var c = trackedConnections.indexOf(req.connection);
            if (c > -1) {
                trackedConnections.splice(c, 1);
            }
        });
    }

    // keep track of number of requests for our stats
    var urlInfo = require('url').parse(req.url);
    if (urlInfo.pathname !== '/health') {
        totalRequests++;
        rollingRequestCount++;
        setTimeout(cleanupReq, 1000);
    }

    next();
};

XCSHealthClass.prototype.currentStatus = function currentStatus() {
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

XCSHealthClass.prototype.fetchMasterStatus = function fetchMasterStatus(cb) {
    databaseClass.health_internal(null, function HEAFetchMasterStatusCallback(err, dbHealth) {
        return xcsutil.safeCallback(cb, {
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

XCSHealthClass.prototype.status_internal = function status_internal(req, cb) {

    var log = logger.withRequest(req);

    log.info('Fetching xcsd health status.');

    var identifier = uuid.v4();
    outstandingResponses[identifier] = cb;

    if (cluster.isDisabled) {
        var self = this;
        this.fetchMasterStatus(function HEAStatusCallback(masterInfo) {
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

XCSHealthClass.prototype.status = function status(req, res) {
    this.status_internal(req, function (healthInfo) {
        xcsutil.standardizedResponse(res, 200, healthInfo);
    });
};

XCSHealthClass.prototype.vendStatusToWorker = function vendStatusToWorker(worker, identifier) {
    this.fetchMasterStatus(function HEAVendStatusToWorkerCallback(masterInfo) {
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

XCSHealthClass.prototype.expectStatusResponses = function expectStatusResponses(identifier, workerIDs, masterInfo) {
    expectedStatuses[identifier] = workerIDs.length;
    masterResults[identifier] = masterInfo;
    this.checkRequestDone(identifier);
};

XCSHealthClass.prototype.fulfillStatusRequest = function fulfillStatusRequest(status, identifier, workerID) {
    statusResults[identifier][workerID] = status;
    this.checkRequestDone(identifier);
};

XCSHealthClass.prototype.checkRequestDone = function checkRequestDone(identifier) {
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

        var callback = outstandingResponses[identifier];

        callback({
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

module.exports = xcsutil.bindAll(new XCSHealthClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/
