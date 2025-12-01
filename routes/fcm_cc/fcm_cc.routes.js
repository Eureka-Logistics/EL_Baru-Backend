const express = require('express');
const router = express.Router();
const fcmCcController = require('../../controllers/fcm_cc/fcm_cc.controller');
const authentication = require('../../middleware/private.middleware');

// Save FCM token for command center (no auth for testing)
router.post('/post-fcm-token', fcmCcController.saveFcmToken);

// Send notification via command center FCM (no auth for testing)
router.post('/post-send-notification', fcmCcController.kirimNotifikasi);

// Get active tokens (no auth for testing)
router.get('/get-active-tokens', fcmCcController.getActiveTokens);

// Delete/deactivate token (no auth for testing)
router.post('/delete-token', fcmCcController.deleteToken);

// Test Firebase Command Center connection
router.get('/test-connection', fcmCcController.testConnection);

// Test notification to specific token  
router.post('/test-notification', fcmCcController.testNotification);

module.exports = router;
