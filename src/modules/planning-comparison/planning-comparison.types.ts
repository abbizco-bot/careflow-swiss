import type {
  PlanningMonth,
  PlanningShiftTemplate,
  Shift,
} from "../../generated/prisma/client";

export type PlanningComparisonStatus =
  | "not_started"
  | "partially_aligned"
  | "aligned"
  | "mismatch";

export type PlanningComparisonGapCode =
  | "planned_shift_missing"
  | "unplanned_operational_shift"
  | "planned_count_not_reached"
  | "operational_count_exceeds_plan"
  | "request_present";

export interface PlanningComparisonGapSignal {
  code: PlanningComparisonGapCode;
  shiftType?: string;
  plannedCount?: number;
  operationalCount?: number;
  requestCount?: number;
}

export interface PlanningComparisonDay {
  date: string;
  planningShiftTemplates: Array<
    Pick<
      PlanningShiftTemplate,
      | "id"
      | "type"
      | "requiredCount"
      | "requiredQualifiedCount"
      | "isCritical"
    >
  >;
  operationalShifts: Array<
    Pick<Shift, "id" | "type" | "requiredCount" | "requiredQualifiedCount">
  >;
  relevantAvailabilityRequestCount: number;
  requestCount: number;
  gapSignalCount: number;
  affectedShiftTypes: string[];
  isSpecialDay: boolean;
  planningNote: string | null;
  comparisonStatus: PlanningComparisonStatus;
  gapSignals: PlanningComparisonGapSignal[];
}

export interface PlanningMonthComparisonSummary {
  daysTotal: number;
  daysAligned: number;
  daysPartiallyAligned: number;
  daysMismatch: number;
  daysNotStarted: number;
  daysWithRequests: number;
  requestsTotal: number;
  gapSignalsTotal: number;
  daysWithGapSignals: number;
  daysWithSpecialDays: number;
  daysWithPlanningNotes: number;
  gapSignalsByCode: Record<PlanningComparisonGapCode, number>;
}

export interface PlanningMonthComparison {
  planningMonth: Pick<PlanningMonth, "id" | "year" | "month" | "status">;
  summary: PlanningMonthComparisonSummary;
  days: PlanningComparisonDay[];
}

// This comparison layer is intentionally read-only.
// It compares planning structure, operational shifts, and request context
// without generating planning, mutating data, or triggering downstream logic.
// Gap signals are explicit difference markers only. They are not scores,
// recommendations, or hidden reasoning.
// Context fields only expose direct, descriptive facts such as counts,
// affected shift types, and existing planning day metadata.
