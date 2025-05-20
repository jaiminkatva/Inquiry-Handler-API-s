import Branch from "../models/Branch.js";
import Course from "../models/Course.js";
import Inquiry from "../models/Inquiry.js";
import Student from "../models/Student.js";
import mongoose from "mongoose";
const userId = new mongoose.Types.ObjectId(req.user.id);

// ✅ Course-wise Inquiry Count (include 0 inquiries)
export const resultInquiry = await Course.aggregate([
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
export const resultStudent = await Branch.aggregate([
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
