'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    te = require('../util/turboevents.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js');

var repositories = {};


repositories.list = function (req, res) {
    var functionTitle = '[Repositories] list hosted repositories';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    te.inquire(k.XCSIsListenerForRepositoryRequests, k.XCSEmitNotificationListRepositories, null, function (result) {
        xcsutil.profilerSummary(req);
        if (result.error) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: result.error
            });
        } else {
            return xcsutil.standardizedResponse(res, 200, result.repositories);
        }
    });
};

repositories.create = function (req, res) {
    var functionTitle = '[Repositories] create hosted repository';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var repository = req.body;

    te.inquire(k.XCSIsListenerForRepositoryRequests, k.XCSEmitNotificationCreateRepository, repository, function (result) {
        xcsutil.profilerSummary(req);
        if (result.error) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 500,
                message: result.error
            });
        } else {
            res.location('/repositories');
            return xcsutil.standardizedResponse(res, 201, result.repository);

        }
    });
};

module.exports = repositories;