import express from 'express';
import { signup, signin, getMe, logout } from '../controllers/authController.js';
import {authenticate} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup); // Signup route
router.post('/signin', signin); // Signin route
router.get('/me', authenticate, getMe); // Get current user info (protected route)
router.post('/logout', logout); // Logout route

export default router;
