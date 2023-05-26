/*
    XCSFileClass
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var _ = require('underscore'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    uuid = require('node-uuid'),
    exec = require('child_process').exec,
    execFile = require('child_process').execFile;

var k = require('../constants.js'),
    XCSAPIBasePath = k.XCSAPIBasePath,
    XCSIntegrationAssets = k.XCSIntegrationAssets,
    authClass = require('./authClass.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    botClass = require('./botClass.js'),
    integrationSearchClass = require('./integrationSearchClass.js'),
    settings = require('./settingsClass.js'),
    redisClass = require('./redisClass.js'),
    xcsutil = require('../util/xcsutil.js'),
    xcsbridge = require('../util/xcsbridge.js'),
    konsole = require('../util/konsole.js');

function request(title, handler) {
    return function (req, res) {
        var logLevel = xcsutil.logLevelInc(req);
        konsole.log(req, title + ' ' + req.method + ' ' + req.url);

        handler.call(this, req, res, function (err, statusCode, results) {
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

            if (err) {
                xcsutil.standardizedErrorResponse(res, err);
            } else {
                xcsutil.standardizedResponse(res, statusCode, results);
            }
        });
    };
}

function helper(handler) {
    return function (req) {
        var logLevel = xcsutil.logLevelInc(req);

        var newArgs = Array.prototype.slice.call(arguments, 0, arguments.length - 1),
            callback = arguments[arguments.length - 1];
        newArgs.push(function () {
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

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
    var query = unitTestify(req, {
        include_docs: true,
        key: integrationID
    });

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentFile, k.XCSDesignDocumentViewFilesByIntegrationAndType, query, cb);
});

XCSFileClass.prototype.create = request('[File - create]', function create(req, res, cb) {
    var asset = req.body,
        integrationID = req.params.id;

    asset.integrationID = integrationID;
    if (req.headers[k.XCSUnitTestHeader]) {
        asset[k.XCSUnitTestProperty] = req.headers[k.XCSUnitTestHeader];
    }

    async.waterfall([
        function (cb) {
            if (asset.relativePath) {
                cb();
            } else {
                integrationSearchClass.findIntegrationWithUUID(req, integrationID, false, function (err, integration) {
                    if (err) {
                        cb(err);
                    } else {
                        asset.relativePath = path.join(assetsDirectoryForIntegration_internal(integration), asset.fileName);
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
    var fileID = req.params.id,
        self = this;

    var file, fullPath, dirName, baseName;

    async.waterfall([
        function (cb) {
            self.findFileWithID(req, fileID, cb);
        },
        function (theFile, cb) {
            file = theFile;
            fullPath = path.join(k.XCSIntegrationAssets, file.relativePath);
            dirName = path.dirname(fullPath);
            baseName = path.basename(fullPath);

            fs.stat(fullPath, function (err) {
                if (err) {
                    mkdirp(dirName, cb);
                } else {
                    cb({
                        status: 409,
                        message: 'Conflict: a file already exists at this location'
                    });
                }
            });
        },
        function (directory, cb) {
            upload_internal(req, dirName, baseName, cb);
        },
        function (fileName, cb) {
            konsole.log(req, '[File - upload] Moved file to ' + fileName);
            fs.stat(fileName, cb);
        },
        function (stats, cb) {
            konsole.log(req, '[File - upload] Got stats: ' + JSON.stringify(stats));
            var changes = {
                size: stats.size
            };
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
    konsole.log(req, '[File - findFileWithID] id: ' + fileID);
    dbCoreClass.findDocumentWithUUID(req, fileID, k.XCSDesignDocumentFile, cb);
});

XCSFileClass.prototype.download = function download(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[File - download] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var uri = url.parse(req.url).pathname,
        newuri = uri.replace(new RegExp(XCSAPIBasePath + '/assets(/token/[^/]+)?/'), '', 'gi'),
        relativePath = decodeURIComponent(newuri),
        filename = path.join(XCSIntegrationAssets, relativePath);

    konsole.log(req, '[File - download] Request to serve file:' + filename);

    var query = unitTestify(req, {
        include_docs: true,
        key: relativePath
    });

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentFile, k.XCSDesignDocumentViewFilesByPath, query, function (err, docs) {

        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (err) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 404,
                message: 'Not found'
            });
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
            return serveFile();
        } else {
            authClass.enforceBotViewerRole(req, res, serveFile);
        }
    });
};

XCSFileClass.prototype.downloadIntegrationArchive = function downloadIntegrationArchive(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[File - downloadIntegrationArchive] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        fullPath, downloadFilename;

    async.waterfall([

        function FIDownloadIntegrationArchiveFindIntegration(cb) {
            integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, cb);
        },
        function FIDownloadIntegrationArchiveSaveAssets(integration, cb) {
            var relativePath = assetsDirectoryForIntegration_internal(integration);
            fullPath = path.join(XCSIntegrationAssets, relativePath);
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
        xcsutil.logLevelDec(req);
        if (err) {
            if (err.status) {
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                return xcsutil.standardizedErrorResponse(res, {
                    status: 500,
                    message: 'Internal Server Error (xcsd): error downloading integration archive: ' + JSON.stringify(err)
                });
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
    konsole.log(req, '[File - productsForIntegration] loading products for ' + integrationUUID);

    var query = {
        startkey: [integrationUUID],
        endkey: [integrationUUID, {}],
        include_docs: true
    };

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentFile, k.XCSDesignDocumentViewProductsByVariant, query, cb);
});

XCSFileClass.prototype.install = function install(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[File - install] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id;

    konsole.log(req, '[File - install] Request to install or download product of integration: ' + integrationUUID);

    // Find the integration
    integrationSearchClass.findIntegrationWithUUID(req, integrationUUID, false, function FIInstallFindIntegration(err, integration) {
        if (err) {
            konsole.log(req, '[File - install] No matching integration found');
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            return res.sendStatus(err.status);
        } else {

            // make sure we have a product asset
            var product = integration && integration.assets && integration.assets.product;
            if (!product) {
                konsole.log(req, '[File - install] Integration does not have a product asset');
                xcsutil.logLevelDec(req);
                xcsutil.logLevelCheck(req, logLevel);
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
                        // we're good to go, generate a token for this request
                        var token = uuid.v4();
                        redisClass.client().set(k.XCSRedisAuthTokenPrefix + token, req.session.username || '', 'EX', k.XCSAuthTokenTTLInSeconds, function FIInstallRedisSetAuthToken(err) {
                            if (err) {
                                konsole.log(req, '[File - install] Could not set auth token in Redis: ' + JSON.stringify(err));
                                xcsutil.logLevelDec(req);
                                xcsutil.logLevelCheck(req, logLevel);
                                return res.sendStatus(500);
                            }

                            // build up the URL
                            var scheme = 'https'; // iOS 7.1+ requires HTTPS
                            var host = (req.headers[k.XCSForwardedHost] && req.headers[k.XCSForwardedHost].split(',')[0]) || req.headers[k.XCSHostHeader];
                            host = host.split(':')[0] + ':' + k.XCSHTTPSPort; // force traffic over the HTTPS port
                            var basePath = k.XCSAPIBasePath; // connection is direct to xcsd, always
                            var manifestURL = scheme + '://' + host + basePath + '/integrations/' + integrationUUID + '/' + token + '/install_manifest.plist';
                            var redirectURL = 'itms-services://?action=download-manifest&url=' + manifestURL;

                            // respond with an install-manifest action
                            konsole.log(req, '[File - install] Redirecting to iOS installation manifest');
                            konsole.log(req, '[File - install] ' + redirectURL);

                            xcsutil.logLevelDec(req);
                            xcsutil.logLevelCheck(req, logLevel);
                            return res.redirect(redirectURL);
                        });

                        return;
                    } else {
                        konsole.log(req, '[File - install] iOS version from user agent (' + version + ') is too old, skipping install');
                    }
                } else {
                    konsole.log(req, '[File - install] User-Agent is not an iOS user agent, skipping install');
                }
            } else {
                konsole.log(req, '[File - install] Product asset is not an .ipa, skipping install');
            }

            // otherwise, just redirect to the file itself, using the appropriate base URL if we're through the /xcode proxy
            konsole.log(req, '[File - install] Redirecting to download URL');
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);

            var relativeURL = '/assets/' + encodeURI(product.relativePath);
            if (req.headers[k.XCSForwardedHost]) {
                res.redirect(k.XCSProxiedAPIBasePath + relativeURL);
            } else {
                res.redirect(k.XCSAPIBasePath + relativeURL);
            }
        }
    });

};

function isAssetPackManifest(file) {
    return file.fileName.indexOf('AssetPackManifest') === 0;
}

XCSFileClass.prototype.installManifest = function installManifest(req, res) {

    var logLevel = xcsutil.logLevelInc(req),
        self = this;

    var functionTitle = '[File - installManifest] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        installToken = req.params.token;

    konsole.log(req, '[File - installManifest] Request for manifest of product from integration: ' + integrationUUID);

    if (!installToken) {
        konsole.log(req, '[File - installManifest] No authentication token in URL');
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
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
                konsole.log(req, '[File - installManifest] No info dictionary was stored with this asset');
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
                    return {
                        kind: 'software-package',
                        url: assetPrefix + '/token/' + installToken + '/' + encodeURI(product.relativePath)
                    };
                } else if (isAssetPackManifest(product)) {
                    return {
                        kind: 'asset-pack-manifest',
                        url: assetPrefix + '/' + product.relativePath
                    };
                } else {
                    konsole.error(req, '[File - installManifest] product \'' + product.fileName + '\' is of unknown type');
                    return null;
                }
            }

            var assets = [],
                thinnedAssets = [];
            products.forEach(function (theProduct) {
                var asset = baseAssetForProduct(theProduct);
                if (theProduct.variantIds) {
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
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (err) {
            res.sendStatus(err.status);
        } else {
            res.type('xml');
            res.send(data);
        }
    });

};

XCSFileClass.prototype.otaProfile = function otaProfile(req, res) {
    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[File - otaProfile] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    xcsutil.logLevelDec(req);
    xcsutil.logLevelCheck(req, logLevel);

    var stream = fs.createReadStream(k.XCSOTAConfigurationProfilePath);
    res.cookie('installedProfile', '1', {
        maxAge: k.XCSSSLCertificateValidityPeriod * 24 * 60 * 60 * 1000
    });
    res.type('application/x-apple-aspen-config');
    stream.pipe(res);
};



XCSFileClass.prototype.deleteAssetsForIntegration = function deleteAssetsForIntegration(integration, cb) {
    var assetsDir = assetsDirectoryForIntegration_internal(integration),
        fullPath = path.join(XCSIntegrationAssets, assetsDir);

    xcsutil.removeDirectory(fullPath, function (err) {
        if (err) {
            konsole.log(null, '[Pruning - ' + integration.bot.name + '] unable to prune directory: ' + fullPath);
        } else {
            konsole.log(null, '[Pruning - ' + integration.bot.name + '] directory pruned: ' + fullPath);
        }
        return xcsutil.safeCallback(cb, err);
    });
};

XCSFileClass.prototype.prune = function FIPrune(req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[File - prune] Starting to prune',
        self = this;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    self.prune_internal(function (err, result) {
        if (err) {
            xcsutil.logLevelDec(req);
            xcsutil.profilerSummary(req);
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            xcsutil.logLevelDec(req);
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
                konsole.log(null, '[Pruning] **************************************************');
                konsole.log(null, '[Pruning] Asset usage exceeds maximum allowed, starting to prune.');
                konsole.log(null, '[Pruning] Need to free up ' + xcsutil.formatBytes(spaceToFree));

                pruneUntilSpaceFreed(spaceToFree, self, function FIPrunePruneUntilSpaceFreed(err, spaceFreed) {
                    if (err) {
                        return xcsutil.safeCallback(cb, err);
                    }
                    konsole.log(null, '[Pruning] **************************************************');
                    return xcsutil.safeCallback(cb, null, spaceFreed > 0);
                });
            } else {
                return xcsutil.safeCallback(cb, null, false);
            }
        }
    });
};

/* Module exports */

module.exports = new XCSFileClass();

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

    xcsutil.logLevelInc(req);

    var functionTitle = '[File - upload_internal] upload internal';

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    // Requirement: obtain only the first file object uploaded
    var key = (req.files && Object.keys(req.files).pop()),
        fileObj = (key && req.files[key]);

    if (!fileObj) {
        xcsutil.logLevelDec(req);
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'no file with key "' + key + '" exists'
        });

    } else {
        var filePath = path.join(dirPath, fileName);
        fs.rename(fileObj.path, filePath, function FIuploadInternalRename(err) {
            xcsutil.logLevelDec(req);
            if (err) {
                konsole.error(req, 'Error moving file: ' + err);
                return xcsutil.safeCallback(cb, {
                    status: 500,
                    message: 'Internal Server Error (xcsd): unable to move uploaded file to path: ' + filePath
                });
            }
            return xcsutil.safeCallback(cb, null, filePath);
        });
    }
}

function getDiskCapacity(cb) {
    exec('df -kl | awk \'$9 == "/" { print $2 }\'', function FIGetDiskCapacity(err, stdout) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, parseInt(stdout.trim(), 10) * 1024);
        }
    });
}

function getTotalAssetUsage(cb) {
    var query = {
        group: false
    };

    dbCoreClass.findDocumentsWithQuery(null, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewAssetSizeByDate, query, function FiGetTotalAssetUsage(err, docs) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            if (docs && docs.length === 1) {
                return xcsutil.safeCallback(cb, null, docs[0]);
            } else {
                return xcsutil.safeCallback(cb, null, 0);
            }
        }
    });
}

function checkPruningNecessary(cb) {
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
            return xcsutil.safeCallback(cb, err);
        }

        var settings = results.settings,
            maxAllowedUsage = settings.max_percent_disk_usage * results.diskCapacity, // i.e. 75% of 500GB = 375GB
            excessSpace = results.totalAssetUsage - maxAllowedUsage; // i.e. 400GB - 375GB = 25GB
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
        konsole.log(null, '[Pruning] Gathering list of integrations per bot');
        sortedIntegrationCountPerBot(function (err, sortedBotIntegrationCounts) {
            if (err) {
                konsole.error(null, '[Pruning] err while calling sortedIntegrationCountPerBot: ' + JSON.stringify(err));
                return xcsutil.safeCallback(pruningRoundCallback, err);
            }

            // No need to continue if there's nothing to prune
            if (0 === sortedBotIntegrationCounts.length) {
                konsole.log(null, '[Pruning] there are not bots -> canceling');
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

                konsole.log(null, '[Pruning] highest bot with an integration count: ' + botName);

                // If the highest bot integration count has hit the watermark, bail out
                if (topBotIntegrationCount <= k.XCSMinNumberOfIntegrationsSafeFromPruning) {
                    konsole.log(null, '[Pruning - ' + botName + '] low watermark reached (' + k.XCSMinNumberOfIntegrationsSafeFromPruning + ' integrations) -> canceling');
                    continuePruning = false;
                    return xcsutil.safeCallback(pruningRoundCallback);
                }

                // Set the lower limit to at least k.XCSMinNumberOfIntegrationsSafeFromPruning integrations
                var secondHighestBotIntegrationCount = (sortedBotIntegrationCounts.length === 1 ? k.XCSMinNumberOfIntegrationsSafeFromPruning : sortedBotIntegrationCounts[1].value);
                if (secondHighestBotIntegrationCount < k.XCSMinNumberOfIntegrationsSafeFromPruning) {
                    secondHighestBotIntegrationCount = k.XCSMinNumberOfIntegrationsSafeFromPruning;
                }

                konsole.log(null, '[Pruning - ' + botName + '] topBotIntegrationCount: ' + topBotIntegrationCount);
                konsole.log(null, '[Pruning - ' + botName + '] secondHighestBotIntegrationCount: ' + secondHighestBotIntegrationCount);

                sortedIntegrationsPerBot(botID, function (err, sortedIntegrations) {
                    if (err) {
                        konsole.error(null, '[Pruning - ' + botID + '] err while calling sortedIntegrationsPerBot: ' + JSON.stringify(err));
                        return xcsutil.safeCallback(pruningRoundCallback, err);
                    }

                    var numberOfIntegrationsToPrune = topBotIntegrationCount - secondHighestBotIntegrationCount;
                    if (0 === numberOfIntegrationsToPrune) {
                        numberOfIntegrationsToPrune = 1;
                    }

                    konsole.log(null, '[Pruning - ' + botName + '] sortedIntegrations.length: ' + sortedIntegrations.length);

                    if (sortedIntegrations.length <= (k.XCSMinNumberOfIntegrationsSafeFromPruning + 10)) {
                        konsole.log(null, '[Pruning - ' + botName + '] sortedIntegrations numbers: ' + _.pluck(sortedIntegrations, 'number'));
                    } else {
                        konsole.log(null, '[Pruning - ' + botName + '] sortedIntegrations.length: ' + sortedIntegrations.length);
                    }

                    konsole.log(null, '[Pruning - ' + botName + '] numberOfIntegrationsToPrune: ' + numberOfIntegrationsToPrune);

                    // Reduce the array to the integrations we're going to prune
                    var pruningCandidates = sortedIntegrations.slice(0, numberOfIntegrationsToPrune);

                    if (pruningCandidates.length <= (k.XCSMinNumberOfIntegrationsSafeFromPruning + 10)) {
                        konsole.log(null, '[Pruning - ' + botName + '] pruningCandidates numbers: ' + _.pluck(pruningCandidates, 'number'));
                    } else {
                        konsole.log(null, '[Pruning - ' + botName + '] pruningCandidates.length: ' + pruningCandidates.length);
                    }

                    pruneIntegrations(botID, pruningCandidates, fileClass, spaceFreed, targetSpace, continuePruning, function (err, newSpaceFreed, newContinuePruning) {
                        if (err) {
                            konsole.error(null, '[Pruning - ' + botName + '] err while pruneIntegrations: ' + JSON.stringify(err));
                            return xcsutil.safeCallback(pruningRoundCallback, err);
                        } else {
                            spaceFreed = newSpaceFreed;
                            continuePruning = newContinuePruning;
                            konsole.log(null, '[Pruning - ' + botName + '] pruning round finalized.');
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
            konsole.log(null, '[Pruning] --------------------------------------------------');
            pruningRound(function (err) {
                if (!err) {
                    konsole.log(null, '[Pruning] spaceFreed so far: ' + xcsutil.formatBytes(spaceFreed));
                    konsole.log(null, '[Pruning] targetSpace: ' + xcsutil.formatBytes(targetSpace));
                    konsole.log(null, '[Pruning] continue pruning? ' + (continuePruning ? 'true' : 'false'));
                }
                return xcsutil.safeCallback(untilCallback, err);
            });
        },
        function (err) {
            if (err) {
                konsole.error(null, '[Pruning] pruning round failed with error: ' + JSON.stringify(err));
                return xcsutil.safeCallback(cb, err);
            } else {
                return xcsutil.safeCallback(cb, null, spaceFreed);
            }
        });
}

function pruneIntegrations(botID, pruningCandidates, fileClass, spaceFreed, targetSpace, continuePruning, cb) {
    // Prune each of the integrations
    async.each(pruningCandidates, function (integration, eachCallback) {

            konsole.log(null, '[Pruning - ' + integration.bot.name + '] obtaining the size of the asset for integration number: ' + integration.number);

            // Obtain the asset size for the integration
            sizeOfAssetsForIntegration(integration, function (err, size) {

                // Canceled integrations are "soft" errors: not having assets to prune is OK
                // (i.e. canceled integrations may not have any)
                if (err) {
                    if (404 === err.status) {
                        konsole.log(null, '[Pruning - ' + integration.bot.name + '] integration ' + integration.number + ': assets not found');
                    } else {
                        konsole.error(null, '[Pruning - ' + integration.bot.name + '] error while obtaining the size of the asset: ' + JSON.stringify(err));
                        return xcsutil.safeCallback(eachCallback, err);
                    }
                }

                konsole.log(null, '[Pruning - ' + integration.bot.name + '] integration ' + integration.number + ' size: ' + xcsutil.formatBytes(size));

                // Attempt to prune it
                pruneIntegration_internal(integration, fileClass, function (err) {
                    // If the error is not an 404 (directory not found), report the error
                    if (err && (404 !== err.status)) {
                        konsole.error(null, '[Pruning - ' + integration.bot.name + '] error while pruning the integration: ' + JSON.stringify(err));
                        return xcsutil.safeCallback(eachCallback, err);
                    }

                    // Only increment the spaced free if we actually removed the assets
                    if (size) {
                        spaceFreed += size;
                    }

                    // If we have accomplished our space-reclaiming goal, we don't need to continue pruning
                    if (spaceFreed >= targetSpace) {
                        konsole.log(null, '[Pruning - ' + integration.bot.name + '] goal reached: reclaimed ' + xcsutil.formatBytes(spaceFreed) + ' (' + xcsutil.formatBytes(targetSpace) + ' targeted): ');
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

    konsole.log(null, '[Pruning - ' + theIntegration.bot.name + '] pruning integration: ' + theIntegration.number);

    fileClass.deleteAssetsForIntegration(theIntegration, function FIPruneIntegration(err) {
        if (err && (404 !== err.status)) {
            konsole.error(null, '[Pruning - ' + theIntegration.bot.name + '] error while deleting the asset: ' + JSON.stringify(err));
            return xcsutil.safeCallback(cb, err);
        } else {
            require('./integrationClass.js').update_internal(null, theIntegration._id, {
                assetsPruned: true
            }, function (err) {
                if (err && 404 !== err.status) {
                    konsole.error(null, '[Pruning - ' + theIntegration.bot.name + '] error while updating the integration: ' + JSON.stringify(err));
                    return xcsutil.safeCallback(cb, err);
                } else {
                    return xcsutil.safeCallback(cb);
                }
            });
        }
    });

}