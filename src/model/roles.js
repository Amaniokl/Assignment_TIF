import mongoose from "mongoose";
import { Snowflake } from "@theinternetfolks/snowflake";

const { Schema, model } = mongoose;

const RoleSchema = new Schema(
  {
    _id: { type: String, default: () => Snowflake.generate() },
    name: { type: String, maxlength: 64, unique: true, required: true },
    scopes: { type: [String], default: [] }
  },
  { timestamps: true }
);


export const Role = model("Role", RoleSchema);
