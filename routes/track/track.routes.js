const express = require('express');
const router = express.Router();
const trackController = require('../../controllers/track/track.controller');

router.get('/', trackController.getTrackingByResi);

module.exports = router;
