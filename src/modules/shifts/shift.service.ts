import { Assignment, Prisma } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

export type CreateAssignmentInput = {
  employeeId: number;
  shiftId: number;
  role?: string;
  status?: string;
};

export type UpdateAssignmentInput = Partial<CreateAssignmentInput>;

export async function getAssignments(): Promise<Assignment[]> {
  return prisma.assignment.findMany({
    orderBy: [{ id: "asc" }],
  });
}

export async function getAssignmentById(id: number): Promise<Assignment | null> {
  return prisma.assignment.findUnique({
    where: { id },
  });
}

export async function createAssignment(
  data: CreateAssignmentInput
): Promise<Assignment> {
  return prisma.assignment.create({
    data,
  });
}

export async function updateAssignment(
  id: number,
  data: UpdateAssignmentInput
): Promise<Assignment> {
  return prisma.assignment.update({
    where: { id },
    data,
  });
}

export async function deleteAssignment(id: number): Promise<Assignment> {
  return prisma.assignment.delete({
    where: { id },
  });
}

export function isPrismaNotFoundError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}