/*
    XCSAuthClass
    A class dedicated to manage authentication and authorization.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var basicAuth = require('basic-auth'),
    util = require('util');

var k = require('../constants.js'),
    xcssecurity = require('../util/xcssecurity'),
    konsole = require('../util/konsole.js'),
    settings = require('./settingsClass.js'),
    redisClass = require('./redisClass.js'),
    xcsutil = require('../util/xcsutil.js');

/* XCSAuthClass object */

function XCSAuthClass() {}

XCSAuthClass.prototype.findDocumentWithUUID = function XCSDBCoreClassFindDocumentWithUUID(req, doc_UUID, doc_type, cb) {
    var self = this;
    self.findDocumentWithUUIDUsingOptionalCaching(req, doc_UUID, doc_type, true, cb);
};

XCSAuthClass.prototype.respondWith401 = function respondWith401(req, res) {
    make401Error(function (error) {
        var message = xcsutil.colorizedErrorMessage(res, error);

        konsole.error(req, message);

        res.setHeader('WWW-Authenticate', (req.socket.localPort === 20344) ? 'negotiate' : 'Basic realm="Xcode Server"');

        return res.sendStatus(401);
    });
};

XCSAuthClass.prototype.verifyIfServiceIsEnabledAllowCertificate = function verifyIfServiceIsEnabledAllowCertificate(req, res, next) {

    konsole.log(req, '[Auth - verifyIfServiceIsEnabledAllowCertificate] verify if the service is enabled or if it\'s a certified request');

    verifyClientCertificate_internal(req, function AUTHVerifyIfServiceIsEnabledAllowCertificateCallback(err) {
        if (err) {
            konsole.warn(req, '[Auth - verifyIfServiceIsEnabledAllowCertificate] verifyClientCertificate error: ' + JSON.stringify(err));
            settings.findOrCreateSettingsDocument(req, function AUTHVerifyIfServiceIsEnabledAllowCertificateError(err, settings) {
                if (err) {
                    err.message = '[Auth - verifyIfServiceIsEnabledAllowCertificate] error: ' + JSON.stringify(err);
                    return xcsutil.standardizedErrorResponse(res, err);
                } else if (!settings) {
                    konsole.error(req, '[Auth - verifyIfServiceIsEnabledAllowCertificate] error: Settings document not found');
                    return xcsutil.standardizedResponse(res, 404, 'Settings document not found');
                } else {
                    xcsutil.handleInitPhaseOrServiceEnabledState(req, res, function () {
                        return next();
                    });
                }
            });
        } else {
            konsole.log(req, '[Auth - verifyIfServiceIsEnabledAllowCertificate] certified request is allowed to continue.');
            return next();
        }
    });

};

XCSAuthClass.prototype.requireClientCertificate = function requireClientCertificate(req, res, next) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - requireClientCertificate] requireClientCertificate';
    konsole.log(req, functionTitle);

    var self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    verifyClientCertificate_internal(req, function AUTHRequireClientCertificateCallback(err) {
        if (err) {
            err.message = '[Auth - requireClientCertificate] verifyClientCertificate failed: ' + JSON.stringify(err);
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.clearRequestWatcherTimeout(res);
            return self.respondWith401(req, res);
        } else {
            konsole.log(req, '[Auth - requireClientCertificate] verifyClientCertificate succeeded.');
            xcsutil.logLevelDec(req);
            return next();
        }
    });

};

XCSAuthClass.prototype.login = function login(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - login] login';

    var self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    function replyWithError(err) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (401 === err.status) {

            konsole.log(req, '[Auth - login] basic auth failed. Sending challenge.');
            xcsutil.clearRequestWatcherTimeout(res);

            return self.respondWith401(req, res);

        } else {
            return xcsutil.standardizedErrorResponse(res, err);
        }
    }

    konsole.log(req, '[Auth - login] parse basic auth header and authenticate');

    parseBasicAuthHeaderAndAuthenticate(req, function AUTHLoginParseBasicAuthHeaderAndAuthenticate(err) {
        if (err) {
            konsole.error(req, '[Auth - login] ' + JSON.stringify(err));
            if (req.session) {
                req.session.regenerate(function AUTHLoginRegenerateSessionCallback() {
                    replyWithError(err);
                });
            } else {
                replyWithError(err);
            }
        } else {
            konsole.log(req, '[Auth - login] authentication successful.');
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

XCSAuthClass.prototype.logout = function logout(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - logout] logout';

    konsole.log(req, functionTitle);

    function finishLogout() {
        konsole.log(req, '[Auth - logout] logout: succeeded.');
        xcsutil.logLevelDec(req);
        return xcsutil.standardizedResponse(res, 204);
    }

    // Clear the session and return.
    if (req.session) {
        req.session.regenerate(finishLogout);
    } else {
        finishLogout();
    }
};

XCSAuthClass.prototype.force_login = function force_login(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - force_login] force_login';
    konsole.log(req, functionTitle);

    var self = this,
        force_login_attempted_already = (req.session && req.session.force_login);

    function continueWithForceLogin() {

        // It's the first call: return the initial XCSForceLogin value

        req.session.force_login = '1';

        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        xcsutil.clearRequestWatcherTimeout(res);

        return self.respondWith401(req, res);

    }

    if (!force_login_attempted_already) {

        konsole.log(req, '[Auth - force_login] Force login requested');

        // Clear the session and return.
        if (req.session) {
            konsole.debug(req, '[Auth - force_login] clear the session and force login');
            req.session.regenerate(function AUTHForceLoginRegenerateSessionCallback() {
                continueWithForceLogin();
            });
        } else {
            continueWithForceLogin();
        }

    } else {

        konsole.log(req, '[Auth - force_login] Hitting endpoint /api/auth/login');

        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        self.login(req, res);

    }

};

XCSAuthClass.prototype.isLogged = function isLogged(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - isLogged] isLogged';

    konsole.log(req, functionTitle);

    var username;

    if (req.session) {
        username = req.session.username;
    }

    var userIsLogged = (username !== undefined ? true : false);

    konsole.log(req, '[Auth - isLogged] is user "' + username + '" logged?: ' + userIsLogged);
    xcsutil.logLevelDec(req);
    xcsutil.logLevelCheck(req, logLevel);

    return xcsutil.standardizedResponse(res, 200, userIsLogged);

};

function isAnyoneAllowed(req, expandedACL, list, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - isAnyoneAllowed] verify for anyone (*) access';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    // *** Check #1 ***
    // - is the user in the list?
    // - is the '*:authenticated' flag in the list?

    if (isAnyoneAllowedInACL(list)) {
        konsole.log(req, '[Auth - isAnyoneAllowed] access to anyone is allowed.');
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb);
    }


    // *** Check #2 ***
    // If the list is 'canViewBots' list, check also the 'canCreateBots' since a bot creator can also view bots

    if (list === expandedACL.canViewBots) {
        list = expandedACL.canCreateBots;
        if (!list) {
            list = expandedACL.canCreateBots;
        }

        konsole.log(req, '[Auth - isAnyoneAllowed] check if anyone (*) is in the "canCreateBots" list: ' + JSON.stringify(list));

        if (isAnyoneAllowedInACL(list)) {
            konsole.log(req, '[Auth - isAnyoneAllowed] access to anyone is allowed.');
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb);
        }
    }

    make401Error(function AUTHIsAnyoneAllowedMake401Error(err) {
        konsole.log(req, '[Auth - isAnyoneAllowed] access to anyone is not allowed.');
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, err);
    });
}

function authorizeUser(req, username, expandedACL, list, listname, strictCheck, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle,
        sessionUserName,
        item;

    if (strictCheck) {
        functionTitle = '[Auth - authorizeUser] strict authorization check of user "' + username + '" using ACL: "' + listname + '"';
    } else {
        functionTitle = '[Auth - authorizeUser] authorization check of user "' + username + '" using ACL: "' + listname + '"';
    }

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    // *** Check #1 ***
    // - is anyone allowed?

    if (isAnyoneAllowedInACL(list)) {
        konsole.log(req, '[Auth - authorizeUser] access to anyone is allowed.');
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb);
    } else {
        konsole.log(req, '[Auth - authorizeUser] access to anyone is not allowed.');
    }

    // *** Check #2 ***
    // - is the user in the list?
    // - is the '*:authenticated' flag in the list?

    if (strictCheck) {
        konsole.log(req, '[Auth - authorizeUser] strict authorization check of user "' + username + '" using ACL: "' + listname + '"');
    } else {
        konsole.log(req, '[Auth - authorizeUser] authorization check of user "' + username + '" using ACL: "' + listname + '"');
    }

    konsole.log(req, '[Auth - authorizeUser] contents of list "' + listname + '": ' + JSON.stringify(list));

    for (var i = 0; i < list.length; i++) {
        item = list[i];
        if (strictCheck) {
            if (username === item) {
                konsole.log(req, '[Auth - authorizeUser] strict authorization check of user "' + username + '" using ACL "' + listname + '": access granted.');
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb);
            }
        } else {
            if (username === item) {
                konsole.log(req, '[Auth - authorizeUser] authorization check of user "' + username + '" using ACL "' + listname + '": access granted.');
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb);
            }
            if ('*:authenticated' === item) {
                // We need to verify whether the specified user is the one that is logged in
                sessionUserName = (req && req.session && req.session.username);
                if (sessionUserName === username) {
                    // The requested user is currently logged in: success!
                    konsole.log(req, '[Auth - authorizeUser] "*:authenticated" matched: access granted.');
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb);
                }
            }
        }
    }

    konsole.log(req, '[Auth - authorizeUser] authorization check for "' + username + '" in ACL "' + listname + '" failed.');

    // *** Check #3 ***
    // If the list is 'canViewBots' list, check also the 'canCreateBots' since a bot creator can also view bots

    if (listname === k.XCSCanViewBots) {

        konsole.log(req, '[Auth - authorizeUser] Since we are checking the list "' + k.XCSCanViewBots + '", check also the "' + k.XCSCanCreateBots + '" list because a bot creator can also view bots');

        listname = k.XCSCanCreateBots;
        list = expandedACL.canCreateBots;

        konsole.log(req, '[Auth - authorizeUser] contents of list "' + listname + '": ' + JSON.stringify(list));

        if (strictCheck) {
            konsole.log(req, '[Auth - authorizeUser] Check list "' + listname + '": is "' + username + '" is in the specified list?');
        } else {
            konsole.log(req, '[Auth - authorizeUser] Check list "' + listname + '": is "' + username + '" or "*:authenticated" is in the specified list?');
        }

        for (var j = 0; j < list.length; j++) {
            item = list[j];
            if (strictCheck) {
                if (username === item) {
                    konsole.log(req, '[Auth - authorizeUser] "' + username + '" matched: access granted.');
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb);
                }
            } else {
                if (username === item) {
                    konsole.log(req, '[Auth - authorizeUser] authorization check of user "' + username + '" using ACL "' + listname + '": access granted.');
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb);
                }
                if ('*:authenticated' === item) {
                    // We need to verify whether the specified user is the one that is logged in
                    sessionUserName = (req && req.session && req.session.username);
                    if (sessionUserName === username) {
                        // The requested user is currently logged in: success!
                        konsole.log(req, '[Auth - authorizeUser] "*:authenticated" matched: access granted.');
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb);
                    }
                }
            }
        }

        konsole.log(req, '[Auth - authorizeUser] authorization check for "' + username + '" in ACL "' + listname + '" failed.');
    }

    // *** Check #4 ***
    // - is the user an admin?

    xcssecurity.userIsAdministrator(req, username, function AUTHAuthorizeUserUserIsAdministrator(err) {
        if (err) {
            err.message = '[Auth - authorizeUser] "' + username + '" is not an administrator: access denied.';
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            konsole.log(req, '[Auth - authorizeUser] "' + username + '" is an administrator: access granted.');
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb);
        }
    });

}

function enforceRole(req, res, expandedACL, list, listname, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - enforceRole] enforceRole using list: ' + listname;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (req && req.session) {

        konsole.debug(req, '*******************************************');
        konsole.debug(req, '**************** Auth cache ***************');
        konsole.debug(req, '*******************************************');
        konsole.debug(req, 'Cache contents: ' + JSON.stringify(expandedACL, null, 4));

        // Before we enforce anything, first check whether we're allowing anyone ('*')
        isAnyoneAllowed(req, expandedACL, list, function AUTHEnforceRoleIsAnyoneAllowed(err) {
            if (err) {
                konsole.warn(req, '[Auth - enforceRole] anyone (*) access: denied.');
                verifyClientCertSessionAndBasicAuth(req, res, function AUTHEnforceRoleVerifyClientCertSessionAndBasicAuth(err, username) {
                    if (err) {
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        // If we're dealing with a certificated request, 'username' will be undefined
                        if (username) {
                            authorizeUser(req, username, expandedACL, list, listname, false, function AUTHEnforceRoleAuthorizeUser(err) {
                                xcsutil.logLevelDec(req);
                                if (err) {
                                    return xcsutil.safeCallback(cb, err);
                                } else {
                                    return xcsutil.safeCallback(cb);
                                }
                            });
                        } else {
                            // It's a certificate. Let's move on...
                            xcsutil.logLevelDec(req);
                            return xcsutil.safeCallback(cb);
                        }
                    }
                });
            } else {
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb);
            }
        });
    } else {
        konsole.error(req, '[Auth - enforceRole] session not available! (req.session is undefined)');
        return xcsutil.safeCallback(cb, {
            status: 500,
            message: 'Internal Server Error (xcsd): session not available (req.session is undefined)'
        });
    }
}

function enforceRole_internal(req, res, listname, cb) {

    xcsutil.logLevelInc(req);

    var aclClass = require('./aclClass.js');

    konsole.log(req, '[Auth - enforceRole_internal] verify if the client request is certified');

    verifyClientCertificate_internal(req, function AUTHEnforceRoleInternalVerifyClientCertificate(err) {
        if (err) {
            // Attempt to retrieve the ACL belonging to the request (either a unit test or regular one)
            performRetrieveExpandedACLAndEnforceRole(req, res, aclClass, listname, function AUTHEnforceRoleInternalPerformRetrieveExpandedACLAndEnforceRole(err) {
                if (err) {
                    err.message = '[Auth - enforceRole_internal] error: ' + JSON.stringify(err);
                    return xcsutil.safeCallback(cb, err);
                } else {
                    return xcsutil.safeCallback(cb);
                }
            });
        } else {
            konsole.log(req, '[Auth - enforceRole_internal] the client request is certified.');
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb);
        }
    });

}

XCSAuthClass.prototype.isBotCreator = function isBotCreator(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - isBotCreator] isBotCreator';

    konsole.log(req, functionTitle);

    enforceRole_internal(req, res, k.XCSCanCreateBots, function isBotCreatorCallback(err) {
        var isBotCreator = (!err);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedResponse(res, 200, isBotCreator);
    });

};

function authorize_internal(req, listname, username, strictCheck, cb) {

    xcsutil.logLevelInc(req);

    konsole.log(req, '[Auth - authorize_internal] list: ' + listname);

    var aclClass = require('./aclClass.js'),
        useRedis = true;

    aclClass.findAndExpandACLDocument(req, useRedis, function AUTHAuthorizeInternalFindAndExpandACLDocument(err, expandedACL) {
        if (err) {
            err.message = '[Auth - authorize_internal] findAndExpandACLDocument error: ' + JSON.stringify(err);
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        } else {
            var list = expandedACL[listname];

            if (username) {
                authorizeUser(req, username, expandedACL, list, listname, strictCheck, function AUTHAuthorizeInternalAuthorizeUser(err) {
                    if (err) {
                        err.message = '[Auth - authorize_internal] authorizeUser error: ' + JSON.stringify(err);
                    }
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, err);
                });
            } else {
                isAnyoneAllowed(req, expandedACL, list, function AUTHAuthorizeInternalIsAnyoneAllowed(err) {
                    if (err) {
                        err.message = '[Auth - authorize_internal] isAnyoneAllowed error: ' + JSON.stringify(err);
                    }
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, err);
                });
            }
        }
    });
}

XCSAuthClass.prototype.authorizeUserToCreateRepositories = function authorizeUserToCreateRepositories(req, username, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - authorizeUserToCreateRepositories] authorizeUserToCreateRepositories';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authorize_internal(req, k.XCSCanCreateHostedRepositories, username, false, function AUTHAuthorizeUserToCreateRepositoriesCallback(err) {
        if (err) {
            err.message = '[Auth - authorizeUserToCreateRepositories] error: ' + JSON.stringify(err);
        }
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, err);
    });

};

XCSAuthClass.prototype.authorizeUserToCreateBots = function authorizeUserToCreateBots(req, username, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - authorizeUserToCreateBots] authorizeUserToCreateBots';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authorize_internal(req, k.XCSCanCreateBots, username, false, function AUTHAuthorizeUserToCreateBotsCallback(err) {
        if (err) {
            err.message = '[Auth - authorizeUserToCreateBots] error: ' + JSON.stringify(err);
        }
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, err);
    });

};

XCSAuthClass.prototype.authorizeUserToViewBots = function authorizeUserToViewBots(req, username, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - authorizeUserToViewBots] authorizeUserToViewBots';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authorize_internal(req, k.XCSCanViewBots, username, false, function AUTHAuthorizeUserToViewBotsCallback(err) {
        if (err) {
            err.message = '[Auth - authorizeUserToViewBots] error: ' + JSON.stringify(err);
        }
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, err);
    });

};

XCSAuthClass.prototype.enforceAdministratorRole = function enforceAdministratorRole(req, res, next) {

    var logLevel = xcsutil.logLevelInc(req);

    xcsutil.displayLogDivision(req, '[Auth - enforceAdministratorRole - START] enforceAdministratorRole');

    var functionTitle = '[Auth - enforceAdministratorRole] enforceAdministratorRole';

    var self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    verifyClientCertSessionAndBasicAuth(req, res, function AUTHEnforceAdministratorRoleVerifyClientCertSessionAndBasicAuth(err, username) {
        if (err) {
            err.message = '[Auth - verifyClientCertSessionAndBasicAuth] error: ' + JSON.stringify(err);
            xcsutil.displayLogDivision(req, '[Auth - verifyClientCertSessionAndBasicAuth - END] enforceAdministratorRole');
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

            if (401 === err.status) {

                xcsutil.clearRequestWatcherTimeout(res);
                return self.respondWith401(req, res);

            } else {
                return xcsutil.standardizedErrorResponse(res, err);
            }
        } else {
            // If we're dealing with a certificated request, 'username' will be undefined
            if (username) {
                konsole.log(req, '[Auth - verifyClientCertSessionAndBasicAuth] credential obtained: ' + username + '. Verifying admin access');
                verifyIfUserIsAdmin(req, username, logLevel, function AUTHEnforceAdministratorRoleVerifyClientCertSessionAndBasicAuthverifyIfUserIsAdmin(err) {
                    if (err) {
                        return xcsutil.standardizedResponse(res, 403, JSON.stringify(err));
                    } else {
                        return next();
                    }
                });
            } else {
                konsole.log(req, '[Auth - verifyClientCertSessionAndBasicAuth] client cert verified: access granted.');
                xcsutil.displayLogDivision(req, '[Auth - verifyClientCertSessionAndBasicAuth - END] enforceAdministratorRole');
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return next();
            }
        }
    });

};

XCSAuthClass.prototype.enforceBotCreatorRole = function enforceBotCreatorRole(req, res, next) {

    xcsutil.displayLogDivision(req, '[Auth - enforceBotCreatorRole - START] enforceBotCreatorRole');

    var functionTitle = '[Auth - enforceBotCreatorRole] enforceBotCreatorRole';

    var self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    enforceRole_internal(req, res, k.XCSCanCreateBots, function AUTHEnforceBotCreatorRole(err) {
        if (err) {
            err.message = '[Auth - enforceBotCreatorRole - END] enforceBotCreatorRole failed: ' + JSON.stringify(err);
            if (401 === err.status) {

                xcsutil.clearRequestWatcherTimeout(res);
                return self.respondWith401(req, res);

            } else {
                return xcsutil.standardizedErrorResponse(res, err);
            }
        } else {
            xcsutil.displayLogDivision(req, '[Auth - enforceBotCreatorRole - END] enforceBotCreatorRole: success');
            return next();
        }
    });

};

XCSAuthClass.prototype.enforceBotViewerRole = function enforceBotViewerRole(req, res, next) {

    xcsutil.displayLogDivision(req, '[Auth - enforceBotViewerRole START] enforceBotViewerRole');

    var functionTitle = '[Auth - enforceBotViewerRole] enforceBotViewerRole';

    var self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    enforceRole_internal(req, res, k.XCSCanViewBots, function AUTHEnforceBotViewerRole(err) {
        if (err) {
            err.message = '[Auth - enforceBotViewerRole - END] enforceBotViewerRole failed: ' + JSON.stringify(err);
            if (401 === err.status) {

                xcsutil.clearRequestWatcherTimeout(res);
                return self.respondWith401(req, res);

            } else {
                return xcsutil.standardizedErrorResponse(res, err);
            }
        } else {
            xcsutil.displayLogDivision(req, '[Auth - enforceBotViewerRole - END] enforceBotViewerRole: success');
            return next();
        }
    });
};

XCSAuthClass.prototype.enforceHostedRepositoryCreatorRole = function enforceHostedRepositoryCreatorRole(req, res, next) {

    xcsutil.displayLogDivision(req, '[Auth - enforceHostedRepositoryCreatorRole - START] enforceHostedRepositoryCreatorRole');

    var functionTitle = '[Auth - enforceHostedRepositoryCreatorRole] enforceHostedRepositoryCreatorRole';

    var self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    enforceRole_internal(req, res, k.XCSCanCreateHostedRepositories, function AUTHEnforceHostedRepositoryCreatorRole(err) {
        if (err) {
            err.message = '[Auth - enforceHostedRepositoryCreatorRole - END] enforceHostedRepositoryCreatorRole failed: ' + JSON.stringify(err);
            if (401 === err.status) {
                xcsutil.clearRequestWatcherTimeout(res);
                return self.respondWith401(req, res);

            } else {
                return xcsutil.standardizedErrorResponse(res, err);
            }
        } else {
            xcsutil.displayLogDivision(req, '[Auth - enforceHostedRepositoryCreatorRole - END] enforceHostedRepositoryCreatorRole: success');
            return next();
        }
    });

};

XCSAuthClass.prototype.consumeAuthenticationToken = function consumeAuthenticationToken(req, res, next) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - consumeAuthenticationToken] checking for an authentication token in the URL';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var authToken = req.params.token;

    if (!authToken) {
        konsole.log(req, '[Auth - consumeAuthenticationToken] no authentication token found, proceeding');
        xcsutil.logLevelDec(req);
        return next();
    } else {
        // get the auth token out of Redis
        konsole.log(req, '[Auth - consumeAuthenticationToken] fetching username for token ' + authToken + ' from Redis');

        redisClass.client().get(k.XCSRedisAuthTokenPrefix + authToken, function AUTHRedisGetAuthTokenPrefix(err, username) {
            if (err || !username) {
                konsole.warn(req, '[Auth - consumeAuthenticationToken] the token ' + authToken + ' could not be found, maybe expired?');
                xcsutil.logLevelDec(req);
                return next();
            }

            // if we have a username, stash it on the session
            if (username.length > 0) {
                konsole.log(req, '[Auth - consumeAuthenticationToken] authorizing session for user "' + username + '"');
                req.session.username = username;
            } else {
                konsole.log(req, '[Auth - consumeAuthenticationToken] no username associated with token');
            }

            xcsutil.logLevelDec(req);
            return next();
        });
    }

};

XCSAuthClass.prototype.verifyClientCertificate = function verifyClientCertificate(req, cb) {
    verifyClientCertificate_internal(req, cb);
};

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function verifyIfUserIsAdmin(req, username, logLevel, cb) {
    xcssecurity.userIsAdministrator(req, username, function AUTHEnforceAdministratorRoleUserIsAdministrator(err) {
        if (err) {
            err.message = '[Auth - verifyIfUserIsAdmin] error: ' + JSON.stringify(err);
            xcsutil.displayLogDivision(req, '[Auth - enforceAdministratorRole - END] enforceAdministratorRole');
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.safeCallback(cb, err);
        } else {
            konsole.log(req, '[Auth - verifyIfUserIsAdmin] ' + username + ' is an administrator: access granted.');
            xcsutil.displayLogDivision(req, '[Auth - enforceAdministratorRole - END] enforceAdministratorRole');
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return xcsutil.safeCallback(cb);
        }
    });
}

function performRetrieveExpandedACLAndEnforceRole(req, res, aclClass, listname, cb) {
    var expandedACLKey = aclClass.getExpandedACLKey(req);

    konsole.log(req, '[Auth - performRetrieveExpandedACLAndEnforceRole] retrieve expanded ACL with key: ' + expandedACLKey);

    // find the expanded ACL in Redis
    aclClass.findExpandedACLInRedis(req, function (err, expandedACL) {
        if (err) {
            konsole.error(req, '[Auth - performRetrieveExpandedACLAndEnforceRole] expanded ACL not found. Trying with the non-expanded version');

            // find the non-expanded ACL version
            aclClass.findOrCreateDefaultACLDocument(req, true, function (err, aclDoc) {
                if (err) {
                    err.message = '[Auth - performRetrieveExpandedACLAndEnforceRole] error: ' + JSON.stringify(err);
                    return xcsutil.safeCallback(cb, err);
                } else {
                    konsole.log(req, ' [Auth - performRetrieveExpandedACLAndEnforceRole] non-expanded ACL found: ' + JSON.stringify(aclDoc));

                    // attempt to find the user literally
                    var list = aclDoc[listname];
                    enforceRole(req, res, aclDoc, list, listname, function (err) {
                        if (err) {
                            // user not found. We'll need to expand the ACL and try again...
                            aclClass.askODToExpandACLDocument(req, function (err) {
                                return xcsutil.safeCallback(cb, err);
                            });
                        } else {
                            return xcsutil.safeCallback(cb);
                        }
                    });
                }
            });

        } else {
            konsole.debug(req, ' [Auth - performRetrieveExpandedACLAndEnforceRole] expanded ACL found: ' + JSON.stringify(expandedACL));

            // found the expanded ACL. Enforce the role...
            var list = expandedACL[listname];
            enforceRole(req, res, expandedACL, list, listname, cb);
        }
    });
}

/* Module exports */

module.exports = new XCSAuthClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function make401Error(cb) {
    var error = {
        status: 401,
        message: 'Unauthorized'
    };
    return xcsutil.safeCallback(cb, error);
}

function verifyClientCertificate_internal(req, cb) {
    if (req && req.connection && req.connection.authorized) {
        return xcsutil.safeCallback(cb);
    } else {
        make401Error(function (error) {
            error.message = error.message + ': client certificate not provided';
            return xcsutil.safeCallback(cb, error);
        });
    }
}

function parseBasicAuthHeaderAndAuthenticate(req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - parseBasicAuthHeaderAndAuthenticate] basic auth verification';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var user = basicAuth(req);

    if (!user) {
        make401Error(function AUTHParseBasicAuthHeaderAndAuthenticateNoUserError(err) {
            err.message = 'Unauthorized: credential not supplied';
            konsole.log(req, '[Auth - parseBasicAuthHeaderAndAuthenticate] basic auth verification failed: credential not supplied.');
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, err);
        });
    } else {
        var username = user.name,
            password = user.pass;

        konsole.log(req, '[Auth - parseBasicAuthHeaderAndAuthenticate] attempting to authenticate user: ' + username);
        xcssecurity.authenticateUser(req, username, password, function AUTHParseBasicAuthHeaderAndAuthenticateAuthenticateUser(err) {
            if (err) {
                err.message = '[Auth - parseBasicAuthHeaderAndAuthenticate] user authentication failed. Reason: ' + JSON.stringify(err);
                make401Error(function AUTHParseBasicAuthHeaderAndAuthenticateAuthenticateUserError(err) {
                    xcsutil.logLevelDec(req);
                    return xcsutil.safeCallback(cb, err);
                });
            } else {
                konsole.log(req, '[Auth - parseBasicAuthHeaderAndAuthenticate] user "' + username + '" authenticated successfully.');

                if (req && req.session) {
                    req.session.username = username;
                    req.session.save(function AUTHSessionSave() {
                        konsole.debug(req, '[Auth - login] session contents: ' + util.inspect(req.session));
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb, null, username);
                    });
                } else {
                    konsole.error(req, '[Auth - parseBasicAuthHeaderAndAuthenticate] error: unable to login because the session object is not available!!!');
                    return xcsutil.safeCallback(cb, {
                        status: 500,
                        message: 'Internal Server Error (xcsd): unable to login because the session is not available'
                    });
                }
            }
        });
    }

}

function verifyClientCertSessionAndBasicAuth(req, res, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - verifyClientCertSessionAndBasicAuth] verifyClientCertSessionAndBasicAuth',
        sessionUsername;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (req && req.session && req.session.username) {
        sessionUsername = req.session.username;
    } else {
        if (!req.session) {
            konsole.warn(req, '[Auth - verifyClientCertSessionAndBasicAuth] req.session is undefined!');
        } else if (!req.session.username) {
            konsole.warn(req, '[Auth - verifyClientCertSessionAndBasicAuth] req.session is valid, but the username is undefined!');
        }
    }

    // Verify if we are dealing with a certificated request
    verifyClientCertificate_internal(req, function AUTHVerifyClientCertSessionAndBasicAuthCallback(err) {
        if (err) {
            konsole.warn(req, '[Auth - verifyClientCertSessionAndBasicAuth] client certificate verification failed.');

            // We are not a certified request: do we have an active session perhaps?
            if (sessionUsername) {
                // Yes, we do!
                konsole.log(req, '[Auth - verifyClientCertSessionAndBasicAuth] session is active for user ' + sessionUsername);
                xcsutil.logLevelDec(req);
                return xcsutil.safeCallback(cb, null, sessionUsername);
            } else {
                // No, we don't: check if the header contains the authentication info
                parseBasicAuthHeaderAndAuthenticate(req, function AUTHVerifyClientCertParseBasicAuthHeaderAndAuthenticateCallback(err, username) {
                    if (err) {
                        err.message = '[Auth - verifyClientCertSessionAndBasicAuth] basic authentication failed: ' + JSON.stringify(err);
                        konsole.debug(req, '[Auth - verifyClientCertSessionAndBasicAuth] session contents: ' + util.inspect(req.session));
                        konsole.debug(req, '[Auth - verifyClientCertSessionAndBasicAuth] request header contents: ' + util.inspect(req.headers));
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb, err);
                    } else {
                        konsole.log(req, '[Auth - verifyClientCertSessionAndBasicAuth] basic authentication succeeded for user ' + username);
                        xcsutil.logLevelDec(req);
                        return xcsutil.safeCallback(cb, null, username);
                    }
                });
            }

        } else {
            konsole.log(req, '[Auth - verifyClientCertSessionAndBasicAuth] client certificate verification succeeded.');
            xcsutil.logLevelDec(req);
            return xcsutil.safeCallback(cb, null);
        }
    });

}

function isAnyoneAllowedInACL(listToSearch) {
    for (var i = 0; i < listToSearch.length; i++) {
        if (k.XCSAccessAnyone === listToSearch[i]) {
            return true;
        }
    }
    return false;
}