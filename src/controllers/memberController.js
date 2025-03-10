import {Member}  from "../model/member.js";
import  {Community}  from "../model/community.js";
import { Role } from "../model/roles.js";
import { Snowflake } from "@theinternetfolks/snowflake";

const addMember = async (req, res) => {
  try {
      const { communityId, userId, roleId } = req.body;
      const adminUserId = req.user.id; // Authenticated user

      // Validate input
      if (!communityId || !userId || !roleId) {
          return res.status(400).json({ status: false, error: "Missing required fields" });
      }

      // Check if the community exists
      const communityExists = await Community.findById(communityId);
      if (!communityExists) {
          return res.status(404).json({ status: false, error: "Community not found" });
      }

      // Check if the authenticated user is an admin in this community
      const adminMember = await Member.findOne({ community: communityId, user: adminUserId }).populate("role");
      console.log(adminMember);
      
      if (!adminMember || adminMember.role.name !== "Community Admin") {
          return res.status(403).json({ status: false, error: "NOT_ALLOWED_ACCESS" });
      }

      // Check if the role exists
      const roleExists = await Role.findById(roleId);
      if (!roleExists) {
          return res.status(404).json({ status: false, error: "Role not found" });
      }

      // Check if the user is already a member
      const existingMember = await Member.findOne({ community: communityId, user: userId });
      if (existingMember) {
          return res.status(400).json({ status: false, error: "User is already a member of this community" });
      }

      // Add the new member
      const newMember = await Member.create({
          id: Snowflake.generate(),
          community: communityId,
          user: userId,
          role: roleId,
      });

      res.status(201).json({
          status: true,
          content: {
              data: newMember,
          },
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};

const removeMember = async (req, res) => {
  try {
      const memberId = req.params.id;
      const adminUserId = req.user.id; // Authenticated user

      // Fetch the member to be removed and its community and role
      const memberToRemove = await Member.findById(memberId)
          .populate("community role")
          .lean();
      // console.log(memberToRemove);e
      
      if (!memberToRemove) {
          return res.status(404).json({ status: false, error: "Member not found" });
      }

      const communityId = memberToRemove.community._id;
      const roleIdToRemove = memberToRemove.role._id;

      // Find the authenticated user's role in the community
      const adminMember = await Member.findOne({ 
          community: communityId, 
          user: adminUserId 
      }).populate("role").lean();

      if (!adminMember || !["Community Admin", "Community Moderator"].includes(adminMember.role.name)) {
          return res.status(403).json({ status: false, error: "NOT_ALLOWED_ACCESS" });
      }

      // Ensure at least one "Community Admin" remains before removal
      const adminRole = await Role.findOne({ name: "Community Admin" }).lean();
      if (String(roleIdToRemove) === String(adminRole._id)) {
          const adminCount = await Member.countDocuments({ community: communityId, role: adminRole._id });
          if (adminCount <= 1) {
              return res.status(400).json({ status: false, error: "Cannot remove the last Community Admin" });
          }
      }

      // Remove the member
      await Member.findByIdAndDelete(memberId);

      return res.status(200).json({
          status: true,
          content: {
              message: "Member removed successfully",
          },
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};


export {removeMember, addMember}