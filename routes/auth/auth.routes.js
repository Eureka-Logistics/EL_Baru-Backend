var express = require('express');
var router = express.Router();
const authController = require('../../controllers/auth/auth.controller')
const middleware = require('../../middleware/auth.middleware')
const authentication = require('../../middleware/private.middleware')


router.post('/login', middleware.validate('login'), authController.login);
router.post('/register-user', authController.creteUser);
router.post('/login-driver', authController.loginDriver);
router.get('/get-profile', authentication, authController.getProfile);
router.get('/get-user', authentication, authController.getUser);
router.get('/get-select', authentication, authController.getSelect);


//configDb

router.get('/get-config', authController.configDb);


module.exports = router;