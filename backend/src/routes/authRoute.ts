import { Router } from "express";
import {
  register,
  login,
  logout,
  getMe,
  refreshToken,
  sendVerificationEmail,
  verifyAccount
} from "../controllers/authController.ts";
import { authenticateToken } from "../middlewares/auth.ts";

import {
  validateRegistration,
  validateLogin,
  handleValidationErrors,
} from "../middlewares/validation.ts";
import { upload } from "../config/multer.ts";

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
 * /api/auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid token
 *       500:
 *         description: Server error
 */
// Protected routes
authRoute.get("/me", authenticateToken, getMe);

export default authRoute;
