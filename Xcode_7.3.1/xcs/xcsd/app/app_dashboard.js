'use strict';

var cluster = require('cluster'),
    os = require('os'),
    async = require('async'),
	config = require('config');

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js'),
    redisClass = require('../classes/redisClass.js'),
    xcsDashboardUtils = require('../util/xcsDashboardUtils.js'),
    xcsWS;

module.exports = function app_dashboard_init(app, cb) {

    if (cluster.isMaster || cluster.isDisabled) {

        redisClass.client().hget('XCSDashboard key', k.XCSDashboardInited, function (reply) {
            if (reply) {
                logger.info('Setting up Xcode Server dashboard.');

                var server = app.get('server'),
                    self;

                var cpuInterval;
                var usedMemInterval;
                var usedDriveSpace;
                var healthInterval;

                if (server) {

                    var ws;

                    try {
                        ws = require('ws');
                    } catch (e) {
                        logger.warn('The WebSocket module "ws" is not installed. Use npm to install it and enable the dashboard.');
                        return xcsutil.safeCallback(cb);
                    }

                    var WebSocketServer = ws.Server;

                    xcsWS = new WebSocketServer({
                        server: server,
                        port: config.get('app.dashboardSocketPort')
                    });

                    if (xcsWS) {

                        logger.debug('WebSocket server initialized successfully.');

                        redisClass.client().hset('XCSDashboard key', k.XCSDashboardInited, '1');

                        xcsWS.on('connection', function (ws) {

                            self = this;

                            logger.debug('Received new dashboard connection.');

                            // Send the new client the latest health stats
                            gatherHealthStats(self);

                            // CPU usage
                            if (!cpuInterval) {
                                cpuInterval = setInterval(function () {
                                    xcsDashboardUtils.percentageCPUUsed(function (err, cpuUsage) {
                                        broadcastObject(self, {
                                            type: 'cpuUsage',
                                            value: cpuUsage
                                        });
                                    });
                                }, 5 * 1000);
                            }

                            // Used RAM
                            if (!usedMemInterval) {
                                usedMemInterval = setInterval(function () {
                                    var totalMem = os.totalmem();
                                    var usedMem = ((totalMem - os.freemem()) * 100) / totalMem;
                                    broadcastObject(self, {
                                        type: 'ramUsage',
                                        value: usedMem
                                    });
                                }, 5 * 1000);
                            }

                            // Used drive space
                            if (!usedDriveSpace) {
                                usedDriveSpace = setInterval(function () {
                                    xcsDashboardUtils.percentageDriveUsed(function (err, usedDriveSpace) {
                                        if (err) {
                                            broadcastObject(self, {
                                                type: 'driveUsage',
                                                value: '-'
                                            });
                                        } else {
                                            broadcastObject(self, {
                                                type: 'driveUsage',
                                                value: usedDriveSpace
                                            });
                                        }
                                    });
                                }, 5 * 1000);
                            }

                            // Health reporting
                            if (!healthInterval) {
                                healthInterval = setInterval(function () {
                                    // Ask a random worker to perform a health check
                                    var workers = cluster.workers,
                                        workerIDs = Object.keys(workers),
                                        numberOfWorkers = workerIDs.length;
                                    if (numberOfWorkers > 0) {
                                        var randomWorkerID = Math.floor(Math.random() * (numberOfWorkers - 0) + 0),
                                            randomWorker = workers[workerIDs[randomWorkerID]];
                                        var obj = {};
                                        obj[k.XCSHealth] = true;
                                        randomWorker.send(obj);
                                    }
                                }, 10 * 1000);
                            }

                            logger.debug('Started all dashboard monitors.');

                            ws.on('close', function () {
                                logger.debug('Dashboard connection closed.');
                                if (0 === self.clients.length) {
                                    logger.debug('Last dashboard client closed connection. Clearing all health monitors.');
                                    clearInterval(cpuInterval);
                                    clearInterval(usedMemInterval);
                                    clearInterval(usedDriveSpace);
                                    clearInterval(healthInterval);

                                    cpuInterval = null;
                                    usedMemInterval = null;
                                    usedDriveSpace = null;
                                    healthInterval = null;
                                }
                            });

                        });

                    } else {

                        logger.warn('Unable to initialize WebSocket server. Dashboard will be unavailable.');
                        redisClass.client().hdel('XCSDashboard key', k.XCSDashboardInited);

                    }

                } else {

                    logger.warn('Unable to find the secure server. Dashboard will be unavailable.');
                    redisClass.client().hdel('XCSDashboard key', k.XCSDashboardInited);

                }

                cluster.on('fork', function (worker) {
                    worker.on('message', function (msg) {
                        switch (msg.type) {
                        case k.XCSStatusEvent:
                            broadcastObject(self, msg);
                            break;
                        case k.XCSLastError:
                            broadcastObject(self, msg);
                            break;
                        case k.XCSHealth:
                            // Send the new client the latest health stats
                            gatherHealthStats(self);
                            break;
                        }
                    });
                });
            }
        });

    }

    return xcsutil.safeCallback(cb);

};

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function logError(err) {
    if (err) {
        logger.error(err);
    }
}

function broadcastObject(self, obj) {
    if (self) {
        var clients = self.clients;
        for (var i in clients) {
            if (self.hasOwnProperty('clients')) {
                self.clients[i].send(JSON.stringify(obj), logError);
            }
        }
    }
}

function gatherHealthStats(self) {

    var healthInfo = {};

    async.series([

        // Obtain the uptime ======================================================================

        function (next) {
                redisClass.client().hget('XCSDashboard key', k.XCSHealth, function (err, reply) {
                    if (reply) {
                        healthInfo = JSON.parse(reply);
                        healthInfo.uptime = process.uptime();
                    }
                    next();
                });
        },

        // Obtain the last server-down event ======================================================

        function (next) {
                redisClass.client().hget('XCSDashboard key', k.XCSStatus503, function (err, reply) {
                    if (reply) {
                        healthInfo[k.XCSStatus503] = reply;
                    }
                    next();
                });
        },

        // Obtain the last error ==================------------====================================

        function (next) {
                redisClass.client().hget('XCSDashboard key', k.XCSLastError, function (err, reply) {
                    if (reply) {
                        healthInfo[k.XCSLastError] = reply;
                    }
                    next();
                });
        }

        ],
        function () {
            broadcastObject(self, {
                type: k.XCSHealth,
                value: healthInfo
            });
        });

}
