import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.ts";
import "dotenv/config";
import transporter from "../config/nodemailer.ts";

const ACCESS_TOKEN: string = process.env.ACCESS_TOKEN || "";
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || "";
const RESET_TOKEN_SECRET: string = process.env.RESET_TOKEN_SECRET || "";

interface AuthRequest extends Request {
  user?: any;
}

const generateRefreshToken = (user: any) => {
  return jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

const generateAccessToken = (user: any) => {
  return jwt.sign({ data: user }, ACCESS_TOKEN, { expiresIn: "1h" });
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

    //Sending welcome email

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to Insighta Platform!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #75B06F 0%, #5a9054 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
            .content h2 { color: #75B06F; margin-top: 0; }
            .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Insighta!</h1>
            </div>
            <div class="content">
              <h2>Hello ${username},</h2>
              <p>Thank you for registering at our platform. We're excited to have you on board!</p>
              <p>Get started by exploring our features and making the most of your account.</p>
              <p>If you have any questions, feel free to reach out to our support team.</p>
              <p>Best regards,<br><strong>The Insighta Team</strong></p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Insighta Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User registered successfully.",
      refresh: REFRESH_TOKEN_SECRET,
      userId: newUser._id,
    });
  } catch (error: any) {
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
    if (user.isAccountVerified === false) {
      return res.status(400).json({
        message: "Verify your account to login",
      });
    }

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
  } catch (error: any) {
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

// Refresh access token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
      async (err: any, decoded: any) => {
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
      },
    );
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

export const sendVerificationEmail = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    }

    const verificationCode = String(
      Math.floor(100000 + Math.random() * 900000),
    );
    user.VerifyOtp = verificationCode;
    user.verifyOtpExpires = new Date(Date.now() + 50 * 60 * 1000);
    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #75B06F 0%, #5a9054 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; color: #333333; line-height: 1.6; text-align: center; }
            .code-box { background: #f8f8f8; border: 2px dashed #75B06F; border-radius: 8px; padding: 20px; margin: 30px 0; }
            .code { font-size: 32px; font-weight: bold; color: #75B06F; letter-spacing: 5px; }
            .warning { color: #E33629; font-size: 14px; margin-top: 20px; }
            .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Account</h1>
            </div>
            <div class="content">
              <p>Please use the verification code below to verify your account:</p>
              <div class="code-box">
                <div class="code">${verificationCode}</div>
              </div>
              <p class="warning">⚠️ This code will expire in 50 minutes</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Insighta Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Verification email sent" });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

export const verifyAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { otp } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    }

    if ((!user.VerifyOtp || user.VerifyOtp) !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.verifyOtpExpires || user.verifyOtpExpires < new Date()) {
      return res.status(400).json({ message: "Verification code expired" });
    }

    user.isAccountVerified = true;
    user.VerifyOtp = "";
    user.verifyOtpExpires = null;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error?.message || "Server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign(
      { userId: user._id },
      RESET_TOKEN_SECRET,
      { expiresIn: "15m" },
    );
    user.resetPasswordOtp = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Password Reset Link",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #E33629 0%, #c02a1f 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 28px; }
            .content { padding: 40px 30px; color: #333333; line-height: 1.6; }
            .button { display: inline-block; background: #75B06F; color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
            .button:hover { background: #5a9054; }
            .warning { color: #E33629; font-size: 14px; margin-top: 20px; }
            .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #666666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <p>We received a request to reset your password. Click the button below to create a new password:</p>
              <div style="text-align: center;">
                <a href="${resetLink}" class="button">Reset Password</a>
              </div>
              <p class="warning">⚠️ This link will expire in 15 minutes</p>
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
              <p style="font-size: 12px; color: #666; margin-top: 30px;">If the button doesn't work, copy and paste this link into your browser:<br>${resetLink}</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Insighta Platform. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error: any) {
    res.status(500).json({ message: error?.message || "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(
      token,
      process.env.RESET_TOKEN_SECRET || "reset_secret",
    ) as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetPasswordOtp || user.resetPasswordOtp !== token) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: "Reset token expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOtp = "";
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error: any) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }
    res.status(500).json({ message: error?.message || "Server error" });
  }
};
