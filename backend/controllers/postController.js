import Post from "../models/Post.js";

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username avatar")
      .populate("comments.user", "username avatar");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username avatar")
      .populate("comments.user", "username avatar");

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("Get single post error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Create new post
export const createPost = async (req, res) => {
  try {
    const postData = {
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,
    };

    if (req.file) {
      postData.coverImage = {
        data: req.file.buffer.toString('base64'),
        contentType: req.file.mimetype
      };
    }

    const newPost = await Post.create(postData);

    res.json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update post
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is the post author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to update this post" });
    }

    // Update fields
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    if (req.file) {
      post.coverImage = {
        data: req.file.buffer.toString('base64'),
        contentType: req.file.mimetype
      };
    }

    await post.save();

    // Populate author before sending response
    await post.populate("author", "username avatar");

    res.json(post);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is the post author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "You are not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Like/unlike post
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
    } else {
      post.likes.pull(req.user.id);
    }

    await post.save();

    // Populate author before sending response
    await post.populate("author", "username avatar");

    res.json(post);
  } catch (error) {
    console.error("Like error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add comment to post
export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (!req.body.text || !req.body.text.trim()) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    post.comments.push({
      user: req.user.id,
      text: req.body.text.trim(),
    });

    await post.save();

    // Populate author and comment users before sending response
    await post.populate("author", "username avatar");
    await post.populate("comments.user", "username avatar");

    res.json(post);
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get post image
export const getPostImage = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || !post.coverImage || !post.coverImage.data) {
      return res.status(404).json({ error: "Image not found" });
    }

    const img = Buffer.from(post.coverImage.data, 'base64');
    
    res.set('Content-Type', post.coverImage.contentType);
    res.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(img);
  } catch (error) {
    console.error("Get image error:", error);
    res.status(500).json({ error: error.message });
  }
};
