import express from "express";
import Post from "../models/Post.js";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//Create post
router.post("/", auth, upload.single("coverImage"), async (req, res) => {
    try {
        const newPost = await Post.create({
            title: req.body.title,
            content: req.body.content,
            author: req.body.user,
            coverImage: req.file ? req.file.path : null
        });

        res.json(newPost);

    } catch (error) {
        res.status(500).json({ error: err.message });
    }
});

//Get all post
router.get("/", async (req, res) => {
    const posts = await Post.find().populate("author", "username avatar");
    res.json(posts);
});

//Get single post
router.get("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id).populate("author", "isername avatar");
    res.json(post);
});

//Like
router.patch("/:id/like", auth, async (req, res) => {
    const post = await Post.findById( req.params.id);

    if(!post.likes.includes(req.user)){
        post.likes.push(req.user);
    }else{
        post.likes.pull(req.user);
    }

    await post.save();
    res.json(post);
});

//comment
router.post("/:id/comment", auth, async ( req, res) => {
    const post = await Post.findById(req.params.id);
    post.comments.push({ user: req.user, text: req.body.text});
    await post.save();
    res.json(post);
});

export default router;