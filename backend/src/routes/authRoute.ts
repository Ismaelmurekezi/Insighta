import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  sendVerificationEmail,
  verifyAccount,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.ts";
import { authenticateToken } from "../middlewares/auth.ts";

import {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} from "../middlewares/validation.ts";


const authRoute = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
// Public routes
authRoute.post(
  "/register",
  validateRegistration,
  handleValidationErrors,
  register,
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
authRoute.post("/login", validateLogin, handleValidationErrors, login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 *       500:
 *         description: Server error
 */
authRoute.post("/logout", logout);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Invalid refresh token
 */
authRoute.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/auth/sendVerificationEmail:
 *   post:
 *     summary: Send account verification email
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: User not found
 *       500:
 *         description: Server error
 */

authRoute.post("/sendVerificationEmail", authenticateToken, sendVerificationEmail);

/**
 * @swagger
 * /api/auth/verify-account:
 *   post:
 *     summary: Verify user account
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - otp
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid OTP or User not found
 *       500:
 *         description: Server error
 */
authRoute.post("/verify-account", authenticateToken, verifyAccount);
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Initiate password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset initiated
 *       400:
 *         description: Invalid email or user not found
 *       500:
 *         description: Server error
 */
authRoute.post("/forgot-password", forgotPassword);
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid token or password
 *       500:
 *         description: Server error
 */
authRoute.post("/reset-password", resetPassword);

export default authRoute;
