const postsCreate = require('./postsCreate');
const postsRead = require('./postsRead');

module.exports = {
    getPosts: postsRead.getPosts,
    getSpecificPost: postsRead.getSpecificPost,
    createPost: postsCreate.createPost,
    addInteraction: postsCreate.addInteraction,
    getMostInteracted: postsRead.getMostInteracted,
    getPostsByTopic: postsRead.getPostsByTopic,
    addComment: postsCreate.addComment,
    getAllPosts: postsRead.getAllPosts
};