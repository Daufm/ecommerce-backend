// src/models/User.js
import mongoose from "mongoose";

// Subdocument schema for addresses
const addressSchema = new mongoose.Schema({
  label: String, // "Home", "Work"
  name: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
  phone: String
}, { _id: false });

// Subdocument schema for refresh tokens
const refreshTokenSchema = new mongoose.Schema({
  tokenHash: String,       // store hashed refresh token for rotation
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  deviceInfo: String
}, { _id: false });


const userSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, index: true },
  passwordHash: { type: String, required: true },
  roles: { type: [String], default: ["customer"] }, // e.g. ['admin']
  addresses: [addressSchema],
  refreshTokens: [refreshTokenSchema],
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isEmailVerified: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
