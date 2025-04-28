import express from "express";
import {
  createEntity,
  getEntities,
  deleteEntity,
  updateEntity,
  addBranch,
  showBranch,
  addCourse,
  showCourse,
  editBranch,
  deleteBranch,
  editCourse,
  deleteCourse,
  getAllInquiryOfCollege,
  getSingleInquiry,
  updateInquiry,
  deleteInquiry,
} from "../controllers/collegeController.js";
import Faculty from "../models/Faculty.js";
import Counselor from "../models/Counselor.js";

const router = express.Router();

const entities = [
  { path: "faculty", model: Faculty },
  { path: "counselor", model: Counselor },
];

entities.forEach(({ path, model }) => {
  router.post(`/${path}`, createEntity(model));
  router.get(`/${path}`, getEntities(model));
  router.put(`/${path}/:id`, updateEntity(model));
  router.delete(`/${path}/:id`, deleteEntity(model));
});

router.get("/inquiries", getAllInquiryOfCollege);
router
  .route("/inquiry/:id")
  .get(getSingleInquiry)
  .put(updateInquiry)
  .delete(deleteInquiry);
router.route("/branch").post(addBranch).get(showBranch);
router.route("/branch/:id").patch(editBranch).delete(deleteBranch);
router.route("/course").post(addCourse).get(showCourse);
router.route("/course/:id").put(editCourse).delete(deleteCourse);

export default router;
