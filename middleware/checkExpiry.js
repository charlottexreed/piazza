const Post = require('../models/Post');

// Checks all Live posts that have expired and changes it to expired status if
// it hasn't Should be done before all calls as it is relevant to certain
// interactions and therefore important to know
const checkExpiry = async (req, res, next) => {
    try {
        const livePosts = await Post.find({ status: 'Live' });
        const expiredPosts = livePosts.filter(post => post.expiry_time <= new Date());

        // If there are expired posts marked 'Live' they get updated to 'Expired'
        if (expiredPosts.length > 0) {
            await Post.updateMany({ _id: { $in: expiredPosts.map(post => post._id) } },
                { $set: { status: 'Expired' } }
            );
        }

        next();
    } catch (err) {
        res.status(500).send({ message: 'Error checking post expirations.' });
    }
}

module.exports = checkExpiry;