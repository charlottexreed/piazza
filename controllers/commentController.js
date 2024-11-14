const Post = require("../models/Post");
const createHelper = require('../helpers/createHelper');
const deleteHelper = require('../helpers/deleteHelper');
const addComment = async(req,res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;
        const post = await Post.findById(postId);

        // Checks if the post exists and returns 404 if not
        if (!post) {
            return res.status(404).send({ message: 'Post not found.' });
        }
        // Checks if the post is expired and stops interaction if it has
        if (post.status.includes('Expired')) {
            return res.status(400).send({ message: 'Post has expired, no longer able to interact' });
        }
        // Checks if the user is the same as the post owner and disallows posting if
        // the owner is the same
        if (String(userId) === String(post.owner)) {
            return res.status(400).send({ message: 'You cannot interact with your own post' });
        }

        // Creates the comment and then sends it back
        addedComment = await createHelper.createComment(postId, userId, req.body.comment_body);
        res.send(addedComment);

    } catch (err) {
        res.send({message: err});
    }
}

const deleteSpecificComment = async(req,res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        const commentId = req.params.commentId;
        const userId = req.params.userId;
        // If the comment does not exist, it cannot be deleted
        if(!comment) {
            return res.status(404).send({message: 'Interaction not found.'});
        }
        // If the user does not have permission to delete the comment, the comment cannot be deleted
        if(String(userId) !== String(comment.owner)) {
            return res.status(403).send({ message: 'You are not authorized to delete this comment.' });
        }
        // Deletes the interaction
        await deleteHelper.deleteComment(commentId);
        res.status(200).send({ message: "Comment deleted successfully" });
    } catch (err) {
        res.status(400).send({ message: "Error deleting comment" });
    }
}

module.exports = {
    addComment,
    deleteSpecificComment
}