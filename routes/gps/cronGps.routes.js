const express = require('express');
const router = express.Router();
const cronGpsController = require('../../controllers/gps/cronGps.controller');

// Get cron job status
router.get('/status', cronGpsController.getCronStatus);

// Manual trigger for testing
router.post('/trigger', cronGpsController.manualTrigger);

// Get active vehicles list
router.get('/vehicles', cronGpsController.getActiveVehicles);

// Debug vehicles in database
router.get('/debug-vehicles', cronGpsController.debugVehicles);

// Enable/disable testing mode
router.put('/testing-mode', cronGpsController.setTestingMode);

module.exports = router;
