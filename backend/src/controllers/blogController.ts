import type { Request, Response } from "express";
import cloudinary from "../config/cloudinary.ts";
import Blog from "../models/blogModel.ts";

interface AuthRequest extends Request {
  user?: any;
}

export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, category, tags, slug, status } = req.body;

    if (!title || !content || !slug) {
      return res.status(400).json({
        success: false,
        message: "Title, content, and slug are required",
      });
    }

    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: "Blog with this slug already exists",
      });
    }

    let coverImageUrl = "";
    if (req.file) {
      const result = await cloudinary.uploader.upload(
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`,
        {
          folder: "blog_covers",
          transformation: [{ width: 800, height: 600, crop: "fill" }],
        },
      );
      coverImageUrl = result.secure_url;
    }

    const newBlog = new Blog({
      title,
      content,
      category: category || "All",
      tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
      slug: slug
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // replace multiple spaces
        .replace(/[^a-z0-9-]/g, "") // remove invalid chars
        .replace(/-+/g, "-"),
      CoverImage: coverImageUrl,
      author: req.user._id,
      status: status || "draft",
      isPublished: status === "published",
      publishedAt: status === "published" ? new Date() : null,
    });

    await newBlog.save();

    // Populate author details
    await newBlog.populate("author", "username email profile_avatar");

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog: newBlog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Server error",
    });
  }
};

export const getBlog = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Slug is required",
      });
    }

    const blog = await Blog.findOne({ slug }).populate(
      "author",
      "username email profile_avatar",
    );

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Server error",
    });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .populate("author", "username email profile_avatar")
      .sort({ createdAt: -1 });

    if (blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No blogs found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Server error",
    });
  }
};

export const getBlogsByAuthor = async (req: AuthRequest, res: Response) => {
  try {
    const blogs = await Blog.find({ author: req.user._id })
      .populate("author", "username email profile_avatar")
      .sort({ createdAt: -1 });

    if (blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No blogs found for this author",
      });
    }

    res.status(200).json({
      success: true,
      message: "Blogs fetched successfully",
      blogs,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Server error",
    });
  }
};

export const updateBlog = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, category, tags, status, coverImage } = req.body;
  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this blog",
      });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;
    blog.tags = tags
      ? tags.split(",").map((tag: string) => tag.trim())
      : blog.tags;
    blog.status = status || blog.status;

    if (coverImage) {
      const result = await cloudinary.uploader.upload(
        `data:${coverImage.mimetype};base64,${coverImage.buffer.toString("base64")}`,
        {
          folder: "blog_covers",
          transformation: [{ width: 800, height: 600, crop: "fill" }],
        },
      );
      blog.CoverImage = result.secure_url;
    }

    if (status === "published" && !blog.isPublished) {
      blog.isPublished = true;
      blog.publishedAt = new Date();
    } else if (status === "draft") {
      blog.isPublished = false;
      blog.publishedAt = null;
    }

    await blog.save();

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Server error",
    });
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this blog",
      });
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Server error",
    });
  }
};

