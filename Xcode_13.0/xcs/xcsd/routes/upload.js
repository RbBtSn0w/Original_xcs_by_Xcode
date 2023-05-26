'use strict';

const config = require('config');
const multer = require('multer');

module.exports = multer(config.get('upload'));