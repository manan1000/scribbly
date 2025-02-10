import express, { Router } from "express";
import { createDrawing, getDrawings } from "../controllers/drawings.controller";
import { verifyToken } from "../middleware/verifyToken";


const router: Router = express.Router();

router.post("/create", verifyToken, createDrawing);
router.get("/get-drawings", verifyToken, getDrawings);

export default router;