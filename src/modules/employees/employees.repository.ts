import { prisma } from "../../lib/prisma";
import type { BaseQualification } from "./employees.types";

export interface CreateEmployeeData {
  name: string;
  role: string;
  workload: number;
  qualified?: boolean;
  baseQualification?: BaseQualification;
}

export const employeesRepository = {
  async findMany() {
    return prisma.employee.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findById(employeeId: number) {
    return prisma.employee.findUnique({
      where: { id: employeeId },
    });
  },

  async create(data: CreateEmployeeData) {
    return prisma.employee.create({
      data: {
        name: data.name,
        role: data.role,
        workload: data.workload,
        qualified: data.qualified ?? false,
        baseQualification: data.baseQualification,
      },
    });
  },

  async update(employeeId: number, data: Partial<CreateEmployeeData>) {
    return prisma.employee.update({
      where: { id: employeeId },
      data: {
        ...data,
      },
    });
  },
};
