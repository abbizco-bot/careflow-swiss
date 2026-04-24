import {
  getAssignmentOperationalAvailabilityByDateRange,
  type AssignmentOperationalAvailability,
} from "../availability/availability.service";
import { parseOverviewDate } from "../overview/overview.service";
import type {
  EmployeeAvailabilityStatus,
  EmployeeOverviewByDateResult,
  EmployeeOverviewEntry,
  EmployeeOverviewShiftEntry,
} from "./employee-overview.types";

export async function getEmployeeOverviewByDate(
  dateInput: string
): Promise<EmployeeOverviewByDateResult> {
  const { startDate, endDate } = parseOverviewDate(dateInput);
  const assignmentAvailability =
    await getAssignmentOperationalAvailabilityByDateRange(startDate, endDate);

  const assignmentsByEmployee = groupAssignmentsByEmployee(assignmentAvailability);

  return sortEmployeeOverviewEntries(
    [...assignmentsByEmployee.values()].map((employeeAssignments) =>
      buildEmployeeOverviewEntry(employeeAssignments)
    )
  );
}

function groupAssignmentsByEmployee(
  assignments: AssignmentOperationalAvailability[]
): Map<number, AssignmentOperationalAvailability[]> {
  const assignmentsByEmployee = new Map<number, AssignmentOperationalAvailability[]>();

  for (const assignment of assignments) {
    const employeeAssignments =
      assignmentsByEmployee.get(assignment.employeeId) ?? [];
    employeeAssignments.push(assignment);
    assignmentsByEmployee.set(assignment.employeeId, employeeAssignments);
  }

  return assignmentsByEmployee;
}

function buildEmployeeOverviewEntry(
  assignments: AssignmentOperationalAvailability[]
): EmployeeOverviewEntry {
  const [firstAssignment] = assignments;

  if (!firstAssignment) {
    throw new Error("Missing assignment availability for employee overview.");
  }

  const availableAssignments = assignments.filter(
    (assignment) => assignment.available
  ).length;
  const absentAssignments = assignments.length - availableAssignments;

  return {
    employeeId: firstAssignment.employeeId,
    name: firstAssignment.employeeName,
    role: firstAssignment.employeeRole,
    plannedAssignments: assignments.length,
    availableAssignments,
    absentAssignments,
    status: determineEmployeeAvailabilityStatus(
      assignments.length,
      availableAssignments
    ),
    shifts: assignments.map<EmployeeOverviewShiftEntry>((assignment) => ({
      shiftId: assignment.shiftId,
      shiftType: assignment.shiftType,
      planned: true,
      available: assignment.available,
      absenceReason: assignment.absenceReason,
    })),
  };
}

function determineEmployeeAvailabilityStatus(
  plannedAssignments: number,
  availableAssignments: number
): EmployeeAvailabilityStatus {
  if (plannedAssignments === 0 || availableAssignments === plannedAssignments) {
    return "available";
  }

  if (availableAssignments === 0) {
    return "absent";
  }

  return "partially_available";
}

function sortEmployeeOverviewEntries(
  employees: EmployeeOverviewEntry[]
): EmployeeOverviewEntry[] {
  return [...employees].sort((left, right) => {
    const statusComparison =
      getStatusPriority(left.status) - getStatusPriority(right.status);

    if (statusComparison !== 0) {
      return statusComparison;
    }

    if (left.absentAssignments !== right.absentAssignments) {
      return right.absentAssignments - left.absentAssignments;
    }

    if (left.plannedAssignments !== right.plannedAssignments) {
      return right.plannedAssignments - left.plannedAssignments;
    }

    const nameComparison = left.name.localeCompare(right.name);

    if (nameComparison !== 0) {
      return nameComparison;
    }

    return left.employeeId - right.employeeId;
  });
}

function getStatusPriority(status: EmployeeAvailabilityStatus): number {
  switch (status) {
    case "absent":
      return 1;
    case "partially_available":
      return 2;
    case "available":
      return 3;
    default:
      return 99;
  }
}
