const express = require('express');
const router = express.Router();
const gpsController = require('../../controllers/gps/gps.controller');
const cronGpsController = require('../../controllers/gps/cronGps.controller');

router.get('/geofence-mobile', gpsController.getPools);
router.get('/device-info', gpsController.getDeviceInfo);
// Endpoint geofence radius 20 meter
router.get('/geofence-radius', gpsController.getGeofenceRadius);
router.get('/device-history', gpsController.getDeviceHistoryData);
router.get('/latest-vehicle-position', gpsController.getLatestVehiclePosition);
router.get('/detect-stationary', gpsController.detectStationaryVehicles);

router.get('/last-position', gpsController.lastPositionMargono);
router.get('/history', gpsController.getHistoryMargono);

router.get('/combined/history', gpsController.getCombinedHistory);
router.get('/combined/last-position', gpsController.getCombinedLastPosition);

router.get('/gps-event-logs', gpsController.getGpsEventLogs);
router.patch('/gps-event-logs/:id/status', gpsController.updateGpsEventLogStatus);

// Manual sync (custom range) - POST {{BASE_URL}}gps/manual-sync?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
router.post('/manual-sync', cronGpsController.manualSyncRange);
// Manual sync progress - GET {{BASE_URL}}gps/manual-sync/progress
router.get('/manual-sync/progress', cronGpsController.getManualSyncProgress);

router.get('/overspeed', gpsController.getOverspeedData);
router.get('/over-hour', gpsController.getOverHourVehicles);

// Cron job routes
router.use('/cron', require('./cronGps.routes'));

module.exports = router;

