const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
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

// @desc    Get single post
// @route   GET /api/posts/:id
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('comments.user', 'username');

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }
    
    // Increment view count
    if (post.incrementViewCount) {
        await post.incrementViewCount();
    }

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(404).json({ success: false, error: 'Post not found' });
  }
};

// @desc    Create new post
// @route   POST /api/posts
exports.createPost = async (req, res) => {
  try {
    // Add user to req.body (assuming auth middleware is running)
    req.body.author = req.user.id; 
    
    const post = await Post.create(req.body);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    // Check ownership
    if (post.author.toString() !== req.user.id) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
    }

    await post.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Add comment
// @route   POST /api/posts/:id/comments
exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post) return res.status(404).json({success: false, error: 'Post not found'});

        await post.addComment(req.user.id, req.body.content);
        
        res.status(201).json({ success: true, data: post.comments });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
}