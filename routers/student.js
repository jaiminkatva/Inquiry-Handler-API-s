import { Router } from "express";
import { studentProfile } from "../controllers/studentController.js";
const router = Router();

router.get("/profile", studentProfile);

export default router;
