// src/models/Product.js
import mongoose from "mongoose";

// Subdocument schema for product variants
const variantSchema = new mongoose.Schema({
  sku: String,
  price: Number,
  currency: { type: String, default: 'USD' },
  attributes: mongoose.Schema.Types.Mixed, // size/color etc
  stock: { type: Number, default: 0 }
}, { _id: false });


const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: String,
  shortDescription: String,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true }],
  images: [String], // s3 urls
  variants: [variantSchema], // different versions of the product
  price: Number,        // legacy main price (or compute from variants)
  isActive: { type: Boolean, default: true, index: true },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 }, // number of reviews
  countInStock: { type: Number, default: 0 },
  meta: mongoose.Schema.Types.Mixed  // for any extra metadata
}, { timestamps: true });

// text index for search
productSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });

export default mongoose.model("Product", productSchema);
