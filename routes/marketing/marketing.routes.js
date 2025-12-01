var express = require('express');
var router = express.Router();
const marketingController = require('../../controllers/marketing/marketing.controller')
const authentication = require('../../middleware/private.middleware')
// const middlewareDriver = require('../../middleware/sp.middleware')

router.get('/get-select', authentication, marketingController.getSelect);
router.post('/create-task-planing', authentication, marketingController.createTask);
router.post('/create-task-result', authentication, marketingController.createTaskDetail);
router.get('/get-Schedule', authentication, marketingController.getSchedule);
router.get('/get-Detail-Schedule', authentication, marketingController.getDetailKunjungan);



module.exports = router;       