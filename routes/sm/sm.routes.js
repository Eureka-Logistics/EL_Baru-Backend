var express = require('express');
var router = express.Router();
const smController = require('../../controllers/sm/sm.controller')
const authentication = require('../../middleware/private.middleware')
const middlewareDriver = require('../../middleware/sp.middleware')


router.get('/get-sm', authentication, smController.getSm);
router.get('/get-sm-driver', authentication, smController.getSmDriver);
router.post('/edit-sm', authentication, smController.updateSm);
router.get('/get-sm-filter', authentication, smController.filterSM);
router.get('/get-sm-detail', authentication, smController.smDetail);
router.get('/get-select-upd-sm', authentication, smController.getSelectEdit);
router.get('/get-sm-detail-bySp', authentication, smController.getSmDetailBySP);
router.get('/get-history-kendaraan', smController.getHistoryKendaraanStatus);
router.get('/get-history-kendaraan-web', authentication, smController.getHistoryKendaraanStatusWeb);
router.get('/get-succes-SM', authentication, smController.getSmBerhasil);


//purchase order
router.get('/get-list-po', authentication, smController.getListPo);
router.get('/get-list-po-id', authentication, smController.getListPobyId);


router.get('/get-select-po', authentication, smController.getSelectPo);
router.get('/get-list-po-detail', authentication, smController.getPoDetail);
router.post('/create-po', authentication, smController.createPO);
router.post('/edit-po', authentication, smController.editPo);
// router.get('/get-sm-bySp', authentication, smController.getSmBySp);


//purchasing
router.get('/get-status-approve-purch', authentication, smController.getStatusApprovePurch);
router.get('/get-sm-one-month', smController.getListMsmOneMonthAgo);




module.exports = router; 