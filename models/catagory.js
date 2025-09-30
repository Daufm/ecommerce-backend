import mongoose from "mongoose";

// Category Schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // null means top-level category
    },
    isActive: {
      type: Boolean,
      default: true, // useful if you want to disable a category
    },
    image: {
      type: String, // URL of category banner/icon
    },
  },
  { timestamps: true }
);

// Add text index for search
categorySchema.index({ name: "text", slug: "text", description: "text" });

export default mongoose.model("Category", categorySchema);
