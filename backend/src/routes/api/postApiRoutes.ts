const express = require("express");
const PostContoller = require('../../controllers/postController');
const router = express.Router();

router.get('/:id', PostContoller.getById);
router.get('/', PostContoller.getAllPosts);
router.post('/', PostContoller.createNew);
router.put('/:id', PostContoller.updateById);
router.delete('/:id', PostContoller.deleteById);

module.exports = router;