import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import customerAuthRoutes from "./routes/customerAuthRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminCategoryRoutes from "./routes/adminCategoryRoutes.js";
import adminProductRoutes from "./routes/adminProductRoutes.js";
import adminSupplierRoutes from "./routes/adminSupplierRoutes.js";
import adminInventoryRoutes from "./routes/adminInventoryRoutes.js";
import adminOrderRoutes from "./routes/adminOrderRoutes.js";
import adminReportRoutes from "./routes/adminReportRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";

dotenv.config();
const app = express();

// Connect DB
connectDB();

//Allow frontend connection
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: "*",
    allowedHeaders: "*",
  })
);

//Middleware to parse JSON
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Customer Routes
app.use("/api/customers", customerAuthRoutes, customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Admin Routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin/categories", adminCategoryRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/suppliers", adminSupplierRoutes);
app.use("/api/admin/inventory", adminInventoryRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/reports", adminReportRoutes);

// Serve static images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
