import Branch from "../models/Branch.js";
import Course from "../models/Course.js";
import Inquiry from "../models/Inquiry.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";

export const getCourseWiseInquiryCount = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // ✅ Course-wise Inquiry Count (include 0 inquiries)
    const resultInquiry = await Course.aggregate([
      {
        $match: { createdBy: userId },
      },
      {
        $lookup: {
          from: "inquiries",
          let: { courseId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$course", "$$courseId"] },
                    { $eq: ["$college", userId] },
                  ],
                },
              },
            },
          ],
          as: "relatedInquiries",
        },
      },
      {
        $project: {
          _id: 0,
          courseId: "$_id",
          courseName: 1,
          inquiryCount: { $size: "$relatedInquiries" },
        },
      },
    ]);

    // ✅ Branch-wise Student Count (include 0 students)
    const resultStudent = await Branch.aggregate([
      {
        $match: { createdBy: userId },
      },
      {
        $lookup: {
          from: "students",
          let: { branchId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$confirmBranch", "$$branchId"] },
                    { $eq: ["$college", userId] },
                  ],
                },
              },
            },
          ],
          as: "relatedStudents",
        },
      },
      {
        $project: {
          _id: 0,
          branchId: "$_id",
          branchName: 1,
          course: 1,
          studentCount: { $size: "$relatedStudents" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Filtered course-wise inquiries and branch-wise student data",
      data: {
        courseWiseInquiry: resultInquiry,
        branchWiseStudents: resultStudent,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.error("Error getting filtered course/branch-wise data:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
      statusCode: 500,
    });
  }
};

export const createEntity = (Model) => async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const existingEntity = await Model.findOne({ email: req.body.email });
    if (existingEntity) {
      return res.status(400).json({ msg: `${Model.modelName} already exists` });
    }

    const newEntity = new Model({ ...req.body, createdBy: req.user.id });
    await newEntity.save();
    res.status(201).json({
      msg: `${Model.modelName} added successfully`,
      data: newEntity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const getEntities = (Model) => async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const entities = await Model.find({ createdBy: req.user.id }).populate(
      "createdBy",
      ["username", "collegeName"]
    );
    res.status(200).json({ Total_Data: entities.length, Data: entities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteEntity = (Model) => async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const entity = await Model.findById(id);
    if (!entity) {
      return res.status(404).json({ msg: `${Model.modelName} not found` });
    }

    if (entity.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: `Unauthorized to delete this ${Model.modelName}` });
    }

    await Model.findByIdAndDelete(id);
    res.status(200).json({ msg: `${Model.modelName} deleted successfully` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const updateEntity = (Model) => async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const entity = await Model.findById(id);
    if (!entity) {
      return res.status(404).json({ msg: `${Model.modelName} not found` });
    }

    if (entity.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: `Unauthorized to update this ${Model.modelName}` });
    }

    Object.assign(entity, req.body);
    await entity.save();

    res
      .status(200)
      .json({ msg: `${Model.modelName} updated successfully`, entity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Branch
export const addBranch = async (req, res) => {
  try {
    const { branchName, course, seats, filled_seats } = req.body;

    // Check if the course exists and is created by the logged-in user
    const existCourse = await Course.findOne({
      _id: course,
      createdBy: req.user.id,
    });

    if (!existCourse) {
      return res.status(400).json({
        message: "Course not found or not authorized",
      });
    }

    const existBranch = await Branch.findOne({
      branchName: branchName,
      createdBy: req.user.id,
    });

    if (existBranch) {
      return res.status(400).json({
        message: "Branch already exist",
      });
    }

    const newBranch = new Branch({
      branchName,
      course,
      seats,
      remaining_seats: seats,
      filled_seats,
      createdBy: req.user.id,
    });

    await newBranch.save();

    res.status(201).json({
      message: "Branch added successfully",
      data: newBranch,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const showBranch = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const branches = await Branch.find({ createdBy: req.user.id })
      .populate("createdBy", ["username", "collegeName"])
      .populate("course", "courseName");

    res.status(200).json({ branches });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({ msg: "Branch not found" });
    }

    if (branch.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to delete this branch" });
    }

    await Branch.findByIdAndDelete(id);
    res.status(200).json({ msg: "Branch deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const editBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { branchName, course, seats, remaining_seats, filled_seats } =
      req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const branch = await Branch.findById(id);
    if (!branch) {
      return res.status(404).json({ msg: "Branch not found" });
    }

    if (branch.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to update this branch" });
    }

    if (branchName) branch.branchName = branchName;
    if (course) branch.course = course;
    if (seats) branch.seats = seats;
    if (remaining_seats) branch.remaining_seats = remaining_seats;
    if (filled_seats) branch.filled_seats = filled_seats;

    await branch.save();

    res.status(200).json({ msg: "Branch updated successfully", branch });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Course
export const addCourse = async (req, res) => {
  try {
    const { courseName } = req.body;

    const existCourse = await Course.findOne({
      courseName: courseName,
      createdBy: req.user.id,
    });

    if (existCourse) {
      return res.status(400).json({
        message: "Course already exist",
      });
    }

    const newCourse = new Course({
      courseName,
      createdBy: req.user.id,
    });

    await newCourse.save();

    res
      .status(201)
      .json({ msg: "Course added successfully", course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const showCourse = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const courses = await Course.find({ createdBy: req.user.id }).populate(
      "createdBy",
      ["username", "collegeName"]
    );

    res.status(200).json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to delete this course" });
    }

    await Course.findByIdAndDelete(id);
    res.status(200).json({ msg: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseName } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ msg: "Unauthorized: No user ID found" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    if (course.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ msg: "Unauthorized to update this course" });
    }

    if (courseName) course.courseName = courseName;

    await course.save();

    res.status(200).json({ msg: "Course updated successfully", course });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update Inquiry
export const updateInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the inquiry and check if it belongs to the current college
    const inquiry = await Inquiry.findOne({ _id: id, college: req.user.id });

    if (!inquiry) {
      return res
        .status(404)
        .json({ message: "Inquiry not found or unauthorized access" });
    }

    // Update inquiry
    const updatedInquiry = await Inquiry.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Inquiry updated successfully",
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get All Inquiries of College
export const getAllInquiryOfCollege = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ college: req.user.id })
      .populate("course", "courseName")
      .populate("priority_one", "branchName")
      .populate("priority_two", "branchName")
      .populate("priority_three", "branchName")
      .populate("formFillBy", "facultyName")
      .populate("college", "collegeName")
      .populate("counselorName", "counselorName");

    res.status(200).json({ inquiries });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get Single Inquiry
export const getSingleInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findOne({ _id: id, college: req.user.id })
      .populate("course")
      .populate("priority_one")
      .populate("priority_two")
      .populate("priority_three")
      .populate("formFillBy")
      .populate("college")
      .populate("counselorName");

    if (!inquiry) {
      return res
        .status(404)
        .json({ message: "Inquiry not found or unauthorized access" });
    }

    res.status(200).json({ inquiry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Single Inquiry
export const deleteInquiry = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the inquiry exists and belongs to the current college
    const inquiry = await Inquiry.findOne({ _id: id, college: req.user.id });

    if (!inquiry) {
      return res
        .status(404)
        .json({ message: "Inquiry not found or unauthorized access" });
    }

    // Delete the inquiry
    await Inquiry.findByIdAndDelete(id);

    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
