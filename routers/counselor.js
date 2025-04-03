import express from "express";
import {
  addRemarks,
  changeAdmissionStatus,
  getAppointedInquiry,
} from "../controllers/counselorController.js";
const router = express.Router();

router.get("/showAppointedInquiries", getAppointedInquiry);
router.post("/remarks", addRemarks);
router.patch("/changeStatus", changeAdmissionStatus);

export default router;
