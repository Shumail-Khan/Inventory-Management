import jwt from 'jsonwebtoken'
import User from '../models/User.js';


const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        
        if(!token){
            return res.status(401).json({success: false, msg: "Authorization token not found."});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){
            return res.status(401).json({success: false, msg: "Invalid token."});
        }

        // const user = await User.findById(decoded.id);
        const user = await User.findById({_id: decoded.id});

        if(!user){
            return res.status(401).json({success: false, msg: "User not found."});
        }
        req.user = user;
        next();
    }
    catch(error){
        return res.status(500).json({success: false, msg: "Internal Server Error in Middleware", error: error.message});
    }
}

export default authMiddleware;