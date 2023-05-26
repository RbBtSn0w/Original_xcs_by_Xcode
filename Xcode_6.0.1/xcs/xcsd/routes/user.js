'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var auth = require('./auth.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js');

var user = {};

/**
 * Read
 */

user.canCreateRepositories = function (req, res) {

    var functionTitle = '[User - canCreateRepositories] canCreateRepositories';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var username = req.params.name;
    if (!username) {
        xcsutil.profilerSummary(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }

    konsole.log(req, '[User - canCreateRepositories] username: ' + username);

    auth.authorizeUserToCreateRepositories(req, username, function (err) {
        xcsutil.profilerSummary(req);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

user.canViewBots = function (req, res) {

    var functionTitle = '[User - canViewBots] canViewBots';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var username = req.params.name;
    if (!username) {
        xcsutil.profilerSummary(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }

    konsole.log(req, '[User - canViewBots] username: ' + username);

    auth.authorizeUserToViewBots(req, username, function (err) {
        xcsutil.profilerSummary(req);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

user.canCreateBots = function (req, res) {

    var functionTitle = '[User - canCreateBots] canCreateBots';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var username = req.params.name;
    if (!username) {
        xcsutil.profilerSummary(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'Bad request'
        });
    }

    konsole.log(req, '[User - canCreateBots] username: ' + username);

    auth.authorizeUserToCreateBots(req, username, function (err) {
        xcsutil.profilerSummary(req);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

user.canAnyoneCreateRepositories = function (req, res) {

    var functionTitle = '[User - canAnyoneCreateRepositories] canAnyoneCreateRepositories';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    auth.authorizeUserToCreateRepositories(req, null, function (err) {
        xcsutil.profilerSummary(req);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

user.canAnyoneViewBots = function (req, res) {

    var functionTitle = '[User - canAnyoneViewBots] canAnyoneViewBots';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    auth.authorizeUserToViewBots(req, null, function (err) {
        xcsutil.profilerSummary(req);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

user.canAnyoneCreateBots = function (req, res) {

    var functionTitle = '[User - canAnyoneCreateBots] canAnyoneCreateBots';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    auth.authorizeUserToCreateBots(req, null, function (err) {
        xcsutil.profilerSummary(req);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

module.exports = user;