import express from "express";
import { adminAuthenticate } from "../middleware/adminAuthticate.js";
import { createCategory, deleteCategory, getAllCategories, getCategoryBySlug, updateCategory } from "../Controller/categoryController.js";
import {authenticateToken } from "../middleware/authMiddleware.js";
const router = express.Router();


//create a new category(admin only)
router.post('/', authenticateToken, adminAuthenticate, createCategory)
//get all categories
router.get('/', getAllCategories)
//get a single category by id or slug
router.get('/:slug', getCategoryBySlug)
//update a category (admin only)
router.put('/:slug', authenticateToken, adminAuthenticate, updateCategory)
//delete a category (admin only)
router.delete('/:slug', authenticateToken, adminAuthenticate, deleteCategory)


export default router;