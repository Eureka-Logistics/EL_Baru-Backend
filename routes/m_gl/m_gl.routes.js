var express = require('express');
var router = express.Router();
const glController = require('../../controllers/m_gl/m_gl.controller')
const authentication = require('../../middleware/private.middleware')

router.get('/get-all-gl', authentication, glController.getAllGl);
router.get('/get-gl-by-bu', authentication, glController.getGlByBu);
router.get('/get-gl-by-id', authentication, glController.getGlById);
router.post('/create-gl', authentication, glController.createGl);
router.post('/edit-gl', authentication, glController.editGl);
router.post('/disable-gl', authentication, glController.disableGl);

module.exports = router;

