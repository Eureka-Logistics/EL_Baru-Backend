var express = require('express');
var router = express.Router();

const uangJalanPTJController = require('../../controllers/uang_jalan/uang_jalan_ptj.controller');
const authentication = require('../../middleware/private.middleware');

// Get all uang jalan PTJ with pagination and filters
router.get('/data-UangJalan-PTJ', authentication, uangJalanPTJController.getAllUangJalanPTJ);

// Get detail uang jalan PTJ by ID
router.get('/data-UangJalan-PTJ-Detail', authentication, uangJalanPTJController.getDetailUangJalanPTJ);

// Create new uang jalan PTJ
router.post('/create-UangJalan-PTJ', authentication, uangJalanPTJController.createUangJalanPTJ);

// Update uang jalan PTJ
router.put('/update-UangJalan-PTJ', authentication, uangJalanPTJController.updateUangJalanPTJ);

// Delete uang jalan PTJ
router.delete('/delete-UangJalan-PTJ', authentication, uangJalanPTJController.deleteUangJalanPTJ);

module.exports = router;
