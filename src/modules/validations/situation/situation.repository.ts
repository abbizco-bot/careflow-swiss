import { prisma } from "../../../lib/prisma";

export const situationRepository = {
  async getRange(fromDate: Date, toDate: Date) {
    return prisma.dailySituation.findMany({
      where: {
        date: {
          gte: fromDate,
          lt: toDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });
  },

  async getRangeInclusive(fromDate: Date, toDate: Date) {
    const exclusiveEndDate = new Date(toDate);
    exclusiveEndDate.setUTCDate(exclusiveEndDate.getUTCDate() + 1);

    return prisma.dailySituation.findMany({
      where: {
        date: {
          gte: fromDate,
          lt: exclusiveEndDate,
        },
      },
      orderBy: {
        date: "asc",
      },
    });
  },

  async upsert(date: Date, situation: string) {
    return prisma.dailySituation.upsert({
      where: {
        date,
      },
      update: {
        situation,
      },
      create: {
        date,
        situation,
      },
    });
  },
};
