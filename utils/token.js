import jwt from "jsonwebtoken";
import argon2 from "argon2";

export const generateTokens = async (user) => {
  const payload = { id: user._id, email: user.email, roles: user.roles };

  const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

  // Save hashed refresh token
  const tokenHash = await argon2.hash(refreshToken);
  user.refreshTokens.push({
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  await user.save();

  return { accessToken, refreshToken };
};
