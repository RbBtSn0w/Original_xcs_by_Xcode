'use strict';

var express = require('express'),
    multer = require('multer'),
    auth = require('../classes/authClass.js'),
    file = require('../classes/fileClass.js'),
    routes_utils = require('./routes_utils.js'),
    config = require('config');


var prepareRequest = routes_utils.prepareRequest,
    requireClientCertificate = auth.requireClientCertificate,
    enforceBotViewerRole = auth.enforceBotViewerRole,
    path = config.get('path.assets'),
    upload = multer({
        dest: path,
        limits: {
            fieldNameSize: 100, // limit property name length (in bytes)
            fileSize: 10 * 1024 * 1024 * 1024 // limit total file size (in bytes)
        }
    });


var router = express.Router();

router.get('/integrations/:id/assets', prepareRequest, enforceBotViewerRole, file.downloadIntegrationArchive);
router.get('/integrations/:id/download_logs', prepareRequest, enforceBotViewerRole, file.downloadLogs);
router.get('/integrations/:id/install_product', prepareRequest, enforceBotViewerRole, file.install);
router.get('/integrations/:id/:token/install_manifest.plist', prepareRequest, auth.consumeAuthenticationToken, enforceBotViewerRole, file.installManifest);
router.get('/assets/token/:token/*', prepareRequest, auth.consumeAuthenticationToken, enforceBotViewerRole, file.download);
router.get('/assets/*', prepareRequest, file.download);
router.get('/profiles/ota.mobileconfig', prepareRequest, file.otaProfile);

// New file APIs
router.route('/integrations/:id/files')
    .all(prepareRequest)
    .get(enforceBotViewerRole, file.list)
    .post(requireClientCertificate, file.create);
router.put('/files/:id/upload', prepareRequest, requireClientCertificate, upload.single('file'), file.upload);

router.post('/files/prune', prepareRequest, auth.enforceAdministratorRole, file.prune);
router.get('/files/prune/space-required-to-integrate', prepareRequest, file.spaceRequiredForAllBotIntegrationSize);

module.exports = router;
