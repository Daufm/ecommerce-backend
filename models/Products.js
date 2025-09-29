// src/models/Product.js
import pkg from 'joi';
const { types } = pkg;
import mongoose from "mongoose";

// Subdocument schema for product variants
const variantSchema = new mongoose.Schema({
  sku: String,
  price: Number,
  currency: { type: String, default: 'USD' },
  attributes: mongoose.Schema.Types.Mixed, // size/color etc
  stock: { type: Number, default: 0 }
}, { _id: false });

// Reviews subdocument schema
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: { type: Number, min: 1, max: 5 },
  comment: String
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  description: String,
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true }],
  images: [String], // s3 urls
  brand: { type: String, index: true },
  variants: { type: [variantSchema], default: [] }, // different versions of the product
  price: { type: Number, required: true }, // legacy main price (or compute from variants)
  isActive: { type: Boolean, default: true, index: true },
  reviews: { type: [reviewSchema], default: [] }, // user reviews
  reviewsCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }, // average rating
  meta: mongoose.Schema.Types.Mixed  // for any extra metadata
}, { timestamps: true });

// text index for search
productSchema.index({ name: 'text', slug: 'text', description: 'text', brand: 'text' });

export default mongoose.model("Product", productSchema);
