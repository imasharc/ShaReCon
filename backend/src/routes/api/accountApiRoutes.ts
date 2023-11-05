const express = require("express");
const AccountController = require('../../controllers/accountController');
const router = express.Router();

router.get('/:username', AccountController.getByUsername);
router.get('/isValid/:token', AccountController.getByToken);
router.get('/', AccountController.getAllAccounts);
router.post('/', AccountController.createNew);
router.put('/:username', AccountController.updateByUsername);
router.delete('/:username', AccountController.deleteByUsernameAndPassword);

module.exports = router;