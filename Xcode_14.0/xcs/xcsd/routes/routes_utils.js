'use strict';

var k = require('../constants.js'),
    xcsutil = require('../util/xcsutil.js'),
    logger = require('../util/logger.js'),
    redisClass = require('../classes/redisClass.js'),
    databaseClass = require('../classes/databaseClass.js'),
    authClass = require('../classes/authClass.js');

var utils = {};

utils.setMemWatchHeapDiff = function setMemWatchHeapDiff(req, res) {

    // Enable MemWatch heap diff per request if it's been activated

    redisClass.client().get(k.XCSMemWatchActive, function (err, value) {
        if ('1' === value) {
            var memwatch = require('memwatch'),
                hd = new memwatch.HeapDiff();
            res[k.XCSMemWatchActive] = hd;
            res[k.XCSMemWatchMethod] = req.method;
            res[k.XCSMemWatchURL] = req.url;
        }
    });

};

utils.setRequestWatcher = function setRequestWatcher(req, res) {

    var timeoutID = setTimeout(function (req) {

        var log = logger.withRequest(req);

        // Looks like the request is taking too long: get the CouchDB active tasks
        // to see if we're blocked due to database re-indexation.

        databaseClass.activeCouchDBTasks_internal(req, function (err, activeTasks) {
            if (err) {
                log.error('Error checking for active CouchDB tasks:', err);
            } else {
                var info = {
                    timeout: k.RequestWatcherTimeout + ' ms',
                    url: (req ? req.method + ' ' + req.url : '<internal call>')
                };

                if (0 === activeTasks.length) {
                    info.tasks = 'No CouchDB tasks currently active';
                    info.num_tasks = activeTasks.length;
                } else {
                    info.num_tasks = activeTasks.length;
                    info.tasks = activeTasks;
                }

                var requestUUID = (req && req.requestUUID);
                if (requestUUID) {
                    info.requestUUID = requestUUID;
                }

                log.info('Request watcher info:', JSON.stringify(info, null, 4));
            }
        });

    }, k.RequestWatcherTimeout, req);

    // Save the timeout ID in the response, since we'll cancel the timeout there
    res[k.XCSRequestWatcher] = timeoutID;

};

utils.setTTLInDocumentIfNeeded = function setTTLInDocumentIfNeeded(req, res, next) {
    var body = req.body,
        unitTestUUID = req && req.headers[k.XCSUnitTestHeader];

    if (unitTestUUID) {

        if (!req.body) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 400,
                message: 'the body is empty'
            });
        }

        var docs = req.body.docs;

        if (docs) {
            if (docs.constructor === Array) {
                docs.forEach(function (doc) {
                    xcsutil.setTTLInDocumentIfNeeded(req, doc);
                });
            } else {
                xcsutil.setTTLInDocumentIfNeeded(req, body);
            }
        } else {
            xcsutil.setTTLInDocumentIfNeeded(req, body);
        }
    }

    return next();
};

utils.prepareRequestSkipVersionCheck = function prepareRequestSkipVersionCheck(req, res, next) {

    var self = utils,
        log = logger.withRequest(req);

    redisClass.incrHotpath(req);

    var session = (req && req.session),
        sessionID = (req && req.sessionID);

    log.debug('Session ID', sessionID, 'contents:', JSON.stringify(session));

    // Check to see if the request contains a petition to return a specific HTTP status code
    var responseStatus = req && req.headers[k.XCSResponseStatus];
    if (responseStatus) {
        responseStatus = parseInt(responseStatus, 10);
        try {
            return xcsutil.handleXCSResponseStatusRequest(res, responseStatus);
        } catch (e) {
            var supportedStatusCodes = xcsutil.supportedStatusCodes();
            return xcsutil.standardizedResponse(res, 400, {
                message: 'Unsupported HTTP status: ' + responseStatus,
                supportedStatusCodes: supportedStatusCodes
            });
        }
    }

    // If the request comes from a cert-based client, let it go through.
    // Case in point: xcscontrol saving version information while xcsd is
    // in the disabled state.

    log.debug('Checking if the request is from an internal daemon.');
    authClass.verifyClientCertificate(req, function (err) {
        if (err) {
            log.debug('Verifying client certificate failed:', err);
            // If MemWatch is active, start diffing the heap
            self.setMemWatchHeapDiff(req, res);

            // Set the request watcher for potential slow requests
            self.setRequestWatcher(req, res);

            if (k.XCSDebugConnectSession) {
                log.debug('Session debugging: request =', req, '\nRequest headers:', req.headers, '\nSession:', req.session);
            }

            var Snitch = require('speedsnitch');
            if (Snitch) {

                // Setup Snitch for the request
                var snitch = new Snitch(),
                    URI = req.protocol + '://' + req.get('host') + req.originalUrl;

                req.snitch = snitch;
                snitch.title = URI;
                snitch.next('Endpoint: ' + URI);

                // If the request contains the parameter 'profiler=true', then the response, assuming it succeeds,
                // will be an HTTP 200 and the body will contain the profiler information for the endpoint.
                if (req.query.profiler) {
                    req.xcsResponse = res;
                }
            }

            return next();
        } else {
            log.info('Allowing request from an internal daemon.');
            return next();
        }
    });

};

utils.prepareRequest = function prepareRequest(req, res, next) {
    var clientVersion = req && req.headers[k.XCSClientVersion],
        self = utils,
        log = logger.withRequest(req);

    // If no client version has been sent along with the request, set it as the last version
    if (!clientVersion) {
        clientVersion = k.XCSAPIVersion;
        log.debug('No API version specified in request headers. Assuming same version as server.');
    }

    log.debug('Client API version: ' + clientVersion + ', server API version:', k.XCSAPIVersion);

    // If in the future we need to lock-out certain versions, this is the place to do it.

    var clientVersionNumber = parseInt(clientVersion, 10);

    if (clientVersionNumber < k.XCSMinimumSupportedClientVersion) {
        var error = {
            status: 530,
            message: 'Client unsupported: minimum version supported is ' + k.XCSMinimumSupportedClientVersion
        };
        log.error(error);
        return xcsutil.standardizedErrorResponse(res, error);
    }


    self.prepareRequestSkipVersionCheck(req, res, next);
};

module.exports = utils;

/***************************************************************************************************

    Private Section

***************************************************************************************************/