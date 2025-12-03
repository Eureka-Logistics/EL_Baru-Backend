var express = require('express');
var router = express.Router();

const uangJalanController = require('../../controllers/uang_jalan/uang_jalan.controller')
const authentication = require('../../middleware/private.middleware')

const uangJalanmiddleware = require('../../middleware/uang_jalan.middleware')

router.get('/data-UangJalan-Periode', authentication, uangJalanmiddleware.validate("data-UangJalan-Periode"), uangJalanController.getDataUangJalanPeriode);

router.get('/data-UangJalan-Periode-Detail', authentication, uangJalanmiddleware.validate("data-UangJalan-Periode-Detail"), uangJalanController.getDataUangJalanPeriodeDetail);

router.post('/create-UangJalan-Periode', authentication, uangJalanmiddleware.validate("create-UangJalan-Periode"), uangJalanController.createUangJalanPeriode);

router.post('/create-UangJalan-Transfer', authentication, uangJalanmiddleware.validate("create-UangJalan-Transfer"), uangJalanController.createUangJalanTransfer);

router.put('/edit-UangJalan-Periode', authentication, uangJalanmiddleware.validate("edit-UangJalan-Periode"), uangJalanController.editUangJalanPeriode);


module.exports = router;