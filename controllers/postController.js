const Post = require("../models/Post");
const createHelper = require("../helpers/createHelper");
const deleteHelper = require("../helpers/deleteHelper");

const addPost = async(req,res) => {
    try {
        // Adds the expiry time in minutes as it is passed through, if it is not it defaults to 30 minutes
        const expiry_minutes = req.body.expiry_minutes || 30;
        const expiry_time = new Date(Date.now() + expiry_minutes * 60 * 1000);

        // Creates the post and returns it
        const postToSave = await createHelper.createPost(req.body.title, req.body.topic,
            req.body.body, expiry_time, req.user._id);
        res.send(postToSave);
    } catch (err) {
        res.status(400).send({message: err});
    }
}

const getPosts = async (req,res, filter = {}) => { // Filter is nothing by default so it will get everything
    try {
        // Checks for the query as to whether expired or live
        if (req.query.expired === 'true') {
            filter.status = 'Expired';
        } else if (req.query.expired === 'false') {
            filter.status = 'Live';
        }
        // Finds the post(s) with whatever filter was sent and returns it
        const posts = await Post.find(filter);
        res.send(posts);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

const getAllPosts = async (req,res) => {
    try {
        await getPosts(req,res);
    } catch (err) {
        res.status(400).send({message: err});
    }
}


const getPostsByTopic = async(req,res)=> {
    try {
        // Changes the topic it gets from the url to have an uppercase
        // letter for the first letter as the first letter in MongoDB
        // is capitalised
        const topic = req.params.topic[0].toUpperCase()
            + req.params.topic.slice(1).toLowerCase();
        //Sends the filter to getPosts
        await getPosts(req,res, { topic: { $in: [topic] } });
    } catch (err) {
        res.status(400).send({message: err});
    }
}

const getSpecificPost = async(req,res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.send(post);
    } catch (err) {
        res.status(400).send({message: err});
    }
}

const deleteSpecificPost = async(req,res) => {
    try {
        const post = await Post.findById(req.params.postId);
        const userId = req.user._id;
        // If the post does not exist, it cannot be deleted
        if(!post) {
            return res.status(404).send({message: 'Post not found.'});
        }
        // If the user does not have permission to delete the post, the post cannot be deleted
        if(!post.owner.equals(userId)) {
            return res.status(403).send({ message: 'You are not authorized to delete this post.' });
        }
        // Deletes the post
        await deleteHelper.deletePost(post);
        res.status(200).send({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(400).send({ message: "Error deleting post" });
    }
}


module.exports = {
    addPost,
    getPosts,
    getSpecificPost,
    getPostsByTopic,
    getAllPosts,
    deleteSpecificPost
}