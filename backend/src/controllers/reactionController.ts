import type { Request, Response } from "express";
import Blog from "../models/blogModel.ts";
import Reaction from "../models/reactionModel.ts";

interface AuthRequest extends Request {
  user?: any;
}

export const addReaction = async (req: AuthRequest, res: Response) => {
  const blogId = req.params.id;
  const { type } = req.body;
  const userId = req.user._id;

  try {
    const blogExist = await Blog.findById(blogId);
    if (!blogExist) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }
    const existingReaction = await Reaction.findOne({
      user: `${userId}`,
      blog: `${blogId}`,
    });

    if (!existingReaction) {
      const newReaction = new Reaction({
        type,
        user: userId,
        blog: blogId,
      });
      const savedReaction = await newReaction.save();

      // Update the blog's comments array
      blogExist.reactions.push(savedReaction._id);
      await blogExist.save();
      return res.status(201).json(newReaction);
    }

    // case 2
    if (existingReaction.type === type) {
      await Reaction.deleteOne({ _id: existingReaction._id });
      blogExist.reactions = blogExist.reactions.filter(
        (id: any) => id.toString() !== existingReaction._id.toString()
      );
      await blogExist.save();
      return res.json({ message: "reaction removed" });
    }

    //case 3
    existingReaction.type = type;
    await existingReaction.save();

    res.json({ message: "reaction updated", data: existingReaction });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

