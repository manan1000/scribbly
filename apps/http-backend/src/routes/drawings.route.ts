import express, { Router } from "express";
import { getDrawings } from "../controllers/drawings.controller";
import { verifyToken } from "../middleware/verifyToken";


const router: Router = express.Router();

router.get("/", verifyToken, getDrawings);

export default router;