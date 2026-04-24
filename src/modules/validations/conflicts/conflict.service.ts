import { assignmentRepository } from "../../assignments/assignment.repository";
import { employeesRepository } from "../../employees/employees.repository";
import { evaluateEmployeeConflicts } from "./conflict.rules";
import type { EmployeeConflictValidationResult } from "./conflict.types";

export class ConflictValidationError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "ConflictValidationError";
    this.code = code;
    this.status = status;
  }
}

export const conflictValidationService = {
  async validateEmployeeConflicts(
    employeeId: number
  ): Promise<EmployeeConflictValidationResult> {
    const employee = await employeesRepository.findById(employeeId);

    if (!employee) {
      throw new ConflictValidationError(
        "VALIDATION_EMPLOYEE_NOT_FOUND",
        `Employee ${employeeId} not found.`,
        404
      );
    }

    const assignments =
      await assignmentRepository.findAssignmentsWithShiftByEmployeeId(employeeId);
    return buildEmployeeConflictValidationResult(employeeId, assignments);
  },
};

export async function validateEmployeeConflicts(
  employeeId: number
): Promise<EmployeeConflictValidationResult> {
  return conflictValidationService.validateEmployeeConflicts(employeeId);
}

type AssignmentWithShift = Awaited<
  ReturnType<typeof assignmentRepository.findAssignmentsWithShiftByEmployeeId>
>[number];

export function buildEmployeeConflictValidationResult(
  employeeId: number,
  assignments: AssignmentWithShift[]
): EmployeeConflictValidationResult {
  const slots = new Map<
    string,
    { date: Date; type: string; assignmentIds: number[] }
  >();

  for (const assignment of assignments) {
    const key = `${assignment.shift.date.toISOString()}::${assignment.shift.type}`;
    const existingSlot = slots.get(key);

    if (existingSlot) {
      existingSlot.assignmentIds.push(assignment.id);
      continue;
    }

    slots.set(key, {
      date: assignment.shift.date,
      type: assignment.shift.type,
      assignmentIds: [assignment.id],
    });
  }

  const conflictSlots = [...slots.values()].filter(
    (slot) => slot.assignmentIds.length > 1
  );

  return evaluateEmployeeConflicts({
    employeeId,
    assignmentCount: assignments.length,
    conflictSlots,
  });
}
