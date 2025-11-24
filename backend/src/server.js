import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

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

// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/auth", authRoutes);

// Serve static images
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
