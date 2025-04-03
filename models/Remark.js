import mongoose from "mongoose";

const remarkSchema = mongoose.Schema({
  remarks: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  Student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inquiry",
  },
});

export default mongoose.model("Remark", remarkSchema);
