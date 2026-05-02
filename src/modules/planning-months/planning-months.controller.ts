import type { Request, Response } from "express";
import {
  createPlanningMonth,
  createPlanningShiftTemplate,
  deletePlanningShiftTemplate,
  getPlanningMonthById,
  getPlanningShiftTemplateById,
  initializePlanningDays,
  listPlanningMonths,
  listPlanningShiftTemplates,
  updatePlanningShiftTemplate,
} from "./planning-months.service";
import { derivePlanningPublicationState } from "./planning-publication-state";
import type {
  CreatePlanningMonthInput,
  CreatePlanningShiftTemplateInput,
  PlanningMonthStatus,
  PlanningShiftTemplateType,
  UpdatePlanningShiftTemplateInput,
} from "./planning-months.types";

type PlanningShiftTemplatePayload = {
  type?: unknown;
  requiredCount?: unknown;
  requiredQualifiedCount?: unknown;
  isCritical?: unknown;
};

type PlanningMonthPayload = {
  year?: unknown;
  month?: unknown;
  status?: unknown;
  planningDays?: unknown;
};

function parsePositiveInteger(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive integer`);
  }

  return value;
}

function parseNonNegativeInteger(value: unknown, fieldName: string): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new Error(`${fieldName} must be a non-negative integer`);
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

function parseOptionalPlanningMonthStatus(
  value: unknown
): PlanningMonthStatus | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("status must be one of: draft, active, finalized");
  }

  return value.trim() as PlanningMonthStatus;
}

function parseOptionalPlanningShiftTemplateType(
  value: unknown
): PlanningShiftTemplateType | undefined {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("template type must be one of: early, mid, late, night");
  }

  return value.trim() as PlanningShiftTemplateType;
}

function parsePlanningShiftTemplateType(
  value: unknown
): PlanningShiftTemplateType {
  const type = parseOptionalPlanningShiftTemplateType(value);

  if (!type) {
    throw new Error("template type is required");
  }

  return type;
}

function parsePlanningShiftTemplatePayload(
  payload: PlanningShiftTemplatePayload
): CreatePlanningShiftTemplateInput {
  return {
    type: parsePlanningShiftTemplateType(payload.type),
    requiredCount: parsePositiveInteger(payload.requiredCount, "requiredCount"),
    requiredQualifiedCount: parseNonNegativeInteger(
      payload.requiredQualifiedCount,
      "requiredQualifiedCount"
    ),
    isCritical: parseOptionalBoolean(payload.isCritical, "isCritical"),
  };
}

function parsePlanningShiftTemplateUpdatePayload(
  payload: PlanningShiftTemplatePayload
): UpdatePlanningShiftTemplateInput {
  return {
    type: parseOptionalPlanningShiftTemplateType(payload.type),
    requiredCount:
      payload.requiredCount === undefined
        ? undefined
        : parsePositiveInteger(payload.requiredCount, "requiredCount"),
    requiredQualifiedCount:
      payload.requiredQualifiedCount === undefined
        ? undefined
        : parseNonNegativeInteger(
            payload.requiredQualifiedCount,
            "requiredQualifiedCount"
          ),
    isCritical: parseOptionalBoolean(payload.isCritical, "isCritical"),
  };
}

function parseCreatePlanningMonthPayload(
  payload: PlanningMonthPayload
): CreatePlanningMonthInput {
  if (payload.planningDays !== undefined) {
    throw new Error(
      "planningDays cannot be created through POST /planning-months. Initialize planning days explicitly."
    );
  }

  return {
    year: parsePositiveInteger(payload.year, "year"),
    month: parsePositiveInteger(payload.month, "month"),
    status: parseOptionalPlanningMonthStatus(payload.status),
  };
}

function sendValidationError(res: Response, message: string): void {
  res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      message,
    },
  });
}

function handlePlanningMonthError(res: Response, error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  if (error.message.startsWith("Invalid")) {
    sendValidationError(res, error.message);
    return true;
  }

  if (
    error.message.startsWith("PlanningMonth with id") ||
    error.message.startsWith("PlanningDay with id") ||
    error.message.startsWith("PlanningShiftTemplate with id")
  ) {
    const entityName = error.message.split(" ")[0];
    res.status(404).json({
      error: `${entityName.replace("Planning", "Planning ").trim()} not found.`,
    });
    return true;
  }

  if (
    error.message.includes("must be") ||
    error.message.includes("cannot be created through POST /planning-months") ||
    error.message.includes("Provide at least one field") ||
    error.message === "template type is required"
  ) {
    sendValidationError(res, error.message);
    return true;
  }

  return false;
}

function mapPlanningMonthResponse(planningMonth: unknown): unknown {
  if (
    typeof planningMonth !== "object" ||
    planningMonth === null ||
    !("status" in planningMonth)
  ) {
    return planningMonth;
  }

  const month = planningMonth as { status: unknown };

  return {
    ...planningMonth,
    publicationState: derivePlanningPublicationState(
      typeof month.status === "string" ? month.status : ""
    ),
  };
}

export async function listPlanningMonthsHandler(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const planningMonths = await listPlanningMonths();
    res.status(200).json(planningMonths.map(mapPlanningMonthResponse));
  } catch (error) {
    console.error("Failed to load planning months:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getPlanningMonthHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseEntityId(req.params.id, "planningMonth");
    const planningMonth = await getPlanningMonthById(id);
    res.status(200).json(mapPlanningMonthResponse(planningMonth));
  } catch (error) {
    if (handlePlanningMonthError(res, error)) {
      return;
    }

    console.error("Failed to load planning month:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createPlanningMonthHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const payload = parseCreatePlanningMonthPayload(req.body);
    const planningMonth = await createPlanningMonth(payload);
    res.status(201).json(mapPlanningMonthResponse(planningMonth));
  } catch (error) {
    if (handlePlanningMonthError(res, error)) {
      return;
    }

    console.error("Failed to create planning month:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function initializePlanningDaysHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const planningMonthId = parseEntityId(req.params.id, "planningMonth");
    const planningMonth = await initializePlanningDays(planningMonthId);
    res.status(200).json(planningMonth);
  } catch (error) {
    if (handlePlanningMonthError(res, error)) {
      return;
    }

    console.error("Failed to initialize planning days:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function listPlanningShiftTemplatesHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const planningDayId = parseEntityId(req.params.planningDayId, "planningDay");
    const planningShiftTemplates = await listPlanningShiftTemplates(planningDayId);
    res.status(200).json(planningShiftTemplates);
  } catch (error) {
    if (handlePlanningMonthError(res, error)) {
      return;
    }

    console.error("Failed to load planning shift templates:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getPlanningShiftTemplateHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseEntityId(req.params.id, "planningShiftTemplate");
    const planningShiftTemplate = await getPlanningShiftTemplateById(id);
    res.status(200).json(planningShiftTemplate);
  } catch (error) {
    if (handlePlanningMonthError(res, error)) {
      return;
    }

    console.error("Failed to load planning shift template:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function createPlanningShiftTemplateHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const planningDayId = parseEntityId(req.params.planningDayId, "planningDay");
    const payload = parsePlanningShiftTemplatePayload(req.body);
    const planningShiftTemplate = await createPlanningShiftTemplate(
      planningDayId,
      payload
    );
  res.status(201).json(planningShiftTemplate);
  } catch (error) {
    if (handlePlanningMonthError(res, error)) {
      return;
    }

    console.error("Failed to create planning shift template:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function updatePlanningShiftTemplateHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseEntityId(req.params.id, "planningShiftTemplate");
    const payload = parsePlanningShiftTemplateUpdatePayload(req.body);
    const planningShiftTemplate = await updatePlanningShiftTemplate(id, payload);
    res.status(200).json(planningShiftTemplate);
  } catch (error) {
    if (handlePlanningMonthError(res, error)) {
      return;
    }

    console.error("Failed to update planning shift template:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function deletePlanningShiftTemplateHandler(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = parseEntityId(req.params.id, "planningShiftTemplate");
    await deletePlanningShiftTemplate(id);
    res.status(204).send();
  } catch (error) {
    if (handlePlanningMonthError(res, error)) {
      return;
    }

    console.error("Failed to delete planning shift template:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
