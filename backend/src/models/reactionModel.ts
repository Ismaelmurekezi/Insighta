import mongoose from "mongoose";

const reactionSchema = new mongoose.Schema(
  {
    blog: {
      object: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["like", "love", "insightful", "funny", "sad", "angry"],
      required: true,
    },
  },
  { timestamps: true },
);

const Reaction = mongoose.model("Reaction", reactionSchema);

export default Reaction;
