import type { Request, Response } from "express";
import {
  getAllCoverageValidations,
  getCoverageValidationByShiftId,
} from "./coverage/coverage.service";
import {
  getAllQualificationValidations,
  getQualificationValidationByShiftId,
} from "./qualification/qualification.service";
import {
  getAllFullValidations,
  getFullShiftDetailsByDate,
  getFullValidationByShiftId,
} from "./full/full.service";
import {
  ConflictValidationError,
  validateEmployeeConflicts,
} from "./conflicts/conflict.service";
import { getEmployeeOverviewByDate } from "./employees-overview/employee-overview.service";
import { getShiftOverviewByDate } from "./overview/overview.service";
import {
  getSituationDashboard,
  deriveSituationTrend,
  getSituationHistoryRange,
  getSituationSummary,
} from "./situation/situation.service";

function parsePositiveInteger(
  value: string | string[] | undefined,
  fieldName: string
): number {
  if (typeof value !== "string") {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_PARAMETER",
      `${fieldName} must be a positive integer.`,
      400
    );
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_PARAMETER",
      `${fieldName} must be a positive integer.`,
      400
    );
  }

  return parsedValue;
}

function parseOptionalPositiveIntegerQuery(
  value: unknown,
  fieldName: string
): number | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_PARAMETER",
      `Der Query-Parameter '${fieldName}' muss eine positive Ganzzahl sein.`,
      400
    );
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_PARAMETER",
      `Der Query-Parameter '${fieldName}' muss eine positive Ganzzahl sein.`,
      400
    );
  }

  return parsedValue;
}

function parseRequiredDateQuery(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_DATE",
      "Der Query-Parameter 'date' ist erforderlich und muss ein gültiges Datum sein.",
      400
    );
  }

  return value;
}

function parseOptionalDateQuery(value: unknown): string {
  if (value === undefined) {
    return utcDateOnly(new Date());
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_DATE",
      "Der Query-Parameter 'date' muss ein gültiges Datum sein, wenn er gesetzt ist.",
      400
    );
  }

  return value;
}

function sendValidationError(res: Response, error: unknown): void {
  if (error instanceof ConflictValidationError) {
    res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  console.error("Validation controller error:", error);
  res.status(500).json({
    error: {
      code: "VALIDATION_INTERNAL_ERROR",
      message: "Internal server error",
    },
  });
}

export async function getCoverageShiftsValidationHandler(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await getAllCoverageValidations();
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getCoverageShiftValidationByIdHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const shiftId = parsePositiveInteger(req.params.shiftId, "shiftId");
    const result = await getCoverageValidationByShiftId(shiftId);
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getQualificationShiftsValidationHandler(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await getAllQualificationValidations();
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getQualificationShiftValidationByIdHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const shiftId = parsePositiveInteger(req.params.shiftId, "shiftId");
    const result = await getQualificationValidationByShiftId(shiftId);
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getFullShiftsValidationHandler(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await getAllFullValidations();
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getFullShiftsByDateHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const date = parseRequiredDateQuery(req.query.date);
    const result = await getFullShiftDetailsByDate(date);
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getFullShiftValidationByIdHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const shiftId = parsePositiveInteger(req.params.shiftId, "shiftId");
    const result = await getFullValidationByShiftId(shiftId);
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getEmployeeConflictValidationHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const employeeId = parsePositiveInteger(req.params.employeeId, "employeeId");
    const result = await validateEmployeeConflicts(employeeId);
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getShiftOverviewByDateHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const date = parseRequiredDateQuery(req.query.date);
    const result = await getShiftOverviewByDate(date);
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getEmployeeOverviewByDateHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const date = parseOptionalDateQuery(req.query.date);
    const result = await getEmployeeOverviewByDate(date);
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getSituationTrendHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const date = parseRequiredDateQuery(req.query.date);
    const days = parseOptionalPositiveIntegerQuery(req.query.days, "days") ?? 7;
    const result = await deriveSituationTrend(date, days);
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getSituationHistoryHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const from = parseRequiredNamedDateQuery(req.query.from, "from");
    const to = parseRequiredNamedDateQuery(req.query.to, "to");
    const result = await getSituationHistoryRange(from, to);
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getSituationSummaryHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const date = parseRequiredDateQuery(req.query.date);
    const result = await getSituationSummary(date);
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

export async function getSituationDashboardHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const date = parseRequiredDateQuery(req.query.date);
    const days = parseOptionalPositiveIntegerQuery(req.query.days, "days") ?? 7;
    const result = await getSituationDashboard(date, days);
    res.status(200).json(result);
  } catch (error) {
    sendValidationError(res, error);
  }
}

function utcDateOnly(date: Date): string {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
    .toISOString()
    .slice(0, 10);
}

function parseRequiredNamedDateQuery(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_DATE",
      `Der Query-Parameter '${fieldName}' ist erforderlich und muss ein gültiges Datum sein.`,
      400
    );
  }

  return value;
}
