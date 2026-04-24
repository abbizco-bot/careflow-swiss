export type EmployeeAvailabilityStatus =
  | "available"
  | "absent"
  | "partially_available";

export interface EmployeeOverviewShiftEntry {
  shiftId: number;
  shiftType: string;
  planned: true;
  available: boolean;
  absenceReason: string | null;
}

export interface EmployeeOverviewEntry {
  employeeId: number;
  name: string;
  role: string;
  plannedAssignments: number;
  availableAssignments: number;
  absentAssignments: number;
  status: EmployeeAvailabilityStatus;
  shifts: EmployeeOverviewShiftEntry[];
}

export type EmployeeOverviewByDateResult = EmployeeOverviewEntry[];
