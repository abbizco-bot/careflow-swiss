// CareFlow statuses are technical signals for leadership prioritization.
// UI language can later map these to "kritisch", "auffällig" and "stabil".
export type ValidationSeverity = "info" | "warning" | "critical";
export type ValidationIssueSource =
  | "coverage"
  | "qualification"
  | "qualification-function"
  | "conflict";

// Issues are the technical carriers for later UI-facing risk hints.
export interface ValidationIssue {
  code: string;
  message: string;
  severity: ValidationSeverity;
  source?: ValidationIssueSource;
  shiftId?: number;
  gap?: number;
  requiredCount?: number;
  assignedCount?: number;
  availableAssignedCount?: number;
  absentAssignedCount?: number;
  requiredQualifiedCount?: number;
  assignedQualifiedCount?: number;
  availableQualifiedCount?: number;
  absentQualifiedCount?: number;
  assignmentId?: number;
  employeeId?: number;
  baseQualification?: string;
  assignedFunction?: string;
}
