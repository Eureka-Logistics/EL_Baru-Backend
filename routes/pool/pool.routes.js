var express = require('express');
var router = express.Router();
const poolController = require('../../controllers/pool/pool.controller')
const authentication = require('../../middleware/private.middleware')

// Get all pools
router.get('/get-all-pools', poolController.getAllPools);

module.exports = router;
