'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    db_core = require('./db_core.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js');

var commit = {};

/**
 * Remove
 */

commit.removeAll = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Commit] ' + req.method + ' ' + req.url + '...';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        query = {
            include_docs: false
        };

    if (unitTestUUID) {
        query.startkey = [unitTestUUID];
        query.endkey = [unitTestUUID, {}];
    }

    db_core.removeAll(req, k.XCSDesignDocumentCommit, k.XCSDesignDocumentViewAllCommits, query, function (err) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err && err.status !== 404) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

/* Module exports */
module.exports = commit;