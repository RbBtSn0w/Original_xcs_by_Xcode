'use strict';

var xcsutil = require('../util/xcsutil.js'),
    logger = require('../util/logger.js');

function XCSRepositoryClass() {}

XCSRepositoryClass.prototype.list = function list(req, res) {
    var log = logger.withRequest(req),
        functionTitle = '[Repositories] list hosted repositories';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    log.info('Listing hosted repositories.');

    return xcsutil.standardizedErrorResponse(res, {
        status: 503,
        message: 'Xcode Server hosted repositories have been removed in Xcode 9.0'
    });
};

XCSRepositoryClass.prototype.create = function create(req, res) {
    var log = logger.withRequest(req),
        functionTitle = '[Repositories] create hosted repository';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    log.info('Creating new hosted repository.');

    return xcsutil.standardizedErrorResponse(res, {
        status: 503,
        message: 'Xcode Server hosted repositories have been removed in Xcode 9.0'
    });
};

module.exports = xcsutil.bindAll(new XCSRepositoryClass());
