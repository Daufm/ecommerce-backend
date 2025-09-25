import express from "express";
import { signIn, createUser ,logOut, forgotPassword ,resetPassword } from '../controllers/userController.js';
import { registerSchema } from "../validators/userValidator.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

router.get('/', signIn);
router.post('/', validate(registerSchema), createUser);
router.post('/verify-email', verifyEmail); 
router.post('/logout', logOut);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);



export default router;
