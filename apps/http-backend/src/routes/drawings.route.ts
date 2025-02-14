import express, { Router } from "express";
import { createDrawing, getDrawings, updateTitle, findDrawing } from "../controllers/drawings.controller";
import { verifyToken } from "../middleware/verifyToken";


const router: Router = express.Router();

router.post("/create", verifyToken, createDrawing);
router.get("/get-drawings", verifyToken, getDrawings);
router.post("/update-title", verifyToken, updateTitle);
router.get("/:id", verifyToken, findDrawing);

export default router;