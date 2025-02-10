import express, { Router } from "express";
import { checkAuth, logout, signin, signup, verifyEmail, getUsername, getToken } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";


const router: Router = express.Router();

router.post("/signup", signup);
router.post("/verify-email", verifyEmail);
router.post("/signin", signin);
router.get("/logout", logout);
router.get("/check-auth", verifyToken, checkAuth);
router.get("/get-username", verifyToken, getUsername);
router.get("/get-token", verifyToken, getToken);

export default router;