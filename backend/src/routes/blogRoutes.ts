import { Router } from "express";
import { createBlog, deleteBlog, getAllBlogs, getBlog, getBlogsByAuthor, updateBlog } from "../controllers/blogController.ts";
import { authenticateToken } from "../middlewares/auth.ts";
import { upload } from "../config/multer.ts";
import { isAdmin } from "../middlewares/isAdmin.ts";

const blogRoute = Router();


/**
 * @swagger
 * /api/blog/create:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: string
 *               slug:
 *                 type: string
 *               status:
 *                 type: string
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Blog created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
blogRoute.post("/create", authenticateToken, upload.single("coverImage"), createBlog);
/**
 * @swagger
 * /api/blog/fetchBlog/{slug}:
 *   get:
 *     summary: Fetch a blog post by slug
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: The slug of the blog post to fetch
 *     responses:
 *       200:
 *         description: Blog fetched successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
blogRoute.get("/fetchBlog/:slug", getBlog);

/**
 * @swagger
 * /api/blog/fetchAllBlogs:
 *   get:
 *     summary: Fetch all published blog posts
 *     tags: [Blog]
 *     responses:
 *       200:
 *        description: Blogs fetched successfully
 *       404:
 *        description: No blogs found
 *       500:
 *        description: Server error
 */
blogRoute.get("/fetchAllBlogs", getAllBlogs);
/**
 * @swagger
 * /api/blog/getBlogByAuthor:
 *   get:
 *     summary: Fetch blogs by the authenticated author
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blogs fetched successfully
 *       404:
 *         description: No blogs found for the author
 *       500:
 *         description: Server error    
 */
blogRoute.get("/getBlogByAuthor", authenticateToken, getBlogsByAuthor);
/**
 * @swagger
 * /api/blog/update/{id}:
 *   put:
 *     summary: Update a blog post by ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to update
 *     requestBody:
 *       required: true 
 */
blogRoute.put("/update/:id", authenticateToken, upload.single("coverImage"), updateBlog);
/**
 * @swagger
 * /api/blog/delete/{id}:
 *   delete:
 *     summary: Delete a blog post by ID
 *     tags: [Blog]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blog post to delete
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       403:
 *         description: Unauthorized to delete this blog
 *       404:
 *         description: Blog not found
 *       500:
 *        description: Server error
 */
blogRoute.delete("/delete/:id",authenticateToken,deleteBlog);


export default blogRoute;
