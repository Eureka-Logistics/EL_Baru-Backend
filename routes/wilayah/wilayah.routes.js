var express = require('express');
var router = express.Router();
const wilayahController = require('../../controllers/wilayah/wilayah.controller');
const authentication = require('../../middleware/private.middleware')
const middlewareVehicle = require('../../middleware/vehicle.middleware')


router.get('/get-provinsi', authentication, wilayahController.getWilayahProvinsi);
router.get('/get-kota', authentication, wilayahController.getWilayahKota);
router.get('/get-kecamatan', authentication, wilayahController.getWilayahKecamatan);
// router.get('/get-status-kendaraan', authentication, vehicleController.getStatusKendaraan);
// router.get('/get-vehicle-detail', vehicleController.getvehicleDetail);
// router.get('/get-select', authentication, vehicleController.getSelect);
// router.post('/off-vehicle', authentication, vehicleController.delVehicle);
// router.post('/on-vehicle', authentication, vehicleController.readyVehicle);
// router.post('/edit-vehicle', authentication, vehicleController.editVehicle);
// router.post('/create-vehicle', authentication, middlewareVehicle.validate('create'), vehicleController.createVehicle);

module.exports = router;