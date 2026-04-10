import { Router } from "express";
import {
  createAssignmentHandler,
  deleteAssignmentHandler,
  getAssignment,
  listAssignments,
  updateAssignmentHandler,
} from "./assignment.controller";

const router = Router();

router.get("/", listAssignments);
router.get("/:id", getAssignment);
router.post("/", createAssignmentHandler);
router.patch("/:id", updateAssignmentHandler);
router.delete("/:id", deleteAssignmentHandler);

export default router;