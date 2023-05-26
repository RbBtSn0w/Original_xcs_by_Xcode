'use strict';

const Promise = require('bluebird'),
      http = require('http'),
      fs = require('fs'),
      util = require('util'),
      _ = require('underscore');

const logger = require('../util/logger.js'),
      config = require('config');

const couchConfig = config.get('database'),
      couchBaseURL = `http://${couchConfig.host}:${couchConfig.port}`,
      couchdbSecretPath = config.get('path.couchdbSecret'),
      couchdbSecret = fs.readFileSync(couchdbSecretPath, 'utf8').trim();

const enableNanoLogging = process.env.XCS_DB_LOGGING === 'true';

if (!couchdbSecret) {
    logger.error('Could not read the CouchDB secret from', couchdbSecretPath);
    process.exit(1);
}

let currentCookie = null;
let currentDatabasePromise = null;

const agent = new http.Agent({
    keepAlive: true,
    maxSockets: 100,
    maxFreeSockets: 50
});

function createDatabase() {
    let nanoConfig = {
        url: couchBaseURL,
        requestDefaults: { agent }
    };

    if (enableNanoLogging) {
        nanoConfig.log = nanoLog;
    }

    if (currentCookie) {
        nanoConfig.cookie = currentCookie;
    }

    let nano = require('nano')(nanoConfig);
    let xcsdb = nano.db.use(couchConfig.database);
    xcsdb.nano = nano;

    injectCookieHandlers(xcsdb);

    Promise.promisifyAll(xcsdb);
    Promise.promisifyAll(xcsdb.nano);
    Promise.promisifyAll(xcsdb.nano.db);

    return xcsdb;
}

const functionsToReplace = {
    db: [
        'insert',
        'view',
        'bulk',
        'get',
        'destroy',
        'replicate'
    ],
    nano: [
        'auth'
    ],
    nano_db: [
        'destroy',
        'replicate'
    ]
};

function injectCookieHandlers(db) {
    functionsToReplace.db.forEach(fun => {
        wrapCallback(db, fun, updateCurrentCookie);
    });
    functionsToReplace.nano.forEach(fun => {
        wrapCallback(db.nano, fun, updateCurrentCookie);
    });
    functionsToReplace.nano_db.forEach(fun => {
        wrapCallback(db.nano.db, fun, updateCurrentCookie);
    });
}

function updateCurrentCookie(err, body, headers) {
    if (err && err.message && err.message.indexOf('You are not authorized') !== -1) {
        refreshAuthentication();
        return;
    }

    if (headers && headers['set-cookie']) {
        currentCookie = headers['set-cookie'][0];
        currentDatabasePromise = Promise.resolve(createDatabase());
    }
}

function wrapCallback(obj, name, cb) {
    let fun = obj[name];

    obj[name] = function () {
        let args = [].slice.call(arguments);
        let lastArg = args.length > 0 ? args[args.length - 1] : null;

        function wrapped(err, body, headers) {
            cb(err, body, headers);
            lastArg(err, body, headers);
        }

        if (lastArg && _.isFunction(lastArg)) {
            fun.apply(obj, args.slice(0, -1).concat([wrapped]));
        } else {
            fun.apply(obj, args.concat([cb]));
        }
    };
}

function nanoLog(message) {
    message = util.inspect(message, { maxArrayLength: 10, depth: 4 });
    if (currentCookie) {
        message = message.replace(currentCookie, '<cookie>');
    }
    message = message.replace(/ *\[\"AuthSession=[^)]*\"\] */g, '<cookie>');
    message = message.replace(couchdbSecret, '<password>');
    logger.debug('nano:', message);
}

currentDatabasePromise = createDatabase().nano.authAsync('xcscouchadmin', couchdbSecret)
    .then(createDatabase);

function getCurrentDatabase(cb) {
    return currentDatabasePromise.asCallback(cb);
}

function refreshAuthentication() {
    return getCurrentDatabase()
        .then(db => db.nano.authAsync('xcscouchadmin', couchdbSecret));
}

// Authenticate every 30 minutes
setInterval(refreshAuthentication, config.get('database.authTimeout') * 1000).unref();

module.exports = getCurrentDatabase;

module.exports.nano = function getCurrentNano(cb) {
    return currentDatabasePromise
        .then(db => db.nano)
        .asCallback(cb);
};

module.exports.config = {
    url: couchBaseURL,
    db: couchConfig.database
};
