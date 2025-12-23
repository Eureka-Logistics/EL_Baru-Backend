var express = require('express');
var router = express.Router();
const cabController = require('../../controllers/m_cab/m_cab.controller')
const authentication = require('../../middleware/private.middleware')

router.get('/get-cab', authentication, cabController.getCab);
router.get('/get-cab-by-id', authentication, cabController.getCabById);
router.post('/create-cab', authentication, cabController.createCab);
router.post('/edit-cab', authentication, cabController.editCab);
router.post('/disable-cab', authentication, cabController.disableCab);

module.exports = router;

