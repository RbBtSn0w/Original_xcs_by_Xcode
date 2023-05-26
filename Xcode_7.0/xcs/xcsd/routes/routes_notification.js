'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    authClass = require('../classes/authClass.js'),
    notificationClass = require('../classes/notificationClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    requireClientCertificate = authClass.requireClientCertificate.bind(authClass);

module.exports = function routes_notification_init(app) {

    app.post(k.XCSAPIBasePath + '/integrations/:id/notifications', prepareRequest, requireClientCertificate, notificationClass.sendNotifications.bind(notificationClass));

};