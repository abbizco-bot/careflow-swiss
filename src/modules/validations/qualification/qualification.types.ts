import type { ValidationIssue } from "../validations.types";

export type QualificationStatus = "ok" | "underqualified";

export interface ShiftQualificationInput {
  shiftId: number;
  requiredQualifiedCount: number;
  assignedQualifiedCount: number;
  availableQualifiedCount: number;
  absentQualifiedCount: number;
}

export interface ShiftQualificationResult {
  shiftId: number;
  requiredQualifiedCount: number;
  assignedQualifiedCount: number;
  availableQualifiedCount: number;
  absentQualifiedCount: number;
  gap: number;
  status: QualificationStatus;
  issues: ValidationIssue[];
}
