import { prisma } from "../../lib/prisma";
import type {
  CreatePlanningMonthInput,
  CreatePlanningShiftTemplateInput,
  UpdatePlanningShiftTemplateInput,
} from "./planning-months.types";

export const planningMonthsRepository = {
  async findMany() {
    return prisma.planningMonth.findMany({
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
      orderBy: [
        {
          year: "desc",
        },
        {
          month: "desc",
        },
      ],
    });
  },

  async findById(id: number) {
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

  async create(data: CreatePlanningMonthInput) {
    return prisma.planningMonth.create({
      data: {
        year: data.year,
        month: data.month,
        status: data.status ?? "draft",
      },
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

  async findPlanningMonthRecordById(id: number) {
    return prisma.planningMonth.findUnique({
      where: { id },
    });
  },

  async findPlanningDaysByPlanningMonthId(planningMonthId: number) {
    return prisma.planningDay.findMany({
      where: { planningMonthId },
      orderBy: [
        {
          date: "asc",
        },
        {
          id: "asc",
        },
      ],
    });
  },

  async createPlanningDays(
    planningMonthId: number,
    dates: Date[]
  ) {
    if (dates.length === 0) {
      return { count: 0 };
    }

    return prisma.planningDay.createMany({
      data: dates.map((date) => ({
        planningMonthId,
        date,
        isSpecialDay: false,
        note: null,
      })),
      skipDuplicates: true,
    });
  },

  async findPlanningDayById(id: number) {
    return prisma.planningDay.findUnique({
      where: { id },
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
    });
  },

  async createPlanningShiftTemplate(
    planningDayId: number,
    data: CreatePlanningShiftTemplateInput
  ) {
    return prisma.planningShiftTemplate.create({
      data: {
        planningDayId,
        type: data.type,
        requiredCount: data.requiredCount,
        requiredQualifiedCount: data.requiredQualifiedCount,
        isCritical: data.isCritical ?? false,
      },
    });
  },

  async findPlanningShiftTemplateById(id: number) {
    return prisma.planningShiftTemplate.findUnique({
      where: { id },
    });
  },

  async findPlanningShiftTemplatesByPlanningDayId(planningDayId: number) {
    return prisma.planningShiftTemplate.findMany({
      where: { planningDayId },
      orderBy: [
        {
          createdAt: "asc",
        },
        {
          id: "asc",
        },
      ],
    });
  },

  async updatePlanningShiftTemplate(
    id: number,
    data: UpdatePlanningShiftTemplateInput
  ) {
    return prisma.planningShiftTemplate.update({
      where: { id },
      data,
    });
  },

  async deletePlanningShiftTemplate(id: number) {
    return prisma.planningShiftTemplate.delete({
      where: { id },
    });
  },
};
