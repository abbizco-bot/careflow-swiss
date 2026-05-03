import { prisma } from "../../lib/prisma";

export const rollingPlanningViewRepository = {
  async findOperationalShiftsByDateRange(startDate: Date, endDate: Date) {
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
            employee: {
              select: {
                qualified: true,
              },
            },
          },
          orderBy: [
            {
              createdAt: "asc",
            },
            {
              id: "asc",
            },
          ],
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

  async findPlanningDaysWithMonthStatusByDateRange(
    startDate: Date,
    endDate: Date
  ) {
    return prisma.planningDay.findMany({
      where: {
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        planningMonth: {
          select: {
            status: true,
          },
        },
        shiftTemplates: {
          select: {
            id: true,
            type: true,
          },
        },
      },
      orderBy: [
        {
          date: "asc",
        },
      ],
    });
  },
};
