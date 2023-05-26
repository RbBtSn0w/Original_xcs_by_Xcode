/*
    auth.js
    Authentication routes for xcsd.
*/

'use strict';


var k = require('../constants.js'),
    basicAuth = require('basic-auth'),
    xcssecurity = require('../util/xcssecurity'),
    konsole = require('../util/konsole.js'),
    settings = require('./settings.js'),
    util = require('util'),
    redis = require('../classes/redisClass.js'),
    xcsutil = require('../util/xcsutil.js');

var auth = {};

function make401Error(cb) {
    var error = {
        status: 401,
        message: 'Unauthorized'
    };
    return cb(error);
}

function make401Header(req, cb) {
    return cb({
        'Content-Type': 'text/plain',
        'WWW-Authenticate': (req.socket.localPort === 20344) ? 'negotiate' : 'Basic realm="Xcode Server"'
    });
}

auth.make401Response = function (req, res, cb) {
    make401Error(function (err) {
        make401Header(req, function (header) {
            res.writeHead(err.status, header);
            return cb(err);
        });
    });
};

auth.verifyIfServiceIsEnabledAllowCertificate = function (req, res, next) {

    konsole.log(req, '[Auth - verifyIfServiceIsEnabledAllowCertificate] verify if the service is enabled or if it\'s a certified request...');

    verifyClientCertificate(req, function (err) {
        if (err) {
            settings.findOrCreateSettingsDocument(req, function (err, settings) {
                if (err) {
                    konsole.error(req, '[Auth - verifyIfServiceIsEnabledAllowCertificate] error: ' + err.message);
                    if (res) {
                        return xcsutil.standardizedResponse(res, err.status);
                    } else {
                        return next(err);
                    }
                } else if (!settings) {
                    konsole.error(req, '[Auth - verifyIfServiceIsEnabledAllowCertificate] error: Settings document not found');
                    if (res) {
                        return xcsutil.standardizedResponse(res, 404, 'Settings document not found');
                    } else {
                        return next(err);
                    }
                } else {
                    if (true === settings.service_enabled) {
                        konsole.log(req, '[Auth - verifyIfServiceIsEnabledAllowCertificate] service is enabled.');
                        return next();
                    } else {
                        konsole.error(req, '[Auth - verifyIfServiceIsEnabledAllowCertificate] error: Service is not enabled');
                        if (res) {
                            return xcsutil.standardizedResponse(res, 503);
                        } else {
                            return next(err);
                        }
                    }
                }
            });
        } else {
            konsole.log(req, '[Auth - verifyIfServiceIsEnabledAllowCertificate] certified request is allowed to continue.');
            return next();
        }
    });

};

function verifyClientCertificate(req, cb) {

    if (req && req.connection && req.connection.authorized) {
        return cb();
    } else {
        var err = {
            status: 401,
            message: 'Unauthorized: client certificate not provided'
        };
        return cb(err);
    }

}

auth.requireClientCertificate = function (req, res, next) {

    xcsutil.logLevelInc(req);

    konsole.log(req, '[Auth - requireClientCertificate] requireClientCertificate...');

    if (req && req.snitch) {
        req.snitch.next('[Auth] requireClientCertificate');
    }

    verifyClientCertificate(req, function (err) {
        if (err) {
            konsole.error(req, '[Auth - requireClientCertificate] verifyClientCertificate failed: ' + err.message);
            auth.make401Response(req, res, function (err) {
                xcsutil.profilerSummary(req);
                xcsutil.logLevelDec(req);
                return res.end(err.message);
            });
        } else {
            konsole.log(req, '[Auth - requireClientCertificate] verifyClientCertificate succeeded.');
            xcsutil.logLevelDec(req);
            return next();
        }
    });

};

function verifyClientCertSessionAndBasicAuth(req, res, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - verifyClientCertSessionAndBasicAuth] verifyClientCertSessionAndBasicAuth...',
        sessionUsername;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (req && req.session && req.session.username) {
        sessionUsername = req.session.username;
    }

    // Verify if we are dealing with a certificated request
    verifyClientCertificate(req, function (err) {
        if (err) {
            konsole.warn(req, '[Auth - verifyClientCertSessionAndBasicAuth] client certificate verification failed.');

            // We are not a certified request: do we have an active session perhaps?
            if (sessionUsername) {
                // Yes, we do!
                konsole.log(req, '[Auth - verifyClientCertSessionAndBasicAuth] session is active for user ' + sessionUsername);
                xcsutil.logLevelDec(req);
                return cb(null, sessionUsername);
            } else {
                // No, we don't: check if the header contains the authentication info
                parseBasicAuthHeaderAndAuthenticate(req, function (err, username) {
                    if (err) {
                        konsole.log(req, '[Auth - verifyClientCertSessionAndBasicAuth] basic authentication failed: ' + err.message);
                        konsole.debug(req, '[Auth - verifyClientCertSessionAndBasicAuth] session contents: ' + util.inspect(req.session));
                        konsole.debug(req, '[Auth - verifyClientCertSessionAndBasicAuth] request header contents: ' + util.inspect(req.headers));
                        xcsutil.logLevelDec(req);
                        return cb(err);
                    } else {
                        konsole.log(req, '[Auth - verifyClientCertSessionAndBasicAuth] basic authentication succeeded for user ' + username);
                        xcsutil.logLevelDec(req);
                        return cb(null, username);
                    }
                });
            }

        } else {
            konsole.log(req, '[Auth - verifyClientCertSessionAndBasicAuth] client certificate verification succeeded.');
            xcsutil.logLevelDec(req);
            return cb(null);
        }
    });

}

// Login and logout

function parseBasicAuthHeaderAndAuthenticate(req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - parseBasicAuthHeaderAndAuthenticate] basic auth verification...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var user = basicAuth(req);

    if (!user) {
        make401Error(function (err) {
            err.message = 'Unauthorized: credential not supplied';
            konsole.log(req, '[Auth - parseBasicAuthHeaderAndAuthenticate] basic auth verification failed: credential not supplied.');
            xcsutil.logLevelDec(req);
            return cb(err);
        });
    } else {
        var username = user.name,
            password = user.pass;

        konsole.log(req, '[Auth - parseBasicAuthHeaderAndAuthenticate] attempting to authenticate user: ' + username);
        xcssecurity.authenticateUser(req, username, password, function (err) {
            if (err) {
                konsole.log(req, '[Auth - parseBasicAuthHeaderAndAuthenticate] user authentication failed. Reason: ' + err.message);
                xcsutil.logLevelDec(req);
                return cb({
                    status: 403,
                    message: err
                });
            } else {
                konsole.log(req, '[Auth - parseBasicAuthHeaderAndAuthenticate] user "' + username + '" authenticated successfully.');

                if (req && req.session) {
                    req.session.username = username;
                    req.session.save(function () {
                        konsole.debug(req, '[Auth - login] session contents: ' + util.inspect(req.session));
                        xcsutil.logLevelDec(req);
                        return cb(null, username);
                    });
                } else {
                    konsole.error(req, '[Auth - parseBasicAuthHeaderAndAuthenticate] error: unable to login because the session object is not available!!!');
                    return cb({
                        status: 500,
                        message: 'Unable to login because the session object is not available'
                    });
                }
            }
        });
    }

}

auth.login = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - login] login...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    function replyWith401() {
        auth.make401Response(req, res, function (err) {
            konsole.log(req, '[Auth - login] basic auth failed. Sending challenge.');
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return res.end(err.message);
        });
    }

    redis.client().get(k.XCSRedisACLExpansion, function (err, value) {
        if ('1' === value) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 531,
                message: 'ACL expansion not yet completed. Waiting for OD.'
            });
        } else {
            parseBasicAuthHeaderAndAuthenticate(req, function (err) {
                if (err) {
                    if (req.session) {
                        req.session.destroy(function () {
                            replyWith401();
                        });
                    } else {
                        replyWith401();
                    }
                } else {
                    return xcsutil.standardizedResponse(res, 204);
                }
            });
        }
    });
};

auth.logout = function (req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - logout] logout...';

    konsole.log(req, functionTitle);

    function finishLogout() {
        konsole.log(req, '[Auth - logout] logout: succeeded.');
        xcsutil.logLevelDec(req);
        return xcsutil.standardizedResponse(res, 204);
    }

    // Clear the session and return.
    if (req.session) {
        req.session.destroy(finishLogout);
    } else {
        finishLogout();
    }

};

auth.force_login = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - force_login] force_login...';
    konsole.log(req, functionTitle);

    var self = auth,
        force_login_attempted_already = (req.session && req.session.force_login);

    if (!force_login_attempted_already) {

        konsole.log(req, '[Auth - force_login] Force login requested');

        // Clear the session and return.
        if (req.session) {
            delete req.session.username;
        }

        // It's the first call: return the initial XCSForceLogin value
        req.session.force_login = '1';

        auth.make401Response(req, res, function (err) {
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return res.end(err.message);
        });

    } else {

        konsole.log(req, '[Auth - force_login] Hitting endpoint /api/auth/login');

        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        self.login(req, res);

    }

};

auth.isLogged = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - isLogged] isLogged...';

    konsole.log(req, functionTitle);

    var username;

    if (req.session) {
        username = req.session.username;
    }

    var isLogged = (username !== undefined ? true : false);

    konsole.log(req, '[Auth - isLogged] isLogged: ' + isLogged);
    xcsutil.logLevelDec(req);
    xcsutil.logLevelCheck(req, logLevel);

    return xcsutil.standardizedResponse(res, 200, isLogged);

};

function enforceRole_internal(req, res, listname, cb) {
    var self = auth;

    self.retrieveExpandedACL(req, function (err, expandedACL) {
        if (err) {
            return cb(err);
        } else {
            var list = req.authCache && req.authCache[listname];
            if (!list) {
                list = expandedACL[listname];
            }
            enforceRole(req, res, expandedACL, list, listname, cb);
        }
    });

}

auth.isBotCreator = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - isBotCreator] isBotCreator...';

    konsole.log(req, functionTitle);

    enforceRole_internal(req, res, k.XCSCanCreateBots, function (err) {
        var isBotCreator = (!err);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedResponse(res, 200, isBotCreator);
    });

};

// Basic Authentication and authorization

function isAnyoneAllowed(req, expandedACL, list, cb) {

    xcsutil.logLevelInc(req);

    konsole.log(req, '[Auth - isAnyoneAllowed] verify for anyone (*) access...');

    if (req && req.snitch) {
        req.snitch.next('[Auth - isAnyoneAllowed] isAnyoneAllowed');
    }

    function isAnyoneAllowedInACL(listToSearch) {

        for (var i = 0; i < listToSearch.length; i++) {
            if (k.XCSAccessAnyone === listToSearch[i]) {
                return true;
            }
        }

        return false;
    }

    // *** Check #1 ***
    // - is the user in the list?
    // - is the '*:authenticated' flag in the list?
    if (isAnyoneAllowedInACL(list)) {
        konsole.log(req, '[Auth - isAnyoneAllowed] access to anyone is allowed.');
        xcsutil.logLevelDec(req);
        return cb();
    }


    // *** Check #2 ***
    // If the list is 'canViewBots' list, check also the 'canCreateBots' since a bot creator can also view bots
    if ((list === (expandedACL && expandedACL.canViewBots)) || (list === (req.authCache && req.authCache.canViewBots))) {
        list = req.authCache && req.authCache.canCreateBots;
        if (!list) {
            list = expandedACL.canCreateBots;
        }

        konsole.log(req, '[Auth - isAnyoneAllowed] check if anyone (*) is in the "canCreateBots" list: ' + JSON.stringify(list));

        if (isAnyoneAllowedInACL(list)) {
            konsole.log(req, '[Auth - isAnyoneAllowed] access to anyone is allowed.');
            xcsutil.logLevelDec(req);
            return cb();
        }
    }

    make401Error(function (err) {
        konsole.log(req, '[Auth - isAnyoneAllowed] access to anyone is not allowed.');
        xcsutil.logLevelDec(req);
        return cb(err);
    });
}

function authorize_internal(req, listname, username, cb) {

    xcsutil.logLevelInc(req);

    konsole.log(req, '[Auth - authorize_internal] list: ' + listname);

    var self = auth;

    self.retrieveExpandedACL(req, function (err, expandedACL) {
        if (err) {
            konsole.error(req, '[Auth - authorize_internal] retrieveExpandedACL error: ' + err.message);
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            var list = req.authCache && req.authCache[listname];
            if (!list) {
                list = expandedACL[listname];
            }
            if (username) {
                authorizeUser(req, username, expandedACL, list, listname, function (err) {
                    if (err) {
                        konsole.error(req, '[Auth - authorize_internal] authorizeUser error: ' + err.message);
                    }
                    xcsutil.logLevelDec(req);
                    return cb(err);
                });
            } else {
                isAnyoneAllowed(req, expandedACL, list, function (err) {
                    if (err) {
                        konsole.error(req, '[Auth - authorize_internal] isAnyoneAllowed error: ' + err.message);
                    }
                    xcsutil.logLevelDec(req);
                    return cb(err);
                });
            }
        }
    });
}

auth.authorizeUserToCreateRepositories = function (req, username, cb) {

    xcsutil.logLevelInc(req);

    if (req && req.snitch) {
        req.snitch.next(req, '[Auth - authorizeUserToCreateRepositories] authorizeUserToCreateRepositories');
    }

    authorize_internal(req, k.XCSCanCreateHostedRepositories, username, function (err) {
        if (err) {
            konsole.error(req, '[Auth - authorizeUserToCreateRepositories] error: ' + err.message);
        }
        xcsutil.logLevelDec(req);
        return cb(err);

    });

};

auth.authorizeUserToCreateBots = function (req, username, cb) {

    xcsutil.logLevelInc(req);

    if (req && req.snitch) {
        req.snitch.next(req, '[Auth - authorizeUserToCreateBots] authorizeUserToCreateBots');
    }

    authorize_internal(req, k.XCSCanCreateBots, username, function (err) {
        if (err) {
            konsole.error(req, '[Auth - authorizeUserToCreateBots] error: ' + err.message);
        }
        xcsutil.logLevelDec(req);
        return cb(err);

    });

};

auth.authorizeUserToViewBots = function (req, username, cb) {

    xcsutil.logLevelInc(req);

    if (req && req.snitch) {
        req.snitch.next(req, '[Auth - authorizeUserToViewBots] authorizeUserToViewBots');
    }

    authorize_internal(req, k.XCSCanViewBots, username, function (err) {
        if (err) {
            konsole.error(req, '[Auth - authorizeUserToViewBots] error: ' + err.message);
        }
        xcsutil.logLevelDec(req);
        return cb(err);

    });

};

function authorizeUser(req, username, expandedACL, list, listname, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - authorizeUser] authorize ' + username + ' using list: ' + listname + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    // *** Check #1 ***
    // - is anyone allowed?

    function isAnyoneAllowedInACL(listToSearch) {
        for (var i = 0; i < listToSearch.length; i++) {
            if (k.XCSAccessAnyone === listToSearch[i]) {
                return true;
            }
        }
        return false;
    }

    if (isAnyoneAllowedInACL(list)) {
        konsole.log(req, '[Auth - isAnyoneAllowed] access to anyone is allowed.');
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb);
    }

    // *** Check #2 ***
    // - is the user in the list?
    // - is the '*:authenticated' flag in the list?

    konsole.log(req, '[Auth - authorizeUser] Check list ' + listname + ': is ' + username + ' or "*:authenticated" is in the following list?: ' + JSON.stringify(list));

    for (var i = 0; i < list.length; i++) {
        if ((username === list[i]) || ('*:authenticated' === list[i])) {
            if (username === list[i]) {
                konsole.log(req, '[Auth - authorizeUser] ' + username + ' matched: access granted.');
            } else {
                konsole.log(req, '[Auth - authorizeUser] "*:authenticated" matched: access granted.');
            }
            xcsutil.logLevelDec(req);
            return cb();
        }
    }

    // *** Check #3 ***
    // If the list is 'canViewBots' list, check also the 'canCreateBots' since a bot creator can also view bots
    if (listname === k.XCSCanViewBots) {

        konsole.log(req, '[Auth - authorizeUser] Since we are checking the list ' + k.XCSCanViewBots + ', check also the ' + k.XCSCanCreateBots + ' list because a bot creator can also view bots');

        list = req.authCache && req.authCache.canCreateBots;
        if (!list) {
            list = expandedACL.canCreateBots;
            listname = k.XCSCanCreateBots;
        } else {
            listname = k.XCSCanCreateBots + ' (in req.authCache)';
        }

        konsole.log(req, '[Auth - authorizeUser] Check list ' + listname + ': is ' + username + ' in the following list?: ' + JSON.stringify(list));

        for (var j = 0; j < list.length; j++) {
            if ((username === list[j]) || ('*:authenticated' === list[j])) {
                konsole.log(req, '[Auth - authorizeUser] ' + username + ' matched: access granted.');
                xcsutil.logLevelDec(req);
                return cb();
            }
        }
    }

    // *** Check #4 ***
    // - is the user an admin?

    konsole.log(req, '[Auth - authorizeUser] check if ' + username + ' is an administrator...');
    xcssecurity.userIsAdministrator(req, username, function (err) {
        if (err) {
            var error = {
                status: 403,
                message: 'Forbidden'
            };
            konsole.log(req, '[Auth - authorizeUser] ' + username + ' is not an administrator: access denied.');
            xcsutil.logLevelDec(req);
            return cb(error);
        } else {
            konsole.log(req, '[Auth - authorizeUser] ' + username + ' is an administrator: access granted.');
            xcsutil.logLevelDec(req);
            return cb();

        }
    });

}

function enforceRole(req, res, expandedACL, list, listname, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - enforceRole] enforceRole...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (req && req.session) {
        konsole.log(req, '[Auth - enforceRole] reloading session...');
        req.session.reload(function () {
            var cacheToBeUsed = req.authCache;
            if (!cacheToBeUsed) {
                cacheToBeUsed = expandedACL;
            }

            konsole.log(req, '[Auth - enforceRole] session reloaded.');

            konsole.debug(req, '*******************************************');
            konsole.debug(req, '**************** Auth cache ***************');
            konsole.debug(req, '*******************************************');
            konsole.debug(req, 'Cache contents: ' + JSON.stringify(cacheToBeUsed, null, 4));

            // Before we enforce anything, first check whether we're allowing anyone ('*')
            isAnyoneAllowed(req, expandedACL, list, function (err) {
                if (err) {
                    konsole.warn(req, '[Auth - enforceRole] anyone (*) access: denied.');
                    verifyClientCertSessionAndBasicAuth(req, res, function (err, username) {
                        if (err) {
                            xcsutil.logLevelDec(req);
                            return cb(err);
                        } else {
                            // If we're dealing with a certificated request, 'username' will be undefined
                            if (username) {
                                authorizeUser(req, username, expandedACL, list, listname, function (err) {
                                    xcsutil.logLevelDec(req);
                                    if (err) {
                                        return cb(err);
                                    } else {
                                        return cb();
                                    }
                                });
                            } else {
                                // It's a certificate. Let's move on...
                                xcsutil.logLevelDec(req);
                                return cb();
                            }
                        }
                    });
                } else {
                    xcsutil.logLevelDec(req);
                    return cb();
                }
            });
        });
    } else {
        konsole.error(req, '[Auth - enforceRole] session not available!');
        return cb({
            status: 500,
            message: 'Session not available'
        });
    }
}

auth.enforceAdministratorRole = function (req, res, next) {

    var logLevel = xcsutil.logLevelInc(req);

    xcsutil.displayLogDivision(req, '[Auth - enforceAdministratorRole - START] enforceAdministratorRole...');

    var functionTitle = '[Auth - enforceAdministratorRole] enforceAdministratorRole';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    function verifyIfUserIsAdmin(username, cb) {
        xcssecurity.userIsAdministrator(req, username, function (err) {
            if (err) {
                konsole.error(req, '[Auth - verifyIfUserIsAdmin] error: ' + JSON.stringify(err));
                xcsutil.displayLogDivision(req, '[Auth - enforceAdministratorRole - END] enforceAdministratorRole');
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return cb({
                    status: 403,
                    message: err
                });
            } else {
                konsole.log(req, '[Auth - verifyIfUserIsAdmin] ' + username + ' is an administrator: access granted.');
                xcsutil.displayLogDivision(req, '[Auth - enforceAdministratorRole - END] enforceAdministratorRole');
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return cb();
            }
        });
    }

    verifyClientCertSessionAndBasicAuth(req, res, function (err, username) {
        if (err) {
            konsole.error(req, '[Auth - verifyClientCertSessionAndBasicAuth] error: ' + JSON.stringify(err));
            auth.make401Response(req, res, function (err) {
                xcsutil.displayLogDivision(req, '[Auth - verifyClientCertSessionAndBasicAuth - END] enforceAdministratorRole');
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
                return res.end(err.message);
            });
        } else {
            // If we're dealing with a certificated request, 'username' will be undefined
            if (username) {
                konsole.log(req, '[Auth - verifyClientCertSessionAndBasicAuth] credential obtained: ' + username + '. Verifying admin access...');
                verifyIfUserIsAdmin(username, function (err) {
                    if (err) {
                        return xcsutil.standardizedResponse(res, 403, err.message);
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

// Verify that the user is a bot creator
auth.enforceBotCreatorRole = function (req, res, next) {

    xcsutil.displayLogDivision(req, '[Auth - enforceBotCreatorRole - START] enforceBotCreatorRole...');

    var functionTitle = '[Auth - enforceBotCreatorRole] enforceBotCreatorRole';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    enforceRole_internal(req, res, k.XCSCanCreateBots, function (err) {
        if (err) {
            auth.make401Response(req, res, function (err) {
                xcsutil.displayLogDivision(req, '[Auth - enforceBotCreatorRole - END] enforceBotCreatorRole');
                return res.end(err.message);
            });
        } else {
            xcsutil.displayLogDivision(req, '[Auth - enforceBotCreatorRole - END] enforceBotCreatorRole');
            return next();
        }
    });

};

// Verify that the user is a bot viewer
auth.enforceBotViewerRole = function (req, res, next) {

    xcsutil.displayLogDivision(req, '[Auth - enforceBotViewerRole START] enforceBotViewerRole...');

    var functionTitle = '[Auth - enforceBotViewerRole] enforceBotViewerRole';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    enforceRole_internal(req, res, k.XCSCanViewBots, function (err) {
        if (err) {
            auth.make401Response(req, res, function (err) {
                xcsutil.displayLogDivision(req, '[Auth - enforceBotViewerRole - END] enforceBotViewerRole');
                return res.end(err.message);
            });
        } else {
            xcsutil.displayLogDivision(req, '[Auth - enforceBotViewerRole - END] enforceBotViewerRole');
            return next();
        }
    });
};

// Verify that the user is a hosted repository creator
auth.enforceHostedRepositoryCreatorRole = function (req, res, next) {

    xcsutil.displayLogDivision(req, '[Auth - enforceHostedRepositoryCreatorRole - START] enforceHostedRepositoryCreatorRole...');

    var functionTitle = '[Auth - enforceHostedRepositoryCreatorRole] enforceHostedRepositoryCreatorRole';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    enforceRole_internal(req, res, k.XCSCanCreateHostedRepositories, function (err) {
        if (err) {
            auth.make401Response(req, res, function (err) {
                xcsutil.displayLogDivision(req, '[Auth - enforceHostedRepositoryCreatorRole - END] enforceHostedRepositoryCreatorRole');
                return res.end(err.message);
            });
        } else {
            xcsutil.displayLogDivision(req, '[Auth - enforceHostedRepositoryCreatorRole - END] enforceHostedRepositoryCreatorRole');
            return next();
        }
    });

};

// Load and cache the ACL document
auth.expandGroups = function (req, acl, cb) {

    xcsutil.logLevelInc(req);

    konsole.log(req, '[Auth - expandGroups] expanding ACL...');

    xcssecurity.expandGroups(req, acl, function (err, expandedACL, unavailableNodes) {
        xcsutil.logLevelDec(req);
        if (err) {
            var error = {
                status: 500,
                message: err
            };
            return cb(error, null, unavailableNodes);
        } else {
            return cb(null, expandedACL, unavailableNodes);
        }
    });

};

auth.retrieveExpandedACL = function (req, cb) {
    require('./acl.js').findAndExpandACLDocument(req, cb);
};

auth.loadAndCacheACLDocumentWithUUID = function (req, cb) {

    xcsutil.logLevelInc(req);

    var unitTestUUID = (req && req.headers[k.XCSUnitTestHeader]),
        query = {
            include_docs: true,
            limit: 1
        },
        self = auth;

    if (unitTestUUID) {
        query.startkey = [unitTestUUID];
        query.endkey = [unitTestUUID, {}];
    } else {
        query.startkey = k.XCSDesignDocumentACL;
    }

    var functionTitle = '[Auth - loadAndCacheACLDocumentWithUUID] load and cache document: ' + query.startkey + '...';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.retrieveExpandedACL(req, function (err, expandedACL) {
        if (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {
            konsole.debug(req, '[Auth - loadAndCacheACLDocumentWithUUID] expand groups with ACL document: ' + util.inspect(expandedACL));

            // Cache the structure

            konsole.debug(req, '[Auth - loadAndCacheACLDocumentWithUUID] cache reload succeeded: ' + util.inspect(newAuthCache));

            if (unitTestUUID) {
                var newAuthCache = {};
                newAuthCache.canCreateBots = expandedACL.canCreateBots;
                newAuthCache.canViewBots = expandedACL.canViewBots;
                newAuthCache.canCreateHostedRepositories = expandedACL.canCreateHostedRepositories;
                req.authCache = newAuthCache;
            }

            konsole.debug(req, '*******************************************');
            konsole.debug(req, '********* Auth cache is now loaded ********');
            konsole.debug(req, '*******************************************');
            konsole.debug(req, 'Cache expanded to: ' + JSON.stringify(expandedACL, null, 4));

            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);

            if (cb) {
                return cb();
            }
        }
    });

};

// Check if there's a param named "token", and if so, fetch a corresponding username from Redis
auth.consumeAuthenticationToken = function (req, res, next) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[Auth - consumeAuthenticationToken] checking for an authentication token in the URL...';

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
        konsole.log(req, '[Auth - consumeAuthenticationToken] fetching username for token ' + authToken + ' from Redis...');

        redis.client().get(k.XCSRedisAuthTokenPrefix + authToken, function (err, username) {
            if (err || !username) {
                konsole.log(req, '[Auth - consumeAuthenticationToken] the token ' + authToken + ' could not be found, maybe expired?');
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

module.exports = auth;