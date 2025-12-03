const express = require('express');
const router = express.Router();
const kendaraanController = require('../../controllers/kendaraan/kendaraan.controller');
const authentication = require('../../middleware/private.middleware')

router.get('/get-kendaraan-gps', kendaraanController.getAllKendaraan);
router.get('/get-kendaraan-all', kendaraanController.getAllKendaraanAll);
router.get('/get-kendaraan-status-gps', kendaraanController.getAllKendaraanStatus);
router.get('/get-stnk-status', kendaraanController.getStnkStatus);
router.get('/get-kir-status', kendaraanController.getKirStatus);
router.post('/add-kendaraan-status', kendaraanController.addKendaraanStatus);
router.get('/get-destinations-summary', kendaraanController.getDestinationsSummary);
router.get('/get-ongoing-trip', kendaraanController.getOngoingTrips);
router.get('/get-kendaraan-trip-summary', kendaraanController.getKendaraanStatusHariIni);
router.get('/get-delivery-data', kendaraanController.getDeliveryData);
router.get('/get-kendaraan-status-ready-noready', kendaraanController.getKendaraanStatusReadyNoReady);
router.get('/export-kendaraan-status-excel', kendaraanController.exportKendaraanStatusToExcel);
router.get('/timeline-unit', kendaraanController.getTimelineUnit);
router.get('/kendaraan-status-by-id', kendaraanController.getKendaraanStatusByIdKendaraan);
router.get('/nomor-polisi', kendaraanController.getAllNomorPolisi);
router.put('/update', kendaraanController.updateKendaraan);


module.exports = router;
