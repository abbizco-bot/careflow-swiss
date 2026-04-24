import { Router } from "express";
import {
  createAbsenceHandler,
  getActiveAbsencesHandler,
} from "./absence.controller";

const absenceRouter = Router();

absenceRouter.get("/active", getActiveAbsencesHandler);
absenceRouter.post("/", createAbsenceHandler);

export default absenceRouter;
