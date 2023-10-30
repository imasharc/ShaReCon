﻿const express = require("express");
const AccountController = require('../controllers/accountController');
const router = express.Router();

router.get('/user/:username', AccountController.getByUsername);

module.exports = router;