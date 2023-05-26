'use strict';

const k = require('../constants.js');
const Errors = require('../util/error.js');
const xcsutil = require('../util/xcsutil.js');
const logger = require('../util/logger.js');
const te = require('../util/turboevents.js');

const redis = require('./redisClass.js');
const integrationSearch = require('./integrationSearchClass.js');

exports.graceful = function graceful(req, res, next) {
    const log = logger.withRequest(req);
    log.info('Received request to shutdown the server gracefully. Waiting until current integration is finished.');

    redis.client().setnx(k.XCSRedisGracefulShutdownRequested, new Date().toISOString()).then(reply => {
        if (reply === 0) {
            log.debug('The server is already going to gracefully shutdown.');
            next(new Errors.Conflict('A graceful shutdown has already been requested.'));
        } else {
            log.debug('Successfully flagged server for graceful shutdown. Checking if we can shutdown now.');

            integrationSearch.findRunningIntegrations(req, (err, docs) => {
                if (err) {
                    // don't leave the flag set, force them to try again.
                    redis.client().del(k.XCSRedisGracefulShutdownRequested, () => {
                        next(err);
                    });
                } else if (docs.length > 0) {
                    log.info('There are', docs.length, 'running integrations. Waiting to shutdown.');
                    xcsutil.standardizedResponse(res, 200, {
                        status: 'waiting'
                    });
                } else {
                    log.info('No integrations are running. Shutting down now.');

                    te.broadcast(k.XCSIsControlDaemon, k.XCSEmitNotificationShutdown, {});

                    xcsutil.standardizedResponse(res, 200, {
                        status: 'shutting-down'
                    });
                }
            });

        }
    }).catch(() => {
        next(new Errors.Internal('Could not initiate graceful shutdown because Redis is not available.'));
    });
};

exports.hasRequestedShutdown = function hasRequestedShutdown() {
    return redis.client().get(k.XCSRedisGracefulShutdownRequested)
        .then(value => !!value);
};

xcsutil.bindAll(module.exports);