var express = require('express');
var router = express.Router();
const mgrController = require('../../controllers/m_mgr/m_mgr.controller')
const authentication = require('../../middleware/private.middleware')

router.get('/get-all-mgr', authentication, mgrController.getAllMgr);
router.get('/get-mgr-by-bu', authentication, mgrController.getMgrByBu);
router.get('/get-mgr-by-id', authentication, mgrController.getMgrById);
router.post('/create-mgr', authentication, mgrController.createMgr);
router.post('/edit-mgr', authentication, mgrController.editMgr);
router.post('/disable-mgr', authentication, mgrController.disableMgr);

module.exports = router;

