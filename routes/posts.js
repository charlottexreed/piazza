const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')
const checkExpiry = require('../middleware/checkExpiry')
const postController = require('../controllers/postsController');

// Basic get (can be queried for expired or live
router.get('/', checkExpiry, verifyToken, postController.getPosts)

// Gets specific post by postId
router.get('/:postId', checkExpiry, verifyToken, postController.getSpecificPost)
// Gets posts by topic
router.get('/topic/:topic', checkExpiry, verifyToken, postController.getPosts)
// Create a post through a schema
router.post('/', checkExpiry, verifyToken, postController.createPost)
// Add interaction (like or dislike) to a post
router.post('/:postId/interaction', checkExpiry, verifyToken, postController.addInteraction)


module.exports = router