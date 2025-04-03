import express from "express";
import { loginAdmin, loginCollege, loginFaculty } from "../controllers/authController.js";
import { addMasterAdmin } from "../controllers/masterAdminController.js";
const router = express.Router();

router.post("/", addMasterAdmin);

router.post("/login", loginAdmin);
router.post("/loginCollege", loginCollege);
router.post("/loginFaculty", loginFaculty);

export default router;
