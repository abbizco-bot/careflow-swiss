import type {
  FullValidationIssue,
  FullValidationOverallStatus,
} from "../full/full.types";

export interface ShiftOverviewEntry {
  shiftId: number;
  date: string;
  type: string;
  requiredCount: number;
  requiredQualifiedCount: number;
  assignedCount: number;
  availableAssignedCount: number;
  absentAssignedCount: number;
  assignedQualifiedCount: number;
  availableQualifiedCount: number;
  absentQualifiedCount: number;
  // Shift overview answers the daily supply-side question for leadership.
  overallStatus: FullValidationOverallStatus;
  issueCount: number;
  issues: FullValidationIssue[];
}

export interface ShiftOverviewByDateResult {
  date: string;
  shiftCount: number;
  criticalCount: number;
  warningCount: number;
  okCount: number;
  // Sorted list of shifts for the day's operational supply situation.
  shifts: ShiftOverviewEntry[];
}
