export type ClosedPeriodReferencePlanStatus = "available" | "missing";

export type ClosedPeriodRollingSnapshotStatus = "available" | "missing";

export interface ClosedPeriodReviewPeriod {
  startDate: string;
  endDate: string;
}

export interface ClosedPeriodReviewSummary {
  criticalDayCount?: number;
  attentionDayCount?: number;
  totalCoverageGap?: number;
  totalQualificationGap?: number;
  openDecisionCount?: number;
  approvedDecisionCount?: number;
  specialNeedDayCount?: number;
  specialCompetenceGapCount?: number;
}

export interface ClosedPeriodReview {
  period: ClosedPeriodReviewPeriod;
  referencePlanStatus: ClosedPeriodReferencePlanStatus;
  rollingSnapshotStatus?: ClosedPeriodRollingSnapshotStatus;
  summary: ClosedPeriodReviewSummary;
  learningNotes?: string[];
  dataLimitations?: string[];
  metadata?: Record<string, unknown>;
}
