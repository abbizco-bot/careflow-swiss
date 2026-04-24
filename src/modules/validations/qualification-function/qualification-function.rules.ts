import type { AssignedFunction } from "../../assignments/assignment.types";
import type { BaseQualification } from "../../employees/employees.types";
import type { FullValidationIssue } from "../full/full.types";

const allowedQualificationsByFunction: Record<
  AssignedFunction,
  readonly BaseQualification[]
> = {
  Hausverantwortung: ["DIPL_PFLEGE"],
  Pflegeleitung: ["DIPL_PFLEGE"],
  Tagesverantwortung: ["DIPL_PFLEGE", "FAGE"],
  Pflegedienst: [
    "DIPL_PFLEGE",
    "FAGE",
    "AGS",
    "PFLEGEHILFE",
    "LEARNER",
    "EXTERNAL",
    "OTHER",
  ],
  Springer: ["DIPL_PFLEGE", "FAGE", "AGS", "PFLEGEHILFE"],
  Lernende: ["LEARNER"],
  Externe: ["EXTERNAL"],
  Andere: [
    "DIPL_PFLEGE",
    "FAGE",
    "AGS",
    "PFLEGEHILFE",
    "LEARNER",
    "EXTERNAL",
    "OTHER",
  ],
};

export type QualificationFunctionViolation = {
  baseQualification: BaseQualification;
  assignedFunction: AssignedFunction;
  message: string;
};

export type AssignmentQualificationFunctionInput = {
  id: number;
  employeeId: number;
  assignedFunction: AssignedFunction;
  employee: {
    baseQualification: BaseQualification;
  } | null;
};

export function isFunctionAllowedForQualification(
  baseQualification: BaseQualification,
  assignedFunction: AssignedFunction
): boolean {
  return allowedQualificationsByFunction[assignedFunction].includes(
    baseQualification
  );
}

export function getQualificationFunctionViolation(
  baseQualification: BaseQualification,
  assignedFunction: AssignedFunction
): QualificationFunctionViolation | null {
  if (isFunctionAllowedForQualification(baseQualification, assignedFunction)) {
    return null;
  }

  return {
    baseQualification,
    assignedFunction,
    message: `Die Funktion ${assignedFunction} ist fuer die Stammqualifikation ${baseQualification} nicht grundsaetzlich freigegeben.`,
  };
}

export function buildQualificationFunctionIssuesForShift(
  shiftId: number,
  assignments: AssignmentQualificationFunctionInput[]
): FullValidationIssue[] {
  return assignments.flatMap((assignment) => {
    if (!assignment.employee) {
      return [];
    }

    const violation = getQualificationFunctionViolation(
      assignment.employee.baseQualification,
      assignment.assignedFunction
    );

    if (!violation) {
      return [];
    }

    return [
      {
        code: "ASSIGNMENT_FUNCTION_BASE_QUALIFICATION_MISMATCH",
        source: "qualification-function",
        severity: "warning",
        shiftId,
        assignmentId: assignment.id,
        employeeId: assignment.employeeId,
        baseQualification: violation.baseQualification,
        assignedFunction: violation.assignedFunction,
        message: `Die zugewiesene Funktion ${violation.assignedFunction} passt nicht zur Stammqualifikation ${violation.baseQualification}.`,
      },
    ];
  });
}
