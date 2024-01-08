const express = require('express');

const {
    fetchGoogleSpeedScoreData,
    updateGoogleSpeedScore
} = require('../../controllers/googleSpeedScore');
const authMiddleware = require("../../middleware/ensureUserLoggedIn");

const router = express.Router();

router.use(authMiddleware.ensureUserLoggedIn);
router.post('/fetch-google-speed-score', updateGoogleSpeedScore)
router.post('/update-google-speed-score/userId', fetchGoogleSpeedScoreData)

module.exports = router;
