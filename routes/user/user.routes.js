var express = require('express');
var router = express.Router();
const userController = require('../../controllers/user/user.controller')
const authentication = require('../../middleware/private.middleware')
const middlewareUser = require('../../middleware/user.middleware')
const plugins = require('../../plugins/uploader')


router.get('/get-user', authentication, userController.getUserAll);
router.get('/get-select-user', authentication, userController.getSelecetUser);
router.post('/create-user', authentication, middlewareUser.validate('create'), userController.createUser);
router.post('/del-user', authentication, userController.delUser);
router.post('/edit-user', authentication, userController.editUser);

router.get('/get-user-all', userController.getAllUserCommanCenter);


module.exports = router;  