export type ReferencePlanSourceType =
  | "planning_month"
  | "draft_plan"
  | "imported_plan"
  | "manual"
  | "unknown";

export interface ReferencePlanPeriod {
  startDate: string;
  endDate: string;
}

export interface ReferencePlanSource {
  sourceType: ReferencePlanSourceType;
  planningMonthId?: number;
  draftPlanId?: string;
  importedPlanId?: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface ReferencePlanApproval {
  approvedAt: string;
  approvedBy?: string;
  approvalNote?: string;
  metadata?: Record<string, unknown>;
}

export interface ReferencePlanSnapshot {
  id?: string;
  version: string;
  period: ReferencePlanPeriod;
  source: ReferencePlanSource;
  approval: ReferencePlanApproval;
  days: ReferencePlanDaySnapshot[];
  metadata?: Record<string, unknown>;
}

export interface ReferencePlanDaySnapshot {
  date: string;
  shifts: ReferencePlanShiftSnapshot[];
  metadata?: Record<string, unknown>;
}

export interface ReferencePlanShiftSnapshot {
  type: string;
  label?: string;
  requiredCount: number;
  requiredQualifiedCount: number;
  requiredFunctions?: ReferencePlanFunctionRequirement[];
  metadata?: Record<string, unknown>;
}

export interface ReferencePlanFunctionRequirement {
  functionName: string;
  requiredCount?: number;
  minimumQualification?: string;
  metadata?: Record<string, unknown>;
}
