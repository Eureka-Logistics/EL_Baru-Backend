const express = require('express');
const router = express.Router();
const poolQRCodeController = require('../../controllers/pool/pool_qrcode.controller');
// const authMiddleware = require('../../middleware/auth.middleware'); // Uncomment jika perlu auth

/**
 * @route   GET /api/pool-qrcode/generate/:pool_code
 * @desc    Generate QR Code untuk pool
 * @access  Public/Private (sesuaikan dengan kebutuhan)
 */
router.get('/generate/:pool_code', poolQRCodeController.generatePoolQRCode);

/**
 * @route   GET /api/pool-qrcode/generate-all
 * @desc    Generate QR Code untuk semua pool
 * @access  Public/Private
 */
router.get('/generate-all', poolQRCodeController.generateAllQRCodes);

/**
 * @route   POST /api/pool-qrcode/scan
 * @desc    Scan QR Code dan record activity (IN/OUT)
 * @access  Private
 * @body    { pool_code, kode_kendaraan, activity_type, latitude, longitude, notes }
 */
router.post('/scan', poolQRCodeController.scanQRCodeAndRecord);
router.post('/auto-scan', poolQRCodeController.autoScanQRCode);

/**
 * @route   POST /api/pool-qrcode/check-in
 * @desc    Check IN ke pool (record aktivitas IN)
 * @access  Private
 * @body    { pool_code, id_kendaraan, latitude, longitude, notes, scan_by, scan_by_name }
 */
router.post('/check-in', poolQRCodeController.checkIn);

/**
 * @route   POST /api/pool-qrcode/check-out
 * @desc    Check OUT dari pool (record aktivitas OUT)
 * @access  Private
 * @body    { pool_code, id_kendaraan, latitude, longitude, notes, scan_by, scan_by_name }
 */
router.post('/check-out', poolQRCodeController.checkOut);

/**
 * @route   GET /api/pool-qrcode/vehicle-status/:id_kendaraan
 * @desc    Get status kendaraan saat ini (IN/OUT di pool mana)
 * @access  Public/Private
 */
router.get('/status/:id_kendaraan', poolQRCodeController.getVehicleCurrentStatus);

/**
 * @route   GET /api/pool-qrcode/history
 * @desc    Get history log pool activity
 * @access  Private
 * @query   pool_code, id_kendaraan, activity_type, start_date, end_date, page, limit
 */
router.get('/history', poolQRCodeController.getPoolActivityHistory);

/**
 * @route   GET /api/pool-qrcode/vehicles-in-pool/:pool_code
 * @desc    Get semua kendaraan yang sedang IN di pool
 * @access  Public/Private
 */
router.get('/vehicles-in/:pool_code', poolQRCodeController.getVehiclesInPool);

/**
 * @route   GET /api/pool-qrcode/statistics/:pool_code
 * @desc    Get statistik pool (total IN/OUT, unique vehicles, dll)
 * @access  Public/Private
 * @query   start_date, end_date
 */
router.get('/statistics/:pool_code', poolQRCodeController.getPoolStatistics);

/**
 * @route   GET /api/pool-qrcode/check-vehicle/:id_kendaraan
 * @desc    Check if vehicle exists in database (helper for debugging)
 * @access  Public/Private
 */
router.get('/check-vehicle/:id_kendaraan', poolQRCodeController.checkVehicleExists);
router.get('/check-driver/:id_driver', poolQRCodeController.checkDriverExists);

/**
 * @route   POST /api/pool-qrcode/create-pool
 * @desc    Create new pool (helper endpoint for testing)
 * @access  Private
 * @body    { nama_pool, alamat_pool, pool_code, latitude, longitude }
 */
router.post('/create-pool', poolQRCodeController.createPool);

module.exports = router;

