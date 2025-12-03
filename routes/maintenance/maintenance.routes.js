const express = require('express');
const router = express.Router();
const maintenanceController = require('../../controllers/maintenance/maintenance.controller');
const authentication = require('../../middleware/private.middleware');

router.post('/repair-request', maintenanceController.createRepairRequest);
router.get('/get-all-repair-request', maintenanceController.getAllRepairRequests);
router.get('/get-repair-request-by-user/:requested_by', maintenanceController.getRepairRequestsByRequestedBy);
router.get('/get-repair-request/:id', maintenanceController.getRepairRequestById);
router.put('/update-repair-request/:id', maintenanceController.updateRepairRequest);
router.delete('/delete-repair-request/:id', maintenanceController.deleteRepairRequest);

router.get('/get-repair-request/:id/details', maintenanceController.getRepairRequestWithDetails);
router.post('/add-repair-request/:id/details', maintenanceController.addRepairDetail);
router.delete('/repair-request-detail/:detail_id', maintenanceController.deleteRepairDetail);

router.post('/repair-request/:id/progress', maintenanceController.addRepairProgress);
router.get('/repair-request/:id/progress', maintenanceController.getRepairProgress);
router.get('/get-issues-repair-category', maintenanceController.getAllIssueCategory);

// Update kondisi barang dan shipping manifest
router.put('/update-kondisi-barang-shipping', maintenanceController.updateKondisiBarangDanShipping);

// Get kondisi barang dan shipping manifest
router.get('/get-kondisi-barang-shipping/:id_msm', maintenanceController.getKondisiBarangDanShipping);

module.exports = router;
