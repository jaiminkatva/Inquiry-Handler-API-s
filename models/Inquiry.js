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
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  priority_one: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  priority_two: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  priority_three: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  formFillBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
  },
  status: {
    type: String,
    enum: ["Pending", "In-Process", "Cancel"],
    default: "Pending",
  },
  admissionCategory: {
    type: String,
    enum: ["ACPC", "MQ", "VQ", "TFW"],
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
  UDISE_NO: {
    type: String,
    require: true,
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
