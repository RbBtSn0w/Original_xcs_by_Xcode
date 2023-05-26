/*
    XCSFileClass
*/

'use strict';

var _ = require('underscore'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    uuid = require('node-uuid'),
    exec = require('child_process').exec,
    execFile = require('child_process').execFile,
    config = require('config');

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    Errors = require('../util/error.js'),
    authClass = require('./authClass.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    botClass = require('./botClass.js'),
    integrationSearchClass = require('./integrationSearchClass.js'),
    settings = require('./settingsClass.js'),
    redisClass = require('./redisClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    xcsbridge = require('../util/xcsbridge.js');

var assetsPath = config.get('path.assets');

function request(title, handler) {
    return function (req, res) {
        handler.call(this, req, res, function (err, statusCode, results) {
            if (err) {
                xcsutil.standardizedErrorResponse(res, err);
            } else {
                xcsutil.standardizedResponse(res, statusCode, results);
            }
        });
    };
}

function helper(handler) {
    return function () {
        var newArgs = Array.prototype.slice.call(arguments, 0, arguments.length - 1),
            callback = arguments[arguments.length - 1];
        newArgs.push(function () {
            callback.apply(this, arguments);
        });

        handler.apply(this, newArgs);
    };
}

function unitTestify(req, query) {
    var unitTestUUID = req && req.headers[k.XCSUnitTestHeader];
    if (!unitTestUUID) {
        return query;
    }

    query = JSON.parse(JSON.stringify(query));

    ['startkey', 'endkey', 'key'].forEach(function (key) {
        var value = query[key];
        if (value) {
            query[key] = [unitTestUUID].concat(value);
        }
    });

    return query;
}

/* XCSFileClass object */

function XCSFileClass() {}

XCSFileClass.prototype.assetsDirectoryForIntegration = function assetsDirectoryForIntegration(integration) {
    return assetsDirectoryForIntegration_internal(integration);
};

XCSFileClass.prototype.list = request('[File - list]', function list(req, res, cb) {
    this.filesForIntegration(req, req.params.id, function (err, files) {
        cb(err, 200, files);
    });
});

XCSFileClass.prototype.filesForIntegration = helper(function filesForIntegration(req, integrationID, cb) {
    var log = logger.withRequest(req);

    log.info('Fetching files for integration', integrationID);

    var query = unitTestify(req, {
        include_docs: true,
        key: integrationID
    });

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentFile, k.XCSDesignDocumentViewFilesByIntegrationAndType, query, cb);
});

XCSFileClass.prototype.create = request('[File - create]', function create(req, res, cb) {
    var log = logger.withRequest(req),
        asset = req.body,
        integrationID = req.params.id;

    log.info('Creating file with name', asset.fileName, 'for integration', integrationID);

    asset.integrationID = integrationID;
    if (req.headers[k.XCSUnitTestHeader]) {
        asset[k.XCSUnitTestProperty] = req.headers[k.XCSUnitTestHeader];
    }

    async.waterfall([
        function (cb) {
            if (asset.relativePath) {
                log.debug('File already has a relative path specified, using it.');
                cb();
            } else {
                log.debug('File has no relative path, loading the integration to determine the correct file location.');
                integrationSearchClass.findIntegrationWithUUID(req, integrationID, false, function (err, integration) {
                    if (err) {
                        log.error('Could not load integration to determine relative path for asset:', err);
                        cb(err);
                    } else {
                        asset.relativePath = path.join(assetsDirectoryForIntegration_internal(integration), asset.fileName);
                        log.debug('Storing file at', asset.relativePath);
                        cb();
                    }
                });
            }
        },
        function (cb) {
            dbCoreClass.createDocument(req, k.XCSDesignDocumentFile, asset, function (err, url, newFile) {
                if (err) {
                    cb(err);
                } else {
                    res.location(url);
                    cb(null, 201, newFile);
                }
            });
        }
    ], cb);
});

XCSFileClass.prototype.upload = request('[File - upload]', function upload(req, res, cb) {
    var log = logger.withRequest(req),
        fileID = req.params.id,
        self = this;

    log.info('Uploading data for file', fileID);

    var file, fullPath, dirName, baseName;

    async.waterfall([
        function (cb) {
            self.findFileWithID(req, fileID, cb);
        },
        function (theFile, cb) {
            file = theFile;
            fullPath = path.join(assetsPath, file.relativePath);
            dirName = path.dirname(fullPath);
            baseName = path.basename(fullPath);

            fs.stat(fullPath, function (err) {
                if (err) {
                    mkdirp(dirName, cb);
                } else {
                    cb(new Errors.Conflict('Could not save file because a file already exists at ' + file.relativePath));
                }
            });
        },
        function (directory, cb) {
            upload_internal(req, dirName, baseName, cb);
        },
        function (fileName, cb) {
            log.debug('Moved file to', fileName);
            fs.stat(fileName, cb);
        },
        function (stats, cb) {
            log.debug('File stat information for file', baseName, stats);
            var changes = {
                size: stats.size
            };
            log.debug('Updating file with uploaded data size.');
            dbCoreClass.updateDocumentWithUUID(req, fileID, changes, true, k.XCSDesignDocumentFile, cb);
        }
    ], function (err, file) {
        if (err && !err.status) {
            err.status = 500;
        }
        cb(err, 200, file);
    });
});

XCSFileClass.prototype.findFileWithID = helper(function findFileWithID(req, fileID, cb) {
    logger.withRequest(req).info('Fetching file', fileID);
    dbCoreClass.findDocumentWithUUID(req, fileID, k.XCSDesignDocumentFile, cb);
});

XCSFileClass.prototype.download = function download(req, res, next) {
    var log = logger.withRequest(req),
        functionTitle = '[File - download] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var uri = url.parse(req.url).pathname,
        newuri = uri.replace(new RegExp('/assets(/token/[^/]+)?/'), '', 'gi'),
        relativePath = decodeURIComponent(newuri),
        filename = path.join(assetsPath, relativePath);

    log.info('Downloading file', filename);

    var query = unitTestify(req, {
        include_docs: true,
        key: relativePath
    });

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentFile, k.XCSDesignDocumentViewFilesByPath, query, function (err, docs) {
        xcsutil.profilerSummary(req);
        if (err) {
            return next(new Errors.NotFound('Could not download file because the file does not exist.'));
        }

        function serveFile() {
            // Since we're bypassing the standard xcsd response mechanism, clear the timeout watcher
            xcsutil.clearRequestWatcherTimeout(res);

            // clear the existing content type so it gets set automatically by res.download()
            res.setHeader('Content-type', null);
            return res.download(filename);
        }

        var file = docs[0];
        if (file.allowAnonymousAccess) {
            log.debug('File is marked as allowing anonymous access, so skipping role enforcement.');
            return serveFile();
        } else {
            authClass.enforceBotViewerRole(req, res, serveFile);
        }
    });
};

XCSFileClass.prototype.downloadIntegrationArchive = function downloadIntegrationArchive(req, res, next) {



    var log = logger.withRequest(req),
        functionTitle = '[File - downloadIntegrationArchive] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        fullPath, downloadFilename;

    log.info('Downloading asset archive for integration', integrationUUID);

    async.waterfall([

        function FIDownloadIntegrationArchiveFindIntegration(cb) {
            integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, cb);
        },
        function FIDownloadIntegrationArchiveSaveAssets(integration, cb) {
            var relativePath = assetsDirectoryForIntegration_internal(integration);
            fullPath = path.join(assetsPath, relativePath);
            downloadFilename = integration.bot.name + ' - ' + integration.number + ' - Assets.tar.gz';

            xcsutil.writeTemporaryFile('', cb);
        },
        function FIDownloadIntegrationArchiveCompress(filename, callback, cb) {
            execFile('/usr/bin/tar', ['-czf', filename, '-C', path.dirname(fullPath), path.basename(fullPath)], function FIDownloadIntegrationArchiveCompressCallback(err) {
                if (err) {
                    return xcsutil.safeCallback(cb, err);
                } else {
                    return xcsutil.safeCallback(cb, null, filename, callback);
                }
            });
        }
    ], function FIDownloadIntegrationArchiveFinalizer(err, filename, cleanupCallback) {
        if (err) {
            log.error('Error trying to download integration log archive:', err);
            if (err.status) {
                return next(err);
            } else {
                return next(new Errors.Internal('Could not download log archive for integration because of an internal error.'));
            }
        } else {
            // Since we're bypassing the standard xcsd response mechanism, clear the timeout watcher
            xcsutil.clearRequestWatcherTimeout(res);

            res.setHeader('Content-type', 'application/gzip');
            res.download(filename, downloadFilename, function FIDownloadIntegrationArchiveDownload() {
                cleanupCallback();
            });
        }
    });

};

XCSFileClass.prototype.productsForIntegration = helper(function productsForIntegration(req, integrationUUID, cb) {
    logger.withRequest(req).info('Loading products for integration', integrationUUID);

    var query = {
        startkey: [integrationUUID],
        endkey: [integrationUUID, {}],
        include_docs: true
    };

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentFile, k.XCSDesignDocumentViewProductsByVariant, query, cb);
});

XCSFileClass.prototype.install = function install(req, res) {



    var log = logger.withRequest(req),
        functionTitle = '[File - install] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id;

    log.info('Request to install product for integration', integrationUUID);

    // Find the integration
    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function FIInstallFindIntegration(err, integration) {
        if (err) {
            log.warn('No matching integration found for installing product.');
            return res.sendStatus(err.status);
        } else {

            // make sure we have a product asset
            var product = integration && integration.assets && integration.assets.product;
            if (!product) {
                log.warn('Integration', integrationUUID, 'has no product asset, cannot perform install.');
                return res.sendStatus(404);
            }

            // check to see if it's an iOS product
            if (product.relativePath.match(/\.ipa$/i)) {
                // check the user agent
                var userAgent = req.headers['user-agent'];
                var m = userAgent.match(/(iPhone|iPod|iPad|iPod touch); (U; )?(CPU|CPU [\w]*)? OS (\d)/i);
                if (m && m.length >= 5) {
                    var version = parseInt(m[4], 10);
                    if (version >= 4) { // install manifests are only for iOS 4+
                        log.debug('Installing an iOS product from an iOS device, delivering an install-manifest instead of just the product.');

                        log.debug('Generating authentication token for the download.');
                        // we're good to go, generate a token for this request
                        var token = uuid.v4();
                        redisClass.client().set(k.XCSRedisAuthTokenPrefix + token, req.session.username || '', 'EX', k.XCSAuthTokenTTLInSeconds, function FIInstallRedisSetAuthToken(err) {
                            if (err) {
                                log.error('Could not set authentication token in Redis:', err);
                                return res.sendStatus(500);
                            }

                            // build up the URL
                            var scheme = 'https'; // iOS 7.1+ requires HTTPS
                            var host = (req.headers[k.XCSForwardedHost] && req.headers[k.XCSForwardedHost].split(',')[0]) || req.headers[k.XCSHostHeader];
                            host = host.split(':')[0] + ':' + config.get('app.httpsPort'); // force traffic over the HTTPS port
                            var basePath = k.XCSAPIBasePath; // connection is direct to xcsd, always
                            var manifestURL = scheme + '://' + host + basePath + '/integrations/' + integrationUUID + '/' + token + '/install_manifest.plist';
                            var redirectURL = 'itms-services://?action=download-manifest&url=' + manifestURL;

                            log.info('Redirecting to installation manifest:', redirectURL);



                            return res.redirect(redirectURL);
                        });

                        return;
                    } else {
                        log.debug('Detected iOS version', version, 'which is too old for OTA installs.');
                    }
                } else {
                    log.debug('Detected non-iOS user agent, performing normal download.');
                }
            } else {
                log.debug('Product is not an iOS app, performing normal download.');
            }

            // otherwise, just redirect to the file itself, using the appropriate base URL if we're through the /xcode proxy
            var relativeURL = '/assets/' + encodeURI(product.relativePath),
                absoluteURL;
            if (req.headers[k.XCSForwardedHost]) {
                absoluteURL = k.XCSProxiedAPIBasePath + relativeURL;
            } else {
                absoluteURL = k.XCSAPIBasePath + relativeURL;
            }
            log.info('Redirecting to download:', absoluteURL);
            res.redirect(absoluteURL);
        }
    });

};

function isAssetPackManifest(file) {
    return file.fileName.indexOf('AssetPackManifest') === 0;
}

XCSFileClass.prototype.installManifest = function installManifest(req, res) {

    var self = this;

    var log = logger.withRequest(req),
        functionTitle = '[File - installManifest] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        installToken = req.params.token;

    log.info('Generating product install manifest for integration', integrationUUID);

    if (!installToken) {
        log.warn('No authentication token found in URL.');
        return res.sendStatus(403);
    }

    var product;

    async.waterfall([
        function (cb) {
            self.productsForIntegration(req, integrationUUID, cb);
        },
        function (products, cb) {
            product = products[0];

            if (!product.infoDictionary) {
                log.error('No Info.plist data stored with this product. Cannot produce install manifest.');
                return cb({
                    status: 500,
                    message: 'Internal Server Error (xcsd): no Info.plist was available for this asset'
                });
            }

            // determine the base URL components and installation URL
            var scheme = req.headers[k.XCSForwardedProto] || 'https';
            var host = (req.headers[k.XCSForwardedHost] && req.headers[k.XCSForwardedHost].split(',')[0]) || req.headers[k.XCSHostHeader];
            var basePath = (req.headers[k.XCSForwardedHost]) ? k.XCSProxiedAPIBasePath : k.XCSAPIBasePath;
            var assetPrefix = scheme + '://' + host + basePath + '/assets';

            function baseAssetForProduct(product) {
                if (product.fileName.lastIndexOf('.ipa') === product.fileName.length - 4) {
                    log.debug(product.fileName, 'is an IPA, including software-package entry.');
                    return {
                        kind: 'software-package',
                        url: assetPrefix + '/token/' + installToken + '/' + encodeURI(product.relativePath)
                    };
                } else if (isAssetPackManifest(product)) {
                    log.debug(product.fileName, 'is an asset pack manifest, including asset-pack-manifest entry.');
                    return {
                        kind: 'asset-pack-manifest',
                        url: assetPrefix + '/' + product.relativePath
                    };
                } else {
                    log.error('Product', product.fileName, 'is of unknown type.');
                    return null;
                }
            }

            var assets = [],
                thinnedAssets = [];
            products.forEach(function (theProduct) {
                var asset = baseAssetForProduct(theProduct);
                if (theProduct.variantIds) {
                    log.debug(theProduct.fileName, 'is thinned for variants:', theProduct.variantIds);
                    asset.variantIds = theProduct.variantIds;
                    thinnedAssets.push(asset);
                } else {
                    assets.push(asset);
                }
            });

            // build up the install manifest
            var manifest = {
                'items': [
                    {
                        'assets': assets,
                        'metadata': {
                            'bundle-identifier': product.infoDictionary.CFBundleIdentifier || null,
                            'bundle-version': product.infoDictionary.CFBundleVersion || null,
                            'kind': 'software',
                            'title': product.infoDictionary.CFBundleDisplayName || product.infoDictionary.CFBundleName || null
                        },
                        'thinned-assets': thinnedAssets
                    }
                ]
            };

            xcsbridge.serialization.createPropertyList(manifest, function (err, data) {
                if (err) {
                    cb({
                        status: 500,
                        message: 'Internal Server Error (xcsbridge): ' + JSON.stringify(err)
                    });
                } else {
                    cb(null, data);
                }
            });
        }
    ], function (err, data) {



        if (err) {
            res.sendStatus(err.status);
        } else {
            res.type('xml');
            res.send(data);
        }
    });

};

XCSFileClass.prototype.otaProfile = function otaProfile(req, res) {


    var log = logger.withRequest(req),
        functionTitle = '[File - otaProfile] ' + req.method + ' ' + req.url;

    log.info('Downloading OTA configuration profile.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }


    var stream = fs.createReadStream(config.get('path.otaProfile'));
    res.cookie('installedProfile', '1', {
        maxAge: k.XCSSSLCertificateValidityPeriod * 24 * 60 * 60 * 1000
    });
    res.type('application/x-apple-aspen-config');
    stream.pipe(res);

    xcsutil.clearRequestWatcherTimeout(res);
};



XCSFileClass.prototype.deleteAssetsForIntegration = function deleteAssetsForIntegration(integration, cb) {
    var assetsDir = assetsDirectoryForIntegration_internal(integration),
        fullPath = path.join(assetsPath, assetsDir);

    xcsutil.removeDirectory(fullPath, function (err) {
        if (err) {
            logger.error('Unable to prune asset directory', fullPath, '#Pruning');
        } else {
            logger.info('Successfully pruned asset directory', fullPath, '#Pruning');
        }
        return xcsutil.safeCallback(cb, err);
    });
};

XCSFileClass.prototype.prune = function FIPrune(req, res) {



    var functionTitle = '[File - prune] Starting to prune',
        self = this;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.prune_internal(function (err, result) {
        if (err) {

            xcsutil.profilerSummary(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {

            xcsutil.profilerSummary(req);
            return xcsutil.standardizedResponse(res, 200, {
                result: result
            });
        }
    });

};

XCSFileClass.prototype.prune_internal = function prune(cb) {

    var self = this;

    checkPruningNecessary(function FIPruneCheckPruningNecessary(err, pruningNeeded, spaceToFree) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            if (pruningNeeded) {
                logger.info('#Pruning is needed. Need to free', xcsutil.formatBytes(spaceToFree));

                pruneUntilSpaceFreed(spaceToFree, self, function FIPrunePruneUntilSpaceFreed(err, spaceFreed) {
                    if (err) {
                        return xcsutil.safeCallback(cb, err);
                    }
                    return xcsutil.safeCallback(cb, null, spaceFreed > 0);
                });
            } else {
                return xcsutil.safeCallback(cb, null, false);
            }
        }
    });
};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSFileClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function sanitizeName(name) {
    return name.replace(/[\/:]/g, '');
}

function assetsDirectoryForIntegration_internal(integration) {
    var bot_name = integration.bot._id + '-' + sanitizeName(integration.bot.name),
        integration_number = integration.number,
        relativepath = path.join(bot_name, '' + integration_number);

    return relativepath;
}

function upload_internal(req, dirPath, fileName, cb) {



    var log = logger.withRequest(req),
        functionTitle = '[File - upload_internal] upload internal';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    // Requirement: obtain only the first file object uploaded
    var fileObj = req.file;

    if (!fileObj) {

        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'no file with key "file" exists'
        });
    }

    var filePath = path.join(dirPath, fileName);
    log.debug('Moving', fileObj.path, 'to', filePath);
    fs.rename(fileObj.path, filePath, function FIuploadInternalRename(err) {

        if (err) {
            log.error('Error moving file:', err);
            return xcsutil.safeCallback(cb, {
                status: 500,
                message: 'Internal Server Error (xcsd): unable to move uploaded file to path: ' + filePath
            });
        }
        return xcsutil.safeCallback(cb, null, filePath);
    });
}

function getDiskCapacity(cb) {
    logger.debug('Checking disk capacity. #Pruning');
    exec('df -kl | awk \'$9 == "/" { print $2 }\'', function FIGetDiskCapacity(err, stdout) {
        if (err) {
            logger.error('#Pruning Error checking disk capacity:', err);
            return xcsutil.safeCallback(cb, err);
        } else {
            var bytes = parseInt(stdout.trim(), 10) * 1024;
            return xcsutil.safeCallback(cb, null, bytes);
        }
    });
}

function getTotalAssetUsage(cb) {
    logger.debug('Getting total asset disk space usage. #Pruning');

    var query = {
        group: false
    };

    dbCoreClass.findDocumentsWithQuery(null, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewAssetSizeByDate, query, function FiGetTotalAssetUsage(err, docs) {
        if (err && err.status !== 404) {
            return xcsutil.safeCallback(cb, err);
        } else {
            if (docs && docs.length === 1) {
                logger.debug('Xcode Server assets are using', xcsutil.formatBytes(docs[0]), '. #Pruning');
                return xcsutil.safeCallback(cb, null, docs[0]);
            } else {
                return xcsutil.safeCallback(cb, null, 0);
            }
        }
    });
}

function checkPruningNecessary(cb) {
    logger.debug('Checking if asset pruning is necessary. #Pruning');

    async.parallel({
        settings: function (cb) {
            settings.findOrCreateSettingsDocument(null, function FICheckPruningNecessarySettings(err, settings) {
                return xcsutil.safeCallback(cb, err, settings);
            });
        },
        diskCapacity: function FICheckPruningNecessaryDiskCapacity(cb) {
            getDiskCapacity(cb);
        },
        totalAssetUsage: function FICheckPruningNecessaryTotalAssetUsage(cb) {
            getTotalAssetUsage(cb);
        }
    }, function checkPruningNecessaryFinalizer(err, results) {
        if (err) {
            logger.error('Could not check if #Pruning is necessary:', err);
            return xcsutil.safeCallback(cb, err);
        }

        var settings = results.settings,
            maxAllowedUsage = settings.max_percent_disk_usage * results.diskCapacity, // i.e. 75% of 500GB = 375GB
            excessSpace = results.totalAssetUsage - maxAllowedUsage; // i.e. 400GB - 375GB = 25GB

        logger.debug('Percentage of disk space allowed to be used by Xcode Server:', settings.max_percent_disk_usage * 100, '%. #Pruning');
        logger.debug('Disk capacity:', xcsutil.formatBytes(results.diskCapacity), '. #Pruning');
        logger.debug('Space allowed to be used by Xcode Server:', xcsutil.formatBytes(maxAllowedUsage), '. #Pruning');
        logger.debug('Total asset usage:', xcsutil.formatBytes(results.totalAssetUsage), '. #Pruning');
        if (excessSpace > 0) {
            logger.debug('Excess space to be pruned:', xcsutil.formatBytes(excessSpace), '. #Pruning');
        }
        logger.debug('Is pruning necessary?:', (excessSpace > 0 ? 'YES' : 'NO'), '. #Pruning');

        return xcsutil.safeCallback(cb, null, excessSpace > 0, excessSpace);
    });
}

/***************************************************************************************************

    Integration Pruning Section

***************************************************************************************************/

function pruneUntilSpaceFreed(targetSpace, fileClass, cb) {

    var spaceFreed = 0,
        continuePruning = true;

    function pruningRound(pruningRoundCallback) {
        logger.debug('Gathering list of integrations per bot. #Pruning');
        sortedIntegrationCountPerBot(function (err, sortedBotIntegrationCounts) {
            if (err) {
                logger.error('#Pruning Error loading integrations for bots:', err);
                return xcsutil.safeCallback(pruningRoundCallback, err);
            }

            // No need to continue if there's nothing to prune
            if (0 === sortedBotIntegrationCounts.length) {
                logger.debug('There are no bots. No #Pruning needed.');
                continuePruning = false;
                return xcsutil.safeCallback(pruningRoundCallback);
            }

            var botID = sortedBotIntegrationCounts[0].key,
                topBotIntegrationCount = sortedBotIntegrationCounts[0].value;

            botClass.findBotWithUUID(null, botID, function (err, bot) {
                var botName = '<bot name unknown; bot ID ' + botID + '>';
                if (bot) {
                    botName = bot.name;
                }

                logger.debug('Bot', botName, 'has the highest integration count:', topBotIntegrationCount, '#Pruning');

                // If the highest bot integration count has hit the watermark, bail out
                if (topBotIntegrationCount <= k.XCSMinNumberOfIntegrationsSafeFromPruning) {
                    logger.debug('Cannot safely remove anymore integrations (must leave', k.XCSMinNumberOfIntegrationsSafeFromPruning + '), done #Pruning.');
                    continuePruning = false;
                    return xcsutil.safeCallback(pruningRoundCallback);
                }

                // Set the lower limit to at least k.XCSMinNumberOfIntegrationsSafeFromPruning integrations
                var secondHighestBotIntegrationCount = (sortedBotIntegrationCounts.length === 1 ? k.XCSMinNumberOfIntegrationsSafeFromPruning : sortedBotIntegrationCounts[1].value);
                if (secondHighestBotIntegrationCount < k.XCSMinNumberOfIntegrationsSafeFromPruning) {
                    secondHighestBotIntegrationCount = k.XCSMinNumberOfIntegrationsSafeFromPruning;
                }

                logger.debug('Top two bot integration counts:', topBotIntegrationCount, secondHighestBotIntegrationCount, '#Pruning');

                sortedIntegrationsPerBot(botID, function (err, sortedIntegrations) {
                    if (err) {
                        logger.error('Could not find sorted integrations for bot', bot._id + ':', err, '#Pruning');
                        return xcsutil.safeCallback(pruningRoundCallback, err);
                    }

                    var numberOfIntegrationsToPrune = topBotIntegrationCount - secondHighestBotIntegrationCount;
                    if (0 === numberOfIntegrationsToPrune) {
                        numberOfIntegrationsToPrune = 1;
                    }

                    logger.debug('Bot', botName, 'has', sortedIntegrations.length, 'integrations. #Pruning');

                    if (sortedIntegrations.length <= (k.XCSMinNumberOfIntegrationsSafeFromPruning + 10)) {
                        logger.debug('Integration numbers:', _.pluck(sortedIntegrations, 'number'), '#Pruning');
                    }

                    logger.debug('Bot', botName, 'has', numberOfIntegrationsToPrune, 'integrations to prune. #Pruning');

                    // Reduce the array to the integrations we're going to prune
                    var pruningCandidates = sortedIntegrations.slice(0, numberOfIntegrationsToPrune);

                    if (pruningCandidates.length <= (k.XCSMinNumberOfIntegrationsSafeFromPruning + 10)) {
                        logger.debug('Candidate integration numbers:', _.pluck(pruningCandidates, 'number'), '#Pruning');
                    }

                    pruneIntegrations(botID, pruningCandidates, fileClass, spaceFreed, targetSpace, continuePruning, function (err, newSpaceFreed, newContinuePruning) {
                        if (err) {
                            logger.error('Error while #Pruning integrations for bot', botName + ':', err);
                            return xcsutil.safeCallback(pruningRoundCallback, err);
                        } else {
                            spaceFreed = newSpaceFreed;
                            continuePruning = newContinuePruning;
                            logger.debug('Finished #Pruning round for bot', botName);
                            return xcsutil.safeCallback(pruningRoundCallback);
                        }
                    });

                });
            });

        });
    }

    async.until(function () {
            return ((spaceFreed >= targetSpace) || (false === continuePruning));
        }, function (untilCallback) {
            pruningRound(function (err) {
                if (!err) {
                    logger.debug('#Pruning round completed. Freed', xcsutil.formatBytes(spaceFreed), 'space, targetting', xcsutil.formatBytes(targetSpace), 'space freed. Will', continuePruning ? 'continue' : 'not continue', 'pruning.');
                }
                return xcsutil.safeCallback(untilCallback, err);
            });
        },
        function (err) {
            if (err) {
                logger.error('#Pruning round failed:', err);
                return xcsutil.safeCallback(cb, err);
            } else {
                return xcsutil.safeCallback(cb, null, spaceFreed);
            }
        });
}

function pruneIntegrations(botID, pruningCandidates, fileClass, spaceFreed, targetSpace, continuePruning, cb) {
    // Prune each of the integrations
    async.each(pruningCandidates, function (integration, eachCallback) {

            logger.debug('#Pruning', integration.bot.name, 'integration', integration.number);

            // Obtain the asset size for the integration
            sizeOfAssetsForIntegration(integration, function (err, size) {

                // Canceled integrations are "soft" errors: not having assets to prune is OK
                // (i.e. canceled integrations may not have any)
                if (err) {
                    if (404 === err.status) {
                        logger.debug('Could not find any assets for integration', integration.number, '#Pruning');
                    } else {
                        logger.error('Error while lookup up asset size for integration', integration._id, err, '#Pruning');
                        return xcsutil.safeCallback(eachCallback, err);
                    }
                }

                logger.debug('Integration', integration._id, 'has assets totaling', xcsutil.formatBytes(size), 'in size. #Pruning');

                // Attempt to prune it
                pruneIntegration_internal(integration, fileClass, function (err) {
                    // If the error is not an 404 (directory not found), report the error
                    if (err && (404 !== err.status)) {
                        logger.error('Error while pruning integration', integration._id + ':', err);
                        return xcsutil.safeCallback(eachCallback, err);
                    }

                    // Only increment the spaced free if we actually removed the assets
                    if (size) {
                        spaceFreed += size;
                    }

                    // If we have accomplished our space-reclaiming goal, we don't need to continue pruning
                    if (spaceFreed >= targetSpace) {
                        logger.info('#Pruning goal reached. Reclaimed', xcsutil.formatBytes(spaceFreed), 'and was targeting', xcsutil.formatBytes(targetSpace));
                        continuePruning = false;
                        // Here we make up an custom, internal status code to exit the iterator early.
                        return xcsutil.safeCallback(eachCallback, {
                            status: -1
                        });
                    }

                    return xcsutil.safeCallback(eachCallback);
                });

            });

        },
        function (err) {
            // Treat a positive error code as a true error, otherwise ignore it
            if (err && (err.status >= 0)) {
                return xcsutil.safeCallback(cb, err);
            } else {
                return xcsutil.safeCallback(cb, null, spaceFreed, continuePruning);
            }
        });
}

function sortedIntegrationCountPerBot(cb) {

    dbCoreClass.findDocumentsWithQuery(null, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsToPrune, {
        group_level: 1
    }, function (err, results) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            // Clean the results
            var botIntegrationCounts = {},
                sortedBotIntegrationCounts = [],
                index,
                item;

            if (results.length > 0) {

                var keys = Object.keys(results);

                for (index in keys) {
                    if (keys.hasOwnProperty(index)) {
                        item = results[keys[index]];
                        botIntegrationCounts[item.key[0]] = {
                            name: item.key[1],
                            value: item.value
                        };
                    }
                }

                var sortedKeys = Object.keys(botIntegrationCounts).sort(function (IDa, IDb) {
                    return -(botIntegrationCounts[IDa].value - botIntegrationCounts[IDb].value);
                });

                for (index in sortedKeys) {
                    if (sortedKeys.hasOwnProperty(index)) {
                        item = botIntegrationCounts[sortedKeys[index]];
                        item.key = sortedKeys[index];
                        sortedBotIntegrationCounts.push(item);
                    }
                }

            }

            return xcsutil.safeCallback(cb, null, sortedBotIntegrationCounts);
        }
    });

}

function sortedIntegrationsPerBot(botID, cb) {

    var query = {
        key: botID,
        include_docs: true
    };

    integrationSearchClass.findIntegrationsForBotWithQuery(null, k.XCSDesignDocumentViewNonPrunedIntegrationsByBot, botID, query, false, function (err, nonPrunedIntegrations) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var sortedIntegrations = [];

            if (nonPrunedIntegrations.length > 0) {
                sortedIntegrations = nonPrunedIntegrations.sort(function (itemA, itemB) {
                    return (itemA.number - itemB.number);
                });
            }

            return xcsutil.safeCallback(cb, null, sortedIntegrations);
        }
    });

}

function sizeOfAssetsForIntegration(integration, cb) {
    dbCoreClass.findDocumentsWithQuery(null, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewAssetSizeByDate, {
        startkey: [integration._id],
        endkey: [integration._id, {}],
        group: false
    }, function (err, result) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, result[0]);
        }
    });
}

function pruneIntegration_internal(theIntegration, fileClass, cb) {

    logger.debug('#Pruning integration', theIntegration.number, 'for bot', theIntegration.bot.name);

    fileClass.deleteAssetsForIntegration(theIntegration, function FIPruneIntegration(err) {
        if (err && (404 !== err.status)) {
            logger.error('Error while #Pruning integration', theIntegration._id + ':', err);
            return xcsutil.safeCallback(cb, err);
        } else {
            logger.debug('#Pruning was successful, updating integration', theIntegration._id, 'to mark assets as pruned.');
            require('./integrationClass.js').update_internal(null, theIntegration._id, {
                assetsPruned: true
            }, function (err) {
                if (err && 404 !== err.status) {
                    logger.error('Error while updating integration', theIntegration._id + ':', err, '#Pruning');
                    return xcsutil.safeCallback(cb, err);
                } else {
                    return xcsutil.safeCallback(cb);
                }
            });
        }
    });

}