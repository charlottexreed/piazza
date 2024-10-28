const Post = require("../models/Post");

const getPosts = async (req, res) => {
    try {
        // The filter is used to filter the find function and left blank if no other params or
        // queries are present
        let filter = {};

        // If the url has the topic name in it, it will filter by that name
        if (req.params.topic) {
            // Needs to be made lowercase as the names in MongoDB start with an uppercase
            const topic = req.params.topic[0].toUpperCase() + req.params.topic.slice(1).toLowerCase(); // Capitalize topic
            filter.topic = { $in: [topic] }; // Update filter for topic
        }

        // Checks for the query as to whether expired or live
        if (req.query.expired === 'true') {
            filter.status = 'Expired';
        } else if (req.query.expired === 'false') {
            filter.status = 'Live';
        }

        const posts = await Post.find(filter);
        res.send(posts);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
};

const getSpecificPost = async(req,res)=> {
    try {
        const post = await Post.findById(req.params.postId)
        res.send(post)
    } catch (err) {
        res.status(400).send({message: err})
    }
}

module.exports = {
    getPosts,
    getSpecificPost,
}