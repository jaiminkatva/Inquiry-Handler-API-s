import Admin from "../models/Admin.js";
import College from "../models/College.js";
import Faculty from "../models/Faculty.js";
import Counselor from "../models/Counselor.js";
import Contact from "../models/Contact.js";
import Request from "../models/Request.js";

export const addMasterAdmin = async (req, res) => {
  const addMaster = await Admin.create(req.body);
  res.status(200).json({ addMaster });
};

// College COntrollers
// Add College
export const addCollege = async (req, res) => {
  try {
    const college = await College.create(req.body);
    res.status(200).json({ college });
  } catch (error) {
    console.log("Server Error : " + error);
    res.status(500).json({ msg: "Server Error", error });
  }
};

// Show College
export const showCollege = async (req, res) => {
  console.log(req.user);
  try {
    const colleges = await College.find();
    res.status(200).json({ colleges });
  } catch (error) {
    console.log("Server Error : " + error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Delete College
export const deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteSingleCollege = await College.findByIdAndDelete(id);

    if (!deleteSingleCollege) {
      res.status(404).send("College Not Found");
    }

    res
      .status(200)
      .json({ msg: "Delete College Successfully", deleteSingleCollege });
  } catch (error) {
    console.log("Server Error : " + error);
    res.status(500).json({ msg: error.msg, error });
  }
};

// Show Faculty
export const showFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find();
    res.status(200).json({ faculty });
  } catch (error) {
    console.log("Server Error : " + error);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Show Counselor
export const showCounselor = async (req, res) => {
  try {
    const counselor = await Counselor.find();
    res.status(200).json({ counselor });
  } catch (error) {
    console.log("Server Error : " + error);
    res.status(500).json({ msg: error.msg, error });
  }
};

// Show Contact Leads
export const showContact = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({ contacts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.msg, error });
  }
};

// Delete Contact Leads
export const deleteContact = async (req, res) => {
  try {
    const contacts = await Contact.findByIdAndDelete(req.params.id);
    if (!contacts) {
      return res.status(404).json({ msg: "Data not found" });
    }
    res.status(200).json({ msg: "Data Deleted Successfully", contacts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.msg, error });
  }
};

// Show all college requests
export const showCollegeRequest = async (req, res) => {
  try {
    const reqCollege = await Request.find();
    res.status(200).json({ reqCollege });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.msg, error });
  }
};

// Show single college requests details
export const showSingleCollegeRequest = async (req, res) => {
  try {
    const reqCollege = await Request.findById(req.params.id);
    if (!reqCollege) {
      return res.status(404).json({ msg: "Data not found" });
    }
    res.status(200).json({ reqCollege });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.msg, error });
  }
};

// Delete college requests
export const deleteCollegeRequest = async (req, res) => {
  try {
    const reqCollege = await Request.findByIdAndDelete(req.params.id);
    if (!reqCollege) {
      return res.status(404).json({ msg: "Data not found" });
    }
    res.status(200).json({ msg: "Data Deleted Successfully", reqCollege });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.msg, error });
  }
};
