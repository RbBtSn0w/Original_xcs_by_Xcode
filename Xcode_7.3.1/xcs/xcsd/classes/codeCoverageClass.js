/*
    XCSCodeCoverageClass
    A class dedicated to interact Code Coverage.
*/

'use strict';

var async = require('async'),
    _ = require('underscore'),
    fs = require('fs'),
    config = require('config');

var k = require('../constants.js'),
    xcsutil = require('../util/xcsutil.js'),
    logger = require('../util/logger.js'),
    Errors = require('../util/error.js'),
    dbCoreClass = require('./dbCoreClass.js'),
    databaseClass = require('./databaseClass.js');

/* XCSCodeCoverageClass object */

function XCSCodeCoverageClass() {}

XCSCodeCoverageClass.prototype.bulk_import = function bulk_import(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Code Coverage - bulk_import] ' + req.method + ' ' + req.url;

    log.info('Bulk importing code coverage results.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    bulk_import_internal(req, this, function (err) {
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }
    });

};

XCSCodeCoverageClass.prototype.findIntegration = function findIntegration(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Code Coverage - findIntegration] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id;

    log.info('Fetching code coverage data for integration', integrationUUID);

    if (!integrationUUID) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'The integration ID has not been specified'
        });
    }

    gatherCodeCoverage(req, this, integrationUUID, false, function (err, ccInfo) {
        xcsutil.profilerSummary(req);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, ccInfo);
        }
    });

};

XCSCodeCoverageClass.prototype.integrationWithCoverageData = function integrationWithCoverageData(req, res) {
    var self = this,
        log = logger.withRequest(req),
        functionTitle = '[Code Coverage - integrationWithCoverageData] ' + req.method + ' ' + req.url;

    // Verify we support the parameter
    var parameters = Object.keys(req.query),
        allowedParameters = ['include_methods'],
        unsupportedFilters = _.difference(parameters, allowedParameters);

    if (unsupportedFilters.length) {

        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'filter(s) not supported: ' + unsupportedFilters
        });
    }

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id,
        include_methods;

    if ((null === req.query.include_methods) || (undefined === req.query.include_methods)) {
        include_methods = true;
    } else {
        include_methods = ('true' === req.query.include_methods);
    }

    log.info('Fetching #CodeCoverageData for integration', integrationUUID, include_methods ? 'including methods.' : '');

    if (!integrationUUID) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'The integration ID has not been specified'
        });
    }

    var clientVersion = req && req.headers[k.XCSClientVersion];

    if (clientVersion <= 4) {
        gatherCodeCoverage(req, self, integrationUUID, include_methods, function (err, ccInfo) {
            xcsutil.profilerSummary(req);
            if (err) {
                return xcsutil.standardizedErrorResponse(res, err);
            } else {
                return xcsutil.standardizedResponse(res, 200, ccInfo);
            }
        });
    } else {
        self.saveCodeCoverageIntegrationToFile(req, integrationUUID, function (err) {
            xcsutil.profilerSummary(req);

            // An HTTP 204 means the cached file is available
            if (204 === err.status) {
                xcsutil.clearRequestWatcherTimeout(res);
                log.debug('Downloading #CodeCoverageData file for integration', integrationUUID);

                var message = xcsutil.colorizedSuccessMessage(res);
                log.info(message);

                // Clear the existing content type so it gets set automatically by res.download()
                res.setHeader('Content-type', 'application/x-tar');
                var fullCCCacheFilePath = filePathForCodeCoverageIntegrationWithID(integrationUUID);
                return res.download(fullCCCacheFilePath);
            } else if (202 === err.status) {
                xcsutil.clearRequestWatcherTimeout(res);
                return xcsutil.standardizedResponse(res, 202, {});
            } else {
                return xcsutil.standardizedErrorResponse(res, err);
            }
        });
    }

};

XCSCodeCoverageClass.prototype.findFileByKeyPath = function findFileByKeyPath(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Code Coverage - findFileByKeyPath] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var keyPaths = req.body[k.XCSKeyPaths];

    log.info('Fetching code coverage files by keypaths.');
    log.debug('Keypaths to fetch:', JSON.stringify(keyPaths, null, 4));

    if (!keyPaths) {
        xcsutil.profilerSummary(req);


        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the property "keypaths" are missing from the body'
        });
    }

    // Since we only allow files to be searched, filter out all keypaths
    // with a length other than 3 (ccid > target > file).

    async.filter(keyPaths, function (keyPath, filterCallback) {
            var numberOfComponents = keyPath.length;
            filterCallback((numberOfComponents >= 1) && (numberOfComponents <= 3));
        },
        function (filteredKeyPaths) {
            log.debug('Filtered key paths for code coverage data:', JSON.stringify(filteredKeyPaths, null, 4));
            if (0 === filteredKeyPaths.length) {
                return xcsutil.standardizedErrorResponse(res, {
                    status: 400,
                    message: 'none of the items in property "keypaths" matched expectations'
                });
            }

            /*
                This is the purpose of removeRedundantKeyPaths(): iterate through the keypaths and eliminate
                the redundant ones. Consider these values:

                    [ '123-ABC',
                      '123-ABC,target-r54e',
                      '123-ABC,target-r54e,file-98g4',
                      '125-ABC',
                      '128-ABC,target-r54e' ]

                Obviously, it doesn't make sense to iterate blindly through this array. Looking closely, there
                are three keypaths that dominate:

                    [ '123-ABC',
                      '125-ABC',
                      '128-ABC,target-r54e' ]

                Calling removeRedundantKeyPaths() will eliminate the keypaths that are already included in shorter,
                therefore "wider" keypaths. This optimization will speedup the process and reduce memory consumption.
            */

            removeRedundantKeyPaths(keyPaths, function (err, uniqueKeyPaths) {

                log.debug('Uniquified code coverage key paths to fetch:', JSON.stringify(uniqueKeyPaths, null, 4));

                if (err) {
                    return xcsutil.standardizedErrorResponse(res, err);
                }

                var results = [];

                async.each(uniqueKeyPaths, function (keyPath, callback) {

                    var query = {
                            include_docs: true
                        },
                        startKeyPathComponents = keyPath.split(','),
                        endKeyPathComponents = startKeyPathComponents.slice(0);

                    endKeyPathComponents.push({});

                    query.startkey = startKeyPathComponents;
                    query.endkey = endKeyPathComponents;

                    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentCodeCoverage, k.XCSDesignDocumentViewCCFiles, query, function CCVFindBotWithUUID(err, ccFiles) {
                        if (err && 404 !== err.status) {
                            err.message = 'Error loading code coverage data for keypath ' + keyPath + ': ' + err.message;
                            log.error(err);
                            return xcsutil.safeCallback(callback, err);
                        } else {
                            if (ccFiles) {
                                results = results.concat(ccFiles);
                            }
                            return xcsutil.safeCallback(callback);
                        }
                    });

                }, function (err) {
                    if (err) {
                        return xcsutil.standardizedErrorResponse(res, err);
                    } else {
                        return xcsutil.standardizedResponse(res, 200, results);
                    }
                });

            });
        });

};

XCSCodeCoverageClass.prototype.cacheCodeCoverageIntegration = function cacheCodeCoverageIntegration(req, res) {

    var log = logger.withRequest(req),
        functionTitle = '[Code Coverage - codeCoverageCacheIntegration] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id;

    log.info('Caching code coverage data for integration', integrationUUID, 'in the background.');

    if (!integrationUUID) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'The integration ID has not been specified'
        });
    }

    require('./backgroundQueue.js').enqueue('bg', 'cacheCoverage', [integrationUUID]);

    xcsutil.profilerSummary(req);

    xcsutil.clearRequestWatcherTimeout(res);

    var error = codeCoverageIntegrationCacheInProgressError(integrationUUID);
    return xcsutil.standardizedResponse(res, error.status, error);
};

XCSCodeCoverageClass.prototype.saveCodeCoverageIntegrationToFile = function saveCodeCoverageIntegrationToFile(req, integrationUUID, cb) {

    var log = logger.withRequest(req),
        functionTitle = '[Code Coverage - saveCodeCoverageIntegrationToFile] ' + req.method + ' ' + req.url;

    log.info('Saving #CodeCoverageData for integration', integrationUUID, 'to file.');

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    if (!integrationUUID) {
        return xcsutil.safeCallback(cb, {
            status: 400,
            message: 'The integration ID has not been specified'
        });
    }

    var fullCCCacheFilePath = filePathForCodeCoverageIntegrationWithID(integrationUUID);

    async.waterfall([
        callback => {
            // If the cache file doesn't exist, it could be because the integration doesn't have Code Coverage data.
            // We *must* check here for this possibility, otherwise we would end up in an infinite loop after the client
            // would request the file after receiving an HTTP 204.

            this.findCodeCoverageIntegrationMasterDocument(req, integrationUUID, function (err) {
                if (err) {
                    log.warn('No #CodeCoverageData found for integration', integrationUUID);
                } else {
                    log.debug('#CodeCoverageData is available for integration', integrationUUID);
                }
                callback(err);
            });
        },
        callback => {
            require('./backgroundQueue.js').enqueue('bg', 'cacheCoverage', [integrationUUID, fullCCCacheFilePath], (err, didEnqueue) => {
                if (err) {
                    return callback(err);
                } else {
                    if (didEnqueue) {
                        log.debug('Enqueued new job to cache #CodeCoverageData for integration', integrationUUID);
                    } else {
                        log.debug('A job to cache #CodeCoverageData for integration', integrationUUID, 'already exists, not enqueuing another.');
                    }
                    return callback(codeCoverageIntegrationCacheInProgressError(integrationUUID));
                }
            });
        }
    ], err => {
        return xcsutil.safeCallback(cb, err);
    });

};

XCSCodeCoverageClass.prototype.cacheCodeCoverageData = function (integrationUUID, cachePath, cb) {
    logger.debug('Saving code coverage for integration', integrationUUID);

    gatherCodeCoverage(null, this, integrationUUID, true, (err, ccInfo) => {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            var fileNameToCompress = integrationUUID + '.json';
            logger.debug('Writing JSON file to compress to', '/tmp/' + fileNameToCompress, '#CodeCoverageData');
            fs.writeFile('/tmp/' + fileNameToCompress, JSON.stringify(ccInfo), err => {
                if (err) {
                    logger.error('Error writing JSON to compress:', err, '#CodeCoverageData');
                    return xcsutil.safeCallback(cb, new Errors.Internal('Could not write code coverage data to disk in order to compress it for caching.'));
                } else {
                    // compress it and store it in Code Coverage caches
                    logger.debug('Compressing JSON and storing at', cachePath, '#CodeCoverageData');
                    xcsutil.tarBZ2(null, fileNameToCompress, cachePath, err => {
                        // Remove the temp file
                        fs.unlink('/tmp/' + fileNameToCompress);

                        if (err) {
                            logger.error('Error compressing #CodeCoverageData:', err);
                            return xcsutil.safeCallback(cb, err);
                        } else {
                            logger.debug('Successfully saved cached #CodeCoverageData.');
                            return xcsutil.safeCallback(cb);
                        }
                    });
                }
            });
        }
    });
};

XCSCodeCoverageClass.prototype.findCodeCoverageIntegrationMasterDocument = function (req, ccid, cb) {

    var query = {
        key: [k.XCSDesignDocumentCodeCoverageIntegrationMaster, ccid],
        include_docs: true
    };

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentCodeCoverage, k.XCSDesignDocumentViewCCMasterDoc, query, function CCVFindCodeCoverageIntegrationMasterDocument(err, ccimDocs) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            if (0 === ccimDocs.length) {
                return xcsutil.safeCallback(cb, {
                    status: 404,
                    message: 'Not found: integration with \'ccid\' ' + ccid + ' not found'
                });
            } else {
                return xcsutil.safeCallback(cb, null, ccimDocs[0]);
            }
        }
    });

};

/* Module exports */

module.exports = xcsutil.bindAll(new XCSCodeCoverageClass());

/***************************************************************************************************

    Private Section

***************************************************************************************************/

function bulk_import_internal(req, self, cb) {
    var log = logger.withRequest(req),
        functionTitle = '[Code Coverage - bulk_import_internal] ' + req.method + ' ' + req.url;

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id;

    xcsutil.bulk_import(req, function CCVBulkImport(err) {

        if (err) {
            log.error('Error importing code coverage results:', err);
        } else {
            log.debug('Successfully imported code coverage results.');
        }

        databaseClass.reindexDatabase_internal(req, function CCReindexDatabaseCallback() {
            if (err) {
                return xcsutil.safeCallback(cb, err);
            } else {
                if (integrationUUID) {
                    require('./backgroundQueue.js').enqueue('bg', 'cacheCoverage', [integrationUUID], function (err) {
                        return xcsutil.safeCallback(cb, err);
                    });
                } else {
                    return xcsutil.safeCallback(cb);
                }
            }
        });

    });

}

function removeRedundantKeyPaths(keyPaths, cb) {

    // Stringify filteredKeyPaths
    var stringifiedKeyPaths = [];

    for (var index = 0; index < keyPaths.length; index++) {
        stringifiedKeyPaths.push(keyPaths[index].toString());
    }

    var unique = uniqueArray(stringifiedKeyPaths).sort();

    var startIndex = 0,
        prefix = unique[startIndex],
        value;

    while (1) {
        for (index = startIndex + 1; index < unique.length; index++) {
            value = unique[index];
            if (0 === value.lastIndexOf(prefix, 0)) {
                logger.debug(value, 'begins with', prefix);
                unique.splice(index, 1);
                index--;
            }
        }

        if (1 === unique.length) {
            break;
        }

        if (startIndex >= unique.length) {
            break;
        }

        startIndex++;
        prefix = unique[startIndex];
    }

    return xcsutil.safeCallback(cb, null, unique);


}

function uniqueArray(values) {
    return values.reduce(function (p, c) {
        if (p.indexOf(c) < 0) {
            p.push(c);
        }
        return p;
    }, []);
}

function filePathForCodeCoverageIntegrationWithID(integrationUUID) {
    var cacheCodeCoveragePath = config.get("path.codeCoverageCache");
    return cacheCodeCoveragePath + '/' + integrationUUID + '.bz2';
}

function codeCoverageIntegrationCacheInProgressError(integrationUUID) {
    return {
        status: 202,
        message: 'Caching of Code Coverage integration ' + integrationUUID + ' is in process.'
    };
}

function findCodeCoverageIntegrationFileDocuments(req, ccid, cb) {

    var query = {
        startkey: [ccid],
        endkey: [ccid, {}],
        include_docs: true
    };

    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentCodeCoverage, k.XCSDesignDocumentViewCCFiles, query, function CCVFindCodeCoverageIntegrationFileDocuments(err, ccifDocs) {
        if (err && err.status !== 404) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, ccifDocs);
        }
    });

}

function gatherCodeCoverage(req, self, integrationUUID, include_methods, cb) {

    var log = logger.withRequest(req),
        ccimDoc,
        ccifDocs,
        ccResult = {};

    async.waterfall([

        function (callback) {

            // 1) Find the Code Coverage Integration master document (doc_type == 'ccim')

            self.findCodeCoverageIntegrationMasterDocument(req, integrationUUID, function (err, doc) {
                ccimDoc = doc;
                callback(err);
            });
        },
        function (callback) {

            // 3) Retrieve all related Code Coverage Integration file documents (doc_type == 'ccif')

            findCodeCoverageIntegrationFileDocuments(req, integrationUUID, function (err, docs) {
                ccifDocs = docs;
                callback(err);
            });
        },
        function (callback) {

            // 4) Attach the file code coverage device data to the proper file

            if (ccifDocs.length > 0) {
                async.each(ccifDocs, function (ccifDoc, callbackEach) {
                    var targetTitle = ccifDoc[k.XCSCodeCoverageKeyPathKey][1],
                        fileTitle = ccifDoc[k.XCSCodeCoverageKeyPathKey][2],
                        methods = ccifDoc[k.XCSCodeCoverageMethodsKey];

                    // Obtain the file object for the given path in the ccim doc:
                    //      trg -> [target title] -> fls -> [file title]

                    var fileObj = ccimDoc[k.XCSCodeCoverageTargetsKey][targetTitle][k.XCSCodeCoverageFilesKey][fileTitle];
                    if (!fileObj) {
                        log.warn('Could not find file', fileTitle, 'in target', targetTitle, 'to attach coverage data.');
                        log.debug('Key path:', ccifDoc[k.XCSCodeCoverageKeyPathKey]);
                        return callbackEach();
                    }

                    // Obtain the code coverage device data from the ccif doc
                    var fileCCDeviceData = ccifDoc[k.XCSCodeCoverageDevicesKey];

                    // Compose the file obj with the device info
                    if (fileObj && fileCCDeviceData) {
                        fileObj[k.XCSCodeCoverageDevicesKey] = fileCCDeviceData;
                    }

                    // Compose the file obj with the methods
                    if (include_methods && methods) {
                        fileObj[k.XCSCodeCoverageMethodsKey] = methods;
                    }

                    callbackEach();
                }, function (err) {
                    if (err) {
                        callback(err);
                    } else {
                        ccResult[k.XCSCodeCoverageTargetsKey] = ccimDoc[k.XCSCodeCoverageTargetsKey];
                        ccResult[k.XCSCodeCoverageDevicesKey] = ccimDoc[k.XCSCodeCoverageDevicesKey];
                        callback(null);
                    }
                });
            } else {
                ccResult[k.XCSCodeCoverageTargetsKey] = ccimDoc[k.XCSCodeCoverageTargetsKey];
                callback(null);
            }

            // Add other relevant properties to the payload
            ccResult[k.XCSCodeCoverageIntegrationIDKey] = ccimDoc[k.XCSCodeCoverageIntegrationIDKey];
            ccResult[k.XCSCodeCoverageIntegrationNumberKey] = ccimDoc[k.XCSCodeCoverageIntegrationNumberKey];
            ccResult[k.XCSCodeCoverageLinePercentageKey] = ccimDoc[k.XCSCodeCoverageLinePercentageKey];
            ccResult[k.XCSCodeCoverageLinePercentageDeltaKey] = ccimDoc[k.XCSCodeCoverageLinePercentageDeltaKey];
            ccResult[k.XCSCodeCoverageTitleKey] = ccimDoc[k.XCSCodeCoverageTitleKey];

        }
    ], function (err) {
        if (err) {
            return xcsutil.safeCallback(cb, err);
        } else {
            return xcsutil.safeCallback(cb, null, ccResult);
        }
    });

}