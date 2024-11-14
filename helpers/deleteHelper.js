const Post = require("../models/Post");
const Interaction = require("../models/Interaction");
const Comment = require("../models/Comment");

async function deletePost(post) {
    try {
        console.log("hi");
        // Deletes all interactions and comments from the post before deleting the actual post
        if (post.comments.length > 0) {
            await Comment.deleteMany({ _id: { $in: post.comments } });
        }

        if (post.interactions.length > 0) {
            await Interaction.deleteMany({ _id: { $in: post.interactions } });
        }

        // Deletes the post itself
        await post.deleteOne();

    } catch(err) {
        throw new Error(err.message);
    }
}

async function deleteInteraction(req, interactionId) {
    try {
        // Changes the count of likes or dislikes on the post
        const type = req.body.type;
        const post = await Post.findById(req.params.postId);
        if (type === 'like') {
            post.like_count -= 1;
        } else if (type === 'dislike') {
            post.dislike_count -= 1;
        }
        // Deletes the interaction
        await Interaction.deleteOne({ _id: interactionId });
    } catch(err) {
        throw new Error(err.message);
    }
}

async function deleteComment(commentId) {
    try {
        // Deletes the comment
        await Comment.deleteOne({ _id: commentId });
    } catch(err) {
        throw new Error(err.message);
    }
}



// Used for debugging and testing only, deletes all posts
async function deleteAllPosts(res) {
    try {
        const posts = await Post.find();
        // Goes through each post and deletes the comments and interactions associated with each of them
        for(const post of posts) {
            if(post.interactions.length > 0) {
                await Interaction.deleteMany({ _id: { $in: post.interactions } });
            }
            if(post.comments.length > 0) {
                await Comment.deleteMany({ _id: { $in: post.comments } });
            }
        }
        // Deletes the posts themselves
        await Post.deleteMany({});
        res.status(200).send({ message: "All posts deleted successfully" });
    } catch(err) {
        res.status(500).send({ message: "Error deleting all posts" });
    }
}
async function deleteUserContent(userId) {
    try {

        // Find all posts made by the user
        const posts = await Post.find({ owner: userId });
        // Delete all associated interactions and comments for each post
        for (const post of posts) {
            // Uses the existing deletePost function to handle the deletion of all the posts
            await deletePost(post);
        }
        // Deletes interactions and comments that are attached to other people's posts
        await Comment.deleteMany({ user: userId });
        await Interaction.deleteMany({ user: userId });
    } catch (err) {
        throw new Error(err.message);
    }
}

module.exports = {
    deletePost,
    deleteInteraction,
    deleteComment,
    deleteAllPosts,
    deleteUserContent
}