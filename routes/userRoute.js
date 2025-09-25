import express from "express";
import { signIn, createUser ,logOut} from '../controllers/userController.js';
import { registerSchema } from "../validators/userValidator.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

router.get('/', signIn);
router.post('/', validate(registerSchema), createUser);
router.post('/verify-email', verifyEmail); 
router.post('/logout', logOut);



export default router;
