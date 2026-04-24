import { prisma } from "../../lib/prisma";
import type {
  AvailabilityRequestFilters,
  CreateAvailabilityRequestInput,
  UpdateAvailabilityRequestStatusInput,
} from "./availability-requests.types";

export const availabilityRequestsRepository = {
  async findEmployeeById(employeeId: number) {
    return prisma.employee.findUnique({
      where: { id: employeeId },
    });
  },

  async findMany(filters: AvailabilityRequestFilters = {}) {
    return prisma.availabilityRequest.findMany({
      where: {
        ...(filters.employeeId !== undefined
          ? {
              employeeId: filters.employeeId,
            }
          : {}),
        ...(filters.status !== undefined
          ? {
              status: filters.status,
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

  async findById(id: number) {
    return prisma.availabilityRequest.findUnique({
      where: { id },
      include: {
        employee: true,
      },
    });
  },

  async findByDateRange(startDate: Date, endDate: Date) {
    return prisma.availabilityRequest.findMany({
      where: {
        startDate: {
          lt: endDate,
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

  async create(data: CreateAvailabilityRequestInput) {
    return prisma.availabilityRequest.create({
      data: {
        employeeId: data.employeeId,
        type: data.type,
        startDate: data.startDate,
        endDate: data.endDate ?? null,
        isFullDay: data.isFullDay,
        constraintType: data.constraintType ?? null,
        note: data.note ?? null,
        priority: data.priority ?? "medium",
        status: data.status ?? "submitted",
      },
      include: {
        employee: true,
      },
    });
  },

  async updateStatus(id: number, data: UpdateAvailabilityRequestStatusInput) {
    return prisma.availabilityRequest.update({
      where: { id },
      data: {
        status: data.status,
      },
      include: {
        employee: true,
      },
    });
  },
};
