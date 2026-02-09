import { Router } from "express";
import { isAdmin } from "../middlewares/isAdmin.ts";

const adminRouter = Router();
import { authenticateToken } from "../middlewares/auth.ts";
import { deleteUserAccount, togglePublishBlog } from "../controllers/adminController.ts";
import { getAllUsers } from "../controllers/userController.ts";

/**
 * @swagger
 * /api/admin/blog/toggle-publish/{id}:
 *   post:
 *     summary: Toggle publish status of a blog post (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Blog publish status toggled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. This action is restricted to Admins only.
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */

adminRouter.post(
  "/blog/toggle-publish/:id",
  authenticateToken,
  isAdmin,
  togglePublishBlog,
);

/**
 * @swagger
 * /api/admin/user/getAllUsers:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. This action is restricted to Admins only.
 *       500:
 *         description: Server error
 */
adminRouter.get("/user/getAllUsers", authenticateToken, isAdmin, getAllUsers);
/**
 * @swagger
 * /api/admin/user/deleteUser/{userId}:
 *   delete:
 *     summary: Delete a user account (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Access denied. This action is restricted to Admins only.
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
adminRouter.delete("/user/deleteUser/:userId", authenticateToken, isAdmin, deleteUserAccount);

export default adminRouter;
