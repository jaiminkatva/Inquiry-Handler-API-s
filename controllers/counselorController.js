import Inquiry from "../models/Inquiry.js";
import Remark from "../models/Remark.js";

export const getAppointedInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.find({ counselorName: req.user.id });
    res.status(200).json({ myTotalData: inquiry.length, inquiries: inquiry });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.msg, error });
  }
};

export const getSingleInquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const getInquiry = await Inquiry.findById(id);
    const getRemarks = await Remark.find({ student: id });
    res.status(200).json({ inquiries: [getInquiry, getRemarks] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.msg, error });
  }
};

export const addRemarks = async (req, res) => {
  try {
    const remark = new Remark({
      remarks: req.body.remarks,
      student: req.params.id,
    });

    remark.save();

    res.status(201).json({ remark: remark });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const changeAdmissionStatus = async (req, res) => {
  res.status(200).json({ msg: "Change Admission Status" });
};
