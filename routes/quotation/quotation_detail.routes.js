var express = require('express');
var router = express.Router();
const quotationDetailController = require('../../controllers/quotation/quotation_detail.controller')
const authentication = require('../../middleware/private.middleware')

router.get('/get-quotation-detail-list', authentication, quotationDetailController.getQuotationDetailList);
router.get('/get-quotation-detail-by-id', authentication, quotationDetailController.getQuotationDetailById);
router.post('/create-quotation-detail', authentication, quotationDetailController.createQuotationDetail);
router.post('/edit-quotation-detail', authentication, quotationDetailController.editQuotationDetail);
router.post('/delete-quotation-detail', authentication, quotationDetailController.deleteQuotationDetail);

module.exports = router;
