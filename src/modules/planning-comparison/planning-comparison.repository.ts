import { prisma } from "../../lib/prisma";

export const planningComparisonRepository = {
  async findPlanningMonthById(id: number) {
    return prisma.planningMonth.findUnique({
      where: { id },
      include: {
        planningDays: {
          include: {
            shiftTemplates: {
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
              id: "asc",
            },
          ],
        },
      },
    });
  },

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
};
