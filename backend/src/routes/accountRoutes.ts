const express = require("express");
const AccountController = require('../controllers/accountController');
const router = express.Router();

router.get('/:username', AccountController.getByUsername);
router.get('/', AccountController.getAllAccounts);

module.exports = router;