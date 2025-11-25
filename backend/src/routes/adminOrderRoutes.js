import express from "express";
import {
  processOrder,
  getAllOrders,
} from "../controllers/adminOrderController.js";
import protectAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// Get all orders with details
router.get("/", protectAdmin, getAllOrders);

// Update order status / payment
router.put("/:id/process", protectAdmin, processOrder);

export default router;
