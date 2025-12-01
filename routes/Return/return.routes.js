var express = require('express');
var router = express.Router();

const returnController = require('../../controllers/Return/return.controller')
const authentication = require('../../middleware/private.middleware')

const Returnmiddleware = require('../../middleware/return.middleware')


router.get('/get-Return-List', authentication, Returnmiddleware.validate("get-Return-List"), returnController.getReturnList);

router.get('/get-Return-List-Detail', authentication, Returnmiddleware.validate("get-Return-List-Detail"), returnController.getReturnListDetail);

router.post('/create-Return', authentication, Returnmiddleware.validate("create-Return"), returnController.createReturn);

router.put('/edit-Return', authentication, Returnmiddleware.validate("edit-Return"), returnController.editReturn);


module.exports = router;