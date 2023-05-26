/*
    XCSCodeCoverageClass
    A class dedicated to interact Code Coverage.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var async = require('async'),
    _ = require('underscore');

var k = require('../constants.js'),
    xcsutil = require('../util/xcsutil.js'),
    konsole = require('../util/konsole.js'),
    dbCoreClass = require('./dbCoreClass.js');

/* XCSCodeCoverageClass object */

function XCSCodeCoverageClass() {}

XCSCodeCoverageClass.prototype.bulk_import = function bulk_import(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Code Coverage - bulk_import] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    xcsutil.bulk_import(req, function CCVBulkImport(err) {

        if (err) {
            konsole.error(req, '[Code Coverage - bulk_import] error: ' + JSON.stringify(err));
        } else {
            konsole.log(req, '[Code Coverage - bulk_import] bulk import completed successfully');
        }

        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);

        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 204);
        }

    });

};

XCSCodeCoverageClass.prototype.findIntegration = function findIntegration(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Code Coverage - findIntegration] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var integrationUUID = req.params.id;

    konsole.log(req, '[Code Coverage - findIntegration] Find Code Coverage integration with ID: ' + integrationUUID);

    if (!integrationUUID) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'The integration ID has not been specified'
        });
    }

    gatherCodeCoverage(req, integrationUUID, false, function (err, ccInfo) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, ccInfo);
        }
    });

};

XCSCodeCoverageClass.prototype.integrationWithCoverageData = function integrationWithCoverageData(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Code Coverage - integrationWithCoverageData] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    // Verify we support the parameter
    var parameters = Object.keys(req.query),
        allowedParameters = ['include_methods'],
        unsupportedFilters = _.difference(parameters, allowedParameters);

    if (unsupportedFilters.length) {
        xcsutil.logLevelDec(req);
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

    konsole.log(req, '[Code Coverage - integrationWithCoverageData] Find Code Coverage integration with ID: ' + integrationUUID + ' (include_methods=' + include_methods);

    if (!integrationUUID) {
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'The integration ID has not been specified'
        });
    }

    gatherCodeCoverage(req, integrationUUID, include_methods, function (err, ccInfo) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        if (err) {
            return xcsutil.standardizedErrorResponse(res, err);
        } else {
            return xcsutil.standardizedResponse(res, 200, ccInfo);
        }
    });

};

XCSCodeCoverageClass.prototype.findFileByKeyPath = function findFileByKeyPath(req, res) {

    var logLevel = xcsutil.logLevelInc(req);

    var functionTitle = '[Code Coverage - findFileByKeyPath] ' + req.method + ' ' + req.url;

    konsole.log(req, functionTitle);

    if (req && req.snitch) {
        req.snitch.next(functionTitle);
    }

    var keyPaths = req.body[k.XCSKeyPaths];

    konsole.debug(req, 'keyPaths: ' + JSON.stringify(keyPaths, null, 4));

    if (!keyPaths) {
        xcsutil.profilerSummary(req);
        xcsutil.logLevelDec(req);
        xcsutil.logLevelCheck(req, logLevel);
        return xcsutil.standardizedErrorResponse(res, {
            status: 400,
            message: 'the property "keypaths" are missing from the body'
        });
    }

    // Since we only allow files to be searched, filter out all keypaths
    // with a length other than 3 (ccid > target > file).

    async.filter(keyPaths, function (keyPath, filterCallback) {
            filterCallback(3 === keyPath.length);
        },
        function (filteredKeyPaths) {
            konsole.debug(req, 'filteredKeyPaths: ' + JSON.stringify(filteredKeyPaths, null, 4));
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

                konsole.debug(req, 'uniqueKeyPaths: ' + JSON.stringify(uniqueKeyPaths, null, 4));

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

                    konsole.debug(req, 'query: ' + JSON.stringify(query, null, 4));

                    dbCoreClass.findDocumentsWithQuery(req, k.XCSDesignDocumentCodeCoverage, k.XCSDesignDocumentViewCCFiles, query, function CCVFindBotWithUUID(err, ccFiles) {
                        xcsutil.profilerSummary(req);
                        xcsutil.logLevelDec(req);
                        xcsutil.logLevelCheck(req, logLevel);
                        if (err) {
                            err.message = '[Code Coverage - findFileByKeyPath] error while calling findDocumentsWithQuery: ' + err.message;
                            konsole.error(req, JSON.stringify(err));
                            return xcsutil.safeCallback(callback, err);
                        } else {
                            results = results.concat(ccFiles);
                            return xcsutil.safeCallback(callback);
                        }
                    });

                }, function (err) {
                    konsole.debug(req, 'results: ' + JSON.stringify(results, null, 4));
                    if (err) {
                        return xcsutil.standardizedErrorResponse(res, err);
                    } else {
                        return xcsutil.standardizedResponse(res, 200, results);
                    }
                });

            });
        });

};


/* Module exports */

module.exports = new XCSCodeCoverageClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/

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
                konsole.debug(null, '    ' + value + ' begins with ' + prefix);
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

function findCodeCoverageIntegrationMasterDocument(req, ccid, cb) {

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

function gatherCodeCoverage(req, integrationUUID, include_methods, cb) {

    var ccimDoc,
        ccifDocs,
        ccResult = {};

    async.waterfall([

        function (callback) {

            // 1) Find the Code Coverage Integration master document (doc_type == 'ccim')

            findCodeCoverageIntegrationMasterDocument(req, integrationUUID, function (err, doc) {
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