﻿const express = require("express");
const CommentController = require('../../controllers/commentController');
const router = express.Router();

router.get('/', CommentController.getAllComments);
router.get('/post/:id', CommentController.getByPostId);
router.get('/acc/:username', CommentController.getByUsername);
router.post('/', CommentController.createNewWithToken);

// router.get('/:id', PostContoller.getById);
// router.get('/acc/:username', PostContoller.getByUsername);
// router.get('/', PostContoller.getAllPosts);
// // router.post('/', PostContoller.createNew);
// router.post('/', PostContoller.createNewWithToken);
// router.put('/:id', PostContoller.updateById);
// router.delete('/:id', PostContoller.deleteById);

module.exports = router;