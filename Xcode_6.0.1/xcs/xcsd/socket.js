'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('./constants.js'),
    security = require('./util/xcssecurity.js'),
    konsole = require('./util/konsole.js'),
    te = require('./util/turboevents.js'),
    integration,
    auth,
    XCSBuildService = 'build service',
    XCSControl = 'xcscontrol',
    XCSListener = 'unidentified listener',
    XCSDebugUser = 'debugging user',
    listenerCount = 0,
    builderCount = 0;

function isBuildService(socket) {
    return (identifySocketType(socket) === XCSBuildService);
}

function isControlDaemon(socket) {
    return (identifySocketType(socket) === XCSControl);
}

function isDebugUser(socket) {
    return (identifySocketType(socket) === XCSDebugUser);
}

function isListener(socket) {
    var type = identifySocketType(socket);
    return (type === XCSListener || type === XCSDebugUser);
}

function isAdminListener(socket) {
    // note: this is for unit tests only
    return (isListener(socket) && (socket.username === k.XCSAdministrator));
}

function isListenerForBotUpdates(socket) {
    // TODO: add a check in here to enforce bot viewer role
    return isListener(socket);
}

function isListenerForIntegrationUpdates(socket) {
    return isListenerForBotUpdates(socket);
}

function isListenerForIntegrationCancels(socket) {
    return isListenerForIntegrationUpdates(socket) || isBuildService(socket);
}

function isListenerForDeviceUpdates(socket) {
    // TODO: determine if we need to force any particular role here
    return isListener(socket);
}

function isListenerForACLUpdates(socket) {
    return isListener(socket);
}

function isListenerForPortalSyncRequests(socket) {
    return (isControlDaemon(socket) || isDebugUser(socket));
}

function isListenerForRepositoryRequests(socket) {
    return isControlDaemon(socket);
}

function identifySocketType(socket) {
    if (socket.identity && socket.identity.subject) {
        if (socket.identity.subject.emailAddress === 'xcsbuildd@xcs.apple.com') {
            return XCSBuildService;
        } else if (socket.identity.subject.emailAddress === 'xcscontrol@xcs.apple.com') {
            return XCSControl;
        } else if (socket.identity.subject.emailAddress.match(/^debug@/)) {
            return XCSDebugUser;
        }
    }

    // TODO: find a way to distinguish between Xcode and web UI (maybe)

    return XCSListener;
}

module.exports = function (integrationObj, authObj) {

    integration = integrationObj;
    auth = authObj;

    // Socket.io section
    te.on('connection', function (socket) {

        var socketType = identifySocketType(socket);
        konsole.log(null, '[XCSNode TurboSocket] connection received from ' + socketType);

        if (socket.identity) {
            konsole.log(null, '    Identified as:', socket.identity.subject.CN);
        }

        // handling authentication
        socket.on(k.XCSSocketOnAuthenticate, function (username, password, callback) {
            security.authenticateUser(null, username, password, callback);
        });

        // build services
        if (isBuildService(socket)) {
            builderCount++;
            konsole.log(null, '    Active builders count: ' + builderCount);

            integration.announcePendingIntegrations(null, function () {
                socket.on('disconnect', function () {
                    konsole.log(null, '[XCSNode TurboSocket] client disconnected');

                    builderCount--;
                    konsole.log(null, '    Build service removed from the list.');
                    konsole.log(null, '    Active builders count: ' + builderCount);
                });
            });
        }

        // listeners (web UI, Xcode, etc.)
        else if (isListener(socket)) {
            listenerCount++;
            konsole.log(null, '    Active listeners count: ' + listenerCount);

            socket.on('disconnect', function () {
                konsole.log(null, '[XCSNode TurboSocket] client disconnected');

                listenerCount--;
                konsole.log(null, '    Listener removed from the list.');
                konsole.log(null, '    Active listeners count: ' + listenerCount);
            });
        }

        // TODO: lock this back down to build service only
        socket.on(k.XCSSocketOnRequestAdvisoryIntegrationStatus, function (status) {
            te.broadcast(k.XCSIsListenerForIntegrationUpdates, k.XCSEmitNotificationNotificationAdvisoryIntegrationStatus, status);
        });

        // unit test endpoints
        socket.on(k.XCSSocketOnRequestAdvisoryPingPong, function (message, cb) {
            cb(message);
        });

        socket.on(k.XCSSocketOnRequestAdvisoryPing, function (message) {
            socket.emit(k.XCSEmitNotificationNotificationPong, message);
        });

        socket.on(k.XCSSocketOnRequestAdvisoryPingAll, function (message) {
            te.broadcast(k.XCSIsListener, k.XCSEmitNotificationNotificationPing, message);
        });

        socket.on(k.XCSSocketOnRequestAdvisoryPingAdmins, function (message) {
            te.broadcast(k.XCSIsAdminListener, k.XCSEmitNotificationNotificationPing, message);
        });
    });
};

module.exports.isBuildService = isBuildService;
module.exports.isControlDaemon = isControlDaemon;
module.exports.isListener = isListener;
module.exports.isAdminListener = isAdminListener;
module.exports.isListenerForBotUpdates = isListenerForBotUpdates;
module.exports.isListenerForIntegrationUpdates = isListenerForIntegrationUpdates;
module.exports.isListenerForIntegrationCancels = isListenerForIntegrationCancels;
module.exports.isListenerForDeviceUpdates = isListenerForDeviceUpdates;
module.exports.isListenerForACLUpdates = isListenerForACLUpdates;
module.exports.isListenerForPortalSyncRequests = isListenerForPortalSyncRequests;
module.exports.isListenerForRepositoryRequests = isListenerForRepositoryRequests;