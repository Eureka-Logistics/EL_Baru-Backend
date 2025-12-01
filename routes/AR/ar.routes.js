var express = require('express');
var router = express.Router();

const arController = require('../../controllers/AR/ar.controller')
const authentication = require('../../middleware/private.middleware')

const ARmiddleware = require('../../middleware/ar.middleware')


router.get('/get-AR-List', authentication, ARmiddleware.validate("get-AR-List"), arController.getARList);

router.get('/get-AR-detail', authentication, ARmiddleware.validate("get-AR-detail"), arController.getARDetail);

router.get('/get-Detail-AR', authentication, ARmiddleware.validate("get-Detail-AR"), arController.getARDetail_2);

router.post('/create-AR', authentication, ARmiddleware.validate("create-AR"), arController.createAR);

router.post('/create-AR-Detail', authentication, ARmiddleware.validate("create-AR-Detail"), arController.createARDetail);

router.put('/edit-AR', authentication, ARmiddleware.validate("edit-AR"), arController.editAR);

router.put('/edit-AR-Detail', authentication, ARmiddleware.validate("edit-AR-Detail"), arController.editARDetail);

router.post('/export-faktur', arController.exportFaktur);


module.exports = router;