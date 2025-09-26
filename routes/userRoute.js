import express from "express";
import { signIn, createUser ,logOut, forgotPassword,verifyEmail ,resetPassword ,getUserProfile } from '../Controller/userController.js';
import { registerSchema } from "../validators/userValidator.js";
import { validate  } from "../middleware/validate.js";
import {authenticateToken} from "../middleware/authMiddleware.js";
const router = express.Router();

router.get('/login', signIn);
router.post('/register', validate(registerSchema), createUser);
router.get('/verify-email', verifyEmail); 
router.post('/logout', logOut);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', authenticateToken, getUserProfile);



export default router;
