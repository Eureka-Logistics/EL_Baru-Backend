var express = require('express');
var router = express.Router();
const driverController = require('../../controllers/driver/driver.controller')
const authentication = require('../../middleware/private.middleware')
const middlewareDriver = require('../../middleware/driver.middleware')
const plugins = require('../../plugins/uploader')



router.get('/get-filter', authentication, driverController.filterDriv);
router.get('/get-select', authentication, driverController.getSelect);

router.get('/get-driver', authentication, middlewareDriver.validate('get-driver'), driverController.getDriver);
router.get('/get-driver-detail', authentication, middlewareDriver.validate('get-driver-detail'), driverController.getDetailDriver);

router.post('/create-driver', authentication, plugins.addPhotoDriverMultiple, middlewareDriver.validate('create'), driverController.createDriver);
router.post('/update-driver', authentication, middlewareDriver.validate('update'), driverController.updateDriver);
router.put('/update', driverController.updateMDriver);
router.post('/upload-driver-photo', authentication, plugins.addPhotoDriver, middlewareDriver.validate('upload-driver-photo'), driverController.uploadPhotoDriver);

router.post('/ready-driver', authentication, middlewareDriver.validate('ready-driver'), driverController.statusOnDriver);
router.post('/off-driver', authentication, middlewareDriver.validate('off-driver'), driverController.statusOffDriver);

// ====================

router.get('/get-kiriman', authentication, driverController.getKiriman);
router.get('/get-kiriman-detail', authentication, driverController.getDetailKiriman);

router.get('/get-kurir', driverController.getKurir);
router.get('/get-kurir-detail', driverController.getDetailKurir);
router.get('/get-runsheet', driverController.getRunsheet);
router.get('/get-runsheet-detail', driverController.getDetailRunsheet);
router.post('/post-statuskirim', driverController.postStatusKirim);


//-------------------------------driver mobile-------------------------------//
router.get('/get-option-status', authentication, driverController.getOptionStatus);
router.post('/add-status-driver', authentication, driverController.DriverPosition);
router.post('/add-memo-driver', authentication, driverController.updateMemo);
router.post('/Approved-photo', authentication, plugins.addPhotoApproved, driverController.updatePhoto);
router.get('/Reward-history', authentication, driverController.historyReward);

router.post('/update-status-kpu', driverController.updateStatusKpu);
router.get('/get-sim-status', driverController.getSimStatus);
router.get('/get-driver-all', driverController.getDriverAll);







module.exports = router;        