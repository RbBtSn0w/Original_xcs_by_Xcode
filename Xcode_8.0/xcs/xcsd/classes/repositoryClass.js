'use strict';

var k = require('../constants.js'),
    te = require('../util/turboevents.js'),
    xcsutil = require('../util/xcsutil.js'),
    logger = require('../util/logger.js');

function XCSRepositoryClass() {}

XCSRepositoryClass.prototype.list = function list(req, res) {
    var log = logger.withRequest(req),
        functionTitle = '[Repositories] list hosted repositories';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    log.info('Listing hosted repositories.');

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
    var log = logger.withRequest(req),
        functionTitle = '[Repositories] create hosted repository';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    log.info('Creating new hosted repository.');

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

module.exports = xcsutil.bindAll(new XCSRepositoryClass());
