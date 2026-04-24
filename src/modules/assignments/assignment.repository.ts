import { prisma } from "../../lib/prisma";
import type { AssignedFunction } from "./assignment.types";

export interface CreateAssignmentData {
  employeeId: number;
  shiftId: number;
  assignedFunction?: AssignedFunction;
  status?: string;
}

export type UpdateAssignmentData = Partial<CreateAssignmentData>;

export const assignmentRepository = {
  async findMany() {
    return prisma.assignment.findMany({
      orderBy: [{ id: "asc" }],
    });
  },

  async findById(assignmentId: number) {
    return prisma.assignment.findUnique({
      where: { id: assignmentId },
    });
  },

  async findEmployeeById(employeeId: number) {
    return prisma.employee.findUnique({
      where: { id: employeeId },
    });
  },

  async findShiftById(shiftId: number) {
    return prisma.shift.findUnique({
      where: { id: shiftId },
    });
  },

  async findByEmployeeAndShift(employeeId: number, shiftId: number) {
    return prisma.assignment.findFirst({
      where: {
        employeeId,
        shiftId,
      },
    });
  },

  async findAssignmentsWithShiftByEmployeeId(employeeId: number) {
    return prisma.assignment.findMany({
      where: {
        employeeId,
      },
      include: {
        shift: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  },

  async findAssignmentsWithEmployeeAndShiftByDateRange(
    startDate: Date,
    endDate: Date
  ) {
    return prisma.assignment.findMany({
      where: {
        shift: {
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
      },
      include: {
        employee: true,
        shift: true,
      },
      orderBy: [
        {
          employeeId: "asc",
        },
        {
          shift: {
            date: "asc",
          },
        },
        {
          shiftId: "asc",
        },
        {
          id: "asc",
        },
      ],
    });
  },

  async create(data: CreateAssignmentData) {
    return prisma.assignment.create({
      data,
    });
  },

  async update(assignmentId: number, data: UpdateAssignmentData) {
    return prisma.assignment.update({
      where: { id: assignmentId },
      data,
    });
  },

  async delete(assignmentId: number) {
    return prisma.assignment.delete({
      where: { id: assignmentId },
    });
  },
};
