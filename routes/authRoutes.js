import express from "express";
import { refreshToken } from "../controller/authController.js";

const router = express.Router();

router.post("/refresh", refreshToken);

export default router;
