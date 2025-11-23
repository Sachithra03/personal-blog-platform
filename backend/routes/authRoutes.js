import express from  "express";
import bycript from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const {username, email, password} = req.body;
        const hashedPassword = await bycript.hash(password, 10);

        const user = await User.create({
            username, email, password: hashedPassword
        });

        res.json({ message: "User Registered", user});
    } catch (error) {
        res.status(500).json({error: err.message});
    }
});

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user) return res.status(404).json({message: "User not found."});

        const match = await bycript.compare(password, user.password);
        if(!match) return res.status(400).json({message: "Incorrect password."});

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ token, user});
    } catch (error) {
        res.status(500).json({ error: err.message});
    }
});

// Update user profile
router.patch("/profile", auth, upload.single("avatar"), async (req, res) => {
    try {
        const userId = req.user.id;
        const updateData = {};

        if (req.body.username) {
            updateData.username = req.body.username;
        }

        if (req.file) {
            updateData.avatar = req.file.path;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, select: "-password" }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete avatar
router.delete("/profile/avatar", auth, async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findByIdAndUpdate(
            userId,
            { avatar: "" },
            { new: true, select: "-password" }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;




