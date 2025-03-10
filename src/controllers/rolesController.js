import {Member}  from "../model/member.js";
import  {Community}  from "../model/community.js";
import { Role } from "../model/roles.js";

const createRole = async (req, res) => {
    try {
        const { name } = req.body;

        // Validate role name
        if (!name || name.length < 2) {
            return res.status(400).json({ status: false, error: "Role name must be at least 2 characters long." });
        }

        // Check if role already exists
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ status: false, error: "Role already exists." });
        }

        // Create a new role
        const role = new Role({ name });
        await role.save();

        res.status(201).json({
            status: true,
            content: {
                id: role._id,
                name: role.name,
                created_at: role.createdAt,
                updated_at: role.updatedAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
};

const getAllRoles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default page = 1
        const limit = 10; // Fixed limit per page

        const total = await Role.countDocuments(); // Total number of roles
        const pages = Math.ceil(total / limit); // Total pages

        // Fetch roles with pagination
        const roles = await Role.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total,
                    pages,
                    page
                },
                data: roles.map(role => ({
                    id: role._id,
                    name: role.name,
                    created_at: role.createdAt,
                    updated_at: role.updatedAt
                }))
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: "Internal Server Error" });
    }
};

export {createRole, getAllRoles}
