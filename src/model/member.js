import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";

const { Schema, model } = mongoose;
// Member Schema (Join Table)
// Member Schema (Join Table)
const MemberSchema = new Schema(
  {
    _id: { type: String, default: () => Snowflake.generate() },
    community: { type: String, ref: "Community", required: true },
    user: { type: String, ref: "User", required: true },
    role: { type: String, ref: "Role", required: true }
  },
  { timestamps: { createdAt: true, updatedAt: false } } // Only keeps `createdAt`
);

export const Member = model("Member", MemberSchema);