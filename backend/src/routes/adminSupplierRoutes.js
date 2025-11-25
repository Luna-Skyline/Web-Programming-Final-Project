import express from "express";
import {
  createSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
} from "../controllers/adminSupplierController.js";
import protectAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Create supplier
router.post("/", protectAdmin, createSupplier);

// Get all suppliers
router.get("/", protectAdmin, getAllSuppliers);

// Update supplier by ID
router.put("/:id", protectAdmin, updateSupplier);

// Delete supplier by ID
router.delete("/:id", protectAdmin, deleteSupplier);

export default router;
