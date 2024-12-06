const User = require("../models/User");
const Post = require("../models/Post");
const deleteHelper = require("../helpers/deleteHelper");

async function getSpecificUser(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (String(userId) !== String(user._id)) {
      return res.status(403).send({
        message: "You are not authorized to view the data of this user",
      });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send({ message: "Error getting user" });
  }
}

async function deleteSpecificUser(req, res) {
  try {
    const userId = req.user._id;
    // Checks for a user if there is none, cannot delete anything
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    if (String(userId) !== req.params.userId) {
      return res
        .status(403)
        .send({ message: "You are not authorized to delete this user" });
    }
    // Deletes all the posts, interactions and comments from the user
    await deleteHelper.deleteUserContent(userId, user);
    // Deletes the actual user
    await User.findByIdAndDelete(userId);
    res.status(200).send({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: "Error deleting user" });
  }
}

module.exports = {
  getSpecificUser,
  deleteSpecificUser,
};
