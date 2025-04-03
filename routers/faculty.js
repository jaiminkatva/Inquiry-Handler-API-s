import express from "express";
import {
  addInquiry,
  appointInquiry,
  getFacultyInquiry,
} from "../controllers/facultyController.js";
const router = express.Router();

router.post("/inquiry", addInquiry);
router.post("/appointInquiry/:id", appointInquiry);
router.get("/inquiry", getFacultyInquiry);

export default router;
