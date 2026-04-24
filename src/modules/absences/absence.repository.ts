import { prisma } from "../../lib/prisma";
import type {
  ActiveAbsenceFilters,
  CreateAbsenceInput,
} from "./absence.types";

export const absenceRepository = {
  async findEmployeeById(employeeId: number) {
    return prisma.employee.findUnique({
      where: { id: employeeId },
    });
  },

  async create(data: CreateAbsenceInput) {
    return prisma.absence.create({
      data: {
        employeeId: data.employeeId,
        type: data.type,
        scope: data.scope ?? "full_day",
        startDate: data.startDate,
        endDate: data.endDate ?? null,
        status: "active",
        note: data.note,
      },
    });
  },

  async findActive(filters: ActiveAbsenceFilters = {}) {
    return prisma.absence.findMany({
      where: {
        status: "active",
        ...(filters.employeeId !== undefined
          ? {
              employeeId: filters.employeeId,
            }
          : {}),
        ...(filters.asOfDate
          ? {
              startDate: {
                lte: filters.asOfDate,
              },
              OR: [
                {
                  endDate: null,
                },
                {
                  endDate: {
                    gte: filters.asOfDate,
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        employee: true,
      },
      orderBy: [
        {
          startDate: "asc",
        },
        {
          id: "asc",
        },
      ],
    });
  },

  async findActiveByEmployeeIdsAndDateRange(
    employeeIds: number[],
    startDate: Date,
    endDate: Date
  ) {
    if (employeeIds.length === 0) {
      return [];
    }

    return prisma.absence.findMany({
      where: {
        status: "active",
        employeeId: {
          in: employeeIds,
        },
        startDate: {
          lte: endDate,
        },
        OR: [
          {
            endDate: null,
          },
          {
            endDate: {
              gte: startDate,
            },
          },
        ],
      },
      orderBy: [
        {
          startDate: "asc",
        },
        {
          id: "asc",
        },
      ],
    });
  },
};
