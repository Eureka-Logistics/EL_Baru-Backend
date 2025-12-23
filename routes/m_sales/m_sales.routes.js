var express = require('express');
var router = express.Router();
const salesController = require('../../controllers/m_sales/m_sales.controller')
const authentication = require('../../middleware/private.middleware')

router.get('/get-all-sales', authentication, salesController.getAllSales);
router.get('/get-sales-by-id', authentication, salesController.getSalesById);
router.post('/create-sales', authentication, salesController.createSales);
router.post('/edit-sales', authentication, salesController.editSales);
router.post('/disable-sales', authentication, salesController.disableSales);

module.exports = router;

