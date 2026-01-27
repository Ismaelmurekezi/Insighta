import mongoose from "mongoose";
import "dotenv/config";

//User schema

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_avatar: {
      type: String,
      default: process.env.DEFAULT_AVATAR,
    },
    bio: {
      type: String,
      default: "This user prefers to keep an air of mystery about them.",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
    VerifyOtp: {
      type: String,
      default: '',
    },
    verifyOtpExpires: {
      type: Date,
      default: null,
    },
    resetPasswordOtp: {
      type: String,
      default: "",
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
