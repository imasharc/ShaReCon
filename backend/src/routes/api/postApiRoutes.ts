﻿const express = require("express");
const PostContoller = require('../../controllers/postController');
const router = express.Router();

router.get('/:id', PostContoller.getById);
router.get('/acc/:username', PostContoller.getByUsername);
router.get('/', PostContoller.getAllPosts);
// router.post('/', PostContoller.createNew);
router.post('/', PostContoller.createNewWithToken);
router.put('/:id', PostContoller.updateById);
router.delete('/:id', PostContoller.deleteById);

module.exports = router;