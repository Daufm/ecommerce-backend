import express from "express";
import { refreshToken } from "../controller/authController.js";
import passport from "passport";


const router = express.Router();

router.post("/refresh", refreshToken);

router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    // res.redirect('/'); // Redirect to your desired route
    res.json({ message: "Google OAuth successful", user: req.user });
  }
);

export default router;
