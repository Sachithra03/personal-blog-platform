import express from "express";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile/:username", authController.getUserByUsername);

// Protected routes
router.patch("/profile", auth, upload.single("avatar"), authController.updateProfile);
router.delete("/profile/avatar", auth, authController.deleteAvatar);
router.post("/logout", auth, authController.logout);

export default router;





