const Post = require("../models/Post");

const getAllPosts = async(req,res)=> {
    try {
        const posts = await Post.find()
        res.send(posts)
    } catch(err){
        res.status(400).send({message:err})
    }
}

const getSpecificPost = async(req,res)=> {
    try {
        const post = await Post.findById(req.params.postId)
        res.send(post)
    } catch (err) {
        res.status(400).send({message: err})
    }
}

module.exports = {
    getAllPosts,
    getSpecificPost
};