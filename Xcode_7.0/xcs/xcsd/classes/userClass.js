/*
    XCSUserClass
    A class dedicated to manipulate the User document.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('./authClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js');

/* XCSDBCoreClass object */

function XCSUserClass() {}

XCSUserClass.prototype.canCreateRepositories = function canCreateRepositories(req, res) {

    var functionTitle = '[User - canCreateRepositories] canCreateRepositories';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var username = req.params.name;
    if (!username) {
        xcsutil.profilerSummary(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the "username" parameter has not been specified'
        });
    }

    konsole.log(req, '[User - canCreateRepositories] username: ' + username);

    authClass.authorizeUserToCreateRepositories(req, username, function USERCanCreateRepositoriesAuthorizeUserToCreateRepositories(err) {
        xcsutil.profilerSummary(req);
        buildAccessResponse(req, res, err);
    });

};

XCSUserClass.prototype.canViewBots = function canViewBots(req, res) {

    var functionTitle = '[User - canViewBots] canViewBots';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var username = req.params.name;
    if (!username) {
        xcsutil.profilerSummary(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the "username" parameter has not been specified'
        });
    }

    konsole.log(req, '[User - canViewBots] username: ' + username);

    authClass.authorizeUserToViewBots(req, username, function USERCanViewBotsauthorizeUserToViewBots(err) {
        xcsutil.profilerSummary(req);
        buildAccessResponse(req, res, err);
    });

};

XCSUserClass.prototype.canCreateBots = function canCreateBots(req, res) {

    var username = req.params.name;
    if (!username) {
        xcsutil.profilerSummary(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the "username" parameter has not been specified'
        });
    }

    var functionTitle = '[User - canCreateBots] canCreateBots: ' + username;
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authClass.authorizeUserToCreateBots(req, username, function USERCanCreateBots(err) {
        xcsutil.profilerSummary(req);
        buildAccessResponse(req, res, err);
    });

};

XCSUserClass.prototype.canAnyoneCreateRepositories = function canAnyoneCreateRepositories(req, res) {

    var functionTitle = '[User - canAnyoneCreateRepositories] canAnyoneCreateRepositories';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authClass.authorizeUserToCreateRepositories(req, null, function USERCanAnyoneCreateRepositories(err) {
        xcsutil.profilerSummary(req);
        buildAccessResponse(req, res, err);
    });

};

XCSUserClass.prototype.canAnyoneViewBots = function canAnyoneViewBots(req, res) {

    var functionTitle = '[User - canAnyoneViewBots] canAnyoneViewBots';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authClass.authorizeUserToViewBots(req, null, function USERCanAnyoneViewBots(err) {
        xcsutil.profilerSummary(req);
        buildAccessResponse(req, res, err);
    });

};

XCSUserClass.prototype.canAnyoneCreateBots = function canAnyoneCreateBots(req, res) {

    var functionTitle = '[User - canAnyoneCreateBots] canAnyoneCreateBots';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authClass.authorizeUserToCreateBots(req, null, function USERCanAnyoneCreateBots(err) {
        xcsutil.profilerSummary(req);
        buildAccessResponse(req, res, err);
    });

};

/* Module exports */

module.exports = new XCSUserClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function buildAccessResponse(req, res, err) {

    var clientVersion = req && req.headers[k.XCSClientVersion];

    // If no version has been specified, assume the latest version
    if (!clientVersion) {
        clientVersion = k.XCSAPIVersion;
    }

    var clientVersionNumber = parseInt(clientVersion, 10);

    if (1 === clientVersionNumber) {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    } else {
        if (err) {
            return xcsutil.standardizedResponse(res, 200, {
                result: false
            });
        } else {
            return xcsutil.standardizedResponse(res, 200, {
                result: true
            });
        }
    }

}