import { planningMonthsRepository } from "./planning-months.repository";
import type {
  CreatePlanningMonthInput,
  CreatePlanningShiftTemplateInput,
  PlanningMonthStatus,
  PlanningShiftTemplateType,
  UpdatePlanningShiftTemplateInput,
} from "./planning-months.types";

const allowedPlanningMonthStatuses = new Set<PlanningMonthStatus>([
  "draft",
  "active",
  "finalized",
]);

const allowedPlanningShiftTemplateTypes = new Set<PlanningShiftTemplateType>([
  "early",
  "mid",
  "late",
  "night",
]);

export const planningMonthsService = {
  async listPlanningMonths() {
    return planningMonthsRepository.findMany();
  },

  async getPlanningMonthById(id: number) {
    const planningMonth = await planningMonthsRepository.findById(id);

    if (!planningMonth) {
      throw new Error(`PlanningMonth with id ${id} not found`);
    }

    return planningMonth;
  },

  async createPlanningMonth(data: CreatePlanningMonthInput) {
    validatePlanningMonthInput(data);

    return planningMonthsRepository.create(data);
  },

  async initializePlanningDays(planningMonthId: number) {
    const planningMonth = await planningMonthsRepository.findPlanningMonthRecordById(
      planningMonthId
    );

    if (!planningMonth) {
      throw new Error(`PlanningMonth with id ${planningMonthId} not found`);
    }

    const allDatesInMonth = buildMonthDates(planningMonth.year, planningMonth.month);
    const existingPlanningDays =
      await planningMonthsRepository.findPlanningDaysByPlanningMonthId(
        planningMonthId
      );
    const existingDateKeys = new Set(
      existingPlanningDays.map((planningDay) =>
        planningDay.date.toISOString().slice(0, 10)
      )
    );
    const missingDates = allDatesInMonth.filter(
      (date) => !existingDateKeys.has(date.toISOString().slice(0, 10))
    );

    if (missingDates.length > 0) {
      await planningMonthsRepository.createPlanningDays(planningMonthId, missingDates);
    }

    return planningMonthsRepository.findById(planningMonthId);
  },

  async listPlanningShiftTemplates(planningDayId: number) {
    await ensurePlanningDayExists(planningDayId);
    return planningMonthsRepository.findPlanningShiftTemplatesByPlanningDayId(
      planningDayId
    );
  },

  async createPlanningShiftTemplate(
    planningDayId: number,
    data: CreatePlanningShiftTemplateInput
  ) {
    await ensurePlanningDayExists(planningDayId);
    validatePlanningShiftTemplateInput(data);

    return planningMonthsRepository.createPlanningShiftTemplate(planningDayId, data);
  },

  async getPlanningShiftTemplateById(id: number) {
    const planningShiftTemplate =
      await planningMonthsRepository.findPlanningShiftTemplateById(id);

    if (!planningShiftTemplate) {
      throw new Error(`PlanningShiftTemplate with id ${id} not found`);
    }

    return planningShiftTemplate;
  },

  async updatePlanningShiftTemplate(
    id: number,
    data: UpdatePlanningShiftTemplateInput
  ) {
    const existingTemplate =
      await planningMonthsRepository.findPlanningShiftTemplateById(id);

    if (!existingTemplate) {
      throw new Error(`PlanningShiftTemplate with id ${id} not found`);
    }

    validatePlanningShiftTemplateUpdateInput(data, existingTemplate);

    return planningMonthsRepository.updatePlanningShiftTemplate(id, data);
  },

  async deletePlanningShiftTemplate(id: number) {
    const existingTemplate =
      await planningMonthsRepository.findPlanningShiftTemplateById(id);

    if (!existingTemplate) {
      throw new Error(`PlanningShiftTemplate with id ${id} not found`);
    }

    await planningMonthsRepository.deletePlanningShiftTemplate(id);
  },
};

function validatePlanningMonthInput(data: CreatePlanningMonthInput): void {
  if (!Number.isInteger(data.year) || data.year < 2000 || data.year > 2100) {
    throw new Error("year must be an integer between 2000 and 2100");
  }

  if (!Number.isInteger(data.month) || data.month < 1 || data.month > 12) {
    throw new Error("month must be an integer between 1 and 12");
  }

  if (
    data.status !== undefined &&
    !allowedPlanningMonthStatuses.has(data.status)
  ) {
    throw new Error("status must be one of: draft, active, finalized");
  }
}

function validatePlanningShiftTemplateInput(
  data: CreatePlanningShiftTemplateInput
): void {
  if (!allowedPlanningShiftTemplateTypes.has(data.type)) {
    throw new Error("template type must be one of: early, mid, late, night");
  }

  if (!Number.isInteger(data.requiredCount) || data.requiredCount <= 0) {
    throw new Error("requiredCount must be a positive integer");
  }

  if (
    !Number.isInteger(data.requiredQualifiedCount) ||
    data.requiredQualifiedCount < 0
  ) {
    throw new Error("requiredQualifiedCount must be a non-negative integer");
  }

  if (data.requiredQualifiedCount > data.requiredCount) {
    throw new Error(
      "requiredQualifiedCount cannot be greater than requiredCount"
    );
  }

  if (data.isCritical !== undefined && typeof data.isCritical !== "boolean") {
    throw new Error("isCritical must be a boolean");
  }
}

function validatePlanningShiftTemplateUpdateInput(
  data: UpdatePlanningShiftTemplateInput,
  existingTemplate: {
    type: string;
    requiredCount: number;
    requiredQualifiedCount: number;
  }
): void {
  if (Object.keys(data).length === 0) {
    throw new Error("Provide at least one field to update");
  }

  if (
    data.type !== undefined &&
    !allowedPlanningShiftTemplateTypes.has(data.type)
  ) {
    throw new Error("template type must be one of: early, mid, late, night");
  }

  if (
    data.requiredCount !== undefined &&
    (!Number.isInteger(data.requiredCount) || data.requiredCount <= 0)
  ) {
    throw new Error("requiredCount must be a positive integer");
  }

  if (
    data.requiredQualifiedCount !== undefined &&
    (!Number.isInteger(data.requiredQualifiedCount) ||
      data.requiredQualifiedCount < 0)
  ) {
    throw new Error("requiredQualifiedCount must be a non-negative integer");
  }

  if (data.isCritical !== undefined && typeof data.isCritical !== "boolean") {
    throw new Error("isCritical must be a boolean");
  }

  const requiredCount = data.requiredCount ?? existingTemplate.requiredCount;
  const requiredQualifiedCount =
    data.requiredQualifiedCount ?? existingTemplate.requiredQualifiedCount;

  if (requiredQualifiedCount > requiredCount) {
    throw new Error(
      "requiredQualifiedCount cannot be greater than requiredCount"
    );
  }
}

async function ensurePlanningDayExists(planningDayId: number): Promise<void> {
  const planningDay = await planningMonthsRepository.findPlanningDayById(
    planningDayId
  );

  if (!planningDay) {
    throw new Error(`PlanningDay with id ${planningDayId} not found`);
  }
}

function buildMonthDates(year: number, month: number): Date[] {
  const dates: Date[] = [];
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const lastDayNumber = new Date(Date.UTC(year, month, 0)).getUTCDate();

  for (let day = 1; day <= lastDayNumber; day += 1) {
    dates.push(new Date(Date.UTC(year, month - 1, day)));
  }

  if (dates.length === 0 || firstDay.getUTCMonth() !== month - 1) {
    throw new Error("Unable to build planning days for the requested month");
  }

  return dates;
}

export async function listPlanningMonths() {
  return planningMonthsService.listPlanningMonths();
}

export async function getPlanningMonthById(id: number) {
  return planningMonthsService.getPlanningMonthById(id);
}

export async function createPlanningMonth(data: CreatePlanningMonthInput) {
  return planningMonthsService.createPlanningMonth(data);
}

export async function initializePlanningDays(planningMonthId: number) {
  return planningMonthsService.initializePlanningDays(planningMonthId);
}

export async function listPlanningShiftTemplates(planningDayId: number) {
  return planningMonthsService.listPlanningShiftTemplates(planningDayId);
}

export async function createPlanningShiftTemplate(
  planningDayId: number,
  data: CreatePlanningShiftTemplateInput
) {
  return planningMonthsService.createPlanningShiftTemplate(planningDayId, data);
}

export async function getPlanningShiftTemplateById(id: number) {
  return planningMonthsService.getPlanningShiftTemplateById(id);
}

export async function updatePlanningShiftTemplate(
  id: number,
  data: UpdatePlanningShiftTemplateInput
) {
  return planningMonthsService.updatePlanningShiftTemplate(id, data);
}

export async function deletePlanningShiftTemplate(id: number) {
  return planningMonthsService.deletePlanningShiftTemplate(id);
}
