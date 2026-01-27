import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.ts";


interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token =
      req.cookies?.access_token ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN || "") as any;
    const user = await User.findById(decoded.data._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error:any) {
    return res.status(401).json({ message: error?.message || "Unauthorized" });
  }
};
