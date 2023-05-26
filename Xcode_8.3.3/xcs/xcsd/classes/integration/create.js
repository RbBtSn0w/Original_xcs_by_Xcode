'use strict';

const _ = require('underscore'),
      Promise = require('bluebird');

const k = require('../../constants.js'),
      Errors = require('../../util/error.js'),
      xcsutil = require('../../util/xcsutil.js'),
      logger = require('../../util/logger.js'),
      te = require('../../util/turboevents.js');

const dbCore = require('../dbCoreClass.js');
const integration = Promise.promisifyAll(require('../integrationClass.js'));
const integrationSearch = Promise.promisifyAll(require('../integrationSearchClass.js'));
const bots = Promise.promisifyAll(require('../botClass.js'));

const repositoryKeychain = require('../keychain/repositories.js');

exports.create = function create(req, res, next) {
    xcsutil.snitch(req, '[Integration - create] ' + req.method + ' ' + req.url);

    let shouldClean = !!req.body.shouldClean,
        revisionBlueprint = req.body.revisionBlueprint;

    exports.addPendingIntegration(req, req.params.id, {shouldClean, revisionBlueprint})
        .spread((url, body) => {
            res.location(url);
            xcsutil.standardizedResponse(res, 201, body);
        })
        .catch(next)
        .finally(() => xcsutil.profilerSummary(req));
};

let lastAddedIntegration = Promise.resolve();

/**
 * A callback for newly created integrations.
 * @callback newIntegrationCallback
 * @param {?Error} err
 * @param {?string} url
 * @param {?Object} integration
 */

/**
 * Adds a new pending integration for a bot, or updates the existing one if the bot already
 * has an integration pending.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {string} botUUID The ID of the bot to create the integration for.
 * @param {Object} params An Object of properties to set on the created integration.
 * @param {newIntegrationCallback} cb The callback for when the integration is created.
 * @returns {Promise} a promise resolving to the URL and integration created.
 */
exports.addPendingIntegration = function addPendingIntegration(req, botUUID, params, cb) {
    xcsutil.snitch(req, '[Integration - addPendingIntegration] add pending integration for bot: ' + botUUID);

    const log = logger.withRequest(req);
    log.info('Attempting to add pending integration for bot', botUUID);

    params = params || {};

    lastAddedIntegration = lastAddedIntegration.reflect()
        .then(() => integrationSearch.findPendingIntegrationsAsync(req))
        .then(integrations => {
            log.debug('There are', integrations.length, 'existing pending integrations.');

            if (integrations.length > 0) {
                let existingIntegration = null;
                integrations.forEach(int => {
                    if (botUUID === int.bot._id) {
                        existingIntegration = int;
                    }
                });

                if (existingIntegration) {
                    return integration.update_internalAsync(req, existingIntegration._id, params)
                        .then(updatedIntegration => {
                            // create endpoints require a 201 status code and a location header with a URL.
                            // dbCore.createDocument normally produces the URL, but we're not calling that.
                            const url = req && `https://${req.headers.host}/integration/${updatedIntegration._id}`;
                            return [url, updatedIntegration];
                        });
                }
            }

            log.debug('There are no pending integrations for bot', botUUID + ', we will add one.');
            return addPendingIntegrationForBot(req, botUUID, params);
        });

    return lastAddedIntegration.asCallback(cb, {spread: true});
};

/**
 * Adds a new 'control' integration for a bot.
 *
 * Control integrations are always built cleanly, and they will rebuild the same revision
 * as the previous integration of the bot.
 *
 * @param {?Object} req The current HTTP request, if any.
 * @param {Object} bot The full JSON of the bot to add the integration to.
 * @param {Object} diff An object describing the changes between tools that we are controlling for.
 * @returns {Promise} A promise containing the created integration.
 */
exports.addControlIntegration = function addControlIntegration(req, bot, diff) {
    const log = logger.withRequest(req);

    // If upgrade integration has been explicitly disabled for the bot, bail out.
    // This defaults to true, and might not be present for older bots.
    if (bot && bot.configuration && bot.configuration.performsUpgradeIntegration === false) {
        log.debug('Skipping creating control integration for bot', bot._id, 'because it is disabled for this bot.');
        return Promise.resolve(null);
    }

    log.debug('Creating control integration for bot', bot._id);

    return exports.addPendingIntegration(req, bot._id, {
        shouldClean: true,
        revisionBlueprint: bot.lastRevisionBlueprint,
        tags: ['xcs-upgrade'],
        controlledChanges: diff || {}
    }).spread((url, integration) => integration);
};

const nextIntegrationNumber = Promise.promisify(bots.nextBotIntegrationNumber, { multiArgs: true });

function addPendingIntegrationForBot(req, botUUID, params, cb) {
    const log = logger.withRequest(req);

    return Promise.join(nextIntegrationNumber(req, botUUID), getPreviousBotConfiguration(req, botUUID), (results, oldBot) => {
            let bot = results[0], number = results[1];
            return createIntegrationDocument(req, oldBot, bot, number, params);
        })
        .spread((url, newIntegration) => {
            log.debug('New integration', newIntegration._id, 'created with tiny ID', newIntegration.tinyID);
            return copyBlueprintForIntegration(req, newIntegration).thenReturn([url, newIntegration]);
        })
        .spread((url, newIntegration) => {
            log.debug('Successfully stored integration blueprint, broadcasting new integration to listeners.');

            te.broadcast(k.XCSIsListenerForIntegrationUpdates, k.XCSEmitNotificationNotificationIntegrationCreated, {
                _id: newIntegration._id,
                botId: newIntegration.bot._id
            });

            log.debug('Announcing new pending integration to build services.');
            return integration.announcePendingIntegrationsAsync(req).thenReturn([url, newIntegration]);
        })
        .asCallback(cb, {spread: true});
}

function getPreviousBotConfiguration(req, botID) {
    const log = logger.withRequest(req);

    log.info('Looking up most recent integration for', botID, 'for diffing configuration');

    const query = {
        limit: 1,
        startkey: [botID],
        endkey: [botID, {}],
        group_level: 1
    };
    const view = k.XCSDesignDocumentViewLastIntegrationForBot;

    return integrationSearch.findLastIntegrationsForBotWithQueryAsync(req, view, botID, query)
        .get(0).get('value')
        .then(number => {
            return integrationSearch.findIntegrationWithNumberForBotWithUUIDAsync(req, number, botID, false);
        })
        .get('bot')
        .catch(err => {
            if (err.status === 404) {
                return null;
            }
            throw err;
        });
}

function createIntegrationDocument(req, oldBot, bot, number, params) {
    const log = logger.withRequest(req);

    let body = _.defaults({
        bot,
        number,
        currentStep: k.XCSIntegrationStepTypePending,
        result: 'unknown',
        queuedDate: new Date().toISOString(),
        [k.XCSUnitTestProperty]: bot[k.XCSUnitTestProperty],
        success_streak: 0
    }, params, req && req.body);

    // set the controlled changes to include the bot configuration diff
    let diff = bots.diffConfiguration(req, oldBot, bot);
    if (!_.isEmpty(diff)) {
        log.debug('Storing changes for bot configuration.');
        body.controlledChanges = _.defaults({}, params.controlledChanges, { configuration: diff });
    }

    // Remove unwanted properties
    delete body.testedDevices;

    log.info('Creating new integration:', body.bot.name, '#' + body.number);
    return dbCore.createDocument(req, k.XCSDesignDocumentIntegration, body);
}

function copyBlueprintForIntegration(req, newIntegration) {
    const log = logger.withRequest(req);

    return bots.findBlueprintForBotAsync(req, newIntegration.bot)
        .catch(err => {
            log.error('Could not load bot blueprint for new integration:', err);
            throw new Errors.Internal('Could not create new integration because the source control credentials for the bot could not be loaded.');
        })
        .then(blueprintBuf => {
            log.debug('Successfully loaded bot blueprint, storing another copy for this integration.');
            return repositoryKeychain.addItemAsync(req, newIntegration._id, blueprintBuf, newIntegration.bot._id, null)
                .catch(err => {
                    log.error('Could not save bot blueprint for integration:', err);
                    throw new Errors.Internal('Could not create new integration because the source control credentials for the integration could not be saved.');
                });
        });
}
