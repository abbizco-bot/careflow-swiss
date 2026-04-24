import type { Request, Response } from "express";
import { ConflictValidationError } from "../validations/conflicts/conflict.service";
import {
  getLeadershipDay,
  getLeadershipMonth,
  getLeadershipWeek,
} from "./leadership-view.service";

function parseRequiredDateQuery(value: unknown): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ConflictValidationError(
      "VALIDATION_INVALID_DATE",
      "Der Query-Parameter 'date' ist erforderlich und muss ein gueltiges Datum sein.",
      400
    );
  }

  return value;
}

function parseOptionalDateQuery(value: unknown): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  return value;
}

function sendLeadershipError(res: Response, error: unknown): void {
  if (error instanceof ConflictValidationError) {
    res.status(error.status).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  console.error("Leadership view controller error:", error);
  res.status(500).json({
    error: {
      code: "LEADERSHIP_VIEW_INTERNAL_ERROR",
      message: "Internal server error",
    },
  });
}

export async function getLeadershipDayHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const date = parseRequiredDateQuery(req.query.date);
    const result = await getLeadershipDay(date);
    res.status(200).json(result);
  } catch (error) {
    sendLeadershipError(res, error);
  }
}

export async function getLeadershipWeekHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const date = parseOptionalDateQuery(req.query.date);
    const start = parseOptionalDateQuery(req.query.start);
    const end = parseOptionalDateQuery(req.query.end);

    if (start && end) {
      const result = await getLeadershipWeek({ start, end });
      res.status(200).json(result);
      return;
    }

    if (!date) {
      throw new ConflictValidationError(
        "VALIDATION_INVALID_DATE",
        "Der Query-Parameter 'date' ist erforderlich und muss ein gueltiges Datum sein.",
        400
      );
    }

    const result = await getLeadershipWeek({ date });
    res.status(200).json(result);
  } catch (error) {
    sendLeadershipError(res, error);
  }
}

export async function getLeadershipMonthHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const date = parseRequiredDateQuery(req.query.date);
    const result = await getLeadershipMonth(date);
    res.status(200).json(result);
  } catch (error) {
    sendLeadershipError(res, error);
  }
}
