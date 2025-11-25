import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

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
