import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.ts";
import "dotenv/config";

const ACCESS_TOKEN: string = process.env.ACCESS_TOKEN || "";
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || "";

interface AuthRequest extends Request {
  user?: any;
}

const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: "5m" });
};

const generateAccessToken = (user: any) => {
  return jwt.sign({ data: user }, ACCESS_TOKEN, { expiresIn: "1m" });
};

// User registration
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
  

    res.status(201).json({
      message: "User registered successfully.",
      refresh:REFRESH_TOKEN_SECRET,
      userId: newUser._id,

    });
  } catch (error:any) {
    res.status(500).json({ message: error.message || "Server error" });
  } 
};

// User login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3600000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 604800000,
    });

    res.status(200).json({
      message: "Login successful",
      token: accessToken,
    });
  } catch (error:any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

// User logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get current user
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user.toObject();
    res.status(200).json({ user: userWithoutPassword });
  } catch (error:any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};
// Refresh access token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err:any, decoded:any) => {
      if (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const newAccessToken = generateAccessToken(user);

      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 3600000,
      });

      res.status(200).json({ token: newAccessToken });
    });
  } catch (error:any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};