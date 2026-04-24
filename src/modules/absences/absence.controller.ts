import type { Request, Response } from "express";
import { createAbsence, getActiveAbsences } from "./absence.service";
import { AbsenceError, absenceErrorCodes, isAbsenceError } from "./absence.errors";
import type { AbsenceScope, AbsenceType } from "./absence.types";

type CreateAbsencePayload = {
  employeeId?: unknown;
  type?: unknown;
  scope?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  note?: unknown;
};

function readRouteParam(value: string | string[] | undefined, fieldName: string): string {
  if (typeof value !== "string") {
    throw new AbsenceError(
      absenceErrorCodes.invalidInput,
      `${fieldName} must be a string`,
      400
    );
  }

  return value;
}

function readQueryParam(
  value: string | string[] | Record<string, unknown> | (string | Record<string, unknown>)[] | undefined,
  fieldName: string
): string {
  if (typeof value !== "string") {
    throw new AbsenceError(
      absenceErrorCodes.invalidInput,
      `${fieldName} must be a string`,
      400
    );
  }

  return value;
}

function parsePositiveInteger(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new AbsenceError(
      absenceErrorCodes.invalidInput,
      `${fieldName} must be a positive integer`,
      400
    );
  }

  return value;
}

function parseDateString(value: unknown, fieldName: string): Date {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    throw new AbsenceError(
      absenceErrorCodes.invalidDate,
      `${fieldName} must be a valid date in YYYY-MM-DD format`,
      400
    );
  }

  const date = new Date(`${value.trim()}T00:00:00.000Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value.trim()) {
    throw new AbsenceError(
      absenceErrorCodes.invalidDate,
      `${fieldName} must be a valid date in YYYY-MM-DD format`,
      400
    );
  }

  return date;
}

function parseOptionalNote(value: unknown): string | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new AbsenceError(
      absenceErrorCodes.invalidInput,
      "note must be a string",
      400
    );
  }

  return value.trim();
}

function parseAbsenceType(value: unknown): AbsenceType {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AbsenceError(
      absenceErrorCodes.invalidInput,
      "type is required",
      400
    );
  }

  return value.trim() as AbsenceType;
}

function parseOptionalAbsenceScope(value: unknown): AbsenceScope | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new AbsenceError(
      absenceErrorCodes.invalidScope,
      "scope must be one of: full_day, early, late, night",
      400
    );
  }

  return value.trim() as AbsenceScope;
}

function validateCreatePayload(payload: CreateAbsencePayload) {
  return {
    employeeId: parsePositiveInteger(payload.employeeId, "employeeId"),
    type: parseAbsenceType(payload.type),
    scope: parseOptionalAbsenceScope(payload.scope),
    startDate: parseDateString(payload.startDate, "startDate"),
    endDate:
      payload.endDate === undefined || payload.endDate === null
        ? null
        : parseDateString(payload.endDate, "endDate"),
    note: parseOptionalNote(payload.note),
  };
}

function validateActiveAbsenceFilters(req: Request) {
  const employeeId = req.query.employeeId;
  const date = req.query.date;

  return {
    employeeId:
      employeeId === undefined
        ? undefined
        : parsePositiveInteger(
            Number(readQueryParam(employeeId, "employeeId")),
            "employeeId"
          ),
    asOfDate:
      date === undefined
        ? undefined
        : parseDateString(readQueryParam(date, "date"), "date"),
  };
}

function sendAbsenceError(res: Response, error: AbsenceError): void {
  res.status(error.status).json({
    error: {
      code: error.code,
      message: error.message,
    },
  });
}

export async function createAbsenceHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const payload = validateCreatePayload(req.body);
    const result = await createAbsence(payload);
    res.status(201).json(result);
  } catch (error) {
    handleAbsenceControllerError(res, error, "Error creating absence:");
  }
}

export async function getActiveAbsencesHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const filters = validateActiveAbsenceFilters(req);
    const result = await getActiveAbsences(filters);
    res.status(200).json(result);
  } catch (error) {
    handleAbsenceControllerError(res, error, "Error fetching active absences:");
  }
}

function handleAbsenceControllerError(
  res: Response,
  error: unknown,
  logPrefix: string
): void {
  if (isAbsenceError(error)) {
    sendAbsenceError(res, error);
    return;
  }

  console.error(logPrefix, error);
  sendAbsenceError(
    res,
    new AbsenceError(
      absenceErrorCodes.internal,
      "Internal server error",
      500
    )
  );
}
