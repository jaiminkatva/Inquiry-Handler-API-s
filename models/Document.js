// models/StudentDocuments.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
});

const studentDocumentsSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    sscMarksheet: documentSchema,
    hscMarksheet: documentSchema,
    leavingCertificate: documentSchema,
    passportPhoto: documentSchema,
    adharCard: documentSchema,
    digitalSignature: documentSchema,
    gujcatAdmitCard: documentSchema,
    incomeCertificate: documentSchema,
    gujcatScoreCard: documentSchema,
    jeeMainAdmitCard: documentSchema,
    jeeMainScoreCard: documentSchema,
    categoryCertificate: documentSchema,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Document", studentDocumentsSchema);
