import type { Request, Response } from "express";
import {
  createAvailabilityRequest,
  getAvailabilityRequestById,
  listAvailabilityRequests,
  updateAvailabilityRequestStatus,
} from "./availability-requests.service";
import type {
  AvailabilityRequestPriority,
  AvailabilityRequestStatus,
  AvailabilityRequestType,
  CreateAvailabilityRequestInput,
} from "./availability-requests.types";

type AvailabilityRequestPayload = {
  employeeId?: unknown;
  type?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  isFullDay?: unknown;
  constraintType?: unknown;
  note?: unknown;
  priority?: unknown;
  status?: unknown;
};

type AvailabilityRequestStatusPayload = {
  status?: unknown;
};

function parsePositiveInteger(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }

  return value;
}

function parseEntityId(value: unknown, entityName: string): number {
  if (typeof value !== "string") {
    throw new Error(`Invalid ${entityName} id.`);
  }

  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new Error(`Invalid ${entityName} id.`);
  }

  return id;
}

function parseDateString(value: unknown, fieldName: string): Date {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    throw new Error(`${fieldName} must be a valid date in YYYY-MM-DD format`);
  }

  const date = new Date(`${value.trim()}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value.trim()
  ) {
    throw new Error(`${fieldName} must be a valid date in YYYY-MM-DD format`);
  }

  return date;
}

function parseOptionalBoolean(
  value: unknown,
  fieldName: string
): boolean | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "boolean") {
    throw new Error(`${fieldName} must be a boolean`);
  }

  return value;
}

function parseOptionalString(
  value: unknown,
  fieldName: string
): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }

  return value.trim();
}

function parseAvailabilityRequestType(value: unknown): AvailabilityRequestType {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("type is required");
  }

  return value.trim() as AvailabilityRequestType;
}

function parseAvailabilityRequestStatus(
  value: unknown
): AvailabilityRequestStatus {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      "status must be one of: submitted, reviewed, approved, rejected"
    );
  }

  return value.trim() as AvailabilityRequestStatus;
}

function parseOptionalAvailabilityRequestPriority(
  value: unknown
): AvailabilityRequestPriority | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("priority must be one of: low, medium, high");
  }

  return value.trim() as AvailabilityRequestPriority;
}

function parseOptionalAvailabilityRequestStatus(
  value: unknown
): AvailabilityRequestStatus | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  return parseAvailabilityRequestStatus(value);
}

function parseCreateAvailabilityRequestPayload(
  payload: AvailabilityRequestPayload
): CreateAvailabilityRequestInput {
  return {
    employeeId: parsePositiveInteger(payload.employeeId, "employeeId"),
    type: parseAvailabilityRequestType(payload.type),
    startDate: parseDateString(payload.startDate, "startDate"),
    endDate:
      payload.endDate === undefined || payload.endDate === null
        ? null
        : parseDateString(payload.endDate, "endDate"),
    isFullDay: parseOptionalBoolean(payload.isFullDay, "isFullDay") ?? true,
    constraintType: parseOptionalString(payload.constraintType, "constraintType"),
    note: parseOptionalString(payload.note, "note"),
    priority: parseOptionalAvailabilityRequestPriority(payload.priority),
    status: parseOptionalAvailabilityRequestStatus(payload.status),
  };
}

function parseStatusUpdatePayload(
  payload: AvailabilityRequestStatusPayload
): { status: AvailabilityRequestStatus } {
  return {
    status: parseAvailabilityRequestStatus(payload.status),
  };
}

function parseOptionalEmployeeIdQuery(
  value:
    | string
    | string[]
    | Record<string, unknown>
    | (string | Record<string, unknown>)[]
    | undefined
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error("employeeId must be a positive integer");
  }

  return parsePositiveInteger(Number(value), "employeeId");
}

function parseOptionalStatusQuery(
  value:
    | string
    | string[]
    | Record<string, unknown>
    | (string | Record<string, unknown>)[]
    | undefined
): AvailabilityRequestStatus | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(
      "status must be one of: submitted, reviewed, approved, rejected"
    );
  }

  return value.trim() as AvailabilityRequestStatus;
}

function sendValidationError(res: Response, message: string): void {
  res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message,
    },
  });
}

function handleAvailabilityRequestError(
  res: Response,
  error: unknown
): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  if (
    error.message.startsWith("AvailabilityRequest with id") ||
    error.message.startsWith("Employee with id")
  ) {
    const isRequestError = error.message.startsWith("AvailabilityRequest with id");
    res.status(404).json({
      error: isRequestError ? "Availability request not found." : "Employee not found.",
    });
    return true;
  }

  if (
    error.message.startsWith("Invalid") ||
    error.message.includes("must be") ||
    error.message === "type is required"
  ) {
    sendValidationError(res, error.message);
    return true;
  }

  return false;
}

export async function listAvailabilityRequestsHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const requests = await listAvailabilityRequests({
      employeeId: parseOptionalEmployeeIdQuery(req.query.employeeId),
      status: parseOptionalStatusQuery(req.query.status),
    });

    res.status(200).json(requests);
  } catch (error) {
    if (handleAvailabilityRequestError(res, error)) {
      return;
    }

    console.error("Failed to load availability requests:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getAvailabilityRequestHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseEntityId(req.params.id, "availabilityRequest");
    const requestRecord = await getAvailabilityRequestById(id);
    res.status(200).json(requestRecord);
  } catch (error) {
    if (handleAvailabilityRequestError(res, error)) {
      return;
    }

    console.error("Failed to load availability request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createAvailabilityRequestHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const payload = parseCreateAvailabilityRequestPayload(req.body);
    const requestRecord = await createAvailabilityRequest(payload);
    res.status(201).json(requestRecord);
  } catch (error) {
    if (handleAvailabilityRequestError(res, error)) {
      return;
    }

    console.error("Failed to create availability request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updateAvailabilityRequestStatusHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseEntityId(req.params.id, "availabilityRequest");
    const payload = parseStatusUpdatePayload(req.body);
    const requestRecord = await updateAvailabilityRequestStatus(id, payload);
    res.status(200).json(requestRecord);
  } catch (error) {
    if (handleAvailabilityRequestError(res, error)) {
      return;
    }

    console.error("Failed to update availability request status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
