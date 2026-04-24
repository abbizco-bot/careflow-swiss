import { Router } from "express";
import {
  createPlanningMonthHandler,
  createPlanningShiftTemplateHandler,
  deletePlanningShiftTemplateHandler,
  getPlanningMonthHandler,
  getPlanningShiftTemplateHandler,
  initializePlanningDaysHandler,
  listPlanningShiftTemplatesHandler,
  listPlanningMonthsHandler,
  updatePlanningShiftTemplateHandler,
} from "./planning-months.controller";
import { getPlanningMonthComparisonHandler } from "../planning-comparison/planning-comparison.controller";

const planningMonthsRouter = Router();

planningMonthsRouter.get("/", listPlanningMonthsHandler);
planningMonthsRouter.get("/:id", getPlanningMonthHandler);
planningMonthsRouter.get("/:id/comparison", getPlanningMonthComparisonHandler);
planningMonthsRouter.post("/", createPlanningMonthHandler);
planningMonthsRouter.post("/:id/initialize-days", initializePlanningDaysHandler);
planningMonthsRouter.get(
  "/days/:planningDayId/shift-templates",
  listPlanningShiftTemplatesHandler
);
planningMonthsRouter.post(
  "/days/:planningDayId/shift-templates",
  createPlanningShiftTemplateHandler
);
planningMonthsRouter.get(
  "/shift-templates/:id",
  getPlanningShiftTemplateHandler
);
planningMonthsRouter.patch(
  "/shift-templates/:id",
  updatePlanningShiftTemplateHandler
);
planningMonthsRouter.delete(
  "/shift-templates/:id",
  deletePlanningShiftTemplateHandler
);

export default planningMonthsRouter;
