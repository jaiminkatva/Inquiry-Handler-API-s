import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});

export default mongoose.model("Contact", contactSchema);
