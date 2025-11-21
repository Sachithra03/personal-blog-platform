import express from  "express";
import bycript from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

export default router;




