var express = require('express');
var router = express.Router();
const customerController = require('../../controllers/customer/customer.controller')
const authentication = require('../../middleware/private.middleware')
const middlewareCustomer = require('../../middleware/customer.middleware')
const plugins = require('../../plugins/uploader')


router.get('/get-select-customer', authentication, customerController.getSelectCustomer);
router.get('/get-customer', authentication, customerController.getCustomer);
router.get('/get-customer-invoice-address', authentication, customerController.GetInvoiceAddress);
router.get('/get-customer-invoice-address-detail', authentication, customerController.GetDetailInvoiceAddress);
router.get('/detail-alamat', authentication, customerController.getCustomerDetailAlamat);

router.get('/get-detail-customer', authentication, customerController.getCustomerDetail);
router.post('/edit-customer', authentication, customerController.editCustomer);
router.post('/del-customer', authentication, customerController.delCustomer);
router.post('/create-customer', authentication, customerController.cretaCustomer);
router.get('/get-customer-address', authentication, customerController.getAlamatCustomer);
router.get('/get-select-create-address', authentication, customerController.getSelectCreatAddress);
router.post('/create-customer-address', authentication, customerController.createCustomerAddress);
router.post('/edit-alamat', authentication, customerController.editCustomerAddress);
router.post('/create-customer-invoice', authentication, customerController.createInvoiceAddress);
router.post('/edit-customer-invoice', authentication, customerController.editInovoiceAddress);

router.get('/get-report-customer', authentication, customerController.getReportCustomer);
router.get('/export-report-customer-excel', authentication, customerController.exportReportCustomerExcel);
router.get('/get-bu-customer', authentication, customerController.getBuReport);

router.get('/get-customer-all', customerController.getCustomerAll);



module.exports = router;        
