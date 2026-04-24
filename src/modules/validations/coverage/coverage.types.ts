import type { ValidationIssue } from "../validations.types";

export type CoverageStatus = "understaffed" | "ok" | "overstaffed";

export interface ShiftCoverageInput {
  shiftId: number;
  requiredCount: number;
  assignedCount: number;
  availableAssignedCount: number;
  absentAssignedCount: number;
}

export interface ShiftCoverageResult {
  shiftId: number;
  requiredCount: number;
  assignedCount: number;
  availableAssignedCount: number;
  absentAssignedCount: number;
  gap: number;
  status: CoverageStatus;
  issues: ValidationIssue[];
}
