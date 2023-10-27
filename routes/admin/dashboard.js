const express = require('express');

const { fetchGoogleSpeedAPIData } = require('../../controllers/admin/dashboard');

const router = express.Router();

router.get('/google-speed-api-data', fetchGoogleSpeedAPIData)

module.exports =  router;
