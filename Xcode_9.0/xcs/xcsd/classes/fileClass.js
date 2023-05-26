/*
    XCSFileClass
*/

'use strict';

var Promise = require('bluebird'),
    _ = require('underscore'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    os = require('os'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    uuid = require('node-uuid'),
    child_process = Promise.promisifyAll(require('child_process')),
    exec = child_process.exec,
    execFile = child_process.execFile,
    config = require('config');

var k = require('../constants.js'),
    logger = require('../util/logger.js'),
    Errors = require('../util/error.js'),
    authClass = require('./authClass.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    botClass = require('./botClass.js'),
    integrationSearchClass = require('./integrationSearchClass.js'),
    redisClass = require('./redisClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    xcsbridge = require('../util/xcsbridge.js'),
    te = require('../util/turboevents.js');

var assetsPath = config.get('path.assets');

const _DEBUG_PRUNNING = false;

function orderDescendingByProperty(prop) {
    var args = Array.prototype.slice.call(arguments, 1);
    return function (a, b) {
        var equality = b[prop] - a[prop];
        if (equality === 0 && arguments.length > 1) {
            return orderDescendingByProperty.apply(null, args)(a, b);
        }
        return equality;
    };
}

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

    var file, fullPath, dirName, baseName, fileSize;

    async.waterfall([
        function (cb) {
            fs.stat(req.file.path, cb);
        },
        function (stats, cb) {
            log.debug('File stat information for file', baseName, stats);
            fileSize = stats.size;
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
            upload_internal(req, dirName, baseName, file.isDirectory, cb);
        },
        function (fileName, cb) {
            log.debug('Moved file to', fileName);
            var changes = {
                size: fileSize
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
        filename = path.join(assetsPath, relativePath),
        includeAllAssets = req.query.full === 'true';

    log.info('Downloading file', filename);

    var query = unitTestify(req, {
        include_docs: true,
        key: relativePath
    });

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentFile, k.XCSDesignDocumentViewFilesByPath, query, function (err, docs) {
        xcsutil.profilerSummary(req);
        if (err) {
            log.info('Could not find file for relative path. Defaulting to not allowing anonymous access.');
        }

        function serveFile() {
            sendFileAtPath(req, res, filename, includeAllAssets);
        }

        var file = docs && docs[0];
        if (file && file.allowAnonymousAccess) {
            log.debug('File is marked as allowing anonymous access, so skipping role enforcement.');
            return serveFile();
        } else {
            authClass.enforceBotViewerRole(req, res, serveFile);
        }
    });

};

function sendFileAtPath(req, res, filePath, includeAllAssets) {
    // clear the existing content type so it gets set automatically by res.download()
    res.setHeader('Content-type', null);

    fs.stat(filePath, (err, stats) => {
        if (err) {
            xcsutil.standardizedErrorResponse(res, err);
        } else {
            // Since we're bypassing the standard xcsd response mechanism, clear the timeout watcher
            xcsutil.clearRequestWatcherTimeout(res);

            if (stats.isDirectory()) {
                // zip the directory
                let dirname = path.dirname(filePath);
                let basename = path.basename(filePath);
                basename = basename.replace(/\.zip$/, '');

                let excludeArgs = [];
                if (!includeAllAssets) {
                    excludeArgs = ['--exclude', '*.png', '*.jpg', '@'];
                }

                let zip = child_process.spawn('/usr/bin/zip', excludeArgs.concat(['-1', '-r', '-', basename]), { cwd: dirname });

                res.type('application/zip').attachment(`${basename}.zip`);
                zip.stdout.pipe(res);
            } else {
                res.download(filePath);
            }
        }
    });
}

XCSFileClass.prototype.downloadIntegrationArchive = function downloadIntegrationArchive(req, res, next) {
    var log = logger.withRequest(req),
        functionTitle = '[File - downloadIntegrationArchive] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        fullPath,
        renamedDirectory,
        downloadFilename;

    log.info('Downloading asset archive for integration', integrationUUID);

    async.waterfall([

        function FIDownloadIntegrationArchiveFindIntegration(cb) {
            integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, cb);
        },
        function FIDownloadIntegrationArchiveSaveAssets(integration, cb) {
            var relativePath = assetsDirectoryForIntegration_internal(integration);
            fullPath = path.join(assetsPath, relativePath);
            renamedDirectory = sanitizeName(integration.bot.name + ' - ' + integration.number + ' - Assets');
            downloadFilename = renamedDirectory + '.tar.gz';

            xcsutil.writeTemporaryFile('', cb);
        },
        function FIDownloadIntegrationArchiveCompress(filename, callback, cb) {
            const basename = path.basename(fullPath);

            execFile('/usr/bin/tar', ['-cf', filename, '-C', path.dirname(fullPath), '-s', `/${basename}/${renamedDirectory}/`, basename], { env: { LC_ALL: 'en_US.UTF-8' }}, function FIDownloadIntegrationArchiveCompressCallback(err) {
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

XCSFileClass.prototype.downloadLogs = function downloadLogs(req, res) {
    var functionTitle = '[File - downloadLogs] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var path = req.url;
    var id = null;

    var options = {
        root: __dirname + '/../templates',
        headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }
    };

    if (path) {
        id = path.match(/\/integrations\/([a-z0-9]+)\/download_logs/);
        if (id && id.length && id.length === 2) {
            id = id[1];

            if (id) {
                integrationSearchClass.findIntegrationWithUUID(req, id, false, (inErr, inIntegration) => {
                    if (inErr) {
                        res.sendFile('/download_logs_error.html', options);
                    } else if (inIntegration && (inIntegration.assetsPruned === undefined || inIntegration.assetsPruned === false)) {
                        res.sendFile('/download_logs.html', options);
                    } else {
                        res.sendFile('/download_logs_missing.html', options);
                    }
                });
            } else {
                res.sendFile('/download_logs_error.html', options);
            }
        } else {
            res.sendFile('/download_logs_error.html', options);
        }
    } else {
        res.sendFile('/download_logs_error.html', options);
    }
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
                var m = userAgent.match(/(iPhone|iPod|iPad|iPod touch); (U; )?(CPU|CPU [\w]*)? OS (\d+)/i);
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
        if (err && (404 !== err.status)) {
            logger.error('Unable to prune asset directory', fullPath, 'Reason:', err.message, '#Pruning');
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

    // Initialize the number of integrations to keep
    var numberToKeep = 0;
    if (req.query.keep) {
        numberToKeep = parseInt(req.query.keep, 10);
    }
    if (numberToKeep <= 0) {
        numberToKeep = k.XCSMinNumberOfIntegrationsSafeFromPruning;
    }

    // Initialize whether pruning should be forced
    var force = false;
    if (req.query.force) {
        force = (req.query.force.toLowerCase() === 'true');
    }

    self.prune_internal(numberToKeep, force, function (err, result) {
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

XCSFileClass.prototype.prune_internal = function prune(numberToKeep, force, cb) {

    var self = this;

    if ((0 === numberToKeep) || (undefined === numberToKeep) || isNaN(numberToKeep)) {
        numberToKeep = k.XCSMinNumberOfIntegrationsSafeFromPruning;
    }

    if ((undefined === force) || (null === force)) {
        force = false;
    }

    self.checkPruningNecessary(numberToKeep, force, function FIPruneCheckPruningNecessary(err, integrationsToPrune) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            if (integrationsToPrune.length > 0) {
                var totalSpaceFreed = 0;

                async.waterfall([
					function (callback) {
					    try {
							logger.info('**** Posting pruningStartedNotification');
					        te.broadcast(k.XCSIsListenerForPruningUpdates, k.XCSEmitNotificationNotificationPruningStarted);
					    } catch (e) {
					        logger.error('Error while posting pruning started notification:', e);
					    }
						callback();
					},
                    function (callback) {
                            pruneIntegrations(integrationsToPrune, self, function (spaceFreed) {
                                logger.debug('Finished #Pruning the integration candidates.');
                                totalSpaceFreed += spaceFreed;
                                callback();
                            });
                    },
                    function (callback) {
                            var oneDayOld = 1;

                            removeNonDirectoriesAtPath(assetsPath, oneDayOld, function (err, moreSpaceFreed) {
                                if (err) {
                                    logger.debug('#Pruning error while removing dangling asset files. Reason:', JSON.stringify(err));
                                } else {
                                    logger.debug('Finished #Pruning the dangling files in the integration assets directory.');
                                }

                                if (moreSpaceFreed) {
                                    totalSpaceFreed += moreSpaceFreed;
                                }

                                callback();
                            });
                    },
                    function (callback) {
                            // Clean the Code Coverage cache
                            clearCodeCoverageCacheDirectory(function (err, sizeOfCCDataFreed) {
                                if (err) {
                                    logger.debug('Error while #Pruning the Code Coverage cache directory. Reason:', JSON.stringify(err));
                                } else {
                                    logger.debug('Finished #Pruning the Code Coverage cache directory.');
                                    totalSpaceFreed += sizeOfCCDataFreed;
                                }

                                callback();
                            });
                    },
                    function (callback) {
                            // Clean the Code Coverage cache
                            removeOrphanedIntegrationAssetDirectories(function (sizeOfOrphanedDataFreed) {
                                logger.debug('Finished #Pruning the orphaned integration asset directories.');

                                totalSpaceFreed += sizeOfOrphanedDataFreed;

                                callback();
                            });
                    },
					function (callback) {
					    try {
							logger.info('**** Posting pruningFinishedNotification');
					        te.broadcast(k.XCSIsListenerForPruningUpdates, k.XCSEmitNotificationNotificationPruningFinished);
					    } catch (e) {
					        logger.error('Error while posting pruning finished notification:', e);
					    }
						callback();
					}
                ],
                    function () {
                        logger.debug('Total space freed during #Pruning:', xcsutil.formatBytes(totalSpaceFreed));
                        return xcsutil.safeCallback(cb, null, true);
                    });
            } else {
                return xcsutil.safeCallback(cb, null, false);
            }
        }
    });

};

XCSFileClass.prototype.checkPruningNecessary = function checkPruningNecessary(numberToKeep, force, cb) {

    var self = this;

    logger.debug('Checking if asset pruning is necessary. #Pruning');

    async.parallel({
        driveSize,
        freeDiskSpace,
        databaseSize,
        integrationAssetsSize,
        spaceRequiredForAllBotIntegrationSize
    }, function checkPruningNecessaryFinalizer(err, results) {
        if (err) {
            logger.error('Could not check if #Pruning is necessary:', err);
            return xcsutil.safeCallback(cb, err);
        }

        var driveSize = results.driveSize,
            freeDiskSpace = results.freeDiskSpace,
            databaseSize = results.databaseSize,
            integrationAssetsSize = results.integrationAssetsSize,
            spaceRequiredForAllBotIntegrationSizeTimesTwo = results.spaceRequiredForAllBotIntegrationSize * 2;

        self.pruningPlan(driveSize, freeDiskSpace, databaseSize, integrationAssetsSize, spaceRequiredForAllBotIntegrationSizeTimesTwo, numberToKeep, force, function (excessSpace, needsPruning) {
            if (needsPruning) {
                self.collectCandidatesForPruning(numberToKeep, excessSpace, function (err, pruningCandidates, spaceThatCouldBeFreed) {
                    if (err) {
                        return xcsutil.safeCallback(cb, err);
                    }
                    logger.debug('#Pruning could reclaim about:', xcsutil.formatBytes(spaceThatCouldBeFreed));

                    return xcsutil.safeCallback(cb, null, pruningCandidates);
                });
            } else {
                return xcsutil.safeCallback(cb, null, []);
            }
        });

    });

};

XCSFileClass.prototype.pruningPlan = function pruningPlan(driveSize, freeDiskSpace, databaseSize, integrationAssetsSize, spaceRequiredForAllBotIntegrationSizeTimesTwo, numberToKeep, force, cb) {
    var excessSpace = freeDiskSpace - databaseSize - spaceRequiredForAllBotIntegrationSizeTimesTwo,
        needsPruning = excessSpace < 0;

    excessSpace = Math.floor(Math.abs(excessSpace));

    logger.debug('Drive size:', xcsutil.formatBytes(driveSize), '#Pruning');
    logger.debug('Free disk space:', xcsutil.formatBytes(freeDiskSpace), '#Pruning');
    logger.debug('Database size:', xcsutil.formatBytes(databaseSize), '#Pruning');
    logger.debug('Integration assets size:', xcsutil.formatBytes(integrationAssetsSize), '#Pruning');
    logger.debug('Size of the bot integration set x2:', xcsutil.formatBytes(spaceRequiredForAllBotIntegrationSizeTimesTwo), '#Pruning');

    if (force) {
        excessSpace = driveSize; // Attempt to reclaim as much as possible
        needsPruning = true;
        logger.debug('Forced #Pruning requested. Will try to reclaim as much space as possible keeping', numberToKeep, 'integrations.');
    } else {
        logger.debug('Is #Pruning necessary?:', (needsPruning ? 'YES' : 'NO'));
        if (needsPruning) {
            logger.debug('#Pruning an excess space of:', xcsutil.formatBytes(excessSpace));
            logger.debug('#Pruning will keep at least', numberToKeep, 'integrations');
        }
    }

    return xcsutil.safeCallback(cb, excessSpace, needsPruning);
};

XCSFileClass.prototype.collectCandidatesForPruning = function collectCandidatesForPruning(numberToKeep, targetSpace, cb) {

    var spaceThatCouldBeFreed = 0,
        continuePruning = true,
        sortedBotIntegrationCounts = [],
        orphanedIntegrationIDs = [],
        pruningCandidates = [],
        currentPruningAssetCycleState = k.XCSPruningAssetIntegrationCompletionType.SUCCESSFUL;

    // Build a list of non-pruned integrations per bot
    function gatherNonPrunedIntegrationsPerBot(pruningRoundCallback) {
        logger.debug('Gathering list of integrations per bot. #Pruning');

        sortedIntegrationCountPerBot(function (err, sortedBotIntegrationCountResults) {
            if (err) {
                logger.error('#Pruning error loading integrations for bots:', err);
                return xcsutil.safeCallback(pruningRoundCallback, err);
            }

            // For each candidate, retrieve the sorted non-pruned integration list
            async.each(sortedBotIntegrationCountResults, function (botInfoObject, callback) {
                sortedNonPrunedIntegrationsPerBot(botInfoObject.key, currentPruningAssetCycleState, numberToKeep, function (err, sortedIntegrations) {
                    if (err) {
                        logger.error('#Pruning error loading non-pruned integrations for bot:', JSON.stringify(err));
                        return xcsutil.safeCallback(callback, err);
                    } else {
                        botClass.findBotWithUUID(null, botInfoObject.key, function (err, bot) {
                            if (err) {
                                if (404 === err.status) {
                                    // We can remove these integrations which point to a non-existing bot
                                    var IDs = _.pluck(sortedIntegrations, '_id');
                                    // Add the integration IDs to the list
                                    orphanedIntegrationIDs.push.apply(orphanedIntegrationIDs, IDs);
                                } else {
                                    logger.error('#Pruning error loading bot:', JSON.stringify(err));
                                }
                            } else {
                                botInfoObject.sortedIntegrations = sortedIntegrations;
                                botInfoObject.name = bot.name;
                                botInfoObject.value = sortedIntegrations.length;
                            }
                            return callback();
                        });
                    }
                });
            }, function (err) {
                if (err) {
                    return xcsutil.safeCallback(pruningRoundCallback, err);
                }

                // Obtain the sorted integrations for valid bots
                sortedBotIntegrationCounts = sortedBotIntegrationCountResults.filter(botInfoObject => botInfoObject.sortedIntegrations !== undefined);

                return xcsutil.safeCallback(pruningRoundCallback);
            });
        });
    }

    function pruneRound(pruningRoundCallback) {
        // No need to continue if there's nothing to prune
        if (0 === sortedBotIntegrationCounts.length) {
            logger.debug('There are no bots. No #Pruning needed.');
            continuePruning = false;
            return xcsutil.safeCallback(pruningRoundCallback);
        }

        sortedBotIntegrationCounts = sortedBotIntegrationCounts.sort(orderDescendingByProperty('value', 'name'));

        if (_DEBUG_PRUNNING) {
            logger.debug('Sorted bot integration counts:', JSON.stringify(sortedBotIntegrationCounts, null, 4), '#Pruning');
        }

        var topBotIntegrationCount = sortedBotIntegrationCounts[0].value,
            botName = sortedBotIntegrationCounts[0].name,
            sortedIntegrations = sortedBotIntegrationCounts[0].sortedIntegrations;

        logger.debug('Bot', botName, 'has the highest integration count:', topBotIntegrationCount, '#Pruning');

        // If we've exhausted all candidates, see if we need to switch to k.XCSPruningAssetIntegrationCompletionType.FAILED
        if (0 === topBotIntegrationCount) {
            if (k.XCSPruningAssetIntegrationCompletionType.SUCCESSFUL === currentPruningAssetCycleState) {
                logger.debug('Done collecting the sucessful integrations, continue #Pruning the failed integrations.');
                currentPruningAssetCycleState = k.XCSPruningAssetIntegrationCompletionType.FAILED;
                continuePruning = true;
                return gatherNonPrunedIntegrationsPerBot(function () {
                    xcsutil.safeCallback(pruningRoundCallback);
                });
            } else {
                logger.debug('Done collecting the sucessful integrations, (must leave', numberToKeep + '), done #Pruning.');
                continuePruning = false;
                return xcsutil.safeCallback(pruningRoundCallback);
            }
        }

        var secondHighestBotIntegrationCount = 0;
        if (sortedBotIntegrationCounts.length > 1) {
            secondHighestBotIntegrationCount = sortedBotIntegrationCounts[1].value;
            logger.debug('Top two bot integration counts:', topBotIntegrationCount, 'and', secondHighestBotIntegrationCount, '#Pruning');
        } else {
            logger.debug('Top bot integration count:', topBotIntegrationCount, '#Pruning');
        }

        var numberOfIntegrationsToPrune = topBotIntegrationCount - secondHighestBotIntegrationCount;
        if (0 === numberOfIntegrationsToPrune) {
            numberOfIntegrationsToPrune = 1;
        }

        // Obtain the list of integrations we're going to prune
        var someCandidates = sortedIntegrations.splice(sortedIntegrations.length - numberOfIntegrationsToPrune, numberOfIntegrationsToPrune);

        // Add them to the candidate list
        pruningCandidates.push.apply(pruningCandidates, someCandidates);

        // Recalculate the bot integration count
        sortedBotIntegrationCounts[0].value -= numberOfIntegrationsToPrune;

        // For each candidate, retrieve its asset size
        async.each(someCandidates, function (integration, callback) {
            sizeOfAssetsForIntegration(integration, function (err, size) {
                if (!err) {
                    spaceThatCouldBeFreed += size;
                }
                return callback();
            });
        }, function () {
            return xcsutil.safeCallback(pruningRoundCallback);
        });

    }

    gatherNonPrunedIntegrationsPerBot(function (err) {
        if (err) {
            logger.error('#Pruning failed while obtaining the candidates:', JSON.stringify(err));
            return xcsutil.safeCallback(cb, err);
        }

        async.until(function () {
                return ((spaceThatCouldBeFreed >= targetSpace) || (false === continuePruning));
            }, function (untilCallback) {
                pruneRound(untilCallback);
            },
            function (err) {
                if (err) {
                    logger.error('#Pruning round failed. Reason:', err);
                    return xcsutil.safeCallback(cb, err);
                } else {
                    // Cleanup orphaned integrations
                    removeNonPrunedIntegrationsWithIDs(orphanedIntegrationIDs, function () {

                        // [TC] Worth leaving this block around to ease debugging/unit testing

                        if (_DEBUG_PRUNNING) {
                            if (pruningCandidates.length > 0) {

                                let botNames = _.map(pruningCandidates, function (integration) {
                                    return integration.bot.name;
                                });
                                let integrationNumbers = _.pluck(pruningCandidates, 'number');
                                let results = _.pluck(pruningCandidates, 'result');

                                logger.debug('***************************************************** #Pruning');
                                logger.debug('List of #Pruning candidates(', pruningCandidates.length, 'total ):');

                                pruningCandidates.forEach(function (integration) {
                                    logger.debug('    Integration number', integration.number, 'of bot "', integration.bot.name, ':', integration.result, '" #Pruning');
                                });

                                logger.debug('Bot names:', JSON.stringify(botNames, null, 4), '#Pruning');
                                logger.debug('Integration numbers:', JSON.stringify(integrationNumbers, null, 4), '#Pruning');
                                logger.debug('Integration results:', JSON.stringify(results, null, 4), '#Pruning');
                                logger.debug('spaceThatCouldBeFreed:', spaceThatCouldBeFreed, '(', xcsutil.formatBytes(spaceThatCouldBeFreed), ' ) #Pruning');
                                logger.debug('***************************************************** #Pruning');
                            }
                        }

                        return xcsutil.safeCallback(cb, null, pruningCandidates, spaceThatCouldBeFreed);
                    });
                }
            });

    });

};

XCSFileClass.prototype.spaceRequiredForAllBotIntegrationSize = function FISpaceRequiredForAllBotIntegrationSize(req, res) {

    var functionTitle = '[File - prune] Calculating the space required to continue integrating';

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    spaceRequiredForAllBotIntegrationSize(function (err, spaceRequired) {
        if (err) {
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedResponse(res, 200, {
                result: spaceRequired
            });
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

function upload_internal(req, dirPath, fileName, isDirectory, cb) {

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

    if (isDirectory) {
        uploadDirectory(req, dirPath, fileName, cb);
    } else {
        uploadFile(req, dirPath, fileName, cb);
    }
}

function uploadFile(req, dirPath, fileName, cb) {
    const log = logger.withRequest(req);

    var filePath = path.join(dirPath, fileName);
    log.debug('Moving', req.file.path, 'to', filePath);
    fs.rename(req.file.path, filePath, err => {
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

function uploadDirectory(req, dirPath, fileName, cb) {
    let filePath = path.join(dirPath, fileName);
    let tempDirectory = path.join(dirPath, uuid.v4());
    let extractedDirectory;

    return fs.mkdirAsync(tempDirectory)
        .then(() => child_process.execAsync(`unzip -Z1 "${req.file.path}" | head -n1`))
        .then(output => {
            extractedDirectory = output.trim();
            return child_process.execAsync(`unzip -qq "${req.file.path}" -d "${tempDirectory}"`);
        })
        .then(() => fs.renameAsync(path.join(tempDirectory, extractedDirectory), filePath))
        .then(() => {
            let noExtensionPath = filePath.replace(/\.zip$/, '');
            if (noExtensionPath !== filePath) {
                return fs.symlinkAsync(path.basename(filePath), noExtensionPath);
            }
        })
        .then(() => fs.unlinkAsync(req.file.path))
        .thenReturn(filePath)
        .asCallback(cb);
}

function driveSize(cb) {

    logger.debug('Checking drive size. #Pruning');
    exec('df -kl "' + config.get('path.assets') + '" | tail -n1 | awk \'{ print $2 }\'', function FIDriveSize(err, stdout) {
        if (err) {
            logger.error('#Pruning error checking drive size:', err);
            logger.error('#Pruning error checking available disk space:', err);
            return xcsutil.safeCallback(cb, err);
        } else {
            var kilobytes = parseInt(stdout.trim(), 10);
            return xcsutil.safeCallback(cb, null, kilobytes * 1024); // df reports back in 1024-byte units
        }
    });

}

function freeDiskSpace(cb) {

    logger.debug('Checking available disk space. #Pruning');
    exec('df -kl "' + config.get('path.assets') + '" | tail -n1 | awk \'{ print $4 }\'', function FIFreeDiskSpace(err, stdout) {
        if (err) {
            logger.error('#Pruning error checking available disk space:', err);
            return xcsutil.safeCallback(cb, err);
        } else {
            var kilobytes = parseInt(stdout.trim(), 10);
            return xcsutil.safeCallback(cb, null, kilobytes * 1024); // df reports back in 1024-byte units
        }
    });

}

function databaseSize(cb) {

    logger.debug('Obtaining database size. #Pruning');
    exec('du -sk "' + config.get('path.database') + '" | awk \'{print $1}\'', function FIDatabaseSize(err, stdout) {
        if (err) {
            logger.error('#Pruning error obtaining database size:', err);
            return xcsutil.safeCallback(cb, err);
        } else {
            var kilobytes = parseInt(stdout.trim(), 10);
            return xcsutil.safeCallback(cb, null, kilobytes * 1024);
        }
    });

}

function integrationAssetsSize(cb) {

    logger.debug('Obtaining integration assets size. #Pruning');
    exec('du -sk "' + config.get('path.assets') + '" | awk \'{print $1}\'', function FIIntegrationAssetsSize(err, stdout) {
        if (err) {
            logger.error('#Pruning error obtaining integration assets size:', err);
            return xcsutil.safeCallback(cb, err);
        } else {
            var kilobytes = parseInt(stdout.trim(), 10);
            return xcsutil.safeCallback(cb, null, kilobytes * 1024);
        }
    });

}

function spaceRequiredForAllBotIntegrationSize(cb) {

    async.waterfall([
        function (callback) {
            // Get all bots
            botClass.listAllBots(null, callback);
        },
        function (bots, callback) {
            // For each bot, get the last 12 integrations IDs
            getLastIntegrationsForBots(bots, callback);
        },
        function (botIntegrationIDs, callback) {
            // botIntegrationIDs = [ { bot._id: integrationIDs }, ...]
            // Retrieve the sum of the largest integrations for each bot
            getSumOfLargestIntegrationsForBots(botIntegrationIDs, callback);
        }
    ], function (err, sumOfIntegrationSizes) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, sumOfIntegrationSizes);
        }
    });

}

function getLastIntegrationsForBots(bots, cb) {

    var botIntegrationIDs = {},
        summary_only, filter, reqQuery, params, unitTestUUID;

    async.each(bots, function (bot, callback) {

        integrationSearchClass.findLastIntegrationsForBot_internal(null, bot._id, 0, summary_only, filter, reqQuery, params, unitTestUUID, function (err, integrations) {
            if (err) {
                return callback(err);
            }

            var integrationIDs = [];

            // Gather the integration IDs
            integrations.forEach(function (integration) {
                integrationIDs.push(integration._id);
            });

            botIntegrationIDs[bot._id] = integrationIDs;

            return callback();
        });

    }, function (err) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, botIntegrationIDs);
        }
    });

}

function getSumOfLargestIntegrationsForBots(botIntegrationIDs, cb) {

    var log = logger.withRequest();
    log.info('Get integration sizes.');

    var sumSizes = 0;

    async.forEachOf(botIntegrationIDs, function (integrationIDs, botID, callback) {

        var query = {
            keys: integrationIDs,
            group: true
        };

        dbCoreClass.findDocumentsWithQuery(null, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewAssetSize, query, function (err, sizes) {
            if (err) {
                return callback(err);
            }

            // Add the largest asset size for this bot.
            // Caution: invoking _.max on an empty array returns -Infinity.
            if (sizes.length) {
                sumSizes += _.max(sizes, function (size) {
                    return size;
                });
            }

            return callback();
        });

    }, function (err) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, sumSizes);
        }
    });

}

/***************************************************************************************************

    Integration Pruning Section

***************************************************************************************************/

function pruneIntegrations(pruningCandidates, fileClass, cb) {
    var spaceFreed = 0;

    // For each candidate, retrieve its asset size
    async.each(pruningCandidates, function (pruningCandidate, callback) {
        sizeOfAssetsForIntegration(pruningCandidate, function (err, size) {
            pruneAssetsForIntegration(pruningCandidate, fileClass, function () {
                if (size) {
                    spaceFreed += size;
                }
                return callback();
            });
        });
    }, function () {
        return xcsutil.safeCallback(cb, spaceFreed);
    });
}

function sortedIntegrationCountPerBot(cb) {

    dbCoreClass.findDocumentsWithQuery(null, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsToPrune, {
        group_level: 1
    }, function (err, results) {
        if (err && err.status !== 404) {
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

function sortedNonPrunedIntegrationsPerBot(botID, currentPruningAssetCycleState, numberToKeep, cb) {

    var query = {
        key: botID,
        include_docs: false
    };

    integrationSearchClass.findIntegrationsForBotWithQuery(null, k.XCSDesignDocumentViewNonPrunedIntegrationsByBot, botID, query, false, function (err, nonPrunedIntegrations) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var sortedIntegrations;

            // Sort integrations (ascending)
            nonPrunedIntegrations = nonPrunedIntegrations.sort(function (itemA, itemB) {
                return (itemB.number - itemA.number);
            });

            if (nonPrunedIntegrations.length > 0) {
                if (_DEBUG_PRUNNING) {
                    logger.debug('Select non pruned integrations for bot:', nonPrunedIntegrations[0], '#Pruning');
                    logger.debug('All non pruned integrations list:', JSON.stringify(nonPrunedIntegrations, null, 4), '#Pruning');
                }

                // Remove the 'untouchables' from the candidate list
                nonPrunedIntegrations = nonPrunedIntegrations.slice(numberToKeep);

                if (_DEBUG_PRUNNING) {
                    logger.debug('Sliced non pruned integrations list:', JSON.stringify(nonPrunedIntegrations, null, 4), '#Pruning');
                }
            }

            if (k.XCSPruningAssetIntegrationCompletionType.SUCCESSFUL === currentPruningAssetCycleState) {
                // Filter (keep) the integrations with (result == succeeded)
                sortedIntegrations = nonPrunedIntegrations.filter(integration => integration.result === 'succeeded');
            } else {
                // Reject the integrations with (result == succeeded)
                sortedIntegrations = nonPrunedIntegrations.filter(integration => integration.result !== 'succeeded');
            }

            sortedIntegrations = sortedIntegrations.sort(function (itemA, itemB) {
                return (itemB.number - itemA.number);
            });

            if (_DEBUG_PRUNNING) {
                logger.debug('Sorted non pruned integrations candidate list:', JSON.stringify(sortedIntegrations, null, 4), '#Pruning');
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

function pruneAssetsForIntegration(theIntegration, fileClass, cb) {

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

function removeNonPrunedIntegrationsWithIDs(docIDList, cb) {
    async.each(docIDList, function (docID, callback) {

        dbCoreClass.removeDocument(null, docID, null, function () {
            // Ignore errors and try to delete as much as we can
            return callback();
        });

    }, function () {
        return xcsutil.safeCallback(cb);
    });
}

function clearCodeCoverageCacheDirectory(cb) {
    var codeCoverageCachePath = config.get('path.codeCoverageCache'),
        numberOfDaysOld = k.XCSCodeCoverageCacheFileMinAgeInDaysToBePruned;
    logger.debug('#Pruning files older than', numberOfDaysOld, 'days located at', codeCoverageCachePath);
    xcsutil.removeDirectoryContents(codeCoverageCachePath, numberOfDaysOld, '#Pruning', cb);
}

function removeNonDirectoriesAtPath(dir, numberOfDaysOld, cb) {

    var log = logger.withRequest(null),
        spaceFreed = 0;

    // Remove the trailing '/'
    dir = dir.replace(/\/$/, "");

    fs.readdir(dir, function (err, list) {
        if (err) {
            log.debug('Unable to read the contents of', dir, '. Reason:', err, '.');
            return xcsutil.safeCallback(cb, err);
        }

        var i = 0,
            oneDayInMiliseconds = 24 * 60 * 60 * 1000;

        if ((null === numberOfDaysOld) || (undefined === numberOfDaysOld) || (numberOfDaysOld < 0)) {
            numberOfDaysOld = k.XCSCodeCoverageCacheFileMinAgeInDaysToBePruned;
        }

        (function next() {
            var file = list[i++];

            if (!file) {
                return xcsutil.safeCallback(cb, null, spaceFreed);
            }

            file = dir + '/' + file;

            fs.stat(file, function (error, stat) {

                if (stat && stat.isDirectory()) {
                    next();
                } else {
                    var days = Math.floor((Date.now() - stat.mtime) / oneDayInMiliseconds);

                    if (days >= numberOfDaysOld) {
                        // Remove the file
                        fs.unlink(file, function () {
                            spaceFreed += stat.size;
                            next();
                        });
                    } else {
                        next();
                    }
                }

            });
        })();
    });
}

function removeOrphanedIntegrationAssetDirectories(cb) {
    var log = logger.withRequest(null),
        sizeOfOrphanedDataFreed = 0;

    botClass.listAllBots(null, function (err, botList) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        }

        var botIDs = _.pluck(botList, '_id');

        fs.readdir(assetsPath, function (err, fileList) {
            if (err) {
                log.debug('Unable to read the contents of', assetsPath, '. Reason:', err);
                return xcsutil.safeCallback(cb, err);
            }

            async.each(fileList, function (file, callback) {
                    var assetBotID = file.substr(0, file.indexOf('-'));

                    var match = _.filter(botIDs, function (botID) {
                        return botID === assetBotID;
                    });

                    if (match.length > 0) {
                        callback();
                    } else {
                        var fullFilePath = assetsPath + '/' + file;

                        fs.stat(fullFilePath, function (err, stat) {
                            log.debug('#Pruning file', fullFilePath, 'is an orphan.');
                            if (stat) {
                                sizeOfOrphanedDataFreed += stat.size;
                            }
                            callback();
                        });
                    }
                },
                function () {
                    return xcsutil.safeCallback(cb, sizeOfOrphanedDataFreed);
                });
        });
    });
}
