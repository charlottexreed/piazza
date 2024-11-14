// Change post to object so you can also use it for comments??

async function updateInteraction(res, post, existingInteraction, type) {
    try {
        // Compares the type to the type of the input in order to change the interaction
        if (existingInteraction.type !== type) {
            // Adjust counts for existing interaction change based on the changes
            if (existingInteraction.type === 'like') {
                post.like_count -= 1;
                post.dislike_count += 1;
            } else if (existingInteraction.type === 'dislike') {
                post.dislike_count -= 1;
                post.like_count += 1;
            }
            // Changes the type of interaction and saves
            existingInteraction.type = type;
            await existingInteraction.save();
        } else if (existingInteraction.type === "like"){
            throw new Error('Cannot like posts more than once');
        } else {
            throw new Error('Cannot dislike posts more than once');
        }
    } catch(err) {
        res.send({message: err});
    }
}

module.exports = {
    updateInteraction,
}