import { Router } from "express";
import {
  listShifts,
  getShift,
  createShiftHandler,
  updateShiftHandler,
  deleteShiftHandler,
} from "./shift.controller";

const router = Router();

router.get("/ping", (_req, res) => {
  res.json({ message: "shift router works" });
});

router.get("/", listShifts);
router.get("/:id", getShift);
router.post("/", createShiftHandler);
router.patch("/:id", updateShiftHandler);
router.delete("/:id", deleteShiftHandler);

export default router;