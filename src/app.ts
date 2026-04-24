import express from "express";
import cors from "cors";
import shiftRouter from "./modules/shifts/shift.routes";
import assignmentRouter from "./modules/assignments/assignment.routes";
import employeesRouter from "./modules/employees/employees.routes";
import leadershipViewRouter from "./modules/leadership-view/leadership-view.routes";
import validationsRouter from "./modules/validations/validations.routes";
import absenceRouter from "./modules/absences/absence.routes";
import availabilityRequestsRouter from "./modules/availability-requests/availability-requests.routes";

type CreateAppOptions = {
  includeValidations?: boolean;
};

export function createApp(_options: CreateAppOptions = {}) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({ message: "CareFlow API läuft." });
  });

  app.use("/shifts", shiftRouter);
  app.use("/assignments", assignmentRouter);
  app.use("/employees", employeesRouter);
  app.use("/validations", validationsRouter);
  app.use("/leadership", leadershipViewRouter);
  app.use("/absences", absenceRouter);
  app.use("/availability-requests", availabilityRequestsRouter);

  return app;
}
