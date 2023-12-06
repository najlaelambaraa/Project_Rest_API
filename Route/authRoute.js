const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
router.post('/auth',authController.autu);
module.exports = router;