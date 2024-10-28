const Post = require("../models/Post");

const getPosts = async (req,res, filter = {}) => { // Filter is nothing by default to it will get everything
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
        await getPosts(req,res)
    } catch (err) {
        res.status(400).send({message: err})
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
        await getPosts(req,res, { topic: { $in: [topic] } })
    } catch (err) {
        res.status(400).send({message: err})
    }
}

const getSpecificPost = async(req,res) => {
    try {
        const post = await Post.findById(req.params.postId)
        res.send(post)
    } catch (err) {
        res.status(400).send({message: err})
    }
}

const getMostInteracted = async (req,res) => {
    try {
        // Fetch all posts from the database
        const posts = await Post.find()

        // This checks all the posts against one another to see which has the most
        // interactions by comparing the length of the interactions array I added
        // onto the schema
        let mostInteractedPost = null;
        let maxInteractions = 0;
        posts.forEach(post => {
            const interactionCount = post.interactions.length;
            if (interactionCount > maxInteractions) {
                maxInteractions = interactionCount;
                mostInteractedPost = post;
            }
        });

        // If none then you know there is no posts
        if (!mostInteractedPost) {
            return res.status(404).send({ message: 'No posts found.' });
        }

        res.send(mostInteractedPost);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};


module.exports = {
    getPosts,
    getSpecificPost,
    getMostInteracted,
    getPostsByTopic,
    getAllPosts
}