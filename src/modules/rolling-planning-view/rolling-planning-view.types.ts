export type RollingDaySeverity = "none" | "attention" | "critical";

export type RollingDataStatus =
  | "reference_plan"
  | "draft_plan"
  | "operational_only"
  | "incomplete";

export interface RollingPlanningView {
  startDate: string;
  endDate: string;
  days: RollingPlanningDay[];
  summary?: RollingPlanningSummary;
}

export interface RollingPlanningDay {
  date: string;
  daySeverity: RollingDaySeverity;
  gapSummary?: RollingGapSummary;
  planningState?: unknown;
  openDecisionCount?: number;
  hasReferencePlan?: boolean;
  dataStatus?: RollingDataStatus;
}

export interface RollingGapSummary {
  effectiveCoverageGapTotal?: number;
  effectiveQualificationGapTotal?: number;
  affectedShiftTypes?: string[];
}

export interface RollingPlanningSummary {
  criticalDayCount: number;
  attentionDayCount: number;
  missingReferencePlanDayCount?: number;
  openDecisionCount?: number;
}
