const Post = require("../models/Post");
const Interaction = require("../models/Interaction");

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

const addInteraction = async (req,res) => {
    const type = req.body.type;
    const postId = req.params.postId;
    const userId = req.user._id;
    const post = await Post.findById(postId);

    try {
        // Checks if the post exists and returns 404 if not
        if (!post) {
            return res.status(404).send({ message: 'Post not found.' });
        }

        // Checks if the user is the same as the post owner and disallows posting if
        // the owner is the same
        if (String(userId) === String(post.owner)) {
            return res.status(400).send({ message: 'You cannot interact with your own post' });
        }

        // Checks if the post is expired and stops interaction if it has
        if (post.status.includes('Expired')) {
            return res.status(400).send({ message: 'Post has expired, no longer able to interact' });
        }

        // Checks if the input is actually one of the types of interactions implemented
        if (!['like', 'dislike'].includes(type)) {
            return res.status(400).send({ message: 'Invalid interaction type' });
        }

        // Finds if there is an existing interaction e.g. an interaction
        // ith the same post and same user in the schema
        const existingInteraction = await Interaction.findOne({ post: postId, user: userId });
        if (existingInteraction) {
            // Checks if the new interaction was not of the same type as the
            // existing interaction, if it is different it updates
            // the old interaction to reflect the new choice
            if (existingInteraction.type !== type) {
                // Adjust counts for existing interaction change
                if (existingInteraction.type === 'like') {
                    post.like_count -= 1;
                    post.dislike_count += 1;
                } else if (existingInteraction.type === 'dislike') {
                    post.dislike_count -= 1;
                    post.like_count += 1;
                }
                existingInteraction.type = type;
                await existingInteraction.save();
            } else {
                return res.status(400).send({message: 'Interaction already recorded'})
            }
        } else {
            // If there is no existing interaction a new interaction is created
            console.log(userId)
            const newInteraction = new Interaction({
                post: postId,
                user: userId,
                type: type,
            });
            const savedInteraction = await newInteraction.save();

            // Adds the interaction object to the post object so
            // you can track the likes and dislikes attached to
            // a specific post
            post.interactions.push(savedInteraction._id);
            await post.save();
        }
        res.status(201).send({ message: 'Interaction recorded successfully.' });
    } catch (err) {
        res.send({message:err})
    }
}

module.exports = {
    createPost,
    addInteraction
}