var express = require('express');
var router = express.Router();
const mitraController = require('../../controllers/mitra/mitra.controller')
const authentication = require('../../middleware/private.middleware')
const middlewareMitra = require('../../middleware/mitra.middleware')
const plugins = require('../../plugins/uploader')



router.get('/get-select-filter', authentication, mitraController.getSelectFilterMitra);
router.get('/get-select-mitraPic', authentication, mitraController.getSelectCreatMitraPic);
router.get('/get-select-mitra', authentication, mitraController.getSelectMitra);

router.get('/get-mitra', authentication, middlewareMitra.validate('get-mitra'), mitraController.getMitra);
router.get('/get-detail-mitra', authentication, middlewareMitra.validate('get-detail-mitra'), mitraController.getMitraDetail);
router.get('/get-mitra-pic', authentication, middlewareMitra.validate('get-mitra-pic'), mitraController.getMitraPic);

router.post('/create-mitra', authentication, middlewareMitra.validate('create-mitra'), mitraController.createMitra);
router.post('/edit-mitra', authentication, middlewareMitra.validate('edit-mitra'), mitraController.updateMitra);
router.post('/del-mitra', authentication, middlewareMitra.validate('del-mitra'), mitraController.deleteMitra);

router.post('/create-mitra-pic', authentication, middlewareMitra.validate('create-mitra-pic'), mitraController.createMitraPic);
router.post('/edit-mitra-pic', authentication, middlewareMitra.validate('edit-mitra-pic'), mitraController.editMitraPic);
router.post('/delete-mitra-pic', authentication, middlewareMitra.validate('delete-mitra-pic'), mitraController.deleteMitraPic);


router.post('/create-mitra-cabangRek', authentication, mitraController.createMitracabang);
router.get('/get-mitra-cabangRek', authentication, mitraController.getMitraCabang);
router.post('/edit-mitra-cabangRek', authentication, mitraController.editMitracabang);
router.post('/delete-mitra-cabangRek', authentication, mitraController.deleteMitracabang);
router.get('/get-mitra-all', mitraController.getMitraAll);




module.exports = router;        
