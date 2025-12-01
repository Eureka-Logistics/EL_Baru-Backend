const express = require('express');
const router = express.Router();
const updateStatusController = require('../../controllers/update_status/update_status.controller');
const authentication = require('../../middleware/private.middleware');

router.get('/get-update-status-el', updateStatusController.getDataStatusEl);
router.get('/get-update-status-el-id', updateStatusController.getDataStatusElById);
router.post('/add-update-status-el', updateStatusController.addDataStatus);
router.post('/add-update-status-el-by-kendaraan', updateStatusController.addDataStatusByKendaraan);

module.exports = router;
