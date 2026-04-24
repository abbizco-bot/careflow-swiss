import type { ValidationIssue } from "../validations.types";

export type EmployeeConflictStatus = "ok" | "conflict";

export interface EmployeeConflictValidationResult {
  employeeId: number;
  assignmentCount: number;
  conflictCount: number;
  // Conflict validation stays narrow: real collision or no collision.
  status: EmployeeConflictStatus;
  issues: ValidationIssue[];
}
