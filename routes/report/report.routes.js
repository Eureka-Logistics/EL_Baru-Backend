var express = require('express');
var router = express.Router();
const reportController = require('../../controllers/report/report.controller')
const authentication = require('../../middleware/private.middleware')
const middlewareDriver = require('../../middleware/sp.middleware')


router.get('/get-report', authentication, reportController.getReportSales);
router.get('/get-belum-kembali', authentication, reportController.getBelumKembali);
router.get('/get-invoice-harian', authentication, reportController.getInvoiceHarian);
router.get('/get-belum-invoice', authentication, reportController.getBelumInvoice);
router.get('/get-penyerahan-harian', authentication, reportController.getPenyerahanHarian);
router.get('/get-ap-harian', authentication, reportController.getApHarian);
router.get('/get-belum-ap', authentication, reportController.getBelumAp);
router.get('/get-kirim-inv', authentication, reportController.getKirimInv);
router.get('/get-lose-sales-bulanan', authentication, reportController.getLoseSalesBulanan);
router.get('/get-uj-harian', authentication, reportController.getUjHarian);
router.get('/export-excel-belum-kembali', authentication, reportController.exportExcelBelumKembali);
router.get('/export-excel-belum-inv', authentication, reportController.exportExcelBelumInv);
router.get('/export-excel-belum-ap', authentication, reportController.exportExcelBelumAp);
router.get('/export-excel-belum-kirim', authentication, reportController.exportExcelBelumKirim);
router.get('/export-excel-lose-sales-detail', authentication, reportController.exportExcelLoseSalesDetail);



module.exports = router; 
