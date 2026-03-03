import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    CoverImage: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      enum: [
        "All",
        "Technology",
        "Health",
        "Lifestyle",
        "Education",
        "Entertainment",
      ],
      default: "All",
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    reactionCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    isTakenDown: {
      type: Boolean,
      default: false,
    },
    takedownReason: {
      type: String,
      default: "",
    },
    takedownBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    takedownDate: {
      type: Date,
      default: null,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: true,
      },
    ],
    reactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reaction",
        required: true,
      },
    ],
  },
  { timestamps: true },
);

// Cascade delete blog's comments and reactions when blog is deleted
blogSchema.pre("deleteOne", { document: true, query: false }, async function () {
  const blogId = this._id;
  
  const Comment = mongoose.model("Comment");
  const Reaction = mongoose.model("Reaction");

  await Comment.deleteMany({ blog: blogId });
  await Reaction.deleteMany({ blog: blogId });
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
  