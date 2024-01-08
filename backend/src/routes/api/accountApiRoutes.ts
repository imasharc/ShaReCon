const express = require("express");
const AccountController = require('../../controllers/accountController');
const multer = require('multer');
const upload = require('../../utils/multerConfig');
const router = express.Router();

router.get('/:username', AccountController.getByUsername);
router.get('/isValid/:token', AccountController.getByToken);
router.get('/', AccountController.getAllAccounts);
router.post('/', AccountController.createNew);
router.put('/:username', AccountController.updateByUsername);
router.delete('/:username', AccountController.deleteByUsernameAndPassword);

router.post('/uploadPfp/:username', upload.single("profile_picture"), AccountController.uploadImage);

module.exports = router;