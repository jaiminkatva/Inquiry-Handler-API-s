import Inquiry from "../models/Inquiry.js";
import Remark from "../models/Remark.js";
import Student from "../models/Student.js";
import Branch from "../models/Branch.js";
import Document from "../models/Document.js";
import Counselor from "../models/Counselor.js";

export const getAppointedInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.find({ counselorName: req.user.id })
      .populate("formFillBy", "facultyName")
      .populate("college", "collegeName")
      .populate("counselorName", "counselorName")
      .populate("course", "courseName")
      .populate("priority_one", "branchName")
      .populate("priority_two", "branchName")
      .populate("priority_three", "branchName");
    res.status(200).json({ myTotalData: inquiry.length, inquiries: inquiry });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.msg, error });
  }
};

export const getSingleInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const getInquiry = await Inquiry.findById(id);
    const getRemarks = await Remark.find({ student: id });
    res.status(200).json({ inquiries: [getInquiry, getRemarks] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.msg, error });
  }
};

export const getAllBranch = async (req, res) => {
  try {
    const loginCounselor = await Counselor.findById(req.user.id);
    const collegeId = loginCounselor.createdBy;
    console.log(collegeId);
    const branches = await Branch.find({
      createdBy: loginCounselor.createdBy,
    }).populate("course", "courseName");
    res
      .status(200)
      .json({ total_branches: branches.length, branches: branches });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  }
};

export const addRemarks = async (req, res) => {
  try {
    const remark = new Remark({
      remarks: req.body.remarks,
      student: req.params.id,
    });

    remark.save();

    res.status(201).json({ remark: remark });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const changeAdmissionStatus = async (req, res) => {
  try {
    const { confirmBranch, inquiryId, status } = req.body;

    const inquiry = await Inquiry.findById(inquiryId);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    switch (status) {
      case "Pending":
        inquiry.status = "Pending";
        await inquiry.save();
        return res.status(200).json({ message: "Status updated to Pending" });

      case "In-Process":
        // Prepare student data from inquiry
        const studentData = {
          inquiry_id: inquiry._id,
          fullName: inquiry.fullName,
          address: inquiry.address,
          mobileNo: inquiry.mobileNo,
          parentsMobileNo: inquiry.parentsMobileNo,
          dateOfBirth: inquiry.dateOfBirth,
          gender: inquiry.gender || "Male", // Optional: set default if gender is missing
          category: inquiry.category,
          aadharNo: inquiry.aadharNo,
          email: inquiry.email,
          password: inquiry.password,
          course: inquiry.course,
          confirmBranch: confirmBranch,
          hscDetails: {
            board: inquiry.board,
            result: inquiry.result,
          },
          college: inquiry.college,
          counselorName: inquiry.counselorName,
        };

        const newStudent = new Student(studentData);
        await newStudent.save();

        inquiry.status = "In-Process";
        await inquiry.save();

        return res.status(201).json({
          message: "Student created and status updated to In-Process",
          student: newStudent,
        });

      case "Cancel":
        inquiry.status = "Cancel";
        await inquiry.save();
        return res.status(200).json({ message: "Admission Cancelled" });

      default:
        return res.status(400).json({ message: "Invalid status" });
    }
  } catch (error) {
    console.error("Error in changeAdmissionStatus:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getStudent = async (req, res) => {
  try {
    const students = await Student.find({
      counselorName: req.user.id,
    })
      .populate("confirmBranch", "branchName")
      .populate("college", "collegeName")
      .populate("counselorName", "counselorName");
    if (!students) {
      res.status(404).json({ msg: "Student not found" });
    }
    res.status(200).json({ totalStudents: students.length, student: students });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "server error", error });
  }
};

export const getStudentWithDocuments = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("confirmBranch", "name")
      .populate("college", "name")
      .populate("counselorName", "fullName email")
      .lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found.",
        data: null,
        statusCode: 404,
      });
    }

    const documents = await Document.find({ studentId: req.params.id }).lean();

    const studentData = {
      ...student,
      documents: documents.length > 0 ? documents : null,
    };

    res.status(200).json({
      success: true,
      message: "Student with documents fetched successfully.",
      data: studentData,
      statusCode: 200,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student.",
      data: null,
      statusCode: 500,
      error: err.message,
    });
  }
};

export const verifyStudentDocument = async (req, res) => {
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

    let updatedDoc = await Document.findByIdAndUpdate(
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
