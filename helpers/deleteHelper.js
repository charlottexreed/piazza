const Post = require("../models/Post");
const Interaction = require("../models/Interaction");
const Comment = require("../models/Comment");

async function deletePost(post) {
  try {
    // Deletes all interactions and comments from the post before deleting the actual post
    if (post.comments.length > 0) {
      await Comment.deleteMany({ _id: { $in: post.comments } });
    }

    if (post.interactions.length > 0) {
      await Interaction.deleteMany({ _id: { $in: post.interactions } });
    }
    // Deletes the post itself
    await post.deleteOne();
  } catch (err) {
    throw err;
  }
}

async function deleteInteraction(post, interaction) {
  try {
    // Changes the count of likes or dislikes on the post
    const type = interaction.type;
    if (type === "like") {
      post.like_count -= 1;
    } else if (type === "dislike") {
      post.dislike_count -= 1;
    }
    await post.save();
    // Deletes the interaction
    await Interaction.deleteOne({ _id: interaction._id });
  } catch (err) {
    throw err;
  }
}

async function deleteComment(commentId) {
  try {
    // Deletes the comment
    await Comment.deleteOne({ _id: commentId });
  } catch (err) {
    throw err;
  }
}

async function deleteUserContent(userId) {
  try {
    // Find all posts made by the user
    const userPosts = await Post.find({ user: userId });
    // Delete all associated interactions and comments for each post
    for (const userPost of userPosts) {
      // Uses the existing deletePost function to handle the deletion of all the posts
      await deletePost(userPost);
    }
    // Deletes interactions and comments that are attached to other people's posts
    await Comment.deleteMany({ user: userId });
    await Interaction.deleteMany({ user: userId });
  } catch (err) {
    throw err;
  }
}

// Used for debugging and testing only, deletes all posts
// async function deleteAllPosts(res) {
//     try {
//         const posts = await Post.find();
//         // Goes through each post and deletes the comments and interactions associated with each of them
//         for(const post of posts) {
//             if(post.interactions.length > 0) {
//                 await Interaction.deleteMany({ _id: { $in: post.interactions } });
//             }
//             if(post.comments.length > 0) {
//                 await Comment.deleteMany({ _id: { $in: post.comments } });
//             }
//         }
//         // Deletes the posts themselves
//         await Post.deleteMany({});
//         res.status(200).send({ message: "All posts deleted successfully" });
//     } catch(err) {
//         res.status(500).send({ message: "Error deleting all posts" });
//     }
// }

module.exports = {
  deletePost,
  deleteInteraction,
  deleteComment,
  deleteUserContent,
  //deleteAllPosts
};
