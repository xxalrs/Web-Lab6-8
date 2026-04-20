const Comment = require('../models/Comment');
const Post = require('../models/Post');
const ApiError = require('../errors/ApiError');
const asyncHandler = require('../middlewares/asyncHandler');

// CREATE
exports.createComment = asyncHandler(async (req, res) => {
  const { postId, author, content } = req.body;
  const postExists = await Post.findById(postId);
  if (!postExists) throw ApiError.notFound('Post not found');
  const comment = await Comment.create({ post: postId, author, content });
  res.status(201).json({ success: true, data: comment, message: 'Comment added successfully' });
});

// READ
exports.getCommentsByPost = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId })
    .sort({ createdAt: -1 })
    .populate('post', 'title');
  res.status(200).json({ success: true, count: comments.length, data: comments });
});

// UPDATE
exports.updateComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findByIdAndUpdate(
    req.params.id,
    { content },
    { new: true, runValidators: true }
  );
  if (!comment) throw ApiError.notFound('Comment not found');
  res.status(200).json({ success: true, data: comment, message: 'Comment updated successfully' });
});

// DELETE
exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw ApiError.notFound('Comment not found');
  await comment.deleteOne();
  res.status(200).json({ success: true, message: 'Comment deleted successfully' });
});