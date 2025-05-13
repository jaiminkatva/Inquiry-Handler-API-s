import express from "express";
import {
  addRemarks,
  changeAdmissionStatus,
  getAllBranch,
  getAppointedInquiry,
  getSingleInquiry,
  getStudent,
  getStudentWithDocuments,
} from "../controllers/counselorController.js";
const router = express.Router();

router.get("/showAppointedInquiries", getAppointedInquiry);
router.get("/student", getStudent);
router.get("/branch", getAllBranch);
router.get("/studentWithDocument/:id", getStudentWithDocuments);
router.get("/showAppointedInquiries/:id", getSingleInquiry);
router.post("/remarks/:id", addRemarks);
router.patch("/changeStatus/:id", changeAdmissionStatus);

export default router;
