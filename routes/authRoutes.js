import express from "express";
import { refreshToken } from "../controller/authController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/refresh", refreshToken);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' , session: false }),
  (req, res) => {
    // Successful authentication
    const token = jwt.sign({ id: req.user._id, roles: req.user.roles }, process.env.JWT_SECRET, { expiresIn: '20m' });
    // You can set the token in a cookie or return it in the response
    res.cookie('jwt', 
              token, 
            { httpOnly: true, 
              secure: process.env.NODE_ENV === 'production' },
            { maxAge: 20 * 60 * 1000 }, // 20 minutes
            { sameSite: 'Lax' }
            );

    // res.redirect('/'); // Redirect to your desired route
    res.json({ message: "Google OAuth successful", user: req.user });
  }
);

export default router;
