import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import SendEmail from "../utils/SendEmail.js";


// const router = express.Router();
// user registration controller
export const createUser = async (req, res) => {
  try {
    const { name, email, password, address} = req.body;
    // validate input(handle more in frontend)
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password
    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    // create user
    const newUser = new User({ name, email, passwordHash });
     if (address) {
        newUser.addresses.push({
            label: address.label || "Home",
            name: address.name,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            phone: address.phone,
        });
        }

    await newUser.save();

    // generate verification token
    const payload = { email: newUser.email, id: newUser._id };
    const verificationToken = jwt.sign(payload, process.env.JWT_EMAIL_SECRET, {
      expiresIn: "10m",
    });

    // build verification link
    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // queue email (for now: send directly)
    const emailHtml = `<p>Hi ${name},</p>
                       <p>Please verify your email:</p>
                       <a href="${verificationLink}">Verify Email</a>
                       <p>This link expires in 10 minutes.</p>`;
    await SendEmail(email, "Email Verification", emailHtml);

    // send response (without sensitive info)
    res.status(201).json({
      message: "User created successfully. Please check your email to verify.",
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};


// login controller
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email before signing in" });
    }

    const validPassword = await argon2.verify(user.passwordHash, password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // JWT tokens
    const payload = { id: user._id, email: user.email, roles: user.roles };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });



    // Ideally: store hashed refreshToken in DB
    user.refreshTokens.push({
      tokenHash: await argon2.hash(refreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      deviceInfo: req.headers["user-agent"] || "unknown"
    });
    await user.save();


     
    //set refresh token in httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      message: "Sign-in successful",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email, roles: user.roles },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};




// verify email controller
export const verifyEmail = async (req, res) => {
  
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Verification token is required" });
    }
    // verify token
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_EMAIL_SECRET);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Find user and update isEmailVerified
    const user = await User.findOne({ _id: payload.id, email: payload.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isEmailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }
    user.isEmailVerified = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

}

// logout controller
export const logOut = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }
    // Verify token
    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Find user
    const user = await User.findById(payload.id);
    if (!user) return res.status(403).json({ message: "User not found" });

    // Remove refresh token from user's list
    user.refreshTokens = user.refreshTokens.filter(
      async (rt) => !(await argon2.verify(rt.tokenHash, refreshToken))
    );

     //this is another way to remove the token(if you don't want to use filter)
   /*  
     const newTokens = [];
      for (const rt of user.refreshTokens) {
        const match = await argon2.verify(rt.tokenHash, refreshToken);
        if (!match) newTokens.push(rt); // keep all except the one being logged out
      }
      user.refreshTokens = newTokens;
   */

    await user.save();

    // Clear cookie
    res.clearCookie("refreshToken" ,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

     res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};