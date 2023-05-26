/*
    XCSAuthClass
    A class dedicated to manage authentication and authorization.
*/

'use strict';

var auth = require('basic-auth');

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    Errors = require('../util/error.js'),
    redisClass = require('./redisClass.js'),
    xcsutil = require('../util/xcsutil.js');

// By default, use OpenDirectory for authentication.
// Tests will override this to mock authentication.
var authProvider = require('./authProvider/openDirectory.js');

/* XCSAuthClass object */

function XCSAuthClass() {}

XCSAuthClass.prototype.setAuthProvider = function (newAuthProvider) {
    authProvider = newAuthProvider;
};

XCSAuthClass.prototype.getAuthProvider = function () {
    return authProvider;
};

XCSAuthClass.prototype.requireClientCertificate = function requireClientCertificate(req, res, next) {
    var log = logger.withRequest(req);

    verifyClientCertificate_internal(req, function AUTHRequireClientCertificateCallback(err) {
        if (err) {
            xcsutil.profilerSummary(req);
            return respondWithError(req, res, err);
        } else {
            log.info('Allowing request from an internal daemon.');
            return next();
        }
    });

};

XCSAuthClass.prototype.login = function login(req, res) {
    var log = logger.withRequest(req),
        functionTitle = '[Auth - login] login';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    function replyWithError(err) {
        xcsutil.profilerSummary(req);
        if (401 === err.status) {
            log.info('Basic authentication failed. Sending challenge response.');
            return respondWithError(req, res, err);
        } else {
            log.error('Error trying to login:', err);
            return xcsutil.standardizedErrorResponse(res, err);
        }
    }

    log.debug('Logging in using basic authentication.');

    parseBasicAuthHeaderAndAuthenticate(req, function AUTHLoginParseBasicAuthHeaderAndAuthenticate(err) {
        if (err) {
            if (req.session) {
                req.session.regenerate(function AUTHLoginRegenerateSessionCallback() {
                    replyWithError(err);
                });
            } else {
                replyWithError(err);
            }
        } else {
            log.info('Login successful.');
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

XCSAuthClass.prototype.logout = function logout(req, res) {
    var log = logger.withRequest(req);

    log.info('Logging out of user session.');

    function finishLogout() {
        log.info('Logout succeeded.');
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
    var log = logger.withRequest(req);

    var self = this,
        force_login_attempted_already = (req.session && req.session.force_login);

    function continueWithForceLogin() {

        // It's the first call: return the initial XCSForceLogin value

        req.session.force_login = '1';

        return respondWithError(req, res, new Errors.Unauthorized('Unauthorized'));
    }

    if (!force_login_attempted_already) {

        log.info('Force login requested.');

        // Clear the session and return.
        if (req.session) {
            log.debug('Clearing the session and forcing login.');
            req.session.regenerate(function AUTHForceLoginRegenerateSessionCallback() {
                continueWithForceLogin();
            });
        } else {
            continueWithForceLogin();
        }

    } else {
        log.info('Already attempted force login, logging in normally.');
        self.login(req, res);
    }

};

XCSAuthClass.prototype.isLogged = function isLogged(req, res) {

    var log = logger.withRequest(req);

    var username = ((req.session && req.session.username) || null),
        userIsLogged = (username ? true : false);

    log.info('User', username, 'is logged in?', userIsLogged);

    return xcsutil.standardizedResponse(res, 200, userIsLogged);

};

function isAnyoneAllowed(req, expandedACL, list, cb) {
    var log = logger.withRequest(req),
        functionTitle = '[Auth - isAnyoneAllowed] verify for anyone (*) access';

    log.debug('Checking if guest access is allowed.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    // *** Check #1 ***
    // - is the user in the list?
    // - is the '*:authenticated' flag in the list?

    if (isAnyoneAllowedInACL(list)) {
        log.debug('Guest access is allowed.');
        return xcsutil.safeCallback(cb);
    }


    // *** Check #2 ***
    // If the list is 'canViewBots' list, check also the 'canCreateBots' since a bot creator can also view bots

    if (list === expandedACL.canViewBots) {
        list = expandedACL.canCreateBots;
        if (!list) {
            list = expandedACL.canCreateBots;
        }

        log.debug('Guest access not allowed for viewing bots, but it might be allowed for creating bots.');

        if (isAnyoneAllowedInACL(list)) {
            log.debug('Guest access is allowed.');
            return xcsutil.safeCallback(cb);
        }
    }

    log.debug('Guest access is not allowed.');
    xcsutil.safeCallback(cb, new Errors.Unauthorized('Guest access is not allowed.'));
}

function isUserInList(req, username, list, listName, strictCheck) {
    var log = logger.withRequest(req),
        item,
        sessionUserName;

    var lowercaseUsername = username.toLowerCase();

    log.debug('Users in', listName + ': ', list);

    for (var i = 0; i < list.length; i++) {
        item = list[i];
        var lowercaseItem = item.toLowerCase();

        if (strictCheck) {
            if (lowercaseUsername === lowercaseItem) {
                log.debug('User', lowercaseUsername, 'found in list', listName + ': access granted.');
                return true;
            }
        } else {
            if (lowercaseUsername === lowercaseItem) {
                log.debug('User', lowercaseUsername, 'found in list', listName + ': access granted.');
                return true;
            }
            if ('*:authenticated' === item) {
                // We need to verify whether the specified user is the one that is logged in
                sessionUserName = (req && req.session && req.session.username);
                if (sessionUserName === username) {
                    log.debug('List', listName, 'allows any authenticated user, and', username, 'is the current user: access granted.');
                    return true;
                }
            }
        }
    }

    log.debug('Could not find user', username, 'in list', listName);
    return false;
}

function authorizeUser(req, username, expandedACL, list, listname, strictCheck, cb) {
    var log = logger.withRequest(req),
        functionTitle;

    if (strictCheck) {
        functionTitle = '[Auth - authorizeUser] strict authorization check of user "' + username + '" using ACL: "' + listname + '"';
    } else {
        functionTitle = '[Auth - authorizeUser] authorization check of user "' + username + '" using ACL: "' + listname + '"';
    }

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (listname === k.XCSCanCreateBots && req) {
        let clientVersion = req.headers[k.XCSClientVersion];
        if (clientVersion) {
            clientVersion = parseInt(clientVersion, 10);

            if (clientVersion < k.XCSMinimumSupportedEditingClientVersion) {
                return xcsutil.safeCallback(cb, new Errors.Forbidden('This client is too old to create and edit bots on this server.'));
            }
        }
    }

    // *** Check #1 ***
    // - is anyone allowed?

    if (isAnyoneAllowedInACL(list)) {
        log.debug('Authorizing user because anyone is allowed in', listname);
        return xcsutil.safeCallback(cb);
    } else {
        log.debug('Not all users are allowed in', listname + ', checking if', username, 'is in the list.');
    }

    // *** Check #2 ***
    // - is the user in the list?
    // - is the '*:authenticated' flag in the list?

    if (isUserInList(req, username, list, listname, strictCheck)) {
        return xcsutil.safeCallback(cb);
    }

    // *** Check #3 ***
    // If the list is 'canViewBots' list, check also the 'canCreateBots' since a bot creator can also view bots

    if (listname === k.XCSCanViewBots) {
        log.debug('User is not in the', listname, 'list, maybe they are in the', k.XCSCanCreateBots, 'list?');

        listname = k.XCSCanCreateBots;
        list = expandedACL.canCreateBots;

        if (isUserInList(req, username, list, listname, strictCheck)) {
            return xcsutil.safeCallback(cb);
        }
    }

    // *** Check #4 ***
    // - is the user an admin?

    authProvider.isAdministrator(req, username, function AUTHAuthorizeUserUserIsAdministrator(err) {
        if (err) {
            err = new Errors.Forbidden('User "' + username + '" is not allowed to perform this action.');
            log.debug(err.message);
            return xcsutil.safeCallback(cb, err);
        } else {
            log.debug(username, 'is an administrator: access granted.');
            return xcsutil.safeCallback(cb);
        }
    });

}

function enforceRole(req, res, expandedACL, list, listname, cb) {
    var log = logger.withRequest(req),
        functionTitle = '[Auth - enforceRole] enforceRole using list: ' + listname;

    log.debug('Enforcing user role using list', listname);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (req && req.session) {
        log.debug('Enforcing role against ACL:', JSON.stringify(expandedACL, null, 4));

        // Before we enforce anything, first check whether we're allowing anyone ('*')
        isAnyoneAllowed(req, expandedACL, list, function AUTHEnforceRoleIsAnyoneAllowed(err) {
            if (err) {
                log.debug('Guest access is not allowed. Checking credentials.');
                verifyClientCertSessionAndBasicAuth(req, res, function AUTHEnforceRoleVerifyClientCertSessionAndBasicAuth(err, username) {
                    if (err) {
                        if (401 === err.status) {
                            log.info('Basic authentication failed. Sending challenge response.');
                            return respondWithError(req, res, err);
                        } else {
                            return xcsutil.safeCallback(cb, err);
                        }
                    } else {
                        // If we're dealing with a certificated request, 'username' will be undefined
                        if (username) {
                            authorizeUser(req, username, expandedACL, list, listname, false, function AUTHEnforceRoleAuthorizeUser(err) {
                                if (err) {
                                    return xcsutil.safeCallback(cb, err);
                                } else {
                                    return xcsutil.safeCallback(cb);
                                }
                            });
                        } else {
                            // It's a certificate. Let's move on...
                            return xcsutil.safeCallback(cb);
                        }
                    }
                });
            } else {
                return xcsutil.safeCallback(cb);
            }
        });
    } else {
        log.error('Cannot enforce a user role without a session.');
        return xcsutil.safeCallback(cb, {
            status: 500,
            message: 'Session not available.'
        });
    }
}

function enforceRole_internal(req, res, listname, cb) {
    var log = logger.withRequest(req),
        aclClass = require('./aclClass.js');

    log.debug('Checking if the request is from one of our internal daemons.');

    verifyClientCertificate_internal(req, function AUTHEnforceRoleInternalVerifyClientCertificate(err) {
        if (err) {
            log.debug('Request is not from an internal daemon, checking session against ACLs.');
            // Attempt to retrieve the ACL belonging to the request (either a unit test or regular one)
            performRetrieveExpandedACLAndEnforceRole(req, res, aclClass, listname, cb);
        } else {
            log.info('Allowing request from an internal daemon.');
            return xcsutil.safeCallback(cb);
        }
    });

}

XCSAuthClass.prototype.isBotCreator = function isBotCreator(req, res) {
    var log = logger.withRequest(req);

    log.info('Checking if current user is a bot creator.');

    enforceRole_internal(req, res, k.XCSCanCreateBots, function isBotCreatorCallback(err) {
        var isBotCreator = (!err);
        return xcsutil.standardizedResponse(res, 200, isBotCreator);
    });

};

function authorize_internal(req, listname, username, strictCheck, cb) {
    var log = logger.withRequest(req);

    log.debug('Checking if user', username, 'is in list', listname);

    var aclClass = require('./aclClass.js'),
        useRedis = true;

    aclClass.findAndExpandACLDocument(req, useRedis, function AUTHAuthorizeInternalFindAndExpandACLDocument(err, expandedACL) {
        if (err) {
            err.message = 'Error loading expanded ACL document: ' + JSON.stringify(err);
            return xcsutil.safeCallback(cb, err);
        } else {
            var list = expandedACL[listname];

            if (username) {
                authorizeUser(req, username, expandedACL, list, listname, strictCheck, function AUTHAuthorizeInternalAuthorizeUser(err) {
                    if (err) {
                        err.message = 'Could not authorize user: ' + JSON.stringify(err);
                    }
                    return xcsutil.safeCallback(cb, err);
                });
            } else {
                isAnyoneAllowed(req, expandedACL, list, function AUTHAuthorizeInternalIsAnyoneAllowed(err) {
                    if (err) {
                        err.message = 'Could not allow guest access: ' + JSON.stringify(err);
                    }
                    return xcsutil.safeCallback(cb, err);
                });
            }
        }
    });
}

XCSAuthClass.prototype.authorizeUserToCreateRepositories = function authorizeUserToCreateRepositories(req, username, cb) {
    var functionTitle = '[Auth - authorizeUserToCreateRepositories] authorizeUserToCreateRepositories';
    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    let err = new Errors.Forbidden('Xcode Server hosted repositories have been removed in Xcode 9.0');
    return xcsutil.safeCallback(cb, err);
};

XCSAuthClass.prototype.authorizeUserToCreateBots = function authorizeUserToCreateBots(req, username, cb) {
    var functionTitle = '[Auth - authorizeUserToCreateBots] authorizeUserToCreateBots';
    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authorize_internal(req, k.XCSCanCreateBots, username, false, function AUTHAuthorizeUserToCreateBotsCallback(err) {
        if (err) {
            err.message = 'Error authorizing user ' + username + ' to create bots: ' + JSON.stringify(err);
        }
        return xcsutil.safeCallback(cb, err);
    });

};

XCSAuthClass.prototype.authorizeUserToViewBots = function authorizeUserToViewBots(req, username, cb) {
    var functionTitle = '[Auth - authorizeUserToViewBots] authorizeUserToViewBots';
    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    authorize_internal(req, k.XCSCanViewBots, username, false, function AUTHAuthorizeUserToViewBotsCallback(err) {
        if (err) {
            err.message = 'Error authorizing user ' + username + ' to view bots: ' + JSON.stringify(err);
        }
        return xcsutil.safeCallback(cb, err);
    });

};

XCSAuthClass.prototype.enforceAdministratorRole = function enforceAdministratorRole(req, res, next) {
    var log = logger.withRequest(req);
    log.info('Requiring administrator privileges for this request.');

    var functionTitle = '[Auth - enforceAdministratorRole] enforceAdministratorRole';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    verifyClientCertSessionAndBasicAuth(req, res, function AUTHEnforceAdministratorRoleVerifyClientCertSessionAndBasicAuth(err, username) {
        if (err) {
            if (401 === err.status) {
                return respondWithError(req, res, err);
            } else {
                return xcsutil.standardizedErrorResponse(res, err);
            }
        } else {
            // If we're dealing with a certificated request, 'username' will be undefined
            if (username) {
                log.debug('Successfully validated login as', username);
                verifyIfUserIsAdmin(req, username, next);
            } else {
                log.debug('Client certificate is valid: access granted.');
                return next();
            }
        }
    });

};

XCSAuthClass.prototype.enforceBotCreatorRole = function enforceBotCreatorRole(req, res, next) {
    var log = logger.withRequest(req),
        functionTitle = '[Auth - enforceBotCreatorRole] enforceBotCreatorRole';

    log.info('Requiring bot creator role for this request.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    enforceRole_internal(req, res, k.XCSCanCreateBots, function AUTHEnforceBotCreatorRole(err) {
        if (err) {
            if (401 === err.status) {
                return respondWithError(req, res, err);
            } else {
                return xcsutil.standardizedErrorResponse(res, err);
            }
        } else {
            return next();
        }
    });

};

XCSAuthClass.prototype.enforceBotViewerRole = function enforceBotViewerRole(req, res, next) {
    var log = logger.withRequest(req);
    log.info('Requiring bot viewer role for this request.');

    var functionTitle = '[Auth - enforceBotViewerRole] enforceBotViewerRole';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    enforceRole_internal(req, res, k.XCSCanViewBots, function AUTHEnforceBotViewerRole(err) {
        if (err) {
            if (401 === err.status) {
                return respondWithError(req, res, err);
            } else {
                return xcsutil.standardizedErrorResponse(res, err);
            }
        } else {
            return next();
        }
    });
};

XCSAuthClass.prototype.enforceRemovedHostedRepositorySupport = function enforceRemovedHostedRepositorySupport(req, res) {
    var functionTitle = '[Auth - enforceRemovedHostedRepositorySupport] enforceRemovedHostedRepositorySupport';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    let err = new Errors.Forbidden('Xcode Server hosted repositories have been removed in Xcode 9.0');
    return respondWithError(req, res, err);
};

XCSAuthClass.prototype.consumeAuthenticationToken = function consumeAuthenticationToken(req, res, next) {
    var log = logger.withRequest(req),
        functionTitle = '[Auth - consumeAuthenticationToken] checking for an authentication token in the URL';

    log.debug('Authenticating using an authentication token, if present.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var authToken = req.params.token;

    if (!authToken) {
        log.debug('No authentication token found, continuing.');
        return next();
    } else {
        // get the auth token out of Redis
        log.debug('Fetching username for authentication token', authToken, 'from Redis.');

        redisClass.client().get(k.XCSRedisAuthTokenPrefix + authToken, function AUTHRedisGetAuthTokenPrefix(err, username) {
            if (err || !username) {
                log.warn('The authentication token', authToken, 'could not be found. Maybe it expired?');
                return next();
            }

            // if we have a username, stash it on the session
            if (username.length > 0) {
                log.info('Using authentication token to login as', username);
                req.session.username = username;
            } else {
                log.warn('Authentication token was provided, but it has no associated username.');
            }

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

function verifyIfUserIsAdmin(req, username, cb) {
    var log = logger.withRequest(req);

    log.debug('Verifying that', username, 'is an administrator.');

    authProvider.isAdministrator(req, username, function AUTHEnforceAdministratorRoleUserIsAdministrator(err) {
        if (err) {
            return xcsutil.safeCallback(cb, new Errors.Forbidden('User "' + username + '" cannot perform this action because they are not an administrator.'));
        } else {
            log.debug(username, 'is an administrator: access granted.');
            return xcsutil.safeCallback(cb);
        }
    });
}

function performRetrieveExpandedACLAndEnforceRole(req, res, aclClass, listname, cb) {
    var log = logger.withRequest(req);

    // find the expanded ACL in Redis
    aclClass.findExpandedACLInRedis(req, function (err, expandedACL) {
        if (err) {
            log.warn('Could not load expanded ACL, trying to enforce role using non-expanded version.');

            // find the non-expanded ACL version
            aclClass.findOrCreateDefaultACLDocument(req, true, function (err, aclDoc) {
                if (err) {
                    err.message = 'Error loading ACL document: ' + JSON.stringify(err);
                    return xcsutil.safeCallback(cb, err);
                } else {
                    log.debug('Found non-expanded ACL. Attempting to enforce role.');

                    // attempt to find the user literally
                    var list = aclDoc[listname];
                    enforceRole(req, res, aclDoc, list, listname, function (err) {
                        if (err) {
                            // user not found. We'll need to expand the ACL and try again...
                            aclClass.askODToExpandACLDocument(req, function (err) {
                                if (err) {
                                    return xcsutil.safeCallback(cb, err);
                                } else {
                                    process.nextTick(function () {
                                        performRetrieveExpandedACLAndEnforceRole(req, res, aclClass, listname, cb);
                                    });
                                }
                            });
                        } else {
                            return xcsutil.safeCallback(cb);
                        }
                    });
                }
            });

        } else {
            // found the expanded ACL. Enforce the role...
            var list = expandedACL[listname];
            enforceRole(req, res, expandedACL, list, listname, cb);
        }
    });
}

/* Module exports */

module.exports = xcsutil.bindAll(new XCSAuthClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function verifyClientCertificate_internal(req, cb) {
    authProvider.validateClientCertificate(req, function (err, isValid) {
        if (err) {
            xcsutil.safeCallback(cb, err);
        } else if (isValid) {
            xcsutil.safeCallback(cb);
        } else {
            xcsutil.safeCallback(cb, new Errors.Forbidden('Could not login because a valid client certificate is required and was not provided.'));
        }
    });
}

function parseBasicAuthHeaderAndAuthenticate(req, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Auth - parseBasicAuthHeaderAndAuthenticate] basic auth verification';

    log.debug('Attempting to authenticate using basic authentication.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    // => { name: 'something', pass: 'whatever' }
    var user = auth(req);

    if (user) {
        var username = user.name,
            password = user.pass;

        log.info('Authenticating user', username);

        authProvider.authenticate(req, username, password, function AUTHParseBasicAuthHeaderAndAuthenticateAuthenticateUser(err) {
            if (err) {
                log.error('User authentication failed:', err);
                xcsutil.safeCallback(cb, new Errors.Unauthorized('Could not log in because the username or password is incorrect.'));
            } else {
                log.info('User', username, 'authenticated successfully.');
                if (req && req.session) {
                    req.session.username = username;
                    req.session.save(function AUTHSessionSave() {
                        log.debug('Saved session ID', req.sessionID, 'Session contents:', JSON.stringify(req.session));
                        return xcsutil.safeCallback(cb, null, username);
                    });
                } else {
                    log.error('Unable to login because the session object is not available.');
                    return xcsutil.safeCallback(cb, {
                        status: 500,
                        message: 'Internal Server Error (xcsd): unable to login because the session is not available'
                    });
                }
            }
        });
    } else {
        var session = (req && req.session);
        var err = new Errors.Unauthorized('Could not log in because a username was not provided.');
        log.debug(err.message, 'Session: ', JSON.stringify(session));
        xcsutil.safeCallback(cb, err);
    }

}

function verifyClientCertSessionAndBasicAuth(req, res, cb) {
    var log = logger.withRequest(req),
        functionTitle = '[Auth - verifyClientCertSessionAndBasicAuth] verifyClientCertSessionAndBasicAuth',
        sessionUsername;

    log.debug('Verifying the request is logged in with a valid session.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (req && req.session && req.session.username) {
        sessionUsername = req.session.username;
        log.debug('A session is already active for user', sessionUsername);
        return xcsutil.safeCallback(cb, null, sessionUsername);
    }

    // Verify if we are dealing with a certificated request
    verifyClientCertificate_internal(req, function AUTHVerifyClientCertSessionAndBasicAuthCallback(err) {
        if (err) {
            log.debug('Verifying client certificate failed, trying username and password authentication.');

            parseBasicAuthHeaderAndAuthenticate(req, function AUTHVerifyClientCertParseBasicAuthHeaderAndAuthenticateCallback(err, username) {
                if (err) {
                    log.error('Basic authentication failed:', err);
                    log.debug('Session ID', req.sessionID, 'contents:', JSON.stringify(req.session));

                    if (401 === err.status) {
                        return respondWithError(req, res, err);
                    } else {
                        return xcsutil.safeCallback(cb, err);
                    }
                } else {
                    log.debug('Basic authentication for user', username, 'succeeded.');
                    return xcsutil.safeCallback(cb, null, username);
                }
            });

        } else {
            log.debug('Client certificate present, verification succeeded.');
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

function respondWithError(req, res, err) {
    if (401 === err.status) {
        res.setHeader('WWW-Authenticate', (req.socket.localPort === 20344) ? 'negotiate' : 'Basic realm="Xcode Server"');
    }
    return xcsutil.standardizedErrorResponse(res, err);
}
