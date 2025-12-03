const express = require('express');
const router = express.Router();
const fcmController = require('../../controllers/fcm_token/fcm_token.controller');
const authentication = require('../../middleware/private.middleware');

router.post('/post-fcm-token',authentication, fcmController.saveFcmToken);
router.post('/post-send-notification',authentication, fcmController.kirimNotifikasi);

module.exports = router;
