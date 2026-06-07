import type {
  PlanningMonth,
  PlanningShiftTemplate,
} from "../../generated/prisma/client";
import type {
  GapInterpretationSignalCode,
  GapPrimaryCause,
} from "../shared/gap-interpretation/gap-interpretation";
import type { PlanningPublicationState } from "../planning-months/planning-publication-state";

export interface PlanningMonthComparison {
  planningMonth: Pick<PlanningMonth, "id" | "year" | "month" | "status"> & {
    publicationState: PlanningPublicationState;
  };
  summary: PlanningMonthComparisonSummary;
  days: PlanningComparisonDay[];
}

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
  | "request_present"
  | GapInterpretationSignalCode;

export type PlanningComparisonPrimaryGapCause = GapPrimaryCause;

export interface PlanningComparisonGapSignal {
  code: PlanningComparisonGapCode;
  shiftType?: string;
  plannedCount?: number;
  operationalCount?: number;
  requestCount?: number;
  requiredCount?: number;
  assignedCount?: number;
  availableAssignedCount?: number;
  absentAssignedCount?: number;
  requiredQualifiedCount?: number;
  qualifiedAssignedCount?: number;
  availableQualifiedCount?: number;
  effectiveCoverageGap?: number;
  effectiveQualificationGap?: number;
}

export interface PlanningComparisonOperationalShift {
  id: number;
  type: string;
  requiredCount: number;
  requiredQualifiedCount: number;
  assignedCount: number;
  availableAssignedCount: number;
  absentAssignedCount: number;
  qualifiedAssignedCount: number;
  availableQualifiedCount: number;
  effectiveCoverageGap: number;
  effectiveQualificationGap: number;
  primaryGapCause: PlanningComparisonPrimaryGapCause;
  primaryGapSignals: PlanningComparisonGapCode[];
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
  operationalShifts: PlanningComparisonOperationalShift[];
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
  planningMonth: Pick<PlanningMonth, "id" | "year" | "month" | "status"> & {
    publicationState: PlanningPublicationState;
  };
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
// Effective staffing fields reuse the existing operational availability logic;
// they describe current staffing reality and do not change planning records.
