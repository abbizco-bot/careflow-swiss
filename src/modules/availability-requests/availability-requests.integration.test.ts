import { afterAll, afterEach, describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../../app";
import { prisma } from "../../lib/prisma";

type AvailabilityRequestTestContext = {
  employeeIds: number[];
  availabilityRequestIds: number[];
  planningMonthIds: number[];
  shiftIds: number[];
  assignmentIds: number[];
};

const testContexts: AvailabilityRequestTestContext[] = [];
const app = createApp({ includeValidations: false });

describe("Availability request controlled usability integration", () => {
  afterEach(async () => {
    while (testContexts.length > 0) {
      const context = testContexts.pop();

      if (!context) {
        continue;
      }

      await prisma.availabilityRequest.deleteMany({
        where: {
          id: {
            in: context.availabilityRequestIds,
          },
        },
      });

      await prisma.assignment.deleteMany({
        where: {
          id: {
            in: context.assignmentIds,
          },
        },
      });

      await prisma.shift.deleteMany({
        where: {
          id: {
            in: context.shiftIds,
          },
        },
      });

      await prisma.planningMonth.deleteMany({
        where: {
          id: {
            in: context.planningMonthIds,
          },
        },
      });

      await prisma.employee.deleteMany({
        where: {
          id: {
            in: context.employeeIds,
          },
        },
      });
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates, lists, and retrieves an availability request without changing assignments", async () => {
    const employee = await prisma.employee.create({
      data: {
        name: `Availability Request Test ${Date.now()}`,
        role: "nurse",
        workload: 80,
        qualified: true,
      },
    });

    testContexts.push({
      employeeIds: [employee.id],
      availabilityRequestIds: [],
      planningMonthIds: [],
      shiftIds: [],
      assignmentIds: [],
    });

    const createResponse = await request(app).post("/availability-requests").send({
      employeeId: employee.id,
      type: "wish_free",
      startDate: "2026-07-10",
      endDate: "2026-07-12",
      isFullDay: true,
      note: "Family event",
      priority: "high",
      status: "submitted",
    });

    testContexts[0]?.availabilityRequestIds.push(createResponse.body.id);

    const listResponse = await request(app)
      .get("/availability-requests")
      .query({ employeeId: employee.id });
    const getResponse = await request(app).get(
      `/availability-requests/${createResponse.body.id}`
    );

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toMatchObject({
      employeeId: employee.id,
      type: "wish_free",
      startDate: "2026-07-10T00:00:00.000Z",
      endDate: "2026-07-12T00:00:00.000Z",
      isFullDay: true,
      note: "Family event",
      priority: "high",
      status: "submitted",
    });

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.id).toBe(createResponse.body.id);

    const assignments = await prisma.assignment.findMany({
      where: {
        employeeId: employee.id,
      },
    });

    expect(assignments).toHaveLength(0);
  });

  it("forces submitted as the initial availability request status", async () => {
    const employee = await prisma.employee.create({
      data: {
        name: `Availability Request Initial Status Test ${Date.now()}`,
        role: "nurse",
        workload: 90,
        qualified: true,
      },
    });

    testContexts.push({
      employeeIds: [employee.id],
      availabilityRequestIds: [],
      planningMonthIds: [],
      shiftIds: [],
      assignmentIds: [],
    });

    const response = await request(app).post("/availability-requests").send({
      employeeId: employee.id,
      type: "absence",
      startDate: "2026-09-14",
      endDate: null,
      isFullDay: true,
      note: "Planned leave",
      priority: "medium",
      status: "approved",
    });

    testContexts[0]?.availabilityRequestIds.push(response.body.id);

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      employeeId: employee.id,
      type: "absence",
      status: "submitted",
    });
  });

  it("updates availability request status explicitly", async () => {
    const uniqueYear = 2000 + (Date.now() % 100);

    const employee = await prisma.employee.create({
      data: {
        name: `Availability Request Status Test ${Date.now()}`,
        role: "nurse",
        workload: 70,
        qualified: false,
      },
    });

    const planningMonth = await prisma.planningMonth.create({
      data: {
        year: uniqueYear,
        month: 10,
        status: "draft",
      },
    });

    const shift = await prisma.shift.create({
      data: {
        date: new Date("2026-08-03T00:00:00.000Z"),
        type: "day",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const assignment = await prisma.assignment.create({
      data: {
        employeeId: employee.id,
        shiftId: shift.id,
        status: "planned",
      },
    });

    const requestRecord = await prisma.availabilityRequest.create({
      data: {
        employeeId: employee.id,
        type: "availability_constraint",
        startDate: new Date("2026-08-03T00:00:00.000Z"),
        endDate: null,
        isFullDay: false,
        constraintType: "no_night",
        note: "Temporary constraint",
        priority: "medium",
        status: "submitted",
      },
    });

    testContexts.push({
      employeeIds: [employee.id],
      availabilityRequestIds: [requestRecord.id],
      planningMonthIds: [planningMonth.id],
      shiftIds: [shift.id],
      assignmentIds: [assignment.id],
    });

    const planningMonthBefore = await prisma.planningMonth.findUnique({
      where: { id: planningMonth.id },
    });
    const shiftBefore = await prisma.shift.findUnique({
      where: { id: shift.id },
    });
    const assignmentBefore = await prisma.assignment.findUnique({
      where: { id: assignment.id },
    });
    const dayCountBefore = await prisma.planningDay.count({
      where: {
        planningMonthId: planningMonth.id,
      },
    });
    const templateCountBefore = await prisma.planningShiftTemplate.count({
      where: {
        planningDay: {
          planningMonthId: planningMonth.id,
        },
      },
    });

    const response = await request(app)
      .patch(`/availability-requests/${requestRecord.id}/status`)
      .send({
        status: "reviewed",
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: requestRecord.id,
      status: "reviewed",
    });

    const planningMonthAfter = await prisma.planningMonth.findUnique({
      where: { id: planningMonth.id },
    });
    const shiftAfter = await prisma.shift.findUnique({
      where: { id: shift.id },
    });
    const assignmentAfter = await prisma.assignment.findUnique({
      where: { id: assignment.id },
    });
    const dayCountAfter = await prisma.planningDay.count({
      where: {
        planningMonthId: planningMonth.id,
      },
    });
    const templateCountAfter = await prisma.planningShiftTemplate.count({
      where: {
        planningDay: {
          planningMonthId: planningMonth.id,
        },
      },
    });

    expect(planningMonthBefore).toEqual(planningMonthAfter);
    expect(shiftBefore).toEqual(shiftAfter);
    expect(assignmentBefore).toEqual(assignmentAfter);
    expect(dayCountAfter).toBe(dayCountBefore);
    expect(templateCountAfter).toBe(templateCountBefore);
  });

  it("rejects invalid availability request status values", async () => {
    const employee = await prisma.employee.create({
      data: {
        name: `Availability Request Invalid Status Test ${Date.now()}`,
        role: "nurse",
        workload: 70,
        qualified: true,
      },
    });

    const requestRecord = await prisma.availabilityRequest.create({
      data: {
        employeeId: employee.id,
        type: "wish_free",
        startDate: new Date("2026-10-01T00:00:00.000Z"),
        endDate: new Date("2026-10-02T00:00:00.000Z"),
        isFullDay: true,
        note: "Test invalid status",
        priority: "medium",
        status: "submitted",
      },
    });

    testContexts.push({
      employeeIds: [employee.id],
      availabilityRequestIds: [requestRecord.id],
      planningMonthIds: [],
      shiftIds: [],
      assignmentIds: [],
    });

    const response = await request(app)
      .patch(`/availability-requests/${requestRecord.id}/status`)
      .send({
        status: "invalid_status",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: {
        code: "VALIDATION_ERROR",
        message: "status must be one of: submitted, reviewed, approved, rejected",
      },
    });
  });

  it("updates availability request status to approved without changing staffing records", async () => {
    const uniqueYear = 2028 + (Date.now() % 20);

    const employee = await prisma.employee.create({
      data: {
        name: `Availability Request Approved ${Date.now()}`,
        role: "nurse",
        workload: 70,
        qualified: false,
      },
    });

    const planningMonth = await prisma.planningMonth.create({
      data: {
        year: uniqueYear,
        month: 11,
        status: "draft",
      },
    });

    const shift = await prisma.shift.create({
      data: {
        date: new Date("2026-11-05T00:00:00.000Z"),
        type: "late",
        requiredCount: 2,
        requiredQualifiedCount: 1,
      },
    });

    const assignment = await prisma.assignment.create({
      data: {
        employeeId: employee.id,
        shiftId: shift.id,
        status: "planned",
      },
    });

    const requestRecord = await prisma.availabilityRequest.create({
      data: {
        employeeId: employee.id,
        type: "wish_free",
        startDate: new Date("2026-11-05T00:00:00.000Z"),
        endDate: null,
        isFullDay: true,
        note: "Family event",
        priority: "high",
        status: "submitted",
      },
    });

    testContexts.push({
      employeeIds: [employee.id],
      availabilityRequestIds: [requestRecord.id],
      planningMonthIds: [planningMonth.id],
      shiftIds: [shift.id],
      assignmentIds: [assignment.id],
    });

    const planningMonthBefore = await prisma.planningMonth.findUnique({
      where: { id: planningMonth.id },
    });
    const shiftBefore = await prisma.shift.findUnique({
      where: { id: shift.id },
    });
    const assignmentBefore = await prisma.assignment.findUnique({
      where: { id: assignment.id },
    });
    const dayCountBefore = await prisma.planningDay.count({
      where: {
        planningMonthId: planningMonth.id,
      },
    });
    const templateCountBefore = await prisma.planningShiftTemplate.count({
      where: {
        planningDay: {
          planningMonthId: planningMonth.id,
        },
      },
    });

    const response = await request(app)
      .patch(`/availability-requests/${requestRecord.id}/status`)
      .send({
        status: "approved",
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: requestRecord.id,
      status: "approved",
    });

    const planningMonthAfter = await prisma.planningMonth.findUnique({
      where: { id: planningMonth.id },
    });
    const shiftAfter = await prisma.shift.findUnique({
      where: { id: shift.id },
    });
    const assignmentAfter = await prisma.assignment.findUnique({
      where: { id: assignment.id },
    });
    const dayCountAfter = await prisma.planningDay.count({
      where: {
        planningMonthId: planningMonth.id,
      },
    });
    const templateCountAfter = await prisma.planningShiftTemplate.count({
      where: {
        planningDay: {
          planningMonthId: planningMonth.id,
        },
      },
    });

    expect(planningMonthBefore).toEqual(planningMonthAfter);
    expect(shiftBefore).toEqual(shiftAfter);
    expect(assignmentBefore).toEqual(assignmentAfter);
    expect(dayCountAfter).toBe(dayCountBefore);
    expect(templateCountAfter).toBe(templateCountBefore);
  });

  it("updates availability request status to rejected without changing staffing records", async () => {
    const uniqueYear = 2030 + (Date.now() % 20);

    const employee = await prisma.employee.create({
      data: {
        name: `Availability Request Rejected ${Date.now()}`,
        role: "nurse",
        workload: 70,
        qualified: false,
      },
    });

    const planningMonth = await prisma.planningMonth.create({
      data: {
        year: uniqueYear,
        month: 12,
        status: "draft",
      },
    });

    const shift = await prisma.shift.create({
      data: {
        date: new Date("2026-12-10T00:00:00.000Z"),
        type: "early",
        requiredCount: 1,
        requiredQualifiedCount: 1,
      },
    });

    const assignment = await prisma.assignment.create({
      data: {
        employeeId: employee.id,
        shiftId: shift.id,
        status: "planned",
      },
    });

    const requestRecord = await prisma.availabilityRequest.create({
      data: {
        employeeId: employee.id,
        type: "absence",
        startDate: new Date("2026-12-10T00:00:00.000Z"),
        endDate: null,
        isFullDay: true,
        note: "Personal reason",
        priority: "medium",
        status: "submitted",
      },
    });

    testContexts.push({
      employeeIds: [employee.id],
      availabilityRequestIds: [requestRecord.id],
      planningMonthIds: [planningMonth.id],
      shiftIds: [shift.id],
      assignmentIds: [assignment.id],
    });

    const planningMonthBefore = await prisma.planningMonth.findUnique({
      where: { id: planningMonth.id },
    });
    const shiftBefore = await prisma.shift.findUnique({
      where: { id: shift.id },
    });
    const assignmentBefore = await prisma.assignment.findUnique({
      where: { id: assignment.id },
    });
    const dayCountBefore = await prisma.planningDay.count({
      where: {
        planningMonthId: planningMonth.id,
      },
    });
    const templateCountBefore = await prisma.planningShiftTemplate.count({
      where: {
        planningDay: {
          planningMonthId: planningMonth.id,
        },
      },
    });

    const response = await request(app)
      .patch(`/availability-requests/${requestRecord.id}/status`)
      .send({
        status: "rejected",
      });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: requestRecord.id,
      status: "rejected",
    });

    const planningMonthAfter = await prisma.planningMonth.findUnique({
      where: { id: planningMonth.id },
    });
    const shiftAfter = await prisma.shift.findUnique({
      where: { id: shift.id },
    });
    const assignmentAfter = await prisma.assignment.findUnique({
      where: { id: assignment.id },
    });
    const dayCountAfter = await prisma.planningDay.count({
      where: {
        planningMonthId: planningMonth.id,
      },
    });
    const templateCountAfter = await prisma.planningShiftTemplate.count({
      where: {
        planningDay: {
          planningMonthId: planningMonth.id,
        },
      },
    });

    expect(planningMonthBefore).toEqual(planningMonthAfter);
    expect(shiftBefore).toEqual(shiftAfter);
    expect(assignmentBefore).toEqual(assignmentAfter);
    expect(dayCountAfter).toBe(dayCountBefore);
    expect(templateCountAfter).toBe(templateCountBefore);
  });
});
