const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const {
  registerValidation,
  loginValidation,
} = require("../validations/validation");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const userController = require("../controllers/userController");

// How the user can send their registration details and have it register them
// assuming the details are valid, this code and the login code from labs largely
// with additional fields added
router.post("/register", async (req, res) => {
  // Code from labs largely with additional fields added
  // Validation to check user input against the requirements
  const { err } = registerValidation(req.body);
  if (err) {
    return res.status(400).send({ message: err });
  }
  // Validation to check if the user exists
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    return res.status(400).send({ message: "User already exists" });
  }
  // Created a hashed representation of the password
  const salt = await bcryptjs.genSalt(5);
  const hashedPassword = await bcryptjs.hash(req.body.password, salt);
  // Code to insert data
  const user = new User({
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send({ message: err });
  }
});
// Logs the user in provided they post the details and they are correct
router.post("/login", async (req, res) => {
  // Validation to check user input against the requirements
  const { err } = loginValidation(req.body);
  if (err) {
    return res.status(400).send({ message: err });
  }
  // Validation to check if the user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send({ message: "User does not exist" });
  }
  // Validation to check if the password is correct
  const passwordValidation = await bcryptjs.compare(
    req.body.password,
    user.password,
  );
  if (!passwordValidation) {
    return res.status(400).send({ message: "Password is incorrect" });
  }
  //Generate auth token
  const token = jsonwebtoken.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send({ "auth-token": token });
});

// Gets the
router.get("/:username", verifyToken, userController.getSpecificUser);
// Deletes users and all the comments, posts and interactions they have made
router.delete("/:userId", verifyToken, userController.deleteSpecificUser);

module.exports = router;
