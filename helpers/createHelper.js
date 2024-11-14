const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Interaction = require("../models/Interaction");

async function createPost(res, title, topic, body, expiry_minutes, userId) {
    try {
        // Adds the expiry time in minutes as it is passed through, if it is not it defaults to 30 minutes
        const expiry_minutes = expiry_minutes || 30;
        const expiry_time = new Date(Date.now() + expiry_minutes * 60 * 1000);
        // Creates the post according to the schema
        const postData = new Post({
            title: title,
            topic: topic,
            body: body,
            expiry_time,
            owner: userId
        })
        return await postData.save();

    } catch (err) {
        res.send({message: err});
    }
}

async function createComment(res, postId, userId, commentBody) {
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
        res.send({message: err});
    }
}

async function createInteraction(res, post, postId, userId, type) {
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
        res.send({message: err});
    }
}

module.exports = {
    createPost,
    createComment,
    createInteraction
}