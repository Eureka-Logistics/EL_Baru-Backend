const express = require('express');
const router = express.Router();
const kirimanController = require('../../controllers/kiriman/kiriman.controller');

router.get('/get-kiriman', kirimanController.getKirimanData);
router.put('/update-status-kiriman', kirimanController.updateStatusKiriman);
router.get('/export-kiriman-excel', kirimanController.exportKirimanExcel);

module.exports = router;
