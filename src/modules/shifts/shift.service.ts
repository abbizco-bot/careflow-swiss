import { Prisma, Shift } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import type { ShiftType } from "./shift.types";

export type CreateShiftInput = {
  date: Date;
  type: ShiftType;
  requiredCount: number;
  requiredQualifiedCount: number;
};

export type UpdateShiftInput = Partial<CreateShiftInput>;

export async function getShifts(): Promise<Shift[]> {
  return prisma.shift.findMany({
    orderBy: [{ date: "asc" }, { id: "asc" }],
  });
}

export async function getShiftById(id: number): Promise<Shift | null> {
  return prisma.shift.findUnique({
    where: { id },
  });
}

export async function createShift(data: CreateShiftInput): Promise<Shift> {
  return prisma.shift.create({
    data,
  });
}

export async function updateShift(
  id: number,
  data: UpdateShiftInput
): Promise<Shift> {
  return prisma.shift.update({
    where: { id },
    data,
  });
}

export async function deleteShift(id: number): Promise<Shift> {
  return prisma.shift.delete({
    where: { id },
  });
}

export function isPrismaNotFoundError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2025"
  );
}
