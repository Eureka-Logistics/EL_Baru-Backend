var express = require('express');
var router = express.Router();
const asmController = require('../../controllers/m_asm/m_asm.controller')
const authentication = require('../../middleware/private.middleware')

router.get('/get-all-asm', authentication, asmController.getAllAsm);
router.get('/get-asm-by-bu', authentication, asmController.getAsmByBu);
router.get('/get-asm-by-id', authentication, asmController.getAsmById);
router.post('/create-asm', authentication, asmController.createAsm);
router.post('/edit-asm', authentication, asmController.editAsm);
router.post('/disable-asm', authentication, asmController.disableAsm);

module.exports = router;

