export const assignmentErrorCodes = {
  duplicate: "ASSIGNMENT_DUPLICATE",
  shiftConflict: "ASSIGNMENT_SHIFT_CONFLICT",
  employeeNotFound: "ASSIGNMENT_EMPLOYEE_NOT_FOUND",
  shiftNotFound: "ASSIGNMENT_SHIFT_NOT_FOUND",
  assignmentNotFound: "ASSIGNMENT_NOT_FOUND",
  invalidAssignmentId: "ASSIGNMENT_INVALID_ID",
  invalidInput: "ASSIGNMENT_INVALID_INPUT",
  internal: "ASSIGNMENT_INTERNAL_ERROR",
} as const;

export type AssignmentErrorCode =
  (typeof assignmentErrorCodes)[keyof typeof assignmentErrorCodes];

export class AssignmentError extends Error {
  readonly code: AssignmentErrorCode;
  readonly status: number;

  constructor(code: AssignmentErrorCode, message: string, status = 400) {
    super(message);
    this.name = "AssignmentError";
    this.code = code;
    this.status = status;
  }
}

export function isAssignmentError(error: unknown): error is AssignmentError {
  return error instanceof AssignmentError;
}
