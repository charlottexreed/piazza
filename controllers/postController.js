const Post = require("../models/Post");

const createPost = async(req,res) => {

    // Adds the expiry time in minutes as it is passed through, if it is not it defaults to 30 minutes
    const expiry_minutes = req.body.expiry_minutes || 30
    const expiry_time = new Date(Date.now() + expiry_minutes * 60 * 1000);

    const postData = new Post({
        title: req.body.title,
        topic: req.body.topic,
        body: req.body.body,
        expiry_time,
        owner: req.user._id
    })

    try {
        const postToSave = await postData.save()
        res.send(postToSave)
    } catch (err) {
        res.send({message: err})
    }
}

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


module.exports = {
    createPost,
    getPosts,
    getSpecificPost,
    getPostsByTopic,
    getAllPosts
}