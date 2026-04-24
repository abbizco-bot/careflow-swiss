export const absenceErrorCodes = {
  employeeNotFound: "ABSENCE_EMPLOYEE_NOT_FOUND",
  invalidType: "ABSENCE_INVALID_TYPE",
  invalidScope: "ABSENCE_INVALID_SCOPE",
  invalidDate: "ABSENCE_INVALID_DATE",
  invalidDateRange: "ABSENCE_INVALID_DATE_RANGE",
  invalidInput: "ABSENCE_INVALID_INPUT",
  internal: "ABSENCE_INTERNAL_ERROR",
} as const;

export type AbsenceErrorCode =
  (typeof absenceErrorCodes)[keyof typeof absenceErrorCodes];

export class AbsenceError extends Error {
  readonly code: AbsenceErrorCode;
  readonly status: number;

  constructor(code: AbsenceErrorCode, message: string, status = 400) {
    super(message);
    this.name = "AbsenceError";
    this.code = code;
    this.status = status;
  }
}

export function isAbsenceError(error: unknown): error is AbsenceError {
  return error instanceof AbsenceError;
}
