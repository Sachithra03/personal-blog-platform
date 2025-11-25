import express from "express";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { 
    register, 
    login, 
    getUserByUsername,
    updateProfile,
    deleteAvatar,
    getUserAvatar 
} from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile/:username", getUserByUsername);

// Protected routes
router.patch("/profile", auth, upload.single("avatar"), updateProfile);
router.delete("/profile/avatar", auth, deleteAvatar);
router.get("/avatar/:userId", getUserAvatar);
router.post("/logout", auth, (req, res) => res.json({ message: "Logged out" }));

export default router;