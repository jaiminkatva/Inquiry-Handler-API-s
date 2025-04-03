import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  formNo: {
    type: Number,
    unique: true,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  parentsMobileNo: {
    type: String,
  },
  address: {
    type: String,
  },
  board: {
    type: String,
  },
  schoolName: {
    type: String,
  },
  referenceName: {
    type: String,
  }, 
  priority_one: {
    type: String,
  },
  priority_two: {
    type: String,
  },
  priority_three: {
    type: String,
  },
  formFillBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  admissionCategory: {
    type: String,
  },
  seatNo: {
    type: String,
  },
  result: {
    type: String,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
  },
  counselorName: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Counselor",
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: ["Open", "SEBC", "SC", "ST", "PH", "EWS"],
  },
  aadharNo: {
    type: String,
    unique: true,
  },
  dateOfBirth: {
    type: Date,
  },
});

export default mongoose.model("Inquiry", inquirySchema);
