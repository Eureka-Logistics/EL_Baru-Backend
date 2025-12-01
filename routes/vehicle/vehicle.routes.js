var express = require('express');
var router = express.Router();
const vehicleController = require('../../controllers/vehicle/vehicle.controller');
const authentication = require('../../middleware/private.middleware')
const middlewareVehicle = require('../../middleware/vehicle.middleware')
const plugins = require('../../plugins/uploader')



router.get('/get-select', authentication, vehicleController.getSelect);
router.get('/get-filter', authentication, vehicleController.filterVeh);

router.get('/get-vehicle', authentication, middlewareVehicle.validate('get-vehicle'), vehicleController.getvehicle);
router.get('/get-vehicle-detail', authentication, middlewareVehicle.validate('get-vehicle-detail'), vehicleController.getvehicleDetail);

router.get('/get-vehicle-mitra', authentication, middlewareVehicle.validate('get-vehicle-mitra'), vehicleController.getvehicleMitra);

router.post('/create-vehicle', authentication, plugins.addPhotoVehicleMultiple, middlewareVehicle.validate('create-vehicle'), vehicleController.createVehicle);
router.post('/edit-vehicle', authentication, plugins.addPhotoVehicleMultiple, middlewareVehicle.validate('create-vehicle'), vehicleController.editVehicle);
router.post('/upload-vehicle-photo', authentication, plugins.addPhotoVehicleMultiple, middlewareVehicle.validate('upload-vehicle-photo'), vehicleController.uploadPhoto);

router.post('/on-vehicle', authentication, middlewareVehicle.validate('on-vehicle'), vehicleController.readyVehicle);
router.post('/off-vehicle', authentication, middlewareVehicle.validate('off-vehicle'), vehicleController.delVehicle);

router.get('/get-type', authentication, vehicleController.getType);
router.post('/create-type', authentication, middlewareVehicle.validate('create-type'), vehicleController.createType);
router.post('/del-type', authentication, middlewareVehicle.validate('del-type'), vehicleController.delType);



module.exports = router;