const express = require("express");
const AccountController = require('../controllers/accountController');
const router = express.Router();

router.get('/:username', AccountController.getByUsername);
router.get('/', AccountController.getAllAccounts);
router.put('/:username', AccountController.updateByUsername);

module.exports = router;