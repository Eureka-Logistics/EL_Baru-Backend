var express = require('express');
var router = express.Router();
const bannerController = require('../../controllers/banner/banner.controller')
const authentication = require('../../middleware/private.middleware')
const middlewareDriver = require('../../middleware/driver.middleware')
const plugins = require('../../plugins/uploader')



router.get('/get-banner-web', bannerController.getBannerWeb);






module.exports = router;        