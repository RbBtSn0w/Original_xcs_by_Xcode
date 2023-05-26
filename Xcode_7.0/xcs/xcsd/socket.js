'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('./constants.js'),
    security = require('./util/xcssecurity.js'),
    konsole = require('./util/konsole.js'),
    xcsutil = require('./util/xcsutil.js'),
    te = require('./util/turboevents.js'),
    integration,
    auth,
    agent,
    XCSBuildService = 'build service',
    XCSControl = 'xcscontrol',
    XCSListener = 'unidentified listener',
    XCSDebugUser = 'debugging user',
    XCSDeviced = 'xcsdeviced',
    listenerCount = 0,
    builderCount = 0;

function socketdentifyType(socket) {
    if (socket.identity && socket.identity.subject) {
        if (socket.identity.subject.emailAddress.match(/^xcsbuildd@/)) {
            return XCSBuildService;
        } else if (socket.identity.subject.emailAddress === 'xcscontrol@xcs.apple.com') {
            return XCSControl;
        } else if (socket.identity.subject.emailAddress === 'xcsdeviced@xcs.apple.com') {
            return XCSDeviced;
        } else if (socket.identity.subject.emailAddress.match(/^debug@/)) {
            return XCSDebugUser;
        }
    }

    // TODO: find a way to distinguish between Xcode and web UI (maybe)

    return XCSListener;
}

function socketIsBuildService(socket) {
    return (socketdentifyType(socket) === XCSBuildService);
}

function socketIsControlDaemon(socket) {
    return (socketdentifyType(socket) === XCSControl);
}

function socketIsDebugUser(socket) {
    return (socketdentifyType(socket) === XCSDebugUser);
}

function socketIsListener(socket) {
    var type = socketdentifyType(socket);
    return (type === XCSListener || type === XCSDebugUser);
}

function socketIsAdminListener(socket) {
    // note: this is for unit tests only
    return (socketIsListener(socket) && (socket.username === k.XCSAdministrator));
}

function socketIsListenerForBotUpdates(socket) {
    // TODO: add a check in here to enforce bot viewer role
    return socketIsListener(socket);
}

function socketIsListenerForIntegrationUpdates(socket) {
    return socketIsListenerForBotUpdates(socket);
}

function socketIsListenerForIntegrationCancels(socket) {
    return socketIsListenerForIntegrationUpdates(socket) || socketIsBuildService(socket);
}

function socketIsListenerForDeviceUpdates(socket) {
    // TODO: determine if we need to force any particular role here
    return socketIsListener(socket);
}

function socketIsListenerForACLUpdates(socket) {
    return socketIsListener(socket);
}

function socketIsListenerForPortalSyncRequests(socket) {
    return (socketIsControlDaemon(socket) || socketIsDebugUser(socket));
}

function socketIsListenerForRepositoryRequests(socket) {
    return socketIsControlDaemon(socket);
}

module.exports = function socket_init(integrationObj, authObj, agentObj) {

    integration = integrationObj;
    auth = authObj;
    agent = agentObj;

    // Socket.io section
    te.on('connection', function SOCKTurboEventConnectionEvent(socket) {

        var socketType = socketdentifyType(socket);
        konsole.log(null, '[XCSNode TurboSocket] connection received from ' + socketType);

        if (socket.identity) {
            konsole.log(null, '    Identified as:', socket.identity.subject.CN);
        }

        // handling authentication
        socket.on(k.XCSSocketOnAuthenticate, function SOCKOnAuthenticateEvent(username, password, callback) {
            security.authenticateUser(null, username, password, callback);
        });

        // build services
        if (socketIsBuildService(socket)) {
            builderCount++;
            konsole.log(null, '    Active builders count: ' + builderCount);

            if (socket.identity.fingerprint) {
                agent.findOrCreateAgentWithFingerprint(null, socket.identity.fingerprint, function (err) {
                    if (err) {
                        konsole.error(null, 'Failed to register build agent: ' + JSON.stringify(err));
                    } else {
                        konsole.log(null, 'Successfully registered build agent.');
                    }
                });
            }

            integration.announcePendingIntegrations(null, function SOCKBuildServiceAnnouncePendingIntegrations() {
                socket.on('disconnect', function SOCKBuildServiceAnnouncePendingIntegrationsDisconnectEvent() {
                    konsole.log(null, '[XCSNode TurboSocket] client disconnected');

                    builderCount--;
                    konsole.log(null, '    Build service removed from the list.');
                    konsole.log(null, '    Active builders count: ' + builderCount);
                });
            });
        }

        // listeners (web UI, Xcode, etc.)
        else if (socketIsListener(socket)) {
            listenerCount++;
            konsole.log(null, '    Active listeners count: ' + listenerCount);

            socket.on('disconnect', function SOCKListenerDisconnectEvent() {
                konsole.log(null, '[XCSNode TurboSocket] client disconnected');

                listenerCount--;
                konsole.log(null, '    Listener removed from the list.');
                konsole.log(null, '    Active listeners count: ' + listenerCount);
            });
        }

        // TODO: lock this back down to build service only
        socket.on(k.XCSSocketOnRequestAdvisoryIntegrationStatus, function SOCKOnRequestAdvisoryIntegrationEvent(status) {
            te.broadcast(k.XCSIsListenerForIntegrationUpdates, k.XCSEmitNotificationNotificationAdvisoryIntegrationStatus, status);
        });

        // unit test endpoints
        socket.on(k.XCSSocketOnRequestAdvisoryPingPong, function SOCKOnRequestAdvisoryPingPongEvent(message, cb) {
            return xcsutil.safeCallback(cb, message);
        });

        socket.on(k.XCSSocketOnRequestAdvisoryPing, function SOCKOnRequestAdvisoryPingEvent(message) {
            socket.emit(k.XCSEmitNotificationNotificationPong, message);
        });

        socket.on(k.XCSSocketOnRequestAdvisoryPingAll, function SOCKOnRequestAdvisoryPingAllEvent(message) {
            te.broadcast(k.XCSIsListener, k.XCSEmitNotificationNotificationPing, message);
        });

        socket.on(k.XCSSocketOnRequestAdvisoryPingAdmins, function SOCKOnRequestAdvisoryPingAdmins(message) {
            te.broadcast(k.XCSIsAdminListener, k.XCSEmitNotificationNotificationPing, message);
        });
    });
};

module.exports.isBuildService = socketIsBuildService;
module.exports.isControlDaemon = socketIsControlDaemon;
module.exports.isListener = socketIsListener;
module.exports.isAdminListener = socketIsAdminListener;
module.exports.isListenerForBotUpdates = socketIsListenerForBotUpdates;
module.exports.isListenerForIntegrationUpdates = socketIsListenerForIntegrationUpdates;
module.exports.isListenerForIntegrationCancels = socketIsListenerForIntegrationCancels;
module.exports.isListenerForDeviceUpdates = socketIsListenerForDeviceUpdates;
module.exports.isListenerForACLUpdates = socketIsListenerForACLUpdates;
module.exports.isListenerForPortalSyncRequests = socketIsListenerForPortalSyncRequests;
module.exports.isListenerForRepositoryRequests = socketIsListenerForRepositoryRequests;