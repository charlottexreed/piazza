const postsCreate = require('./postsCreate');
const postsRead = require('./postsRead');

module.exports = {
    getPosts: postsRead.getPosts,
    getSpecificPost: postsRead.getSpecificPost,
    createPost: postsCreate.createPost,
    addInteraction: postsCreate.addInteraction,
};