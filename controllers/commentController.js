const Post = require("../models/Post");
const Comment = require("../models/Comment");
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

        const newComment = new Comment({
            post: postId,
            user: userId,
            comment_body: req.body.comment_body
        });
        const savedComment = await newComment.save();

        // Adds the comment object to the post object so
        // you can track the likes and dislikes attached to
        // a specific post
        post.comments.push(savedComment._id);
        await post.save()

        res.send(savedComment);

    } catch (err) {
        res.send({message: err})
    }
}

module.exports = {
    addComment
}