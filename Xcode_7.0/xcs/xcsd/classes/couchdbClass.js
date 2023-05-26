/*
    XCSCouchDBClass
    A class dedicated to determine whether CouchDB is available on startup.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var request = require('request'),
    cluster = require('cluster');

var k = require('../constants.js'),
    konsole = require('../util/konsole.js'),
    xcsutil = require('../util/xcsutil.js');

/* XCSCouchDBClass object */

module.exports = function couchdb_class_init(cb) {
    if (cluster.isMaster) {
        var headers = {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        };

        request({
            url: 'http://localhost:' + k.XCSCouchPort + '/xcs/_all_dbs',
            method: 'GET',
            headers: headers,
        }, function (err) {
            if (err) {
                var message = 'Unable to connect to CouchDB. Reason: ' + JSON.stringify(err) + '. XCSNode will not be able to function properly. Exiting now.';
                konsole.error(null, '[XCSCouchDBClass - init] ***** ' + message);
                return process.exit(1);
            } else {
                konsole.log(null, '[XCSCouchDBClass - init] CouchDB is ready and responding.');
            }
            return xcsutil.safeCallback(cb);
        });
    } else {
        return xcsutil.safeCallback(cb);
    }
};