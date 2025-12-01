var express = require('express');
var router = express.Router();
const reportController = require('../../controllers/report/report.controller')
const authentication = require('../../middleware/private.middleware')
const middlewareDriver = require('../../middleware/sp.middleware')


router.get('/get-report', authentication, reportController.getReportSales);



module.exports = router; 
