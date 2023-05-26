'use strict';

const Promise = require('bluebird'),
    fs = require('fs'),
    _ = require('underscore');

const logger = require('../util/logger.js'),
    config = require('config');

const couchConfig = config.get('database'),
    couchBaseURL = `http://${couchConfig.host}:${couchConfig.port}`,
    couchdbSecretPath = config.get('path.couchdbSecret'),
    couchdbSecret = fs.readFileSync(couchdbSecretPath, 'utf8').trim();

if (!couchdbSecret) {
    logger.error('Could not read the CouchDB secret from', couchdbSecretPath);
    process.exit(1);
}

let currentCookie = null;
let currentDatabasePromise = null;

function createDatabase() {
    let nanoConfig = {
        url: couchBaseURL,
        log: nanoLog
    };
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

        if (lastArg && _.isFunction(lastArg)) {
            function wrapped(err, body, headers) {
                cb(err, body, headers);
                lastArg(err, body, headers);
            }

            fun.apply(obj, args.slice(0, -1).concat([wrapped]));
        } else {
            fun.apply(obj, args.concat([cb]));
        }
    };
}

function nanoLog(message) {
    message = JSON.stringify(message);
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

// Authenticate every 30 minutes
setInterval(() => {
    getCurrentDatabase()
        .then(db => db.nano.authAsync('xcscouchadmin', couchdbSecret));
}, config.get('database.authTimeout') * 1000).unref();

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
