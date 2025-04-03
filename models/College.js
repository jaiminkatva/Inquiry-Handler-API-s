import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const collegeSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    collegeName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, // Email validation
    },
    mobileNo: {
      type: String,
      match: /^[0-9]{10}$/, // Ensures exactly 10 digits
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Enforce password length
    },
    role: {
      type: String,
      default: "College",
    },
  },
  { timestamps: true }
);

// Hash password before saving
collegeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

export default mongoose.model("College", collegeSchema);
