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

    await Comment.findByIdAndDelete(commentId);
    
    const updates: Promise<any>[] = [Blog.findByIdAndUpdate(comment.blog, { $inc: { commentCount: -1 } })];
    
    if (comment.parentComment) {
      updates.push(Comment.findByIdAndUpdate(comment.parentComment, { $inc: { replyCount: -1 } }));
    }
    
    await Promise.all(updates);

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


export const addReply = async (req: AuthRequest, res: Response) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    const replyComment = new Comment({
      content,
      user: userId,
      blog: parentComment.blog,
      parentComment: parentComment._id,
    });

    await replyComment.save();
    await Promise.all([
      Comment.findByIdAndUpdate(parentComment._id, { $inc: { replyCount: 1 } }),
      Blog.findByIdAndUpdate(parentComment.blog, { $inc: { commentCount: 1 } }),
    ]);

    res.status(201).json(replyComment);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error || "Server Error" });
  }
};
