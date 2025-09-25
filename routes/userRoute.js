import express from "express";
import { getUsers, createUser } from '../controllers/userController.js';
import { registerSchema } from "../validators/userValidator.js";
import { validate } from "../middleware/validate.js";
const router = express.Router();

router.get('/', getUsers);
router.post('/', validate(registerSchema), createUser);



export default router;
