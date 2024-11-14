const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const checkExpiry = require('../middleware/checkExpiry');
const postController = require('../controllers/postController');
const interactionController = require('../controllers/interactionController');
const commentController = require('../controllers/commentController');
const deleteHelper = require('../helpers/deleteHelper');

// Basic get (can be queried for expired or live
router.get('/', checkExpiry, verifyToken, postController.getAllPosts);
// Gets the most interacted with post (likes and dislikes)
router.get('/top-post', checkExpiry, verifyToken, interactionController.getMostInteracted);
// Gets specific post by postId
router.get('/:postId', checkExpiry, verifyToken, postController.getSpecificPost);
// Gets posts by topic
router.get('/topic/:topic', checkExpiry, verifyToken, postController.getPostsByTopic);
// Create a post through a schema
router.post('/', checkExpiry, verifyToken, postController.addPost);
// Add interaction (like or dislike) to a post
router.post('/:postId', checkExpiry, verifyToken, interactionController.addInteraction);
// Add comment to a post
router.post('/:postId/comments', checkExpiry, verifyToken, commentController.addComment);
// Deletes a post if the user is the owner of said post
router.delete('/:postId', checkExpiry, verifyToken, postController.deleteSpecificPost);
// Deletes an interaction if the user is responsible for the interaction
router.delete('/:postId/:interactionId', checkExpiry, verifyToken, interactionController.deleteSpecificInteraction);
// Deletes a comment if the user is the owner of said comment
router.delete('/:postId/comments/:commentId', checkExpiry, verifyToken, commentController.deleteSpecificComment);
// Deletes all posts, used for testing
router.delete('/test', verifyToken, deleteHelper.deleteAllPosts)
// Deletes all users, used for testing

module.exports = router;