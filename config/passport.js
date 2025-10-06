import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || `${process.env.BACKEND_URL}/api/auth/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists in the database
      let user = await User.findOne({ email: profile.emails[0].value });
      if (!user) {
        // If not, create a new user
         user = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          passwordHash: "", // No password for OAuth users
          googleId: profile.id,
          roles : ["customer"],
          isEmailVerified: true,
          provider: "google",

        });
        await user.save();
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  }
));