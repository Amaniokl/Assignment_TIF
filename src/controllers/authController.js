import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {User} from '../model/user.js';

dotenv.config(); // Load environment variables

const JWT_EXPIRES_IN = '1h';
const COOKIE_OPTIONS = {
    httpOnly: true, // Prevents JavaScript access
    secure: process.env.NODE_ENV === 'production', // Set to true only in production (HTTPS)
    sameSite: 'Strict', // Prevents CSRF attacks
    maxAge: 3600000, // 1 hour in milliseconds
};

// SignUp API
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // Set token in cookie
        res.cookie('access_token', token, COOKIE_OPTIONS);

        res.json({
            status: true,
            content: {
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at,
                },
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Signup failed' });
    }
};

// SignIn API
const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // Set token in HTTP-only cookie
        res.cookie('access_token', token, COOKIE_OPTIONS);

        res.json({
            status: true,
            content: {
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at,
                },
            },
        });
    } catch (error) {
        res.status(500).json({ error: 'Signin failed' });
    }
};

// Get Me API
const getMe = async (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            status: true,
            content: {
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at,
                },
            },
        });
    } catch (error) {
        res.status(401).json({ error: 'Token is invalid or expired' });
    }
};

// Logout API
const logout = (req, res) => {
    res.clearCookie('access_token', COOKIE_OPTIONS);
    res.json({ status: true, message: 'Logged out successfully' });
};
export {signin, signup, getMe, logout}
