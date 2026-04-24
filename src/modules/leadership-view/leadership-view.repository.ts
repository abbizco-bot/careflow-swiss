import { prisma } from "../../lib/prisma";

export const leadershipViewRepository = {
  async findPlanningDayByDate(date: Date) {
    return prisma.planningDay.findFirst({
      where: {
        date,
      },
      include: {
        planningMonth: true,
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
    });
  },
};
