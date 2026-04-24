import { prisma } from "../../lib/prisma";

export const shiftsRepository = {
  async findByIdWithAssignments(shiftId: number) {
    return prisma.shift.findUnique({
      where: { id: shiftId },
      include: {
        assignments: {
          include: {
            employee: true,
          },
        },
      },
    });
  },

  async findManyWithAssignments() {
    return prisma.shift.findMany({
      include: {
        assignments: {
          include: {
            employee: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });
  },

  async findManyByDateRangeWithAssignments(startDate: Date, endDate: Date) {
    return prisma.shift.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        assignments: {
          include: {
            employee: true,
          },
        },
      },
      orderBy: [
        {
          date: "asc",
        },
        {
          type: "asc",
        },
        {
          id: "asc",
        },
      ],
    });
  },
};
