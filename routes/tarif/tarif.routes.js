var express = require('express');
var router = express.Router();
const tarifController = require('../../controllers/tarif/tarif.controller');
const authentication = require('../../middleware/private.middleware')
const middlewareVehicle = require('../../middleware/vehicle.middleware')


router.get('/get-select', authentication, tarifController.getSelectTarif);
router.get('/get-tarifCustomer', authentication, tarifController.getTarifCustomer);
router.get('/get-detail-tarifCustomer', authentication, tarifController.getDetailCustomer);
router.post('/create-tarifCustomer', authentication, tarifController.createTarifCustomer);
router.post('/edit-tarifCustomer', authentication, tarifController.editTariffCustomer);
router.post('/delete-tarifCustomer', authentication, tarifController.deleteTarifCustomer);

// Route baru untuk create dengan konfirmasi
router.post('/create-tarifCustomer-confirmation', authentication, tarifController.createTarifCustomerWithConfirmation);
router.post('/replace-tarifCustomer', authentication, tarifController.replaceTarifCustomer);


router.get('/get-tarifEureka', authentication, tarifController.getTarifEureka);
router.get('/get-detail-tarifEureka', authentication, tarifController.getDetailtarifEureka);
router.post('/create-tarifEureka', authentication, tarifController.creatTarifEureka);
router.post('/edit-tarifEureka', authentication, tarifController.updateTarifEureka);
router.post('/delete-tarifEureka', authentication, tarifController.delTarifEureka);

// Route baru untuk create dengan konfirmasi
router.post('/create-tarifEureka-confirmation', authentication, tarifController.createTarifEurekaWithConfirmation);
router.post('/replace-tarifEureka', authentication, tarifController.replaceTarifEureka);


// router.get('/get-tarifEureka', authentication, tarifController.getTarifEureka);
router.get('/get-tarifMitra', authentication, tarifController.getTarifMitra);
router.get('/get-detail-tarifMitra', authentication, tarifController.getDetailTarifMitra);
router.post('/create-tarifMitra', authentication, tarifController.creatTarifMitra);
router.post('/update-tarifMitra', authentication, tarifController.updateTarifMitra);
router.post('/del-tarifMitra', authentication, tarifController.delTarifMitra);

// Route baru untuk create dengan konfirmasi
router.post('/create-tarifMitra-confirmation', authentication, tarifController.createTarifMitraWithConfirmation);
router.post('/replace-tarifMitra', authentication, tarifController.replaceTarifMitra);

// router.get('/get-status-kendaraan', authentication, vehicleController.getStatusKendaraan);
// router.get('/get-vehicle-detail', vehicleController.getvehicleDetail);
// router.get('/get-select', authentication, vehicleController.getSelect);
// router.post('/off-vehicle', authentication, vehicleController.delVehicle);
// router.post('/on-vehicle', authentication, vehicleController.readyVehicle);
// router.post('/edit-vehicle', authentication, vehicleController.editVehicle);
// router.post('/create-vehicle', authentication, middlewareVehicle.validate('create'), vehicleController.createVehicle);

module.exports = router;