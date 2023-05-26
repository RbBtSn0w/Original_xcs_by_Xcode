/*
    XCSCouchDBClass
    A class dedicated to determine whether CouchDB is available on startup.
*/

'use strict';

var request = require('request'),
    cluster = require('cluster'),
	config = require('config');

var logger = require('../util/logger.js'),
    xcsutil = require('../util/xcsutil.js');

/* XCSCouchDBClass object */

module.exports = function couchdb_class_init(cb) {
    if (cluster.isMaster) {
        var headers = {
            'Content-type': 'application/json',
            'Accept': 'application/json'
        };

		var couchConfig = config.get('database'),
            url = 'http://' + couchConfig.host + ':' + couchConfig.port + '/' + couchConfig.database + '/_all_dbs';

        logger.debug('Verifying CouchDB is up by checking ' + url);

        request({
            url: url,
            method: 'GET',
            headers: headers,
        }, function (err) {
            if (err) {
                logger.critical('Cannot connect to CouchDB:', err);
                return process.exit(1);
            } else {
                logger.info('CouchDB is ready and responding.');
            }
            return xcsutil.safeCallback(cb);
        });
    } else {
        return xcsutil.safeCallback(cb);
    }
};
