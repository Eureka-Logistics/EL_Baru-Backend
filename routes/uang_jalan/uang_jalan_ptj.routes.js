var express = require('express');
var router = express.Router();

const uangJalanPTJController = require('../../controllers/uang_jalan/uang_jalan_ptj.controller')
const authentication = require('../../middleware/private.middleware')
const uploader = require('../../plugins/uploader')

// Get all PTJ with pagination
router.get('/ptj', authentication, uangJalanPTJController.getAllPTJ);

// Get PTJ by ID
router.get('/ptj-detail', authentication, uangJalanPTJController.getPTJById);

// Create new PTJ
router.post('/ptj', authentication, uploader.addPhotoUangJalan, uangJalanPTJController.createPTJ);

// Update PTJ
router.put('/ptj', authentication, uploader.addPhotoUangJalan, uangJalanPTJController.updatePTJ);

// Delete PTJ
router.delete('/ptj', authentication, uangJalanPTJController.deletePTJ);

module.exports = router;
