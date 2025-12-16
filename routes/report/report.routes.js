var express = require('express');
var router = express.Router();
const reportController = require('../../controllers/report/report.controller')
const authentication = require('../../middleware/private.middleware')
const middlewareDriver = require('../../middleware/sp.middleware')


router.get('/get-report', authentication, reportController.getReportSales);
router.get('/get-belum-kembali', authentication, reportController.getBelumKembali);
router.get('/get-invoice-harian', authentication, reportController.getInvoiceHarian);
router.get('/get-belum-invoice', authentication, reportController.getBelumInvoice);



module.exports = router; 
