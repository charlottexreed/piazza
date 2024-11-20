const Post = require("../models/Post");
const createHelper = require("../helpers/createHelper");
const deleteHelper = require("../helpers/deleteHelper");

const addPost = async(req,res) => {
    try {
        // Makes sure the title is valid
        const title = req.body.title;
        if (!title || typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 70) {
            return res.status(400)
                .send({ message: 'Invalid title, must be a string and contain between 3 and 70 characters.' });
        }
        // Checks if there is a topic
        const topic = req.body.topic;
        if (!topic) {
            return res.status(400).send({ message: 'No topic.' });
        }
        // Basic checks on the body and its length
        const body = req.body.body;
        if (!body || typeof body !== 'string' || body.trim().length < 6 || body.trim().length > 1024) {
            return res.status(400).send({ message: 'Invalid body, it must be a string between 6 and 1024 characters.' });
        }

        // Adds the expiry time in minutes as it is passed through, if it is not it defaults to 30 minutes
        const expiry_minutes = req.body.expiry_minutes || 30;
        const expiry_time = new Date(Date.now() + expiry_minutes * 60 * 1000);

        // Creates the post and returns it
        const postToSave = await createHelper.createPost(req.body.title, req.body.topic,
            req.body.body, expiry_time, expiry_minutes, req.user._id);
        res.status(201).send(postToSave);
    } catch (err) {
        res.status(400).send({ message: err });
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
        res.status(200).send(posts);
    } catch (err) {
        res.status(400).send({ message: err });
    }
};

const getAllPosts = async (req,res) => {
    try {
        await getPosts(req,res);
    } catch (err) {
        res.status(400).send({ message: err });
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
        res.status(400).send({ message: err });
    }
}

const getSpecificPost = async(req,res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.send(post);
    } catch (err) {
        res.status(400).send({ message: err });
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
        if(String(userId) !== String(post.user)) {
            return res.status(403).send({ message: 'You are not authorized to delete this post.' });
        }
        // Deletes the post
        await deleteHelper.deletePost(post);
        res.status(200).send({ message: "Post deleted successfully" });
    } catch (err) {
        res.status(400).send({ message: "Error deleting post" });
    }
}

// Used for a test
const updateExpirationTime = async(req,res) => {
    try {
        const postId = req.params.postId;
        const { expiry_minutes } = req.body;
        const post = await Post.findById(postId);
        if(!post) {
            return res.status(404).send({ message: "Post not found" });
        }
        if(!expiry_minutes && expiry_minutes !== -1) {
            return res.status(400).send({ message: "New expiration time is required" });
        }
        // If the user is not the creator of the post they cannot update it
        const userId = req.user._id;
        if(!post.user.equals(userId)) {
            return res.status(403).send({ message: 'You are not authorized to update the post expiry.' });
        }
        const expiry_time = new Date(Date.now() + expiry_minutes * 60 * 1000);
        // Updates the expiration time to the new one
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                expiration_minutes: expiry_minutes,
                expiration_time: expiry_time,
                status: expiry_minutes === -1 ? 'Expired' : 'Live'
            },
            { new: true }
        );
        if (!updatedPost) {
            return res.status(400).send({ message: "Error updating expiration time" });
        }
        res.status(200).send(updatedPost);
    } catch (err) {
        res.status(400).send({ message: "Error updating post"});
    }
}


module.exports = {
    addPost,
    getPosts,
    getSpecificPost,
    getPostsByTopic,
    getAllPosts,
    deleteSpecificPost,
    updateExpirationTime
}