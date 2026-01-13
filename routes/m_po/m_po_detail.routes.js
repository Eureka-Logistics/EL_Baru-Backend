var express = require('express');
var router = express.Router();
const poDetailController = require('../../controllers/m_po/m_po_detail.controller')
const authentication = require('../../middleware/private.middleware')

router.get('/get-po-detail-list', authentication, poDetailController.getPoDetailList);
router.get('/get-po-detail-by-id', authentication, poDetailController.getPoDetailById);
router.post('/create-po-detail', authentication, poDetailController.createPoDetail);
router.post('/edit-po-detail', authentication, poDetailController.editPoDetail);
router.post('/delete-po-detail', authentication, poDetailController.deletePoDetail);

module.exports = router;
