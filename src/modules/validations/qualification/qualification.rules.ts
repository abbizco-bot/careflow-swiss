import type {
  ShiftQualificationInput,
  ShiftQualificationResult,
  QualificationStatus,
} from "./qualification.types";
import type { ValidationIssue } from "../validations.types";

export function evaluateQualification(
  input: ShiftQualificationInput
): ShiftQualificationResult {
  const gap = Math.max(
    0,
    input.requiredQualifiedCount - input.availableQualifiedCount
  );

  let status: QualificationStatus;
  const issues: ValidationIssue[] = [];

  if (gap > 0) {
    status = "underqualified";
    issues.push({
      code: "SHIFT_UNDERQUALIFIED",
      source: "qualification",
      shiftId: input.shiftId,
      requiredQualifiedCount: input.requiredQualifiedCount,
      assignedQualifiedCount: input.assignedQualifiedCount,
      availableQualifiedCount: input.availableQualifiedCount,
      absentQualifiedCount: input.absentQualifiedCount,
      gap,
      message: `Shift ${input.shiftId} ist operativ unterqualifiziert: benötigt ${input.requiredQualifiedCount} qualifizierte Person(en), verfügbar ${input.availableQualifiedCount}, abwesend ${input.absentQualifiedCount}.`,
      severity: "critical",
    });
  } else {
    status = "ok";
  }

  return {
    shiftId: input.shiftId,
    requiredQualifiedCount: input.requiredQualifiedCount,
    assignedQualifiedCount: input.assignedQualifiedCount,
    availableQualifiedCount: input.availableQualifiedCount,
    absentQualifiedCount: input.absentQualifiedCount,
    gap,
    status,
    issues,
  };
}
