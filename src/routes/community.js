import express from "express";
import { 
    createCommunity, 
    getAllCommunities, 
    getCommunityMembers, 
    getMyOwnedCommunities, 
    getMyJoinedCommunities 
} from "../controllers/communityController.js";
import  {authenticate}  from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new community (Authenticated user required)
router.post("/community", authenticate, createCommunity);

// Get all communities with pagination
router.get("/community",authenticate, getAllCommunities);

// Get members of a specific community (with pagination)
router.get("/community/member/:id",authenticate, getCommunityMembers);

// Get communities owned by the authenticated user
router.get("/community/me/owner", authenticate, getMyOwnedCommunities);

// Get communities the authenticated user has joined
router.get("/community/me/member", authenticate, getMyJoinedCommunities);

export default router;
