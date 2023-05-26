'use strict';

var config = require('config'),
    couchConfig = config.get('database'),
	couchBaseURL = 'http://' + couchConfig.host + ':' + couchConfig.port,
	nano = require('nano')(couchBaseURL);

module.exports = nano.db.use(couchConfig.database);
