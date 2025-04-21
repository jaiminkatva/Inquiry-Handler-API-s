import Inquiry from "../models/Inquiry.js";
import Remark from "../models/Remark.js";
import Student from "../models/Student.js";

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
    const { inquiryId, status } = req.body;

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
          confirmBranch: inquiry.priority_one,
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

      case "Admitted":
        // Update Inquiry Status
        inquiry.status = "Admitted";
        await inquiry.save();

        // Find the Branch
        const branch = await Branch.findById(inquiry.priority_one);
        if (!branch) {
          return res.status(404).json({ message: "Branch not found" });
        }

        // Check seat availability
        if (branch.remaining_seats <= 0) {
          return res
            .status(400)
            .json({ message: "No remaining seats in this branch" });
        }

        // Update seat counters
        branch.remaining_seats -= 1;
        branch.filled_seats += 1;
        await branch.save();

        return res.status(200).json({
          message: "Status updated to Admitted and branch seat count updated",
          branchDetails: {
            branchName: branch.branchName,
            filled_seats: branch.filled_seats,
            remaining_seats: branch.remaining_seats,
          },
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
