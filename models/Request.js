import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
    match: /^[0-9]{10}$/, // Validates a 10-digit mobile number
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Basic email format validation
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  faculty: {
    type: Number,
    required: true,
  },
  counselor: {
    type: Number,
    required: true,
  },
  branch: {
    type: Number,
    required: true,
  },
  course: {
    type: Number,
    required: true,
  },
  question: {
    type: String,
    trim: true,
    default: "", // Optional field
  },
  createdAt: {
    type: Date,
    default: Date.now, // Auto-set the creation date
  },
});

export default mongoose.model("Request", requestSchema);
