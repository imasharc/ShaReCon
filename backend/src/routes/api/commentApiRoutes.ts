const express = require("express");
const CommentController = require('../../controllers/commentController');
const router = express.Router();

router.get('/', CommentController.getAllComments);
router.get('/:id', CommentController.getById);
router.get('/post/:id', CommentController.getByPostId);
router.get('/acc/:username', CommentController.getByUsername);
router.post('/', CommentController.createNewWithToken);
router.delete('/:id', CommentController.deleteById);

module.exports = router;