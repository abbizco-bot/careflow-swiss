import type { Request, Response } from "express";
import { getPlanningMonthComparison } from "./planning-comparison.service";

function parsePlanningMonthId(value: unknown): number {
  if (typeof value !== "string") {
    throw new Error("Invalid planningMonth id.");
  }

  const planningMonthId = Number(value);

  if (!Number.isInteger(planningMonthId) || planningMonthId <= 0) {
    throw new Error("Invalid planningMonth id.");
  }

  return planningMonthId;
}

function sendValidationError(res: Response, message: string): void {
  res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message,
    },
  });
}

export async function getPlanningMonthComparisonHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const planningMonthId = parsePlanningMonthId(req.params.id);
    const comparison = await getPlanningMonthComparison(planningMonthId);
    res.status(200).json(comparison);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid planningMonth id."
    ) {
      sendValidationError(res, error.message);
      return;
    }

    if (
      error instanceof Error &&
      error.message.startsWith("PlanningMonth with id")
    ) {
      res.status(404).json({ error: "Planning month not found." });
      return;
    }

    console.error("Failed to load planning month comparison:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
