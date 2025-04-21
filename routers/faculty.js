import express from "express";
import {
  addInquiry,
  appointInquiry,
  getFacultyInquiry,
  showAllBranch,
  showAllCounselor,
  showAllCourse,
} from "../controllers/facultyController.js";
const router = express.Router();

router.post("/inquiry", addInquiry);
router.get("/branch", showAllBranch);
router.get("/course", showAllCourse);
router.get("/counselor", showAllCounselor);
router.get("/inquiry", getFacultyInquiry);
router.post("/appointInquiry/:id", appointInquiry);

export default router;
