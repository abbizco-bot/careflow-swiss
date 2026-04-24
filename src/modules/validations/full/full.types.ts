import type { ShiftCoverageResult } from "../coverage/coverage.types";
import type { ShiftQualificationResult } from "../qualification/qualification.types";
import type { ValidationIssue } from "../validations.types";

export type FullValidationOverallStatus =
  | "ok"
  | "warning"
  | "critical";

export type FullValidationIssueSource =
  | "coverage"
  | "qualification"
  | "qualification-function";

export interface FullValidationIssue extends ValidationIssue {
  source: FullValidationIssueSource;
}

export interface FullValidationResult {
  shiftId: number;
  coverage: ShiftCoverageResult;
  qualification: ShiftQualificationResult;
  // issues[] explains why a shift is stable, noticeable or critical.
  issues: FullValidationIssue[];
  issueCount: number;
  // overallStatus drives leadership prioritization, not end-user wording.
  hasCriticalIssues: boolean;
  overallStatus: FullValidationOverallStatus;
}

export interface FullShiftDetailEntry {
  shiftId: number;
  shiftType: string;
  overallStatus: FullValidationOverallStatus;
  requiredCount: number;
  assignedCount: number;
  availableAssignedCount: number;
  absentAssignedCount: number;
  requiredQualifiedCount: number;
  assignedQualifiedCount: number;
  availableQualifiedCount: number;
  absentQualifiedCount: number;
  issues: FullValidationIssue[];
}

export interface FullShiftsByDateResult {
  date: string;
  shifts: FullShiftDetailEntry[];
}
