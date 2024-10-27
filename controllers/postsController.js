const postsCreate = require('./postsCreate');
const postsRead = require('./postsRead');

module.exports = {
    getAllPosts: postsRead.getAllPosts,
    getSpecificPost: postsRead.getSpecificPost,
    createPost: postsCreate.createPost,
    addInteraction: postsCreate.addInteraction,
    getPostsByTopic: postsRead.getPostsByTopic
};