import express from "express";
import {
  createInventory,
  getAllInventory,
  updateInventory,
  deleteInventory,
} from "../controllers/adminInventoryController.js";
import protectAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Create inventory
router.post("/", protectAdmin, createInventory);

// Get all inventory records
router.get("/", protectAdmin, getAllInventory);

// Update inventory by ID
router.put("/:id", protectAdmin, updateInventory);

// Delete inventory by ID
router.delete("/:id", protectAdmin, deleteInventory);

export default router;
