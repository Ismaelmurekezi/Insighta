import type { Request, Response } from "express";
import Comment from "../models/commentModel.ts";
import Blog from "../models/blogModel.ts";

interface AuthRequest extends Request {
  user?: any;
}

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const blogId = req.params.id;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = new Comment({
      content,
      user: userId,
      blog: blogId,
    });

    await comment.save();
    await Blog.findByIdAndUpdate(blogId, { $inc: { commentCount: 1 } });

    res.status(201).json(comment);
  } catch (error: any) {
    res
      .status(500)
      .json({ success: false, message: error.message || "Server Error" });
  }
};

export const getCommentsByBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId)
      .populate("comments")
      .populate("content");
    const blogComments = await Comment.find();
    if (!blog) {
      return res
        .status(404)
        .json({ success: false, message: "Blog not found" });
    }
    if (!blogComments) {
      return res
        .status(404)
        .json({ success: false, message: "No comments founds" });
    }

    const blogs = blogComments.filter((bl) => bl.blog.toString() == blogId);

    res.status(200).json(blogs);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error || "Server Error" });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    comment.isDeleted = true;
    await comment.save();

    await Comment.findByIdAndDelete(commentId);
    await Blog.findByIdAndUpdate(comment.blog, { $inc: { commentCount: -1 } });

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error || "Server Error" });
  }
};

export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is the author of the comment
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update the comment content
    comment.content = content;
    comment.isEdited = true;
    const updatedComment = await comment.save();

    res.status(200).json(updatedComment);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error || "Server Error" });
  }
};
