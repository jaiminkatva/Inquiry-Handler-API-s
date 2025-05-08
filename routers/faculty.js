import express from "express";
import {
  addInquiry,
  appointInquiry,
  getCourseBranches,
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
router.get("/courseBranch/:id", getCourseBranches);

export default router;
