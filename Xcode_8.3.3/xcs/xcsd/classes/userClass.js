/*
    XCSUserClass
    A class dedicated to manipulate the User document.
*/

'use strict';

var k = require('../constants.js'),
    authClass = require('./authClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    xcsbridge = require('../util/xcsbridge.js'),
    logger = require('../util/logger.js');

/* XCSDBCoreClass object */

function XCSUserClass() {}

XCSUserClass.prototype.canCreateRepositories = function canCreateRepositories(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[User - canCreateRepositories] canCreateRepositories',
        username = req.params.name;

    log.info('Checking if user', username, 'is allowed to create hosted repositories.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!username) {
        xcsutil.profilerSummary(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the "username" parameter has not been specified'
        });
    }

    authClass.authorizeUserToCreateRepositories(req, username, function USERCanCreateRepositoriesAuthorizeUserToCreateRepositories(err) {
        xcsutil.profilerSummary(req);
        buildAccessResponse(req, res, err);
    });

};

XCSUserClass.prototype.canViewBots = function canViewBots(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[User - canViewBots] canViewBots',
        username = req.params.name;

    log.info('Checking if user', username, 'is allowed to view bots.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!username) {
        xcsutil.profilerSummary(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the "username" parameter has not been specified'
        });
    }

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

    var log = logger.withRequest(req),
        functionTitle = '[User - canCreateBots] canCreateBots: ' + username;

    log.info('Checking if user', username, 'is allowed to create bots.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authClass.authorizeUserToCreateBots(req, username, function USERCanCreateBots(err) {
        xcsutil.profilerSummary(req);
        buildAccessResponse(req, res, err);
    });

};

XCSUserClass.prototype.canAnyoneCreateRepositories = function canAnyoneCreateRepositories(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[User - canAnyoneCreateRepositories] canAnyoneCreateRepositories';

    log.info('Checking if anyone can create hosted repositories.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authClass.authorizeUserToCreateRepositories(req, null, function USERCanAnyoneCreateRepositories(err) {
        xcsutil.profilerSummary(req);
        buildAccessResponse(req, res, err);
    });

};

XCSUserClass.prototype.canAnyoneViewBots = function canAnyoneViewBots(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[User - canAnyoneViewBots] canAnyoneViewBots';

    log.info('Checking if anyone can view bots.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authClass.authorizeUserToViewBots(req, null, function USERCanAnyoneViewBots(err) {
        xcsutil.profilerSummary(req);
        buildAccessResponse(req, res, err);
    });

};

XCSUserClass.prototype.canAnyoneCreateBots = function canAnyoneCreateBots(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[User - canAnyoneCreateBots] canAnyoneCreateBots';

    log.info('Checking if anyone can create bots.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authClass.authorizeUserToCreateBots(req, null, function USERCanAnyoneCreateBots(err) {
        xcsutil.profilerSummary(req);
        buildAccessResponse(req, res, err);
    });

};

XCSUserClass.prototype.userPicture = function userPicture(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[User - userPicture] userPicture',
        email = req.params.email;

    log.info('Retrieving user picture for email: ' + email);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!email) {
        xcsutil.profilerSummary(req);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the "email" parameter has not been specified'
        });
    }

    xcsbridge.core.pictureForUser(email, function (err, data) {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            if (data) {
                xcsutil.clearMemWatchHeapDiff(res);
                xcsutil.clearRequestWatcherTimeout(res);

                // Make sure we set the content type appropriately
                res.setHeader('Content-type', 'image/jpeg');
                res.status(200).write(data);
                return res.end();
            } else {
                return xcsutil.standardizedErrorResponse(res, {
                    status: 404,
                    message: 'no picture found for email: ' + email
                });
            }
        }
    });

};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSUserClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function buildAccessResponse(req, res, err) {

    var log = logger.withRequest(req);
    if (err) {
        log.error('Access denied because an error occurred', JSON.stringify(err));
    } else {
        log.info('Access granted.');
    }

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