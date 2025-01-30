import express, { Router } from "express";
import { logout, signin, signup, verifyEmail } from "../controllers/auth.controller";


const router: Router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/signin", signin);
router.get("/logout", logout);
router.get("/check-auth", check-auth);

export default router;