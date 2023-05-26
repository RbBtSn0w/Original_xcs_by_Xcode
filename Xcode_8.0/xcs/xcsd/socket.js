'use strict';

var k = require('./constants.js'),
    logger = require('./util/logger.js'),
    xcsutil = require('./util/xcsutil.js'),
    te = require('./util/turboevents.js'),
    worker = require('./classes/worker.js'),
    integration,
    auth,
    agent,
    XCSBuildService = 'build service',
    XCSControl = 'xcscontrol',
    XCSListener = 'unidentified listener',
    XCSDebugUser = 'debugging user',
    listenerCount = 0,
    builderCount = 0;

function socketIdentifyType(socket) {
    if (socket.identity && socket.identity.subject) {
        if (socket.identity.subject.emailAddress.match(/^builder[0-9]+@/)) {
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

function socketIsBuildService(socket) {
    return (socketIdentifyType(socket) === XCSBuildService);
}

function socketIsControlDaemon(socket) {
    return (socketIdentifyType(socket) === XCSControl);
}

function socketIsDebugUser(socket) {
    return (socketIdentifyType(socket) === XCSDebugUser);
}

function socketIsListener(socket) {
    var type = socketIdentifyType(socket);
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
    return socketIsListener(socket);
}

function socketIsListenerForToolchainUpdates(socket) {
    return socketIsListener(socket);
}

function socketIsListenerForACLUpdates(socket) {
    return socketIsListener(socket);
}

function socketIsListenerForPortalSyncRequests(socket) {
    return (socketIsControlDaemon(socket) || socketIsDebugUser(socket));
}

function socketIsListenerForRepositoryRequests(socket) {
    return socketIsListener(socket);
}

function socketIsListenerForPruningUpdates(socket) {
    return (socketIsControlDaemon(socket) || socketIsDebugUser(socket));
}

module.exports = function socket_init(integrationObj, authObj, agentObj) {

    integration = integrationObj;
    auth = authObj;
    agent = agentObj;

    // Socket.io section
    te.on('connection', function SOCKTurboEventConnectionEvent(socket) {

        var socketType = socketIdentifyType(socket);
        logger.info('Socket connection received from', socketType, (socket.identity ? '(' + socket.identity.subject.CN + ')' : ''));

        // handling authentication
        socket.on(k.XCSSocketOnAuthenticate, function SOCKOnAuthenticateEvent(username, password, callback) {
            auth.getAuthProvider().authenticate(null, username, password, callback);
        });

        // build services
        if (!worker.isDisabled && socketIsBuildService(socket)) {
            builderCount++;
            logger.debug('Currently connected build services:', builderCount);

            const agentName = socket.identity.subject.CN;

            socket.on('register', (message) => {
                if (socket.identity.fingerprint) {
                    const agentParams = {
                        name: agentName,
                        fingerprint: socket.identity.fingerprint,
                        username: message.username,
                        fullName: message.fullName
                    };

                    agent.registerAgent(null, agentParams)
                        .then(agent => {
                            logger.debug('Successfully registered agent "' + agent.name + '"');
                            integration.announcePendingIntegrations(null, function () {});
                        })
                        .catch(err => logger.error('Failed to register build agent:', err));
                } else {
                    logger.warn('Builder connected but has no fingerprint.');
                }

                socket.on('disconnect', () => {
                    agent.setAgentConnected(null, agentName, false)
                        .catch(err => logger.error('Failed to mark agent as disconnected:', err));
                });
            });

            socket.on('disconnect', () => {
                builderCount--;
                logger.info('Build service disconnected,', builderCount, 'build services remaining.');
            });

            socket.emit('requestRegistration', {});
        }

        // listeners (web UI, Xcode, etc.)
        else if (socketIsListener(socket)) {
            listenerCount++;
            logger.debug('Currently connected listeners:', listenerCount);

            socket.on('disconnect', function SOCKListenerDisconnectEvent() {
                listenerCount--;
                logger.info('Listener disconnected,', listenerCount, 'listeners remaining.');
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
module.exports.isListenerForToolchainUpdates = socketIsListenerForToolchainUpdates;
module.exports.isListenerForACLUpdates = socketIsListenerForACLUpdates;
module.exports.isListenerForPortalSyncRequests = socketIsListenerForPortalSyncRequests;
module.exports.isListenerForRepositoryRequests = socketIsListenerForRepositoryRequests;
module.exports.isListenerForPruningUpdates = socketIsListenerForPruningUpdates;
