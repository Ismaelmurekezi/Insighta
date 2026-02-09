import { response, type Request, type Response } from "express";
import Blog from "../models/blogModel.ts";
import User from "../models/userModel.ts";

interface AuthRequest extends Request {
  user?: any;
}

export const togglePublishBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    blog.isPublished = !blog.isPublished;
    await blog.save();

    res.status(200).json({
      success: true,
      message: `Blog ${blog.isPublished ? "published" : "unpublished"} successfully`,
      blog,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message || "Server error",
    });
  }
};

export const getOneBlog = async (req: Request, res: Response) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId).populate("author", "username profile_avatar");

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog retrieved successfully",
            blog,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error?.message || "Server error",
        });
    }   
}


export const getUser = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      user,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error?.message || "Server error" });
  }
};

export const deleteUserAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User account deleted successfully",
      user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || "Server error" });
  }
};
