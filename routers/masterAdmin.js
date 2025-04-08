import { Router } from "express";
import {
  addCollege,
  showCollege,
  deleteCollege,
  showFaculty,
  showCounselor,
  showContact,
  deleteContact,
  showCollegeRequest,
  showSingleCollegeRequest,
  deleteCollegeRequest,
} from "../controllers/masterAdminController.js";

const router = Router();

// Master

router.route("/college").post(addCollege).get(showCollege);
router.route("/college/:id").delete(deleteCollege);

router.route("/faculty").get(showFaculty);

router.route("/counselor").get(showCounselor);

router.route("/contact").get(showContact);
router.route("/contact/:id").delete(deleteContact);

router.route("/request").get(showCollegeRequest);
router
  .route("/request/:id")
  .get(showSingleCollegeRequest)
  .delete(deleteCollegeRequest);

export default router;
