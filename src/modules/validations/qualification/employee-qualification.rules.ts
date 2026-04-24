type EmployeeQualificationSnapshot = {
  qualified?: boolean | null;
} | null | undefined;

export function isEmployeeCountedAsQualified(
  employee: EmployeeQualificationSnapshot
): boolean {
  return employee?.qualified === true;
}
