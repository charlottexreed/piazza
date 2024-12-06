const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: 3,
    max: 70,
  },
  topic: {
    type: [String],
    enum: ["Politics", "Health", "Sport", "Tech"], // Array of strings that is then restricted
    required: true,
  },
  body: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  upload_time: {
    type: Date,
    default: Date.now,
  },
  expiry_minutes: {
    type: Number,
    default: 30,
  },
  expiry_time: {
    type: Date,
    default: () => Date.now(),
    required: true,
  },
  status: {
    type: [String],
    enum: ["Live", "Expired"],
    default: "Live",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  interactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interaction",
    },
  ],
  like_count: {
    type: Number,
    default: 0,
  },
  dislike_count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("post", postSchema);
