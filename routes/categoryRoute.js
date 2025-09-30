import express from "express";
import { adminAuthenticate } from "../middleware/adminAuthticate";
import { createCategory, deleteCategory, getAllCategories, getCategoryByIdOrSlug, updateCategory } from "../controllers/categoryController.js";

const router = express.Router();


//create a new category(admin only)
router.post('/', adminAuthenticate , createCategory)
//get all categories
router.get('/', getAllCategories)
//get a single category by id or slug
router.get('/:identifier', getCategoryByIdOrSlug)
//update a category (admin only)
router.put('/:id', adminAuthenticate , updateCategory)
//delete a category (admin only)
router.delete('/:id', adminAuthenticate , deleteCategory)