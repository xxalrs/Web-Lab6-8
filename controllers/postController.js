const Post = require('../models/Post');
const Comment = require('../models/Comment');

// CREATE
exports.createPost = async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;
    const post = await Post.create({ title, content, author, tags: tags || [] });
    res.status(201).json({ success: true, data: post, message: 'Post created successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// READ 
exports.getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const posts = await Post.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Post.countDocuments();
    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: posts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const comments = await Comment.find({ post: post._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: { post, comments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search
exports.searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Query parameter "q" is required' });
    const posts = await Post.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE
exports.updatePost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, tags, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.status(200).json({ success: true, data: post, message: 'Post updated successfully' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// LIKE
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.status(200).json({ success: true, data: post, message: 'Like added' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.status(200).json({ success: true, message: 'Post and all its comments deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};