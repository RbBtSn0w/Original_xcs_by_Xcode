'use strict';

const Promise = require('bluebird');
const config = require('config');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const logger = require('../../util/logger.js');
const k = require('../../constants.js');
const te = require('../../util/turboevents.js');

const cachePath = config.get('path.activityLogCache');

let streams = new Map();

exports = module.exports = {
    appendActivityChunk(message) {
        let integrationID = message.integrationID;
        let body = message.body;
        let logPath = logPathForIntegration(integrationID);

        return Promise.try(() => {
                let stream = streams.get(integrationID);
                if (!stream) {
                    stream = fs.createWriteStream(logPath, { flags: 'a', mode: 0o600 });
                    streams.set(integrationID, stream);
                }
                return stream;
            })
            .then(stream => {
                return Promise.fromCallback(fn => stream.write(body, fn));
            })
            .then(() => {
                te.broadcast(k.XCSIsListenerForActivityLogChunks, k.XCSEmitNotificationActivityLogChunk, message);
            });
    },

    createReadStream(integrationID) {
        let logPath = logPathForIntegration(integrationID);
        return fs.createReadStream(logPath, {
            highWaterMark: 512
        });
    },

    streamLogsToSocket(socket, message) {
        // now this socket will receive new broadcasts of logs for this integration
        socket.activityLogIntegrationID = message.integrationID;
        
        let stream = exports.createReadStream(message.integrationID);
        stream.setEncoding('utf8');
        stream.on('data', str => {
            socket.emit(k.XCSEmitNotificationActivityLogChunk, {
                integrationID: message.integrationID,
                body: str
            });
        });
        stream.on('error', err => {
            if (err.code === 'ENOENT') {
                // this is fine, it just means we haven't written any contents yet.
                logger.info('Tried to read from activity log for integration', message.integrationID, 'but no log exists.');
            } else {
                logger.error('Error reading activity log for integration', message.integrationID, err);
            }
        });
    },

    deleteActivityLog(integrationID, cb) {
        logger.info('Cleaning up activity event log for integration', integrationID);

        let logPath = logPathForIntegration(integrationID);
        fs.unlink(logPath, err => {
            if (err) {
                logger.warn('Error trying to delete activity event log for integration', integrationID, err);
            }
            cb();
        });
    },

    resetStreams() {
        for (let stream of streams.values()) {
            stream.end();
        }
        streams.clear();
    }
};

function logPathForIntegration(integrationID) {
    return path.join(cachePath, integrationID);
}