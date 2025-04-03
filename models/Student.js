import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  photo: {
    type: String, // Store image URL or file path
  },
  fullName: {
    type: String,
    required: true,
  },
  permanentAddress: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  fatherMobileNo: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  placeOfBirth: {
    type: String,
  },
  citizenship: {
    type: String,
  },
  category: {
    type: String,
    enum: ["Open", "SEBC", "SC", "ST", "PH", "EWS"],
    required: true,
  },
  aadharNo: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  hscDetails: {
    board: {
      type: String,
      required: true,
    },
    centreNo: {
      type: String,
    },
    seatNo: {
      type: String,
    },
    monthYearOfPassing: {
      type: String,
    },
    group: {
      type: String,
      enum: ["A", "B", "AB"],
    },
    result: {
      type: String,
    },
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Student", studentSchema);
