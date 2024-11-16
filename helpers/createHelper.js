const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Interaction = require("../models/Interaction");

async function createPost(title, topic, body, expiry_time, expiry_minutes, userId) {
    try {
        // Creates the post according to the schema
        const postData = new Post({
            title: title,
            topic: topic,
            body: body,
            expiry_time,
            status: expiry_minutes === -1 ? 'Expired' : 'Live',
            user: userId
        })
        return await postData.save();

    } catch (err) {
        throw new Error(err.message);
    }
}

async function createComment(postId, userId, commentBody) {
    try {
        // Creates the comment according to the schema
        const newComment = new Comment({
            post: postId,
            user: userId,
            comment_body: commentBody
        });
        const savedComment = await newComment.save();
        // Adds the comment object to the post object so
        // you can track the likes and dislikes attached to
        // a specific post
        const post = await Post.findById(postId);
        post.comments.push(savedComment._id);
        await post.save();

        return savedComment
    } catch(err) {
        throw new Error(err.message);
    }
}

async function createInteraction(post, postId, userId, type) {
    try {
        // If there is no existing interaction a new interaction is created
        const newInteraction = new Interaction({
            post: postId,
            user: userId,
            type: type,
        });
        const savedInteraction = await newInteraction.save();

        // Adds the interaction object to the post object so
        // you can track the likes and dislikes attached to
        // a specific post
        post.interactions.push(savedInteraction._id);

        if (type === 'like') {
            post.like_count += 1;
        } else if (type === 'dislike') {
            post.dislike_count += 1;
        }

        await post.save();
    } catch(err) {
        throw new Error(err.message);
    }
}

module.exports = {
    createPost,
    createComment,
    createInteraction
}