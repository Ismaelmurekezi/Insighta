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
      await newReaction.save();
      await Blog.findByIdAndUpdate(blogId, { $inc: { reactionCount: 1 } });
      return res.status(201).json(newReaction);
    }

    if (existingReaction.type === type) {
      await Reaction.deleteOne({ _id: existingReaction._id });
      await Blog.findByIdAndUpdate(blogId, { $inc: { reactionCount: -1 } });
      return res.json({ message: "reaction removed" });
    }

    existingReaction.type = type;
    await existingReaction.save();

    res.json({ message: "reaction updated", data: existingReaction });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

