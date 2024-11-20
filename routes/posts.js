const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const checkExpiry = require('../middleware/checkExpiry');
const postController = require('../controllers/postController');
const interactionController = require('../controllers/interactionController');
const commentController = require('../controllers/commentController');
//const deleteHelper = require('../helpers/deleteHelper');

// Basic get (can be queried for expired or live
router.get('/', checkExpiry, verifyToken, postController.getAllPosts);
// Gets the most interacted with post (likes and dislikes) of all posts
router.get('/top-post', checkExpiry, verifyToken, interactionController.getMostInteracted);
// Gets specific post by postId
router.get('/:postId', checkExpiry, verifyToken, postController.getSpecificPost);
// Gets posts by topic
router.get('/topic/:topic', checkExpiry, verifyToken, postController.getPostsByTopic);
// Gets the most interacted with post (likes and dislikes) by topic
router.get('/topic/:topic/top-post', checkExpiry, verifyToken, interactionController.getMostInteracted);
// Create a post through a schema
router.post('/', checkExpiry, verifyToken, postController.addPost);
// Add interaction (like or dislike) to a post
router.post('/:postId', checkExpiry, verifyToken, interactionController.addInteraction);
// Add comment to a post
router.post('/:postId/comments', checkExpiry, verifyToken, commentController.addComment);
// Gets all comments on a post
router.get('/:postId/comments', checkExpiry, verifyToken, commentController.getComments);
// Gets specific comment on a post
router.get('/:postId/comments/:commentId', checkExpiry, verifyToken, commentController.getSpecificComment);
// Deletes a post if the user is the owner of said post
router.delete('/:postId', checkExpiry, verifyToken, postController.deleteSpecificPost);
// Deletes an interaction if the user is responsible for the interaction
router.delete('/:postId/:interactionId', checkExpiry, verifyToken, interactionController.deleteSpecificInteraction);
// Deletes a comment if the user is the owner of said comment
router.delete('/:postId/comments/:commentId', checkExpiry, verifyToken, commentController.deleteSpecificComment);
// Changes the expiration time, used for a test
router.patch('/:postId', checkExpiry, verifyToken, postController.updateExpirationTime);
// Deletes all posts, used for debugging/testing
//router.delete('/test', verifyToken, deleteHelper.deleteAllPosts);

module.exports = router;