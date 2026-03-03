import { Router } from "express";
import { addReaction } from "../controllers/reactionController.ts";
import { authenticateToken } from "../middlewares/auth.ts";

const reactionRoute = Router();

/**
 * @swagger
 * /api/blog/reaction/add/{id}:
 *  post:
 *    summary: Adding reaction to a blog
 *    tags: [Reaction]
 *    security:
 *       -bearAuth: []
 *    requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *    parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *          -type: string
 *         description: This endpoints is for adding reaction to the blog
 *    responses:
 *       201:
 *         description: Reaction added successfully
 *       404:
 *         description: Blog not found
 *       500:
 *        description: Server error
 */
reactionRoute.post("/add/:id", authenticateToken, addReaction);

export default reactionRoute;
