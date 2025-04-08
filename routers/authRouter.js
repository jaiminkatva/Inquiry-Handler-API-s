import express from "express";
import { loginAdmin, loginCollege, loginCounselor, loginFaculty } from "../controllers/authController.js";
import { addMasterAdmin } from "../controllers/masterAdminController.js";
const router = express.Router();

router.post("/", addMasterAdmin);

router.post("/login/master", loginAdmin);
router.post("/login/college", loginCollege);
router.post("/login/faculty", loginFaculty);
router.post("/login/counselor", loginCounselor);

export default router;
