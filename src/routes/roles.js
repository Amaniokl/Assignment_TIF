import express from "express";
import { createRole, getAllRoles } from "../controllers/rolesController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate,createRole); // Create a new role
router.get("/", authenticate, getAllRoles); // Get all roles with pagination

export default router;
