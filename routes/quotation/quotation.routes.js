var express = require('express');
var router = express.Router();
const quotationController = require('../../controllers/quotation/quotation.controller')
const authentication = require('../../middleware/private.middleware')

router.get('/get-quotation-list', authentication, quotationController.getQuotationList);
router.get('/get-quotation-detail', authentication, quotationController.getQuotationDetail);
router.post('/create-quotation', authentication, quotationController.createQuotation);
router.post('/edit-quotation', authentication, quotationController.editQuotation);
router.post('/delete-quotation', authentication, quotationController.deleteQuotation);

module.exports = router;
