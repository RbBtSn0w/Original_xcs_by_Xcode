/*
    XCSCouchDBClass
    A class dedicated to determine whether CouchDB is available on startup.
*/

'use strict';

/* jshint camelcase: false */
/* jshint onevar: false */
/* jslint nomen: true */

var settings = require('../routes/settings.js'),
    konsole = require('../util/konsole.js');

/* XCSCouchDBClass object */

function XCSCouchDBClass() {

    settings.findOrCreateSettingsDocument(null, function (err, settingsDoc) {
        if (err || !settingsDoc) {
            var message = 'Unable to connect with CouchDB. XCSNode will not be able to function properly. Exiting now.';
            konsole.error(null, '[XCSCouchDBClass - init] ***** ' + message);
            return process.exit(1);
        } else {
            konsole.log(null, '[XCSCouchDBClass - init] CouchDB is ready and responding.');
        }
    });

}

/* Module exports */

module.exports = new XCSCouchDBClass();

/***************************************************************************************************

    Private Section

***************************************************************************************************/