import { Router } from "express";

import {
  addComment,
  getCommentsByBlog,
  updateComment,
  deleteComment,
  addReply,
} from "../controllers/commentController.ts";
import { authenticateToken } from "../middlewares/auth.ts";

const commentRoute = Router();

/**
 * @swagger
 * /api/blog/comment/add/{id}:
 *  post:
 *    summary: Adding comment to a blog
 *    tags: [Comment]
 *    security:
 *       -bearAuth: []
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          -type: string
 *         description: This endpoints is for adding comment to the blog
 *    responses:
 *       201:
 *         description: Comment added successfully
 *       404:
 *         description: Blog not found
 *       500:
 *        description: Server error
 */

commentRoute.post("/add/:id", authenticateToken, addComment);

/**
 * @swagger
 * /api/blog/comment/fetch/{id}:
 *  get:
 *    summary: Fetching comments of a blog
 *    tags: [Comment]
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          -type: string
 *         description: This endpoints is for fetching comments of the blog
 *    responses:
 *       200:
 *         description: Comments fetched successfully
 *       404:
 *         description: Blog not found
 *       500:
 *        description: Server error
 */

commentRoute.get("/fetch/:id", getCommentsByBlog);

/**
 * @swagger
 * /api/blog/comment/update/{id}:
 *  put:
 *    summary: Updating comment of a blog
 *    tags: [Comment]
 *    security:
 *       -bearAuth: []
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          -type: string
 *         description: This endpoints is for adding comment to the blog
 *    responses:
 *       200:
 *         description: Comment updated successfully
 *       403:
 *         description: Unauthorized to update this comment
 *       404:
 *         description: Comment not found
 *       500:
 *        description: Server error
 */
commentRoute.put("/update/:commentId", authenticateToken, updateComment);

/**
 * @swagger
 * /api/blog/comment/delete/{id}:
 *  delete:
 *    summary: Deleting comment from blog
 *    tags: [Comment]
 *    security:
 *       -bearAuth: []
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          -type: string
 *         description: This endpoints is for deleting comment from the blog
 *    responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Unauthorized to delete this comment
 *       404:
 *         description: Comment not found
 *       500:
 *        description: Server error
 */

commentRoute.delete("/delete/:commentId", authenticateToken, deleteComment);

/**
 * @swagger
 * /api/blog/comment/reply/{id}:
 *  post:
 *    summary: Adding reply to a comment
 *    tags: [Comment]
 *    security:
 *       -bearAuth: []
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          -type: string
 *         description: This endpoints is for adding reply to a comment
 *    responses:
 *       201:
 *         description: Reply added successfully
 *       403:
 *         description: Unauthorized to reply to this comment
 *       404:
 *         description: Comment not found
 *       500:
 *        description: Server error
 */

commentRoute.post("/reply/:commentId", authenticateToken, addReply);

export default commentRoute;
