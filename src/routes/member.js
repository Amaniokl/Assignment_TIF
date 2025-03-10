import express from 'express';
import { addMember, removeMember } from '../controllers/memberController.js';
import {authenticate} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, addMember); // Add a member (protected route)
router.delete('/:id', authenticate, removeMember); // Remove a member (protected route)

export default router;
