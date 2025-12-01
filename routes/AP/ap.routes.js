var express = require('express');
var router = express.Router();
const apController = require('../../controllers/AP/ap.controller')
const authentication = require('../../middleware/private.middleware')
const APmiddleware = require('../../middleware/ap.middleware')


router.get('/get-AP-List', authentication, APmiddleware.validate("get-AP-List"), apController.getAPlist);
router.get('/get-AP-Detail', authentication, APmiddleware.validate("get-AP-Detail"), apController.getAPDetail);
router.get('/get-Detail-AP', authentication, APmiddleware.validate("get-Detail-AP"), apController.getDetailAP);

// router.get('/get-data-sm', authentication, apController.addDetail);
// router.get('/get-select-AP', authentication, apController.getSelectAP);

router.post('/create-AP', authentication, APmiddleware.validate("create-AP"), apController.createAP);
router.post('/create-AP-Detail', authentication, APmiddleware.validate("create-AP-Detail"), apController.createAPDetail);

router.put('/edit-AP', authentication, APmiddleware.validate("edit-AP"), apController.editAP);
router.put('/edit-AP-Detail', authentication, APmiddleware.validate("edit-AP-Detail"), apController.editAPDetail);

module.exports = router;


