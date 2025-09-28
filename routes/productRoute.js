
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { adminAuthenticate } from "../middlewares/adminAuth.js";
import { createProduct } from "../controllers/productController.js";

const router = express.Router();

// Create product (admin only)
router.post("/", authenticateToken, adminAuthenticate, createProduct);

export default router;
