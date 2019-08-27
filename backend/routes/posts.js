const express = require('express');

const postsController = require('../controllers/posts');

const checkAuth = require('../middleware/check-auth');
const extractedFile = require('../middleware/file');

const router = express.Router();

router.post('', checkAuth, extractedFile, postsController.createPost);

router.put('/:id', checkAuth, extractedFile, postsController.updatePost);

router.get('', postsController.getPosts);

router.get('/:id', postsController.getPost);

router.delete('/:id', checkAuth, postsController.deletePost);

module.exports = router;