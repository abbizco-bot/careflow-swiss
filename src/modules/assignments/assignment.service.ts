import { Assignment, Prisma } from "../../generated/prisma/client";
import {
  assignmentRepository,
  type CreateAssignmentData,
  type UpdateAssignmentData,
} from "./assignment.repository";
import {
  AssignmentError,
  assignmentErrorCodes,
} from "./assignment.errors";

export type CreateAssignmentInput = CreateAssignmentData;
export type UpdateAssignmentInput = UpdateAssignmentData;

type AssignmentWithShift = Awaited<
  ReturnType<typeof assignmentRepository.findAssignmentsWithShiftByEmployeeId>
>[number];

export const assignmentService = {
  async getAssignments(): Promise<Assignment[]> {
    return assignmentRepository.findMany();
  },

  async getAssignmentById(id: number): Promise<Assignment | null> {
    return assignmentRepository.findById(id);
  },

  async createAssignment(data: CreateAssignmentInput): Promise<Assignment> {
    await ensureEmployeeExists(data.employeeId);
    const shift = await ensureShiftExists(data.shiftId);
    await ensureNoDuplicate(data.employeeId, data.shiftId);
    await ensureNoShiftConflict(data.employeeId, shift.date, shift.type);

    try {
      return await assignmentRepository.create(data);
    } catch (error) {
      if (isPrismaUniqueConstraintError(error)) {
        throw new AssignmentError(
          assignmentErrorCodes.duplicate,
          "Employee is already assigned to this shift",
          409
        );
      }

      throw error;
    }
  },

  async updateAssignment(
    id: number,
    data: UpdateAssignmentInput
  ): Promise<Assignment> {
    const existingAssignment = await ensureAssignmentExists(id);

    const nextEmployeeId = data.employeeId ?? existingAssignment.employeeId;
    const nextShiftId = data.shiftId ?? existingAssignment.shiftId;

    await ensureEmployeeExists(nextEmployeeId);
    const shift = await ensureShiftExists(nextShiftId);
    await ensureNoDuplicate(nextEmployeeId, nextShiftId, id);
    await ensureNoShiftConflict(nextEmployeeId, shift.date, shift.type, id);

    try {
      return await assignmentRepository.update(id, data);
    } catch (error) {
      if (isPrismaUniqueConstraintError(error)) {
        throw new AssignmentError(
          assignmentErrorCodes.duplicate,
          "Employee is already assigned to this shift",
          409
        );
      }

      throw error;
    }
  },

  async deleteAssignment(id: number): Promise<Assignment> {
    await ensureAssignmentExists(id);
    return assignmentRepository.delete(id);
  },
};

async function ensureAssignmentExists(assignmentId: number): Promise<Assignment> {
  const assignment = await assignmentRepository.findById(assignmentId);

  if (!assignment) {
    throw new AssignmentError(
      assignmentErrorCodes.assignmentNotFound,
      "Assignment not found",
      404
    );
  }

  return assignment;
}

async function ensureEmployeeExists(employeeId: number): Promise<void> {
  const employee = await assignmentRepository.findEmployeeById(employeeId);

  if (!employee) {
    console.warn(
      `[assignments] missing employee for assignment attempt: employeeId=${employeeId}`
    );

    throw new AssignmentError(
      assignmentErrorCodes.employeeNotFound,
      "Employee not found",
      404
    );
  }
}

async function ensureShiftExists(shiftId: number) {
  const shift = await assignmentRepository.findShiftById(shiftId);

  if (!shift) {
    console.warn(
      `[assignments] missing shift for assignment attempt: shiftId=${shiftId}`
    );

    throw new AssignmentError(
      assignmentErrorCodes.shiftNotFound,
      "Shift not found",
      404
    );
  }

  return shift;
}

async function ensureNoDuplicate(
  employeeId: number,
  shiftId: number,
  ignoreAssignmentId?: number
): Promise<void> {
  const existingAssignment = await assignmentRepository.findByEmployeeAndShift(
    employeeId,
    shiftId
  );

  if (
    existingAssignment &&
    existingAssignment.id !== ignoreAssignmentId
  ) {
    console.warn(
      `[assignments] duplicate assignment blocked: employeeId=${employeeId}, shiftId=${shiftId}`
    );

    throw new AssignmentError(
      assignmentErrorCodes.duplicate,
      "Employee is already assigned to this shift",
      409
    );
  }
}

async function ensureNoShiftConflict(
  employeeId: number,
  shiftDate: Date,
  shiftType: string,
  ignoreAssignmentId?: number
): Promise<void> {
  const assignments =
    await assignmentRepository.findAssignmentsWithShiftByEmployeeId(employeeId);

  const conflictingAssignment = assignments.find((assignment) =>
    isShiftConflict(assignment, shiftDate, shiftType, ignoreAssignmentId)
  );

  if (conflictingAssignment) {
    console.warn(
      `[assignments] shift conflict blocked: employeeId=${employeeId}, shiftDate=${shiftDate.toISOString()}, shiftType=${shiftType}`
    );

    throw new AssignmentError(
      assignmentErrorCodes.shiftConflict,
      "Employee already has a conflicting shift assignment",
      409
    );
  }
}

function isShiftConflict(
  assignment: AssignmentWithShift,
  shiftDate: Date,
  shiftType: string,
  ignoreAssignmentId?: number
): boolean {
  if (assignment.id === ignoreAssignmentId) {
    return false;
  }

  return (
    assignment.shift.date.getTime() === shiftDate.getTime() &&
    assignment.shift.type === shiftType
  );
}

function isPrismaUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function getAssignments() {
  return assignmentService.getAssignments();
}

export async function getAssignmentById(id: number) {
  return assignmentService.getAssignmentById(id);
}

export async function createAssignment(data: CreateAssignmentInput) {
  return assignmentService.createAssignment(data);
}

export async function updateAssignment(
  id: number,
  data: UpdateAssignmentInput
) {
  return assignmentService.updateAssignment(id, data);
}

export async function deleteAssignment(id: number) {
  return assignmentService.deleteAssignment(id);
}
