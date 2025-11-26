import express from "express";
import { getCategoriesByGenre } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/by-genre", getCategoriesByGenre);

export default router;
