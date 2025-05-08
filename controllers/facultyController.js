import Counselor from "../models/Counselor.js";
import Inquiry from "../models/Inquiry.js";
import Faculty from "../models/Faculty.js";
import getNextSequenceValue from "../utils/autoIncrement.js";
import Branch from "../models/Branch.js";
import Course from "../models/Course.js";

export const addInquiry = async (req, res) => {
  try {
    console.log(req.user.id);

    const { email, ...otherData } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const existingInquiry = await Inquiry.findOne({ email });
    if (existingInquiry) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const faculty = await Faculty.findById(req.user.id);
    if (!faculty || !faculty.createdBy) {
      return res
        .status(400)
        .json({ error: "Faculty or associated college not found." });
    }

    const nextId = await getNextSequenceValue("userId");
    if (!nextId) {
      return res.status(500).json({ error: "Failed to generate form number." });
    }

    const inquiryData = {
      ...otherData,
      email,
      formNo: nextId,
      formFillBy: req.user.id,
      college: faculty.createdBy,
    };

    const newInquiry = new Inquiry(inquiryData);
    await newInquiry.save();

    res.status(201).json({
      message: "Inquiry successfully created.",
      inquiry: newInquiry,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
};

export const getFacultyInquiry = async (req, res) => {
  try {
    const getData = await Inquiry.find({ formFillBy: req.user.id })
      .select("-password") // Exclude password from Inquiry schema
      .populate("formFillBy", "facultyName")
      .populate("college", "collegeName")
      .populate("counselorName", "counselorName")
      .populate("course", "courseName")
      .populate("priority_one", "branchName")
      .populate("priority_two", "branchName")
      .populate("priority_three", "branchName");
    res.status(200).json({ my_total_data: getData.length, inquiry: getData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

export const appointInquiry = async (req, res) => {
  try {
    const inquiryId = req.params.id;
    const { counselorId } = req.body;

    // Find the inquiry
    const inquiry = await Inquiry.findById(inquiryId).populate("formFillBy");

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    // Get faculty details
    const faculty = inquiry.formFillBy;

    if (!faculty || !faculty.createdBy) {
      return res
        .status(400)
        .json({ message: "Faculty has no createdBy field" });
    }

    // Find the counselor
    const counselor = await Counselor.findById(counselorId);

    if (!counselor) {
      return res.status(404).json({ message: "Counselor not found" });
    }

    // Ensure the Counselor's createdBy matches Faculty's createdBy
    if (counselor.createdBy.toString() !== faculty.createdBy.toString()) {
      return res.status(403).json({
        message:
          "Unauthorized appointment: Counselor and Faculty must have the same createdBy",
      });
    }

    // Update Inquiry with the appointed counselor
    inquiry.counselorName = counselor._id;
    await inquiry.save();

    res
      .status(200)
      .json({ message: "Counselor appointed successfully", inquiry });
  } catch (error) {
    console.error("Error appointing counselor:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const showAllBranch = async (req, res) => {
  try {
    const loginFaculty = await Faculty.findById(req.user.id);
    const collegeId = loginFaculty.createdBy;
    console.log(collegeId);
    const branches = await Branch.find({
      createdBy: loginFaculty.createdBy,
    }).populate("course", "courseName");
    res
      .status(200)
      .json({ total_branches: branches.length, branches: branches });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  }
};

export const showAllCourse = async (req, res) => {
  try {
    const loginFaculty = await Faculty.findById(req.user.id);
    const collegeId = loginFaculty.createdBy;
    console.log(collegeId);
    const courses = await Course.find({ createdBy: loginFaculty.createdBy });
    res.status(200).json({ total_courses: courses.length, courses: courses });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  }
};

export const showAllCounselor = async (req, res) => {
  try {
    const loginFaculty = await Faculty.findById(req.user.id);
    const collegeId = loginFaculty.createdBy;
    console.log(collegeId);
    const counselors = await Counselor.find({
      createdBy: loginFaculty.createdBy,
    });
    res
      .status(200)
      .json({ total_counselor: counselors.length, counselors: counselors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  }
};

export const getCourseBranches = async (req, res) => {
  try {
    const { id } = req.params;
    const branches = await Branch.find({ course: id });
    res
      .status(200)
      .json({ total_branches: branches.length, branches: branches });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  }
};
