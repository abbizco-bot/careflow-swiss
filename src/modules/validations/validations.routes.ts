import { Router } from "express";
import {
  getCoverageShiftsValidationHandler,
  getCoverageShiftValidationByIdHandler,
  getEmployeeConflictValidationHandler,
  getEmployeeOverviewByDateHandler,
  getFullShiftsByDateHandler,
  getShiftOverviewByDateHandler,
  getSituationHistoryHandler,
  getSituationDashboardHandler,
  getSituationSummaryHandler,
  getSituationTrendHandler,
  getQualificationShiftsValidationHandler,
  getQualificationShiftValidationByIdHandler,
  getFullShiftsValidationHandler,
  getFullShiftValidationByIdHandler,
} from "./validations.controller";

const validationsRouter = Router();

validationsRouter.get(
  "/coverage/shifts",
  getCoverageShiftsValidationHandler
);

validationsRouter.get(
  "/coverage/shifts/:shiftId",
  getCoverageShiftValidationByIdHandler
);

validationsRouter.get(
  "/conflicts/employees/:employeeId",
  getEmployeeConflictValidationHandler
);

validationsRouter.get(
  "/employees/overview",
  getEmployeeOverviewByDateHandler
);

validationsRouter.get(
  "/shifts/overview",
  getShiftOverviewByDateHandler
);

validationsRouter.get("/shifts/full", getFullShiftsByDateHandler);

validationsRouter.get("/situation/trend", getSituationTrendHandler);
validationsRouter.get("/situation/history", getSituationHistoryHandler);
validationsRouter.get("/situation/summary", getSituationSummaryHandler);
validationsRouter.get("/situation/dashboard", getSituationDashboardHandler);

validationsRouter.get(
  "/qualification/shifts",
  getQualificationShiftsValidationHandler
);

validationsRouter.get(
  "/qualification/shifts/:shiftId",
  getQualificationShiftValidationByIdHandler
);

validationsRouter.get(
  "/full/shifts",
  getFullShiftsValidationHandler
);

validationsRouter.get(
  "/full/shifts/:shiftId",
  getFullShiftValidationByIdHandler
);

export default validationsRouter;
