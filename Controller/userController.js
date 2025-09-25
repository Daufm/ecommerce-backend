import express from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import SendEmail from "../utils/SendEmail.js";

const router = express.Router();

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
