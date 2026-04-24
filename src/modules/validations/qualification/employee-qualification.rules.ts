import type { BaseQualification } from "../../employees/employees.types";

type EmployeeQualificationSnapshot = {
  qualified?: boolean | null;
} | null | undefined;

export function isEmployeeCountedAsQualified(
  employee: EmployeeQualificationSnapshot
): boolean {
  return employee?.qualified === true;
}

export function deriveQualifiedFromBaseQualification(
  baseQualification: BaseQualification
): boolean {
  return baseQualification === "DIPL_PFLEGE" || baseQualification === "FAGE";
}
