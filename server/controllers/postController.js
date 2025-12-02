const Post = require('../models/Post');

// 1. Get All Posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 })
      .populate('author', 'username')
      .populate('category', 'name');
    res.status(200).json({ success: true, count: posts.length, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// 2. Get Single Post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.user', 'username');

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(404).json({ success: false, error: 'Post not found' });
  }
};

// 3. Create Post
exports.createPost = async (req, res) => {
  try {
    // If no user is attached (e.g. auth disabled), use a placeholder or fail
    if (!req.user) {
        return res.status(401).json({ success: false, error: 'User not authenticated' });
    }
    req.body.author = req.user.id;
    const post = await Post.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// 4. Update Post
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// 5. Delete Post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) await post.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// 6. Add Comment
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
    
    // Check if addComment method exists on model, else manual push
    if (post.addComment) {
        await post.addComment(req.user.id, req.body.content);
    } else {
        post.comments.push({ user: req.user.id, content: req.body.content });
        await post.save();
    }
    res.status(201).json({ success: true, data: post.comments });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};