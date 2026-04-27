export type PersonAvailabilityStatus =
  | "available"
  | "absent"
  | "requested"
  | "not_effective";

export type PersonGapReasonCategory =
  | "absence"
  | "request"
  | "assignment_status"
  | "qualification"
  | "function";

export interface PersonContextEntry {
  employeeId: number;
  role?: string;
  assignmentStatus?: string;
  availabilityStatus?: PersonAvailabilityStatus;
  reasonCategory?: PersonGapReasonCategory;
}

export interface PersonGapContext {
  shiftId: number;
  shiftType: string;
  affectedEmployees?: PersonContextEntry[];
  absentEmployees?: PersonContextEntry[];
  requestedEmployees?: PersonContextEntry[];
  unavailableEmployees?: PersonContextEntry[];
  assignedButNotEffectiveEmployees?: PersonContextEntry[];
  missingFunctionContext?: unknown;
  qualificationGapContext?: unknown;
  assignmentConflictContext?: unknown;
}
