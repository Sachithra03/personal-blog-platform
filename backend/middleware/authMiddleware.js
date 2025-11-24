import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if(!token)
        return res.status(401).json({message: "No token provided"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verify token matches the one in database
        const user = await User.findOne({ 
            _id: decoded.id, 
            token: token 
        });
        
        if (!user) {
            return res.status(401).json({message: "Token not found or expired"});
        }
        
        req.user = { id: decoded.id };
        req.token = token;
        next();
    } catch (error) {
        res.status(401).json({message: "Invalid token"});
    }
};

export default auth;