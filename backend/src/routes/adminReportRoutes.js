import express from "express";
import { generateSalesReport } from "../controllers/adminReportController.js";
import protectAdmin from "../middleware/authAdmin.js";

const router = express.Router();

// GET /api/admin/reports/sales
router.get("/sales", protectAdmin, generateSalesReport);

export default router;
