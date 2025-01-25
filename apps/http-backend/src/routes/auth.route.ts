import express, { Router } from "express";
import { signup } from "../controllers/auth.controller";


const router: Router = express.Router();

router.post("signup", signup);

export default router;