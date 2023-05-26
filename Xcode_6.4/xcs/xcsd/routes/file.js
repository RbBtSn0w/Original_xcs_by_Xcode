'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var k = require('../constants.js'),
    XCSAPIBasePath = k.XCSAPIBasePath,
    XCSIntegrationAssets = k.XCSIntegrationAssets,
    db_core = require('./db_core.js'),
    integration_search = require('./integration_search.js'),
    settings = require('./settings.js'),
    url = require('url'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    mkdirp = require('mkdirp'),
    uuid = require('node-uuid'),
    redis = require('../classes/redisClass.js'),
    exec = require('child_process').exec,
    execFile = require('child_process').execFile,
    xcsutil = require('../util/xcsutil.js'),
    xcsbridge = require('../util/xcsbridge.js'),
    konsole = require('../util/konsole.js');

var file = {};

file.assetsDirectoryForIntegration = function (integration) {
    var bot_name = integration.bot._id + '-' + integration.bot.name,
        integration_number = integration.number,
        relativepath = path.join(bot_name, '' + integration_number);

    return relativepath;
};

file.download = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[File - download] ' + req.method + ' ' + req.url + '...';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var uri = url.parse(req.url).pathname,
        newuri = uri.replace(new RegExp(XCSAPIBasePath + '/assets(/token/[^/]+)?'), '', 'gi'),
        filename = path.join(XCSIntegrationAssets, decodeURIComponent(newuri));

    konsole.log(req, '[File - download] Request to serve file:' + filename);

    fs.exists(filename, function (exists) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (!exists) {
            return xcsutil.standardizedErrorResponse(res, {
                status: 404,
                message: 'Not found'
            });
        }

        // clear the existing content type so it gets set automatically by res.download()
        res.setHeader('Content-type', null);
        return res.download(filename);
    });
};

file.downloadIntegrationArchive = function (req, res) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[File - downloadIntegrationArchive] ' + req.method + ' ' + req.url + '...';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        fullPath, downloadFilename;

    async.waterfall([

        function (cb) {
            integration_search.findIntegrationWithUUID(req, integrationUUID, cb);
        },
        function (integration, cb) {
            var relativePath = file.assetsDirectoryForIntegration(integration);
            fullPath = path.join(XCSIntegrationAssets, relativePath);
            downloadFilename = integration.bot.name + ' - ' + integration.number + ' - Assets.tar.gz';

            xcsutil.writeTemporaryFile('', cb);
        },
        function (filename, callback, cb) {
            execFile('/usr/bin/tar', ['-czf', filename, '-C', path.dirname(fullPath), path.basename(fullPath)], function (err) {
                if (err) {
                    cb(err);
                } else {
                    cb(null, filename, callback);
                }
            });
        }
    ], function (err, filename, cleanupCallback) {
        xcsutil.logLevelDec(req);
        if (err) {
            if (err.status) {
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                return xcsutil.standardizedErrorResponse(res, {
                    status: 500,
                    message: 'Error downloading integration archive: ' + err
                });
            }
        } else {
            res.setHeader('Content-type', 'application/gzip');
            res.download(filename, downloadFilename, function () {
                cleanupCallback();
            });
        }
    });
    
};

file.install = function (req, res) {
    
    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[File - install] ' + req.method + ' ' + req.url + '...';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }
    
    var integrationUUID = req.params.id;
    
    konsole.log(req, '[File - install] Request to install or download product of integration: ' + integrationUUID);

    // Find the integration
    integration_search.findIntegrationWithUUID(req, integrationUUID, function (err, integration) {
        if (err) {
            konsole.log(req, '[File - install] No matching integration found');
            xcsutil.logLevelDec(req);
            return res.send(err.status, err.message);
        } else {
            
            // make sure we have a product asset
            var product = integration && integration.assets && integration.assets.product;
            if (!product) {
                konsole.log(req, '[File - install] Integration does not have a product asset');
                xcsutil.logLevelDec(req);
                return res.send(404, "File Not Found");
            }
            
            // check to see if it's an iOS product
            if (product.relativePath.match(/\.ipa$/i)) {
                // check the user agent
                var userAgent = req.headers['user-agent'];
                var m = userAgent.match(/(iPhone|iPod|iPad|iPod touch); (U; )?(CPU|CPU [\w]*)? OS (\d)/i);
                if (m && m.length >= 5) {
                    var version = parseInt(m[4], 10);
                    if (version >= 4) {     // install manifests are only for iOS 4+
                        // we're good to go, generate a token for this request
                        var token = uuid.v4();
                        redis.client().set(k.XCSRedisAuthTokenPrefix + token, req.session.username || '', 'EX', k.XCSAuthTokenTTLInSeconds, function(err){
                            if (err) {
                                konsole.log(req, '[File - install] Could not set auth token in Redis: ' + err.message);
                                xcsutil.logLevelDec(req);
                                return res.send(500, err.message);
                            }
                        
                            // build up the URL
                            var scheme = 'https';   // iOS 7.1+ requires HTTPS
                            var host = (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].split(',')[0]) || req.headers['host'];
                                host = host.split(':')[0] + ':' + k.XCSHTTPSPort;   // force traffic over the HTTPS port
                            var basePath = k.XCSAPIBasePath;    // connection is direct to xcsd, always
                            var manifestURL = scheme + '://' + host + basePath + '/integrations/' + integrationUUID + '/' + token + '/install_manifest.plist';
                            var redirectURL = 'itms-services://?action=download-manifest&url=' + manifestURL;
                            
                            // respond with an install-manifest action
                            konsole.log(req, '[File - install] Redirecting to iOS installation manifest');
                            konsole.log(req, '[File - install] ' + redirectURL);
                            
                            xcsutil.logLevelDec(req);
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
            
            var relativeURL = '/assets/' + encodeURI(product.relativePath);
            if (req.headers['x-forwarded-host'])
                res.redirect(k.XCSProxiedAPIBasePath + relativeURL);
            else
                res.redirect(k.XCSAPIBasePath + relativeURL);
            
        }
    });
    
};

file.installManifest = function (req, res) {
    
    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[File - installManifest] ' + req.method + ' ' + req.url + '...';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        installToken = req.params.token;
    
    konsole.log(req, '[File - installManifest] Request for manifest of product from integration: ' + integrationUUID);
    
    if (!installToken) {
        konsole.log(req, '[File - installManifest] No authentication token in URL');
        xcsutil.logLevelDec(req);
        return res.send(403, "Forbidden: no authentication token provided");
    }
    
    // find the integration
    integration_search.findIntegrationWithUUID(req, integrationUUID, function (err, integration) {
        if (err) {
            konsole.log(req, '[File - installManifest] No matching integration found');
            xcsutil.logLevelDec(req);
            return res.send(err.status, err.message);
        } else {
    
            // make sure we have a product asset
            var product = integration && integration.assets && integration.assets.product;
            if (!product) {
                konsole.log(req, '[File - installManifest] Integration does not have a product asset');
                xcsutil.logLevelDec(req);
                return res.send(404, "File Not Found");
            }
    
            // check to see if it's an iOS product
            if (product.relativePath.match(/\.ipa$/i)) {
                // make sure we have an info dictionary
                if (!product.infoDictionary) {
                    konsole.log(req, '[File - installManifest] No info dictionary was stored with this asset');
                    xcsutil.logLevelDec(req);
                    return res.send(500, "No info dictionary was available for this asset");
                }
                
                // determine the base URL components and installation URL
                var scheme = req.headers['x_forwarded_proto'] || 'https';
                var host = (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].split(',')[0]) || req.headers['host'];
                var basePath = (req.headers['x-forwarded-host']) ? k.XCSProxiedAPIBasePath : k.XCSAPIBasePath;
                var downloadURL = scheme + '://' + host + basePath + '/assets/token/' + installToken + '/' + encodeURI(product.relativePath);
                
                // build up the install manifest
                var manifest = {
                    'items': [
                        {
                            'assets': [
                                {
                                    'kind': 'software-package',
                                    'url': downloadURL
                                }
                            ],
                            'metadata': {
                                'bundle-identifier': product.infoDictionary.CFBundleIdentifier || null,
                                'bundle-version': product.infoDictionary.CFBundleVersion || null,
                                'kind': 'software',
                                'title': product.infoDictionary.CFBundleDisplayName || product.infoDictionary.CFBundleName || null
                            }
                        }
                    ]
                };
                
                // convert it to a plist and respond
                xcsbridge.serialization.createPropertyList(manifest, function(err, data){
                    if (err) {
                        konsole.log(req, '[File - installManifest] Error serializing manifest: ' + err);
                        xcsutil.logLevelDec(req);
                        return res.send(500, err);
                    }
                    
                    xcsutil.logLevelDec(req);
                    res.type('xml');
                    return res.send(data);
                });
                
                return;
                
            } else {
                konsole.log(req, '[File - installManifest] Product asset is not an .ipa, skipping install');
            }
    
            // otherwise, let's call it a 404
            konsole.log(req, '[File - installManifest] Something went wrong, so we\'ll treat it as "not found"');
            xcsutil.logLevelDec(req);
            res.send(404, "File Not Found");
    
        }
    });
    
};

file.otaProfile = function(req, res) {
    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[File - otaProfile] ' + req.method + ' ' + req.url + '...';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }
    
    xcsutil.logLevelDec(req);
    
    var stream = fs.createReadStream(k.XCSOTAConfigurationProfilePath);
    res.cookie('installedProfile', '1', {maxAge: k.XCSSSLCertificateValidityPeriod * 24 * 60 * 60 * 1000});
    res.type('application/x-apple-aspen-config');
    stream.pipe(res);
};

function makeDirIfNeeded(req, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[File - makeDirIfNeeded] make dir if needed...';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id;

    // Find the integration
    integration_search.findIntegrationWithUUID(req, integrationUUID, function (err, integration) {
        if (err) {
            xcsutil.logLevelDec(req);
            return cb(err);
        } else {

            var relativepath = file.assetsDirectoryForIntegration(integration),
                fullpath = path.join(XCSIntegrationAssets, relativepath),
                error;

            // Check if the directory exists
            fs.stat(fullpath, function (err, stats) {

                // Check if it doesn't exist
                if (err) {
                    mkdirp(fullpath, function (err) {

                        if (err) {
                            error = {};
                            error.status = 500;
                            error.message = 'Unable to create the directory: ' + fullpath;
                            xcsutil.logLevelDec(req);
                            return cb(error);
                        } else {
                            konsole.log(req, 'Directory created at path: ' + fullpath);
                            xcsutil.logLevelDec(req);
                            return cb(null, fullpath, relativepath);
                        }

                    });
                } else {

                    // Check that we're not dealing with a file
                    if (stats.isFile()) {
                        error = {};
                        error.status = 500;
                        error.message = 'The directory at ' + fullpath + ' is a file!';
                        xcsutil.logLevelDec(req);
                        return cb(error);
                    } else {
                        konsole.log(req, '[File - makeDirIfNeeded] directory already exists at path: ' + fullpath);
                        xcsutil.logLevelDec(req);
                        return cb(null, fullpath, relativepath);
                    }

                }
            });
        }
    });

}

function upload_internal(req, dirPath, cb) {

    xcsutil.logLevelInc(req);

    var functionTitle = '[File - upload_internal] upload internal...';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    // Requirement: obtain only the first file object uploaded
    var key = (req.files && Object.keys(req.files).pop()),
        fileObj = (key && req.files[key]),
        error;

    if (!fileObj) {
        error = {};
        error.status = 400;
        error.message = 'No file object found!';
        xcsutil.logLevelDec(req);
        return cb(error);

    } else {
        var filename = fileObj.name;

        // Check if the file name is not found
        if (!filename) {
            xcsutil.logLevelDec(req);
            return cb({
                status: 500,
                message: 'File name property not found!'
            });
        } else {
            var filePath = path.join(dirPath, filename);
            fs.rename(fileObj.path, filePath, function (err) {
                xcsutil.logLevelDec(req);
                if (err) {
                    return cb({
                        status: 500,
                        message: 'Unable to move uploaded file to path: ' + filePath
                    });
                }
                return cb(null, filename);
            });
        }

    }
}

file.upload = function (req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[File - upload] ' + req.method + ' ' + req.url + '...';
    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.title = functionTitle;
        req.snitch.next(functionTitle);
    }

    var dirPath,
        filename,
        relativePath,
        filesize;

    async.series([

        function (cb) {
                makeDirIfNeeded(req, function (err, path, relativeDir) {
                    dirPath = path;
                    relativePath = relativeDir;
                    return cb(err);
                });
            },
        function (cb) {
                upload_internal(req, dirPath, function (err, newFilename) {
                    filename = newFilename;
                    relativePath = path.join(relativePath, filename);
                    return cb(err);
                });
            },
        function (cb) {
                fs.stat(path.join(dirPath, filename), function (err, stats) {
                    filesize = stats.size;
                    return cb(err);
                });
            }
    ],
        function (err) {
            xcsutil.profilerSummary(req);
            xcsutil.logLevelDec(req);
            xcsutil.logLevelCheck(req, logLevel);
            if (err) {
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                return xcsutil.standardizedResponse(res, 200, {
                    relativePath: relativePath,
                    size: filesize
                });
            }
        });

};

file.deleteAssetsForIntegration = function (integration, cb) {
    var assetsDir = file.assetsDirectoryForIntegration(integration),
        fullPath = path.join(XCSIntegrationAssets, assetsDir);

    xcsutil.removeDirectory(fullPath, cb);
};


// PRUNING

function getDiskCapacity(cb) {
    exec('df -kl | awk \'$9 == "/" { print $2 }\'', function (err, stdout) {
        if (err) {
            cb(err);
        } else {
            cb(null, parseInt(stdout.trim(), 10) * 1024);
        }
    });
}

function getTotalAssetUsage(cb) {
    var query = {
        group: false
    };

    db_core.findDocumentsWithQuery(null, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewAssetSizeByDate, query, function (err, docs) {
        if (err) {
            cb(err);
        } else {
            if (docs && docs.length === 1) {
                cb(null, docs[0]);
            } else {
                cb(null, 0);
            }
        }
    });
}

function checkPruningNecessary(cb) {
    async.parallel({
        settings: function (cb) {
            settings.findOrCreateSettingsDocument(null, function (err, settings) {
                cb(err, settings);
            });
        },
        diskCapacity: function (cb) {
            getDiskCapacity(cb);
        },
        totalAssetUsage: function (cb) {
            getTotalAssetUsage(cb);
        }
    }, function (err, results) {
        if (err) {
            return cb(err);
        }

        var settings = results.settings,
            maxAllowedUsage = settings.max_percent_disk_usage * results.diskCapacity,
            excessSpace = results.totalAssetUsage - maxAllowedUsage,
            spaceToFree = excessSpace + settings.prune_disk_percent * results.diskCapacity;
        cb(null, excessSpace > 0, spaceToFree);
    });
}

function assetSizeForIntegration(integration) {
    var total = 0;

    for (var key in integration.assets) {
        if (integration.assets.hasOwnProperty(key)) {
            var asset = integration.assets[key];
            if (asset.length) {
                for (var i = 0; i < asset.length; i++) {
                    total += asset[i].size;
                }
            } else {
                total += asset.size;
            }
        }
    }

    return total;
}

function findPrunableAssets(cb) {
    var query = {
        limit: 10,
        include_docs: true
    };

    db_core.findDocumentsWithQuery(null, k.XCSDesignDocumentIntegration, k.XCSDesignDocumentViewIntegrationsToPrune, query, cb);
}

function pruneUntilSpaceFreed(targetSpace, pruneCallback, cb) {
    var spaceFreed = 0;

    function doneFreeing() {
        return spaceFreed >= targetSpace;
    }

    async.until(doneFreeing, function (cb) {
        findPrunableAssets(function (err, integrations) {
            if (err) {
                return cb(err);
            }

            var i = 0;

            async.until(function () {
                return doneFreeing() || i >= integrations.length;
            }, function (cb) {
                pruneCallback(integrations[i], function (err) {
                    if (err) {
                        return cb(err);
                    }

                    spaceFreed += assetSizeForIntegration(integrations[i]);
                    konsole.log(null, '[Pruning] Space freed is now ' + spaceFreed);
                    i++;
                    cb();
                });
            }, cb);
        });
    }, cb);
}

function pruneIntegration(theIntegration, cb) {
    konsole.log(null, '[Pruning] Pruning integration ' + theIntegration._id);

    file.deleteAssetsForIntegration(theIntegration, function (err) {
        if (err) {
            return cb(err);
        } else {
            require('./integration.js').update_internal(null, theIntegration._id, {
                assetsPruned: true
            }, cb);
        }
    });
}

file.prune = function (cb) {
    checkPruningNecessary(function (err, pruningNeeded, spaceToFree) {
        if (err) {
            cb(err);
        } else {
            if (pruningNeeded) {
                konsole.log(null, '[Pruning] Asset usage exceeds maximum allowed, starting to prune.');
                konsole.log(null, '[Pruning] Need to free up ' + spaceToFree + ' bytes');

                pruneUntilSpaceFreed(spaceToFree, pruneIntegration, function (err) {
                    if (err) {
                        return cb(err);
                    }

                    cb(null, true);
                });
            } else {
                cb(null, false);
            }
        }
    });
};

module.exports = file;