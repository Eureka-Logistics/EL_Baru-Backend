const express = require('express');
const router = express.Router();
const orderController = require('../../controllers/monitoring/order.controller');

// Route untuk export Excel tanpa limit ukuran file
router.get('/export-excel-unlimited', orderController.exportExcelUnlimited);

// Route untuk export Excel dengan streaming (untuk file yang sangat besar)
// router.get('/export-excel-streaming', orderController.exportExcelStreaming);

router.get(
  "/export-excel-streaming",
  (req, res, next) => {
    res.setHeader("Content-Encoding", "identity");
    next();
  },
  orderController.exportExcelStreaming
);

module.exports = router;
