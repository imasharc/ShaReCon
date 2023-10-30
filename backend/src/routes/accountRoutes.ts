﻿const express = require("express");
const AccountController = require('../controllers/accountController');
const router = express.Router();

router.get('/user/:username', AccountController.getByUsername);
router.get('/users', AccountController.getAllAccounts);

module.exports = router;