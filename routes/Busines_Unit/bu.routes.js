var express = require('express');
var router = express.Router();
const buController = require('../../controllers/Busines_Unit/bu.controller')
const authentication = require('../../middleware/private.middleware')
const middlewareDriver = require('../../middleware/driver.middleware')
const plugins = require('../../plugins/uploader')



router.get('/get-select', authentication, buController.getSelect);

//bu
router.get('/get-bu', authentication, buController.getBU);
router.get('/get-bu-detail', authentication, buController.getBuDetail);
router.post('/create-bu', authentication, buController.createBu);
router.post('/delete-bu', authentication, buController.delBu);
router.post('/active-bu', authentication, buController.activeBu);
router.post('/edit-bu', authentication, buController.editBu);


//bu branch
router.get('/get-select-bu-brench', authentication, buController.getSelectBuBranch);
router.get('/get-bu-brench', authentication, buController.getBuBranch);
router.get('/get-bu-brench-detail', authentication, buController.getBuBrenchDetail);

router.post('/create-bu-brench', authentication, buController.createBuBranch);
router.post('/edit-bu-brench', authentication, buController.editBuBrench);
router.post('/delete-bu-brench', authentication, buController.delBuBrench);

//bu employe
router.get('/get-bu-employee', authentication, buController.getBuEmploye);
router.get('/get-bu-employee-detail', authentication, buController.getBuEmployeDetail);
router.get('/get-select-bu-employee', authentication, buController.getSelectBuEmployee);
router.post('/create-bu-employee', authentication, buController.createBuEmployee);
router.post('/edit-bu-employee', authentication, buController.editBuEmployee);

//bu employee position
router.get('/get-employee-position-filter', authentication, buController.buEmployeePostionFilter);
router.get('/get-bu-employee-position', authentication, buController.getBuEmployePosition);
router.get('/get-bu-employee-detail-position', authentication, buController.getBuEmployePositionDetail);
router.post('/create-bu-employee-position', authentication, buController.createBuEmployeePosition);
router.post('/edit-bu-employee-position', authentication, buController.editBuEmployeePosition);



router.get('/get-select-add-position', authentication, buController.getSelectAddemployeePosition);
router.post('/add-employee-position', authentication, buController.addEmployeePosition);
router.post('/del-employee-position', authentication, buController.delEmployeePosition);

router.get('/get-all-bu', buController.getAllBU);
router.get('/get-all-bu-brench', buController.getAllBUBrench);





module.exports = router;        
