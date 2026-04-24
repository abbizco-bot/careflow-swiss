import type { ValidationIssue } from "../validations.types";
import type { EmployeeConflictValidationResult } from "./conflict.types";

interface ConflictSlot {
  date: Date;
  type: string;
  assignmentIds: number[];
}

export function evaluateEmployeeConflicts(input: {
  employeeId: number;
  assignmentCount: number;
  conflictSlots: ConflictSlot[];
}): EmployeeConflictValidationResult {
  const issues = buildConflictIssues(input.employeeId, input.conflictSlots);

  return {
    employeeId: input.employeeId,
    assignmentCount: input.assignmentCount,
    conflictCount: input.conflictSlots.length,
    status: input.conflictSlots.length > 0 ? "conflict" : "ok",
    issues,
  };
}

function buildConflictIssues(
  employeeId: number,
  conflictSlots: ConflictSlot[]
): ValidationIssue[] {
  return conflictSlots.map((slot) => ({
    code: "EMPLOYEE_SHIFT_CONFLICT",
    message: `Employee ${employeeId} has conflicting assignments on ${slot.date.toISOString().slice(0, 10)} for shift type '${slot.type}'.`,
    severity: "critical",
  }));
}
