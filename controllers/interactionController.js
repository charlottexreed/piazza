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
            return res.status(404).send({message: 'Post not found.'});
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
            await updateHelper.updateInteraction(post, existingInteraction, type);
            res.status(200).send({ message: 'Interaction updated successfully.' });
        } else {
            // If there is no existing interaction a new interaction is created
            addedInteraction = await createHelper.createInteraction(post, postId, userId, type)
            res.status(201).send({ message: 'Interaction recorded successfully.' });
        }
    } catch (err) {
        res.status(400).send({message:err})
    }
}
const getMostInteracted = async (req,res) => {
    try {
        // Fetch all posts from the database
        const posts = await Post.find();

        // This checks all the posts against one another to see which has the most
        // interactions by comparing the length of the interactions array I added
        // onto the Post schema
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
}

const deleteSpecificInteraction = async(req,res) => {
    try {
        const interaction = await Interaction.findById(req.params.interactionId);
        const interactionId = req.params.interactionId;
        const userId = req.params.userId;
        // If the interaction does not exist, it cannot be deleted
        if(!interaction) {
            return res.status(404).send({message: 'Interaction not found.'});
        }
        // If the user does not have permission to delete the interaction, the interaction cannot be deleted
        if(String(userId) !== String(interaction.user)) {
            return res.status(403).send({ message: 'You are not authorized to delete this interaction.' });
        }
        // Deletes the interaction
        await deleteHelper.deleteInteraction(req, interactionId);
        res.status(201).send({ message: "Interaction deleted successfully" });
    } catch (err) {
        res.status(400).send({ message: "Error deleting interaction" });
    }
}

module.exports = {
    addInteraction,
    getMostInteracted,
    deleteSpecificInteraction
}