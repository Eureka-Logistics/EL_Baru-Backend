const express = require('express');
const router = express.Router();
const returController = require('../../controllers/retur/retur.controller');
const authentication = require('../../middleware/private.middleware');

router.get("/get-all-retur", returController.getAllRetur);
router.get("/get-retur/:id", returController.getReturById);
router.get("/get-sm-retur-history", returController.getsmreturhistory);
router.post("/create-retur", returController.createRetur);
router.put("/update-retur/:id", returController.updateRetur);
router.put("/update-retur-stage/:id", returController.updateReturStage);
router.put("/update-retur-pihak-dibebankan/:id", returController.updateReturPihakDibebankan);
router.delete("/delete-retur/:id", returController.deleteRetur);

router.get("/filters", returController.getReturFilters);


module.exports = router;
