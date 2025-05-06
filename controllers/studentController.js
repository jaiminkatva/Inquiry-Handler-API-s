import Document from "../models/Document.js";
import Student from "../models/Student.js";

export const studentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .populate("inquiry_id", "formNo")
      .populate("confirmBranch", "branchName")
      .populate("college", "collegeName")
      .populate("counselorName", "counselorName")
      .select("-password"); // Don't send password
    console.log(student);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Student profile fetched successfully",
      data: student,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ studentId: req.user.id }).populate(
      "studentId",
      "fullName"
    );

    if (!documents) {
      return res.status(404).json({
        success: false,
        message: "Documents not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Student documents fetched successfully",
      data: documents,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", data: error.message });
  }
};

export const updateStudentProfile = async (req, res) => {
  try {
    const updates = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedStudent) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found", data: null });
    }

    res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Update failed", data: error.message });
  }
};

export const uploadDocuments = async (req, res) => {
  try {
    const studentId = req.user.id;

    const existDoc = await Document.findOne({studentId: studentId})
    if(existDoc){
      res.status(400).json({
        success: false,
        message: "Student already uploaded their document one time.",
        data: existDoc,
      });
    }

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
    console.log(err);

    res.status(500).json({ message: "Upload failed.", error: err.message });
  }
};

export const verifyDocumentStatus = async (req, res) => {
  const { id } = req.params;
  const { field, verified } = req.body;

  if (!field || typeof verified !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Field and verified flag are required.",
      data: null,
      statusCode: 400,
    });
  }

  try {
    const update = {};
    update[`${field}.verified`] = verified;

    let updatedDoc = await StudentDocuments.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({
        success: false,
        message: "Document not found.",
        data: null,
        statusCode: 404,
      });
    }

    // ✅ List of required fields to verify
    const requiredFields = [
      "sscMarksheet",
      "hscMarksheet",
      "leavingCertificate",
      "passportPhoto",
      "adharCard",
      "digitalSignature",
    ];

    const allRequiredVerified = requiredFields.every(
      (field) => updatedDoc[field]?.verified === true
    );

    // ✅ Update status accordingly
    const newStatus = allRequiredVerified ? "approved" : "reupload";

    if (updatedDoc.status !== newStatus) {
      updatedDoc.status = newStatus;
      await updatedDoc.save();
    }

    res.status(200).json({
      success: true,
      message: `Field "${field}" marked as ${
        verified ? "verified" : "unverified"
      }.`,
      data: updatedDoc,
      statusCode: 200,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to verify document.",
      data: null,
      statusCode: 500,
      error: err.message,
    });
  }
};
