import { Router } from "express";
import {
  getDocuments,
  studentProfile,
  updateStudentProfile,
  uploadDocuments,
} from "../controllers/studentController.js";
import upload from "../middlewares/upload.js";
const router = Router();


const fileFields = [
  'sscMarksheet', 'hscMarksheet', 'leavingCertificate',
  'passportPhoto', 'adharCard', 'digitalSignature',
  'gujcatAdmitCard', 'gujcatScoreCard',
  'jeeMainAdmitCard', 'jeeMainScoreCard',
  'categoryCertificate', 'incomeCertificate'
].map(name => ({ name, maxCount: 1 }));

// Upload documents
router.post('/upload', upload.fields(fileFields), uploadDocuments);

router.get("/profile", studentProfile);
router.get("/documents", getDocuments);
router.put("/updateProfile", updateStudentProfile);

export default router;
