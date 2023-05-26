'use strict';

var express = require('express'),
    database = require('../classes/databaseClass.js'),
    prepareRequest = require('./routes_utils.js').prepareRequest;

var router = express.Router();

router.get('/active_tasks', prepareRequest, database.activeCouchDBTasks);
router.get('/is_compaction_active', prepareRequest, database.isCompactionActive);
router.get('/fragmentation_index', prepareRequest, database.fragmentationIndex);
router.post('/compact', prepareRequest, database.compact);
router.post('/reindex', prepareRequest, database.reindexDatabase);

module.exports = router;
