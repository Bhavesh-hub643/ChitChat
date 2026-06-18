import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  fullName:   { type: String, required: true },
  username:   { type: String, required: true, unique: true },
  password:   { type: String, required: true },  // stored as bcrypt hash
  profilePic: { type: String, default: "" },      // cloudinary URL later
}, { timestamps: true })

export const User= mongoose.model("User",userSchema)