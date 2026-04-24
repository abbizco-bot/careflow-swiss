import { Router } from "express";
import {
  createEmployeeHandler,
  getEmployeeByIdHandler,
  getEmployeesHandler,
  updateEmployeeHandler,
} from "./employees.controller";

const employeesRouter = Router();

console.log("EMPLOYEES ROUTER FILE LOADED");

employeesRouter.get("/ping", (_req, res) => {
  res.json({ message: "employees router works" });
});

employeesRouter.get("/", getEmployeesHandler);
employeesRouter.get("/:employeeId", getEmployeeByIdHandler);
employeesRouter.post("/", createEmployeeHandler);
employeesRouter.patch("/:employeeId", updateEmployeeHandler);

export default employeesRouter;