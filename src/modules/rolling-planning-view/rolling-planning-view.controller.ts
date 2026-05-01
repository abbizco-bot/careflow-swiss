import type { Request, Response } from "express";
import { ConflictValidationError } from "../validations/conflicts/conflict.service";
import { rollingPlanningViewService } from "./rolling-planning-view.service";

function parseRequiredDateQuery(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_DATE",
      "Der Query-Parameter 'startDate' ist erforderlich und muss ein gueltiges Datum sein (YYYY-MM-DD).",
      400
    );
  }

  return value;
}

function parseOptionalWindowDays(value: unknown): number {
  if (value === undefined || value === null || value === "") {
    return 28;
  }

  const parsed = parseInt(String(value), 10);
  if (isNaN(parsed) || parsed < 1 || parsed > 365) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_WINDOW_DAYS",
      "Der Query-Parameter 'windowDays' muss eine Zahl zwischen 1 und 365 sein.",
      400
    );
  }

  return parsed;
}

function parseDate(dateStr: string): Date {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_DATE_FORMAT",
      `Das Datum '${dateStr}' ist nicht valide. Bitte das Format YYYY-MM-DD verwenden.`,
      400
    );
  }
  return date;
}

export async function getRollingOperationalWindowHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const startDateStr = parseRequiredDateQuery(req.query.startDate);
    const windowDays = parseOptionalWindowDays(req.query.windowDays);
    const startDate = parseDate(startDateStr);

    const result = await rollingPlanningViewService.getRollingPlanningWindow(
      startDate,
      windowDays
    );

    res.json(result);
  } catch (error) {
    if (error instanceof ConflictValidationError) {
      res.status(error.status).json({
        error: error.code,
        message: error.message,
      });
      return;
    }

    console.error("getRollingOperationalWindowHandler error:", error);
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Ein interner Fehler ist aufgetreten.",
    });
  }
}
