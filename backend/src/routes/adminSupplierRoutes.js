import express from "express";
import {
  createSupplier,
  getAllSuppliers,
  updateSupplier,
  deleteSupplier,
  getSupplierById,
} from "../controllers/adminSupplierController.js";
import protectAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Create supplier
router.post("/", protectAdmin, createSupplier);

// Get all suppliers
router.get("/", protectAdmin, getAllSuppliers);

// Get supplier by ID
router.get("/:id", protectAdmin, getSupplierById);

// Update supplier by ID
router.patch("/:id", protectAdmin, updateSupplier);

// Delete supplier by ID
router.delete("/:id", protectAdmin, deleteSupplier);

export default router;
