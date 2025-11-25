import express from "express";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import * as postController from "../controllers/postController.js";

const router = express.Router();

// Public routes
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.get("/:id/image", postController.getPostImage);

// Protected routes
router.post("/", auth, upload.single("image"), postController.createPost);
router.put("/:id", auth, upload.single("image"), postController.updatePost);
router.delete("/:id", auth, postController.deletePost);
router.patch("/:id/like", auth, postController.toggleLike);
router.post("/:id/comment", auth, postController.addComment);

export default router;