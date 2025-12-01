const express = require('express');
const router = express.Router();
const  daruratController = require('../../controllers/darurat/darurat.controller');
const authentication = require('../../middleware/private.middleware');
const uploader = require('../../plugins/uploader');

router.post('/post-darurat', authentication, daruratController.createDarurat);
router.get('/get-all-darurat', authentication, daruratController.getAllDarurat);
router.post('/post-update-tanggapan-darurat', authentication, daruratController.updateTanggapanDarurat);
router.post('/upload', authentication, uploader.addPhotoDarurat, daruratController.createDarurat);

module.exports = router;
