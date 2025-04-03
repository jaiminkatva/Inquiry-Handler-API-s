import Contact from "../models/Contact.js";
import Request from "../models/Request.js";

export const addContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ contact });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error", error });
  }
};

export const addRequest = async (req, res) => {
  try {
    const reqCollege = await Request.create(req.body);
    res.status(201).json({ reqCollege });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server Error", error });
  }
};
