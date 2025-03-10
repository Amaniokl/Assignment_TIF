import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";

const { Schema, model } = mongoose;
const CommunitySchema = new Schema(
  {
    _id: { type: String, default: () => Snowflake.generate() },
    name: { type: String, maxlength: 128, required: true },
    slug: { type: String, maxlength: 255, unique: true, required: true },
    owner: { type: String, ref: "User", required: true }
  },
  { timestamps: true }
);

// export const User = model("User", UserSchema);
export const Community = model("Community", CommunitySchema);