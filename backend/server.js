import expess from "express";
import mongoose from "mongoose";
import cros from "cros";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

//server images
app.use('/uploads', express.static('uploads'));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

//connect to mongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB Connected.");
    app.listen(PORT, () => {
        console.log("Server stared on PORT : ", PORT);
    });
});