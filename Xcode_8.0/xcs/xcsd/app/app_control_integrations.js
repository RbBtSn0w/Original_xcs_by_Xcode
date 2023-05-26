'use strict';

const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const config = require('config');
const cluster = require('cluster');

const logger = require('../util/logger.js');
const bots = Promise.promisifyAll(require('../classes/botClass.js'));
const createIntegration = require('../classes/integration/create.js');
const platforms = Promise.promisifyAll(require('../classes/platformClass.js'));

/**
 * If xcscontrol signals that we have upgraded our tools, creates control integrations
 * for the bots on this server.
 *
 * @returns {Promise} A promise for when this phase of startup is complete.
 */
module.exports = function controlIntegrations() {
    if (!cluster.isMaster && !cluster.isDisabled) {
        return Promise.resolve();
    }

    const checkPath = config.get('path.createControlIntegrations');

    return fs.readFileAsync(checkPath, 'utf8')
        .then(contents => {
            let parsed = JSON.parse(contents);
            logger.debug('Control integrations data:', parsed);

            return controlledChanges(parsed)
                .then(diff => {
                    logger.debug('Control integration diff:', diff);

                    if (diff) {
                        return bots.listAllBotsAsync(null)
                            .each(bot => {
                                logger.info('Creating control integration for bot', bot.name);
                                return createIntegration.addControlIntegration(null, bot, diff);
                            })
                            .then(() => fs.unlinkAsync(checkPath));
                    } else {
                        logger.debug('No upgrades detected, skipping creating control integrations.');
                        return null;
                    }
                });
        }, () => { // ignore the error (file does not exist) but do nothing
            logger.debug('No control integrations payload found, skipping.');
        });
};

function controlledChanges(contents) {
    return platforms.listPlatformsAsync(null)
        .then(plats => upgradeDiff(contents, plats));
}

function upgradeDiff(contents, platforms) {
    let diff = {};

    // first check if the Xcode versions are different
    if (contents.xcode) {
        diff.xcode = contents.xcode;
    }

    let platformDiffs = {};

    // load the previously existing platforms
    platforms.forEach(platform => {
        platformDiffs[platform.displayName] = makePlatformEntry(platform, 'before');
    });

    // now add the info for the new platforms
    contents.platforms.forEach(platform => {
        let existingPlatform = platformDiffs[platform.displayName];
        if (existingPlatform) {
            existingPlatform.version.after = platform.version;
            existingPlatform.buildNumber.after = platform.buildNumber;

            // remove any information that is the same
            deleteIfMatching(existingPlatform, 'version');
            deleteIfMatching(existingPlatform, 'buildNumber');
        } else {
            platformDiffs[platform.displayName] = makePlatformEntry(platform, 'after');
        }
    });

    // remove any platforms that don't have differences
    Object.keys(platformDiffs).forEach(name => {
        if (Object.keys(platformDiffs[name]).length === 0) {
            delete platformDiffs[name];
        }
    });

    if (Object.keys(platformDiffs).length !== 0) {
        diff.platforms = platformDiffs;
    }

    if (Object.keys(diff).length !== 0) {
        return diff;
    }

    return null;
}

function deleteIfMatching(object, key) {
    if (object[key].before === object[key].after) {
        delete object[key];
    }
}

function makePlatformEntry(platform, key) {
    return {
        version: {
            [key]: platform.version
        },
        buildNumber: {
            [key]: platform.buildNumber
        }
    };
}
