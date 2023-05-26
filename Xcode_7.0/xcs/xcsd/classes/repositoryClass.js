/*
    XCSRepositoryClass
    A class dedicated to interact with CouchDB and Redis.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    te = require('../util/turboevents.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js');

/* XCSRepositoryClass object */

function XCSRepositoryClass() {}

XCSRepositoryClass.prototype.list = function list(req, res) {
    var functionTitle = '[Repositories] list hosted repositories';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    te.inquire(k.XCSIsListenerForRepositoryRequests, k.XCSEmitNotificationListRepositories, null, function REPList(result) {
        xcsutil.profilerSummary(req);
        if (result.error) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: 'Internal Server Error (xcsd): ' + JSON.stringify(result.error)
            });
        } else {
            return xcsutil.standardizedResponse(res, 200, result.repositories);
        }
    });
};

XCSRepositoryClass.prototype.create = function create(req, res) {
    var functionTitle = '[Repositories] create hosted repository';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var repository = req.body;

    te.inquire(k.XCSIsListenerForRepositoryRequests, k.XCSEmitNotificationCreateRepository, repository, function REPCreateTurboEventInquire(result) {
        xcsutil.profilerSummary(req);
        if (result.error) {
            return xcsutil.standardizedErrorResponse(res, result.error);
        } else {
            res.location('/repositories');
            return xcsutil.standardizedResponse(res, 201, result.repository);

        }
    });
};

/* Module exports */

module.exports = new XCSRepositoryClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/