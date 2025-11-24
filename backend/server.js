import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
const app = express();

// CORS configuration - Allow requests from Vercel and localhost
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://personal-blog-platform-frontend.vercel.app",
        /\.vercel\.app$/  // Allow all Vercel preview deployments
    ],
    credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

//server images
app.use('/uploads', express.static('uploads'));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

//connect to mongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected.");
    app.listen(PORT, () => {
        console.log("Server started on PORT : ", PORT);
    });
})
.catch((err) => console.log(err));
