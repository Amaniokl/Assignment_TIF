import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";

const { Schema, model } = mongoose;

// User Schema
const UserSchema = new Schema(
  {
    _id: { type: String, default: () => Snowflake.generate() },
    name: { type: String, maxlength: 64 },
    email: { type: String, unique: true, maxlength: 128, required: true },
    password: { type: String, maxlength: 64, required: true }
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

export const User = model("User", UserSchema);