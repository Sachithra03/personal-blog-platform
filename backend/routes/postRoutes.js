import express from "express";
import Post from "../models/Post.js";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Create post
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const newPost = await Post.create({
      title: req.body.title,
      content: req.body.content,
      author: req.user.id,        
      coverImage: req.file ? req.file.path : null
    });

    res.json(newPost);

  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    // return newest posts first
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("author", "username avatar")
      .populate("comments.user", "username avatar");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "username avatar");
  res.json(post);
});

// Like post
router.patch("/:id/like", auth, async (req, res) => {
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
});

// Comment on post
router.post("/:id/comment", auth, async (req, res) => {
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
      text: req.body.text.trim() 
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
});

// Delete post
router.delete("/:id", auth, async (req, res) => {
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
});

export default router;