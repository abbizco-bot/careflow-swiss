import type {
  PlanningDay,
  PlanningMonth,
  PlanningShiftTemplate,
} from "../../generated/prisma/client";

export type PlanningMonthStatus = "draft" | "active" | "finalized";
export type PlanningShiftTemplateType = "early" | "mid" | "late" | "night";

export interface CreatePlanningShiftTemplateInput {
  type: PlanningShiftTemplateType;
  requiredCount: number;
  requiredQualifiedCount: number;
  isCritical?: boolean;
}

export interface UpdatePlanningShiftTemplateInput {
  type?: PlanningShiftTemplateType;
  requiredCount?: number;
  requiredQualifiedCount?: number;
  isCritical?: boolean;
}

export interface CreatePlanningMonthInput {
  year: number;
  month: number;
  status?: PlanningMonthStatus;
}

export type PlanningMonthWithStructure = PlanningMonth & {
  planningDays: (PlanningDay & {
    shiftTemplates: PlanningShiftTemplate[];
  })[];
};

// PlanningMonth is a planning frame only.
// It stores the intended month structure and target staffing template,
// but it does not create or mutate operational assignments.
