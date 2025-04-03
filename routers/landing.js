import express from "express";
import { addContact, addRequest } from "../controllers/landingPageController.js";
const router = express.Router();

router.post("/contact-form", addContact);
router.post("/college-request", addRequest);

export default router;
