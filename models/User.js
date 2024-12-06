const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 256,
  },
  first_name: {
    type: String,
    required: true,
    min: 1,
    max: 256,
  },
  last_name: {
    type: String,
    required: true,
    min: 1,
    max: 256,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 256,
  },
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

module.exports = mongoose.model("users", userSchema);
