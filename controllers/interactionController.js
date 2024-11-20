const Post = require("../models/Post");
const Interaction = require("../models/Interaction");
const createHelper = require("../helpers/createHelper");
const updateHelper = require("../helpers/updateHelper");
const deleteHelper = require("../helpers/deleteHelper");
const addInteraction = async (req,res) => {
    try {
        const type = req.body.type;
        const postId = req.params.postId;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        // Checks if the post exists and returns 404 if not
        if (!post) {
            return res.status(404).send({ message: 'Post not found.' });
        }
        // Checks if the user is the same as the post owner and disallows posting if
        // the owner is the same
        if (String(userId) === String(post.user)) {
            return res.status(400).send({ message: 'You cannot interact with your own post' });
        }
        // Checks if the post is expired and stops interaction if it has
        if (post.status.includes('Expired')) {
            return res.status(403).send({ message: 'Post has expired, no longer able to interact' });
        }
        // Checks if the input is actually one of the types of interactions implemented
        if (!['like', 'dislike'].includes(type)) {
            return res.status(400).send({ message: 'Invalid interaction type' });
        }

        // Finds if there is an existing interaction e.g. an interaction
        // with the same post and same user in the schema
        const existingInteraction = await Interaction.findOne({ post: postId, user: userId });
        if (existingInteraction) {
            // If there is an existing interaction, checks if the new interaction
            // was not of the same type as the existing interaction, if it is
            // different it updates the old interaction to reflect the new choice
            const updatedInteraction = await updateHelper.updateInteraction(post, existingInteraction, type);
            res.status(200).send({ message: 'Interaction recorded successfully.', interaction: updatedInteraction });
        } else {
            // If there is no existing interaction a new interaction is created
            const addedInteraction = await createHelper.createInteraction(post, postId, userId, type)
            res.status(201).send({ message: 'Interaction recorded successfully.', interaction: addedInteraction });
        }
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}
const getMostInteracted = async (req,res) => {
    try {
        // Filters for live posts
        let filter = { status: 'Live' };
        // If topic parameter exists filter for that too
        if (req.params.topic) {
            let topic = req.params.topic[0].toUpperCase() + req.params.topic.slice(1).toLowerCase();
            filter.topic = topic;  // Only add topic filter if topic is provided
        }
        const posts = await Post.find(filter);
        // This checks all the posts against one another to see which has the most
        // interactions by comparing the length of the interactions array I added
        // onto the Post schema
        let mostInteractedPost = null;
        let maxInteractions = 0;
        for (let i = 0; i < posts.length; i++) {
            const interactionCount = posts[i].interactions.length;
            if (interactionCount > maxInteractions) {
                maxInteractions = interactionCount;
                mostInteractedPost = posts[i];
            }
        }
        // If none then you know there is no posts
        if (!mostInteractedPost) {
            return res.status(404).send({ message: 'No posts found.' });
        }
        res.send(mostInteractedPost);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
}

const deleteSpecificInteraction = async(req,res) => {
    try {
        const interactionId = req.params.interactionId;
        const interaction = await Interaction.findById(interactionId);
        const userId = req.user._id;
        const post = await Post.findById(req.params.postId);
        // If the interaction does not exist, it cannot be deleted
        if(!post) {
            return res.status(404).send({message: 'Post not found.'});
        }
        if(!interaction) {
            return res.status(404).send({message: 'Interaction not found.'});
        }
        // If the user does not have permission to delete the interaction, the interaction cannot be deleted
        if(String(userId) !== String(interaction.user)) {
            return res.status(403).send({ message: 'You are not authorized to delete this interaction.' });
        }
        // Deletes the interaction
        await deleteHelper.deleteInteraction(post, interaction);
        res.status(200).send({ message: "Interaction deleted successfully" });
    } catch (err) {
        res.status(400).send({ message: "Error deleting interaction" });
    }
}

module.exports = {
    addInteraction,
    getMostInteracted,
    deleteSpecificInteraction
}