import type {
  ShiftCoverageInput,
  ShiftCoverageResult,
  CoverageStatus,
} from "./coverage.types";
import type { ValidationIssue } from "../validations.types";

export function evaluateCoverage(
  input: ShiftCoverageInput
): ShiftCoverageResult {
  const gap = input.requiredCount - input.availableAssignedCount;

  let status: CoverageStatus;
  const issues: ValidationIssue[] = [];

  if (gap > 0) {
    status = "understaffed";
    issues.push({
      code: "SHIFT_UNDERSTAFFED",
      source: "coverage",
      shiftId: input.shiftId,
      requiredCount: input.requiredCount,
      assignedCount: input.assignedCount,
      availableAssignedCount: input.availableAssignedCount,
      absentAssignedCount: input.absentAssignedCount,
      gap,
      message: `Shift ${input.shiftId} ist operativ unterbesetzt: geplant ${input.assignedCount}, verfügbar ${input.availableAssignedCount}, abwesend ${input.absentAssignedCount}.`,
      severity: "critical",
    });
  } else if (gap < 0) {
    status = "overstaffed";
    issues.push({
      code: "SHIFT_OVERSTAFFED",
      source: "coverage",
      shiftId: input.shiftId,
      requiredCount: input.requiredCount,
      assignedCount: input.assignedCount,
      availableAssignedCount: input.availableAssignedCount,
      absentAssignedCount: input.absentAssignedCount,
      gap,
      message: `Shift ${input.shiftId} ist operativ überbesetzt: geplant ${input.assignedCount}, verfügbar ${input.availableAssignedCount}, abwesend ${input.absentAssignedCount}.`,
      severity: "warning",
    });
  } else {
    status = "ok";
  }

  return {
    shiftId: input.shiftId,
    requiredCount: input.requiredCount,
    assignedCount: input.assignedCount,
    availableAssignedCount: input.availableAssignedCount,
    absentAssignedCount: input.absentAssignedCount,
    gap,
    status,
    issues,
  };
}
