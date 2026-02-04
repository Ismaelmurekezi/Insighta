import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.ts";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.ts";

interface AuthRequest extends Request {
  user?: any;
}



export const uploadProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
      {
        folder: "profile_images",
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      },
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profile_avatar: result.secure_url },
      { new: true },
    ).select("-password");

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: result.secure_url,
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

export const deleteProfileImage = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profile_avatar: process.env.DEFAULT_AVATAR },
      { new: true },
    ).select("-password");

    res.status(200).json({
      message: "Profile image deleted successfully",
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { username, bio } = req.body;
    const updateData: any = {};

    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user._id, { password: hashedNewPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};
