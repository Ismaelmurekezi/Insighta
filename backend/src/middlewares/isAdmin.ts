//middleware to check if the user is an admin
import type { Request, Response, NextFunction } from "express";
import User from "../models/userModel.ts";

interface AuthRequest extends Request {
  user?: { _id?: string; role?: string };
}

export const isAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. This action is restricted to Admins only.",
      });
    }

    next();
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Server error",
    });
  }
};
