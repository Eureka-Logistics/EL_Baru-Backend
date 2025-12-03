var express = require('express');
var router = express.Router();
const monitoringController = require('../../controllers/monitoring/monitoring.controller')
const orderController = require('../../controllers/monitoring/order.controller')
const authentication = require('../../middleware/private.middleware')
const middlewareDriver = require('../../middleware/sp.middleware')


router.post('/update-status-kendaraan', monitoringController.kendaraanStatus);
router.get('/get-datapesanan-customer', authentication, monitoringController.getPesananCustomer);
router.get('/get-monit-kendaraan', authentication, monitoringController.getKendaraanstatus);
router.post('/get-location', authentication, monitoringController.getLocation);
router.get('/get-latlong', authentication, monitoringController.JadikanLatLong);

// Routes untuk export Excel monitoring order
router.get('/order/export-excel-unlimited', orderController.exportExcelUnlimited);
router.get('/order/export-excel-streaming', orderController.exportExcelStreaming);

// Monitoring SJ list
router.get('/order/monitoring-sj', authentication, orderController.getMonitoringSJList);

// Get data terima SJ
router.get('/order/get_terimasj', authentication, orderController.getTerimaSJ);

// Submit terima/reject SJ
router.post('/order/submit_terimasj', authentication, orderController.submitTerimaSJ);

// Get daftar receive SJ oleh OPS (penerima)
router.post('/order/get_receivesj_ops', authentication, orderController.getReceiveSjOps);

// Serahkan SJ ke divisi berikutnya (AR/AP)
router.post('/order/submit_serahkansj', authentication, orderController.submitSerahkanSJ);

// Monitoring history receive
router.get('/order/monitoring-history-receive', authentication, orderController.getMonitoringHistoryReceive);

// Monitoring history receive (DataTables server-side)
router.post('/order/monitoring-history-receive', authentication, orderController.monitoringHistoryReceive);





module.exports = router; 
