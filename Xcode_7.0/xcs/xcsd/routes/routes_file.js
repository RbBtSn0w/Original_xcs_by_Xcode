'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var api = require('../constants.js').XCSAPIBasePath,
    authClass = require('../classes/authClass.js'),
    fileClass = require('../classes/fileClass.js'),
    routes_utils = require('./routes_utils.js');

var prepareRequest = routes_utils.prepareRequest,
    prepareRequestSkipVersionCheck = routes_utils.prepareRequestSkipVersionCheck,
    requireClientCertificate = authClass.requireClientCertificate.bind(authClass),
    serviceEnabled = authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass),
    enforceBotViewerRole = authClass.enforceBotViewerRole.bind(authClass);

module.exports = function routes_file_init(app) {

    app.get(api + '/integrations/:id/assets', prepareRequestSkipVersionCheck, serviceEnabled, enforceBotViewerRole, fileClass.downloadIntegrationArchive.bind(fileClass));
    app.get(api + '/integrations/:id/install_product', prepareRequestSkipVersionCheck, serviceEnabled, enforceBotViewerRole, fileClass.install.bind(fileClass));
    app.get(api + '/integrations/:id/:token/install_manifest.plist', prepareRequestSkipVersionCheck, serviceEnabled, authClass.consumeAuthenticationToken.bind(authClass), enforceBotViewerRole, fileClass.installManifest.bind(fileClass));
    app.get(api + '/assets/token/:token/*', prepareRequestSkipVersionCheck, serviceEnabled, authClass.consumeAuthenticationToken, enforceBotViewerRole, fileClass.download.bind(fileClass));
    app.get(api + '/assets/*', prepareRequestSkipVersionCheck, serviceEnabled, fileClass.download.bind(fileClass));
    app.get(api + '/profiles/ota.mobileconfig', prepareRequestSkipVersionCheck, serviceEnabled, fileClass.otaProfile.bind(fileClass));

    // New file APIs
    app.get(api + '/integrations/:id/files', prepareRequest, serviceEnabled, enforceBotViewerRole, fileClass.list.bind(fileClass));
    app.post(api + '/integrations/:id/files', prepareRequest, requireClientCertificate, fileClass.create.bind(fileClass));
    app.put(api + '/files/:id/upload', prepareRequest, requireClientCertificate, fileClass.upload.bind(fileClass));

    app.post(api + '/files/prune', prepareRequest, authClass.verifyIfServiceIsEnabledAllowCertificate.bind(authClass), authClass.enforceAdministratorRole.bind(authClass), fileClass.prune.bind(fileClass));
};