
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { adminAuthenticate } from "../middlewares/adminAuth.js";
import {createProduct, getProducts, getProductBySlug } from "../Controller/productController.js";

const router = express.Router();

// Create product (admin only)
router.post("/",authenticateToken, adminAuthenticate, createProduct);
//update product (admin only)
router.put("/slug/:slug", authenticateToken, adminAuthenticate, updateProduct);
//delete product (admin only)
router.delete("/slug/:slug", authenticateToken, adminAuthenticate, deleteProduct);

// Get all products (public)
router.get("/", getProducts);

// Get single product by slug (public)
router.get("/:slug", getProductBySlug);

export default router;
