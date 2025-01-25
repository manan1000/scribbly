import express, { Router } from "express";
import { signup, verifyEmail } from "../controllers/auth.controller";


const router: Router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);

export default router;