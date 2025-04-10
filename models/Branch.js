import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    unique: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  seats: {
    type: Number,
    required: true,
  },
  remaining_seats: {
    type: Number,
  },
  filled_seats: { type: Number },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College", // Assuming 'User' model for tracking who created the branch
    required: true,
  },
});

export default mongoose.model("Branch", branchSchema);
