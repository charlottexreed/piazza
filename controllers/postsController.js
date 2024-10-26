const createPost = require('./postsCreate');
const postsRead = require('./postsRead');

module.exports = {
    getAllPosts: postsRead.getAllPosts,
    getSpecificPost: postsRead.getSpecificPost
};