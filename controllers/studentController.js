// controllers/studentDocuments.controller.js
import Document from "../models/Document.js";

export const uploadDocuments = async (req, res) => {
  try {
    const { studentId } = req.body;

    const fields = [
      "sscMarksheet",
      "hscMarksheet",
      "leavingCertificate",
      "passportPhoto",
      "adharCard",
      "digitalSignature",
      "gujcatAdmitCard",
      "gujcatScoreCard",
      "jeeMainAdmitCard",
      "jeeMainScoreCard",
      "categoryCertificate",
      "incomeCertificate",
    ];

    const documentData = { studentId, status: "pending" };

    for (const field of fields) {
      if (req.files[field]) {
        documentData[field] = {
          url: req.files[field][0].path,
          uploadedAt: new Date(),
          verified: false,
        };
      }
    }

    const savedDoc = await Document.create(documentData);

    res.status(201).json({ message: "Documents uploaded.", data: savedDoc });
  } catch (err) {
    res.status(500).json({ message: "Upload failed.", error: err.message });
  }
};
