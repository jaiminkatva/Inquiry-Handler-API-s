// middleware/upload.js
import multer from "multer";
import { storage } from "../config/cloudinary.js";

// Allow only certain file types
const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, JPG, and PNG are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
