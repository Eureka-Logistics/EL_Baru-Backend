var express = require('express');
var router = express.Router();
const mSmController = require('../../controllers/m_sm/m_sm.controller')
const authentication = require('../../middleware/private.middleware')

router.get('/get-all-msm', authentication, mSmController.getAllMsm);
router.get('/get-msm-detail', authentication, mSmController.getMsmDetail);

module.exports = router;
