import type { Request, Response } from "express";
import {
  createAssignment,
  deleteAssignment,
  getAssignmentById,
  getAssignments,
  updateAssignment,
} from "./assignment.service";
import {
  AssignmentError,
  assignmentErrorCodes,
  isAssignmentError,
} from "./assignment.errors";
import {
  ASSIGNMENT_FUNCTIONS,
  type AssignedFunction,
} from "./assignment.types";

type AssignmentPayload = {
  employeeId?: unknown;
  shiftId?: unknown;
  assignedFunction?: unknown;
  status?: unknown;
};

function parseAssignmentId(value: string): number {
  const assignmentId = Number(value);

  if (!Number.isInteger(assignmentId) || assignmentId <= 0) {
    throw new AssignmentError(
      assignmentErrorCodes.invalidAssignmentId,
      "Invalid assignment id",
      400
    );
  }

  return assignmentId;
}

function readRouteParam(value: string | string[] | undefined): string {
  if (typeof value !== "string") {
    throw new AssignmentError(
      assignmentErrorCodes.invalidAssignmentId,
      "Invalid assignment id",
      400
    );
  }

  return value;
}

function validateCreatePayload(payload: AssignmentPayload) {
  const employeeId = parsePositiveInteger(payload.employeeId);
  const shiftId = parsePositiveInteger(payload.shiftId);
  const assignedFunction = parseOptionalAssignmentFunction(
    payload.assignedFunction
  );
  const status = parseOptionalString(payload.status, "status");

  if (employeeId === null) {
    throw new AssignmentError(
      assignmentErrorCodes.invalidInput,
      "employeeId must be a positive integer",
      400
    );
  }

  if (shiftId === null) {
    throw new AssignmentError(
      assignmentErrorCodes.invalidInput,
      "shiftId must be a positive integer",
      400
    );
  }

  return {
    employeeId,
    shiftId,
    assignedFunction,
    status,
  };
}

function validateUpdatePayload(payload: AssignmentPayload) {
  const data: {
    employeeId?: number;
    shiftId?: number;
    assignedFunction?: AssignedFunction;
    status?: string;
  } = {};

  if (payload.employeeId !== undefined) {
    const employeeId = parsePositiveInteger(payload.employeeId);

    if (employeeId === null) {
      throw new AssignmentError(
        assignmentErrorCodes.invalidInput,
        "employeeId must be a positive integer",
        400
      );
    }

    data.employeeId = employeeId;
  }

  if (payload.shiftId !== undefined) {
    const shiftId = parsePositiveInteger(payload.shiftId);

    if (shiftId === null) {
      throw new AssignmentError(
        assignmentErrorCodes.invalidInput,
        "shiftId must be a positive integer",
        400
      );
    }

    data.shiftId = shiftId;
  }

  if (payload.assignedFunction !== undefined) {
    data.assignedFunction = parseOptionalAssignmentFunction(
      payload.assignedFunction
    );
  }

  if (payload.status !== undefined) {
    data.status = parseOptionalString(payload.status, "status");
  }

  if (Object.keys(data).length === 0) {
    throw new AssignmentError(
      assignmentErrorCodes.invalidInput,
      "Provide at least one field to update",
      400
    );
  }

  return data;
}

function parsePositiveInteger(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    return null;
  }

  return value;
}

function parseOptionalString(
  value: unknown,
  fieldName: string
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new AssignmentError(
      assignmentErrorCodes.invalidInput,
      `${fieldName} must be a string`,
      400
    );
  }

  return value.trim();
}

function parseOptionalAssignmentFunction(
  value: unknown
): AssignedFunction | undefined {
  const assignedFunction = parseOptionalString(value, "assignedFunction");

  if (assignedFunction === undefined) {
    return undefined;
  }

  if (!isAssignedFunction(assignedFunction)) {
    throw new AssignmentError(
      assignmentErrorCodes.invalidInput,
      "assignedFunction must be a known assignment function",
      400
    );
  }

  return assignedFunction;
}

function isAssignedFunction(value: string): value is AssignedFunction {
  return ASSIGNMENT_FUNCTIONS.includes(value as AssignedFunction);
}

function sendAssignmentError(res: Response, error: AssignmentError): void {
  res.status(error.status).json({
    error: {
      code: error.code,
      message: error.message,
    },
  });
}

export async function listAssignments(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const assignments = await getAssignments();
    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    sendAssignmentError(
      res,
      new AssignmentError(
        assignmentErrorCodes.internal,
        "Failed to fetch assignments",
        500
      )
    );
  }
}

export async function getAssignment(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseAssignmentId(readRouteParam(req.params.id));
    const assignment = await getAssignmentById(id);

    if (!assignment) {
      throw new AssignmentError(
        assignmentErrorCodes.assignmentNotFound,
        "Assignment not found",
        404
      );
    }

    res.status(200).json(assignment);
  } catch (error) {
    handleAssignmentControllerError(res, error, "Error fetching assignment:");
  }
}

export async function createAssignmentHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const payload = validateCreatePayload(req.body);
    const assignment = await createAssignment(payload);

    res.status(201).json(assignment);
  } catch (error) {
    handleAssignmentControllerError(res, error, "Error creating assignment:");
  }
}

export async function updateAssignmentHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseAssignmentId(readRouteParam(req.params.id));
    const payload = validateUpdatePayload(req.body);
    const assignment = await updateAssignment(id, payload);

    res.status(200).json(assignment);
  } catch (error) {
    handleAssignmentControllerError(res, error, "Error updating assignment:");
  }
}

export async function deleteAssignmentHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseAssignmentId(readRouteParam(req.params.id));
    await deleteAssignment(id);

    res.status(204).send();
  } catch (error) {
    handleAssignmentControllerError(res, error, "Error deleting assignment:");
  }
}

function handleAssignmentControllerError(
  res: Response,
  error: unknown,
  logPrefix: string
): void {
  if (isAssignmentError(error)) {
    sendAssignmentError(res, error);
    return;
  }

  console.error(logPrefix, error);
  sendAssignmentError(
    res,
    new AssignmentError(
      assignmentErrorCodes.internal,
      "Internal server error",
      500
    )
  );
}
