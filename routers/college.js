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

router.route("/branch").post(addBranch).get(showBranch);
router.route("/branch/:id").put(editBranch).delete(deleteBranch);
router.route("/course").post(addCourse).get(showCourse);
router.route("/course/:id").put(editCourse).delete(deleteCourse);

export default router;
