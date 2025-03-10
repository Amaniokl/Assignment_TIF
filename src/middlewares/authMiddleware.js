import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authenticate = (req, res, next) => {
    try {
        // Extract token from cookies
        const token = req.cookies.access_token;
        // console.log('Token from Cookie:', token);
        
        if (!token) {
            return res.status(401).json({ status: false, error: "Unauthorized: No token provided" });
        }
        
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user information to request
        req.user = decoded;

        next(); // Proceed to next middleware/controller
    } catch (error) {
        console.error('Authentication Error:', error);
        return res.status(401).json({ status: false, error: "Unauthorized: Invalid or expired token" });
    }
};