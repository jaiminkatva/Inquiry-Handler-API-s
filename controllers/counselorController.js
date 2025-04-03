import Inquiry from "../models/Inquiry.js";

export const getAppointedInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.find({ counselorName: req.user.id });
    res.status(200).json({ myTotalData: inquiry.length, inquiries: inquiry });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.msg, error });
  }
};

export const addRemarks = async (req, res) => {
  res.status(200).json({ msg: "Add Remarks" });
};

export const changeAdmissionStatus = async (req, res) => {
  res.status(200).json({ msg: "Change Admission Status" });
};
