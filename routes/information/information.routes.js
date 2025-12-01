var express = require('express');
var router = express.Router();
const informationController = require('../../controllers/Information/information.controller')
const authentication = require('../../middleware/private.middleware')
// const middlewareDriver = require('../../middleware/sp.middleware')

router.get('/get-inform-ops', authentication, informationController.getInformationoOps);
router.get('/get-inform-mitra', authentication, informationController.getInformationMitra);
router.post('/sendMail', informationController.sendMail);



module.exports = router;       