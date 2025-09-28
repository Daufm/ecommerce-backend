// authenticate admin users

import User from "../models/User.js";

export const adminAuthenticate = async (req, res, next) => {
  try {
    const userId = req.user.id; // set by authenticateToken middleware
    const user = await User.findById(userId);

    if (user && user.roles.includes("admin")) {
      next();
    } else {
      res.status(403).json({ message: "Admin access required" });
    }
  } catch (error) {
    console.error("Admin Auth Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
