import express, { Router } from "express";
import { checkAuth, logout, signin, signup, verifyEmail } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";


const router: Router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/signin", signin);
router.get("/logout", logout);
router.get("/check-auth", verifyToken, checkAuth);

export default router;