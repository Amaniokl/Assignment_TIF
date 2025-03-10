import {Community} from '../model/community.js';
import {Member} from '../model/member.js';
import jwt from 'jsonwebtoken';
import {User} from '../model/user.js';
import dotenv from 'dotenv';
import { Role } from '../model/roles.js';
// import { Community } from "../model/community.js";
// import { Member } from "../model/member.js"; // Member model for role assignment
import { Snowflake } from "@theinternetfolks/snowflake";
import slugify from "slugify";

dotenv.config(); // Load environment variables

const createCommunity = async (req, res) => {
    try {
        const { name } = req.body;
    
        if (!name || name.length < 2) {
            return res.status(400).json({ status: false, error: "Community name must be at least 2 characters." });
        }
    
        const slug = slugify(name, { lower: true, strict: true });
    
        const existingCommunity = await Community.findOne({ slug });
        if (existingCommunity) {
            return res.status(400).json({ status: false, error: "Community with this name already exists." });
        }
    
        const ownerId = req.user.id;
    
        // Ensure the "Community Admin" role exists
        let communityAdminRole = await Role.findOne({ name: "Community Admin" });
    
        if (!communityAdminRole) {
            // Create the role if it doesn't exist
            communityAdminRole = await Role.create({
                _id: Snowflake.generate(),
                name: "Community Admin",
            });
        }
    
        const newCommunity = await Community.create({
            _id: Snowflake.generate(),
            name,
            slug,
            owner: ownerId,
        });
    
        await Member.create({
            _id: Snowflake.generate(),
            community: newCommunity._id,
            user: ownerId,
            role: communityAdminRole._id, // Assign the correct role ID
        });
    
        res.status(201).json({
            status: true,
            content: {
                id: newCommunity._id,
                name: newCommunity.name,
                slug: newCommunity.slug,
                owner: newCommunity.owner,
                created_at: newCommunity.createdAt,
                updated_at: newCommunity.updatedAt,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
    
};

const getAllCommunities = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const total = await Community.countDocuments();
        const pages = Math.ceil(total / limit);

        if (page > pages && pages !== 0) {
            return res.status(404).json({ status: false, error: "Page not found" });
        }

        const communities = await Community.find()
            .populate("owner", "id name") // Expanding only id and name of the owner
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total,
                    pages,
                    page,
                },
                data: communities,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
};

const getCommunityMembers = async (req, res) => {
    try {
        const { id } = req.params; // Community ID from URL params
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        // console.log(id);
        
        // Check if community exists
        const communityExists = await Community.findById(id);
        if (!communityExists) {
            return res.status(404).json({ status: false, error: "Community not found" });
        }

        // Count total members in the community
        const total = await Member.countDocuments({ community: id });
        const pages = Math.ceil(total / limit);

        if (page > pages && pages !== 0) {
            return res.status(404).json({ status: false, error: "Page not found" });
        }

        // Fetch members with pagination
        const members = await Member.find({ community: id })
            .populate("user", "id name") // Expand user with only `id` and `name`
            .populate("role") // Expand role details
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            status: true,
            content: {
                meta: { total, pages, page },
                data: members,
            },
        });
    } catch (error) {
        console.error("Error fetching community members:", error);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
};

const getMyOwnedCommunities = async (req, res) => {
    try {
        const userId = req.user.id; 
        // Extract user ID from the authenticated request
        console.log(userId);
        
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const total = await Community.countDocuments({ owner: userId });
        const pages = Math.ceil(total / limit);

        if (page > pages && pages !== 0) {
            return res.status(404).json({ status: false, error: "Page not found" });
        }

        const communities = await Community.find({ owner: userId })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total,
                    pages,
                    page,
                },
                data: communities,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
};


const getMyJoinedCommunities = async (req, res) => {
    try {
        const userId = req.user.id; // Extract user ID from authenticated request
        const page = parseInt(req.query.page) || 1; // Default page = 1
        const limit = 10; // Fixed limit per page

        // Find communities where the user is a member
        const total = await Member.countDocuments({ user: userId });
        const pages = Math.ceil(total / limit);

        const memberships = await Member.find({ user: userId })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate({
                path: "community",
                populate: {
                    path: "owner",
                    select: "id name" // Only fetch id and name of the owner
                }
            });

        // Extract communities from memberships
        const communities = memberships.map(m => ({
            id: m.community._id,
            name: m.community.name,
            slug: m.community.slug,
            owner: m.community.owner, // Already populated with id & name
            created_at: m.community.createdAt,
            updated_at: m.community.updatedAt
        }));

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total,
                    pages,
                    page
                },
                data: communities
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
};

export {createCommunity, getAllCommunities, 
    getCommunityMembers,getMyOwnedCommunities,
    getMyJoinedCommunities}
