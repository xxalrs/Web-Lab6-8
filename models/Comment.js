const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: [true, "Post ID is required"]
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true
  },
  content: {
    type: String,
    required: [true, "Comment content is required"],
    maxlength: [1000, 'Comment is too long (max 1000 characters)']
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);