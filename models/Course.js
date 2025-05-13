import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseName: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College", // Assuming 'User' model for tracking who created the course
    required: true,
  },
});

export default mongoose.model("Course", courseSchema);
