import express from 'express';
import upload from '../middlewares/upload.js';
import {
  uploadDocuments,
} from '../controllers/studentController.js';

const router = express.Router();

const fileFields = [
  'sscMarksheet', 'hscMarksheet', 'leavingCertificate',
  'passportPhoto', 'adharCard', 'digitalSignature',
  'gujcatAdmitCard', 'gujcatScoreCard',
  'jeeMainAdmitCard', 'jeeMainScoreCard',
  'categoryCertificate', 'incomeCertificate'
].map(name => ({ name, maxCount: 1 }));

// Upload documents
router.post('/upload', upload.fields(fileFields), uploadDocuments);

// router.patch('/:id/verify', verifyDocumentStatus);

// router.patch('/:id/status', updateOverallStatus);

export default router;
