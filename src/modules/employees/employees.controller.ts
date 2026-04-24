import type { Request, Response } from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
} from "./employees.service";

function parseEmployeeId(value: string): number {
  const employeeId = Number(value);

  if (!Number.isInteger(employeeId) || employeeId <= 0) {
    throw new Error("Invalid employeeId parameter.");
  }

  return employeeId;
}

function readRouteParam(value: string | string[] | undefined): string {
  if (typeof value !== "string") {
    throw new Error("Invalid employeeId parameter.");
  }

  return value;
}

export async function getEmployeesHandler(
  _req: Request,
  res: Response
): Promise<void> {
  const result = await getAllEmployees();
  res.status(200).json(result);
}

export async function getEmployeeByIdHandler(
  req: Request,
  res: Response
): Promise<void> {
  const employeeId = parseEmployeeId(readRouteParam(req.params.employeeId));
  const result = await getEmployeeById(employeeId);
  res.status(200).json(result);
}

export async function createEmployeeHandler(
  req: Request,
  res: Response
): Promise<void> {
  const result = await createEmployee(req.body);
  res.status(201).json(result);
}

export async function updateEmployeeHandler(
  req: Request,
  res: Response
): Promise<void> {
  const employeeId = parseEmployeeId(readRouteParam(req.params.employeeId));
  const result = await updateEmployee(employeeId, req.body);
  res.status(200).json(result);
}
