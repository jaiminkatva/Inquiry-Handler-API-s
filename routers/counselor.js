import express from "express";
import {
  addRemarks,
  changeAdmissionStatus,
  getAppointedInquiry,
  getSingleInquiry,
  getStudent,
  getStudentWithDocuments,
} from "../controllers/counselorController.js";
const router = express.Router();

router.get("/showAppointedInquiries", getAppointedInquiry);
router.get("/student", getStudent);
router.get("/studentWithDocument/:id", getStudentWithDocuments);
router.get("/showAppointedInquiries/:id", getSingleInquiry);
router.post("/remarks/:id", addRemarks);
router.patch("/changeStatus/", changeAdmissionStatus);

export default router;
