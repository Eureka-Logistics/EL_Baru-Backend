var express = require('express');
var router = express.Router();
const spController = require('../../controllers/SP/sp.controller')
const authentication = require('../../middleware/private.middleware')
const middlewareDriver = require('../../middleware/sp.middleware')

//sales
router.get('/get-SP-select-create', authentication, spController.getSelectCreateSp);
router.get('/get-SP-select-detail', authentication, spController.getSelectDetailSp);
router.get('/get-list-alamat', authentication, spController.getListAlamat);
router.post('/create-SP', authentication, middlewareDriver.validate('createSp'), spController.createSp);
router.post('/create-SP-vico', authentication, middlewareDriver.validate('createSp'), spController.createSp_vico);
router.post('/create-SP-race', authentication, middlewareDriver.validate('createSp_race'), spController.createSp_race);
router.post('/get-tarif-alamat', authentication, spController.getTarifAlamat);
router.post('/ganti-alamat', authentication, spController.gantiAlamat);
router.post('/edit-SP', authentication, spController.editSp);
router.post('/edit-SP-vico', authentication, spController.editSp_vico);
router.post('/edit-SP-race', authentication, spController.editSp_race);
router.post('/create-SP-detail', authentication, spController.createDetailSp);
router.post('/create-SP-detail-vico', authentication, spController.createDetailSp_vico);
router.post('/create-SP-detail-race', authentication, spController.createDetailSp_race);
// router.post('/create-SM-detail', authentication, spController.createDetailSM);
router.post('/delete-SP-detail', authentication, spController.deleteDetailSp);
router.post('/edit-SP-detail', authentication, spController.editSpDetail);
router.post('/edit-SP-detail-vico', authentication, spController.editSpDetail_vico);
router.post('/edit-SP-detail-race', authentication, spController.editSpDetail_race);
router.get('/get-SP-sales', authentication, spController.getSpSales);
router.get('/get-detail-sp', authentication, spController.getSpDetailSales);
router.get('/get-detail-sp-race', authentication, spController.getSpDetailRace);
router.post('/solved-issue', authentication, spController.solvedIssue);


router.get('/get-select-do', authentication, spController.getSelectCancelDo);
router.post('/cancel-sp', authentication, spController.cancelDoSp);
router.get('/get-massage-do-detail', authentication, spController.getMassageDoDetail);
router.get('/get-list-cancel-do', authentication, spController.getCancelDoList);

router.post('/create-massage-do', authentication, spController.createDoMassage);
router.post('/del-massage-do', authentication, spController.deleteDoMassage);
router.post('/update-massage-do', authentication, spController.updateDoMassage);
router.get('/get-do-massage', authentication, spController.getMassageDo);
router.post('/create-massage', authentication, spController.createMassageSales);




//OPERASIONAL
router.get('/get-SP', authentication, spController.getSp);
router.get('/get-cabang', authentication, spController.getCabang);
router.get('/another-driver', authentication, spController.anotherDriver);
router.get('/get-SP-detail', authentication, spController.getSpDetail);
router.get('/get-SP-select', authentication, spController.getSelectApprove);
router.get('/get-SP-select-2', authentication, spController.getSelect);
router.get('/get-SP-select-purch', authentication, spController.getSelectPurch);
router.get('/get-SP-massage', authentication, spController.getSpMassage);
router.get('/get-customer-filter', authentication, spController.getCustomerFilter);
router.post('/approve-SP', authentication, middlewareDriver.validate('approveSp'), spController.approveSp);
router.post('/decline-SP', authentication, spController.declineSp);
router.post('/set-lost-sale', authentication, spController.setLostSale);


//akunting
router.post('/approve-SP-akunting', authentication, spController.approveAkunting);
router.post('/reject-SP-akunting', authentication, spController.rejecAkunting);
router.get('/get-SP-akunting', authentication, spController.getListWaitingAkunting);
router.post('/approve-SO-accounting', authentication, spController.approveSoAccounting);
router.post('/revisi-SO-accounting', authentication, spController.revisiSoAccounting);

// CRUD endpoints untuk tambahan biaya detail SJ (m_sm_cost)
router.post('/create-sm-cost', authentication, spController.createSmCost);
router.get('/get-sm-costs', authentication, spController.getSmCosts);
router.get('/get-all-sm-costs', authentication, spController.getAllSmCosts);
router.put('/update-sm-cost/:id_msm_cost', authentication, spController.updateSmCost);
router.delete('/delete-sm-cost/:id_msm_cost', authentication, spController.deleteSmCost);
router.put('/approve-sm-cost/:id_msm_cost', authentication, spController.approveSmCost);
router.put('/reject-sm-cost/:id_msm_cost', authentication, spController.rejectSmCost);
router.get('/get-biaya-tambahan-sp-detail', authentication, spController.getBiayaTambahanSpDetail);
router.get('/get-SP-detail-purch', authentication, spController.getDetailApprovePurch);
router.get('/get-SP-detail-purch-idmp', authentication, spController.getDetailApprovePurchIDMP);
router.post('/approve-SP-purch', authentication, spController.approvePurchasing);
router.post('/create-po-purch', authentication, spController.addPoPurch);
router.get('/get-list-multi', authentication, spController.getListMultiDrop);
router.get('/get-SP-select-puch', authentication, spController.getSelectApprovePurc);
router.get('/get-list-purch', authentication, spController.getListWaitingPurch);
router.get('/get-list-purch2', authentication, spController.getListWaitingPurch2);
router.post('/reject-purch', authentication, spController.rejectPurch);



//sales,ops,akunting
router.get('/get-SP-all-filter', authentication, spController.getFilterSp);
router.get('/get-SP-all', authentication, spController.getSpListAll2);
router.get('/export-sp-list-excel', authentication, spController.exportSpListExcel);
router.get('/get-SP-all-approve', authentication, spController.getSpListApprove);
router.get('/get-SP-all-detail-vico', authentication, spController.getSpListAllDetail_vico);
router.post('/update-id-oddo', authentication, spController.updateIdOddo);
router.get('/get-SP-all-detail', authentication, spController.getSpListAllDetail);

router.get('/get-lost-sales', authentication, spController.getLostSales);



//status approve
router.get('/get-status-approve', authentication, spController.statusApproveAll);
router.get('/get-status-detail', authentication, spController.getStatusDetail);


// GET TOTAL DATA
// router.get('/get-total-data', authentication, spController.getDataSjPerbulan);
router.get('/get-total-data', spController.getDataSjPerbulan);
router.get('/get-list-sj', spController.getListSJ);





module.exports = router;

