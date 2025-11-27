import express from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "../controllers/adminCategoryController.js";
import protectAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Create a new category
router.post("/", protectAdmin, createCategory);

// Get all categories
router.get("/", protectAdmin, getAllCategories);

// Get category by ID
router.get("/:id", protectAdmin, getCategoryById);

// Update category by ID
router.patch("/:id", protectAdmin, updateCategory);

// Delete category by ID
router.delete("/:id", protectAdmin, deleteCategory);

export default router;
