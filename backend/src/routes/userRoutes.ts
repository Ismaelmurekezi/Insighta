import { Router } from "express";
import {
  getMe,
  updateProfile,
  updatePassword,
  uploadProfileImage,
  deleteProfileImage,
  deleteAccount,
} from "../controllers/userController.ts";
import { authenticateToken } from "../middlewares/auth.ts";
import { upload } from "../config/multer.ts";

const userRoute = Router();

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       500:
 *         description: Server error
 */

userRoute.get("/me", authenticateToken, getMe);

/**
 * @swagger
 * /api/auth/upload-profile-image:
 *   post:
 *     summary: Upload profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *       400:
 *         description: No file uploaded
 *       500:
 *         description: Server error
 */
userRoute.post(
  "/upload-profile-image",
  authenticateToken,
  upload.single("profileImage"),
  uploadProfileImage,
);

/**
 * @swagger
 * /api/auth/delete-profile-image:
 *   delete:
 *     summary: Delete profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile image deleted successfully
 *       500:
 *         description: Server error
 */
userRoute.delete(
  "/delete-profile-image",
  authenticateToken,
  deleteProfileImage,
);

/**
 * @swagger
 * /api/auth/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       500:
 *         description: Server error
 */
userRoute.put("/update-profile", authenticateToken, updateProfile);

/**
 * @swagger
 * /api/auth/update-password:
 *   put:
 *     summary: Update user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Invalid current password or new password too short
 *       500:
 *         description: Server error
 */
userRoute.put("/update-password", authenticateToken, updatePassword);
/**
 * @swagger
 * /api/auth/delete-account/{userId}:
 *   delete:
 *     summary: Delete user account
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to delete
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: User not found
 *       500:
 *         description: Server error  
 */

userRoute.delete("/delete-account/:userId", authenticateToken, deleteAccount);

export default userRoute;
