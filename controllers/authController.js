import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import College from "../models/College.js";
import Faculty from "../models/Faculty.js";
import Counselor from "../models/Counselor.js";
import Student from "../models/Student.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔹 Received Email:", email); // Debugging

    const admin = await Admin.findOne({ email });

    console.log("🔹 Found Admin:", admin); // Debugging

    if (!admin)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginCollege = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔹 Received Email:", email); // Debugging

    const college = await College.findOne({ email });

    console.log("🔹 Found College:", college); // Debugging

    if (!college)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, college.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: college._id, role: college.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({ token, college });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔹 Received Email:", email); // Debugging

    const faculty = await Faculty.findOne({ email });

    console.log("🔹 Found College:", faculty); // Debugging

    if (!faculty)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, faculty.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: faculty._id, role: faculty.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({ token, faculty });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginCounselor = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("🔹 Received Email:", email); // Debugging

    const counselor = await Counselor.findOne({ email });

    console.log("🔹 Found College:", counselor); // Debugging

    if (!counselor)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, counselor.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: counselor._id, role: counselor.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({ token, counselor });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });

    if (!student)
      return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.findOne(student.password === password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: student._id, role: student.role },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    res.status(200).json({ token, student });
  } catch (error) {
    console.error("❌ Error during login:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
