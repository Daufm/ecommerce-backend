
import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { adminAuthenticate } from "../middleware/adminAuthticate.js";
import {createProduct,
        getProducts,
       updateProduct,
       deleteProduct,
        getProductReviews,
        addProductReview, 
        getProductBySlug ,getProductsByCategory} from "../Controller/productController.js";

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

// Add product review (authenticated users)
router.post('/slug/:slug/reviews', authenticateToken, addProductReview);

// Get product reviews
router.get('/slug/:slug/reviews', getProductReviews);

//get by catagory
router.get("/category/:category", getProductsByCategory);

export default router;
