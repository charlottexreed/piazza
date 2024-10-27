const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const Interaction = require('../models/Interaction')
const verifyToken = require('../verifyToken')
const postController = require('../controllers/postsController');

// Basic get
router.get('/', verifyToken, postController.getAllPosts)
// Gets specific post by postId
router.get('/:postId', verifyToken, postController.getSpecificPost)
router.get('/topic/:topic', verifyToken, postController.getPostsByTopic)
// Create a post through a schema
router.post('/', verifyToken, postController.createPost)
// Add interaction (like or dislike) to a post
router.post('/:postId/interaction', verifyToken, postController.addInteraction)


module.exports = router