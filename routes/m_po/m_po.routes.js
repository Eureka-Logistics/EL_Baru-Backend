var express = require('express');
var router = express.Router();
const poController = require('../../controllers/m_po/m_po.controller')
const authentication = require('../../middleware/private.middleware')

router.get('/get-po-list', authentication, poController.getPoList);
router.get('/get-po-detail', authentication, poController.getPoDetail);
router.post('/create-po', authentication, poController.createPo);
router.post('/edit-po', authentication, poController.editPo);
router.post('/delete-po', authentication, poController.deletePo);

module.exports = router;
