import jwt from "jsonwebtoken";
import argon2 from "argon2";
import User from "../models/User.js";
import { generateTokens } from "../utils/token.js";



//to use this route in frontend use axios interceptor to call this route when access token expires
//send  refresh token in cookie to get new access token
export const refreshToken = async (req, res) => {
  try {
    //get refresh token from body(send the refresh token in cookie)
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token required" });
    }

    // Verify signature
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) return res.status(403).json({ message: "User not found" });

    // Find matching refresh token in DB
    const storedToken = user.refreshTokens.find(
      (rt) => rt.expiresAt > new Date()
    );

    if (!storedToken) {
      return res.status(403).json({ message: "Refresh token expired or revoked" });
    }

    // Verify token hash
    const isValid = await argon2.verify(storedToken.tokenHash, refreshToken , { type: argon2.argon2id });
    if (!isValid) {
      // 🚨 Possible reuse attack → clear all tokens
      user.refreshTokens = [];
      await user.save();
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Rotate refresh token → remove old, issue new
    user.refreshTokens = user.refreshTokens.filter((rt) => rt._id.toString() !== storedToken._id.toString());
    // Generate new tokens
    const { accessToken, refreshToken: newRefresh } = await generateTokens(user);

    res.status(200).json({ accessToken, refreshToken: newRefresh });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
